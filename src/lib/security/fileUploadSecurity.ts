/**
 * Findely Enterprise File Upload Security Validator
 * Protects server and users against malicious file uploads, webshells, remote code execution (RCE), and embedded scripts.
 */

// Permitted MIME types and file configurations
export const UPLOAD_LIMITS = {
  AVATAR: {
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedMimes: ["image/jpeg", "image/png", "image/webp"],
    allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
  },
  RESUME: {
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    allowedMimes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    allowedExtensions: [".pdf", ".doc", ".docx"],
  },
  VIDEO: {
    maxSizeBytes: 25 * 1024 * 1024, // 25MB
    allowedMimes: ["video/mp4", "video/webm", "video/quicktime"],
    allowedExtensions: [".mp4", ".webm", ".mov"],
  },
} as const;

// Dangerous executable file extensions that must NEVER be allowed under any circumstances
const EXECUTABLE_EXTENSIONS = [
  ".exe", ".bat", ".cmd", ".sh", ".bash", ".php", ".phtml", ".php3", ".php4", ".php5",
  ".phps", ".phar", ".asp", ".aspx", ".jsp", ".jspx", ".cgi", ".pl", ".py", ".pyc",
  ".rb", ".js", ".mjs", ".ts", ".html", ".htm", ".xhtml", ".shtml", ".svg", ".vbs",
  ".wsf", ".scr", ".com", ".pif", ".dll", ".so", ".bin", ".iso", ".jar", ".war"
];

// Magic byte signatures
const FILE_MAGIC_SIGNATURES: Array<{ type: string; bytes: number[] }> = [
  { type: "image/jpeg", bytes: [0xFF, 0xD8, 0xFF] },
  { type: "image/png", bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] },
  { type: "application/pdf", bytes: [0x25, 0x50, 0x44, 0x46] }, // %PDF-
];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedFilename?: string;
}

/**
 * Sanitizes a filename: removes directory traversal characters (../), strips invalid chars,
 * and appends a safe random hash.
 */
export function sanitizeFilename(originalName: string): string {
  // Remove directory separators and null bytes
  const baseName = originalName.replace(/^.*[\\\/]/, "").replace(/\0/g, "");
  
  // Extract extension
  const dotIdx = baseName.lastIndexOf(".");
  if (dotIdx === -1) {
    return `upload_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`;
  }

  const namePart = baseName.substring(0, dotIdx).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
  const rawExt = baseName.substring(dotIdx).toLowerCase();

  // If extension is dangerous, neutralize it
  if (EXECUTABLE_EXTENSIONS.includes(rawExt)) {
    return `${namePart}_${Date.now()}.bin`;
  }

  return `${namePart}_${Date.now()}_${crypto.randomUUID().slice(0, 8)}${rawExt}`;
}

/**
 * Validates file properties before reading or storing.
 */
export function validateUploadFile(
  file: { name: string; size: number; type: string },
  category: "AVATAR" | "RESUME" | "VIDEO"
): FileValidationResult {
  const config = UPLOAD_LIMITS[category];

  // 1. Check file size
  if (!file.size || file.size <= 0) {
    return { valid: false, error: "Uploaded file is empty." };
  }

  if (file.size > config.maxSizeBytes) {
    const maxMb = Math.round(config.maxSizeBytes / (1024 * 1024));
    return { valid: false, error: `File size exceeds maximum allowed limit of ${maxMb}MB.` };
  }

  // 2. Check MIME type against strict whitelist
  const allowedMimes: readonly string[] = config.allowedMimes;
  if (!allowedMimes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file format (${file.type || "unknown"}). Allowed formats: ${config.allowedExtensions.join(", ")}.`,
    };
  }

  // 3. Check file extension
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  const allowedExtensions: readonly string[] = config.allowedExtensions;
  if (!allowedExtensions.includes(ext)) {
    return {
      valid: false,
      error: `Invalid file extension (${ext}). Allowed extensions: ${config.allowedExtensions.join(", ")}.`,
    };
  }

  // 4. Strict check for SVG uploads in avatars (SVG can contain <script> XSS payloads)
  if (file.type === "image/svg+xml" || ext === ".svg") {
    return {
      valid: false,
      error: "SVG uploads are disabled for security reasons. Please upload JPG, PNG, or WEBP.",
    };
  }

  // 5. Block double-extension bypasses (e.g. evil.php.png)
  const parts = file.name.toLowerCase().split(".");
  if (parts.length > 2) {
    for (let i = 1; i < parts.length - 1; i++) {
      if (EXECUTABLE_EXTENSIONS.includes("." + parts[i])) {
        return {
          valid: false,
          error: "Dangerous multi-extension file detected and blocked.",
        };
      }
    }
  }

  const sanitized = sanitizeFilename(file.name);
  return { valid: true, sanitizedFilename: sanitized };
}

/**
 * Validates binary magic bytes from an ArrayBuffer or Buffer to detect spoofed MIME types.
 */
export function validateMagicBytes(buffer: ArrayBuffer | Uint8Array, expectedMime: string): boolean {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  
  const signature = FILE_MAGIC_SIGNATURES.find((s) => s.type === expectedMime);
  if (!signature) {
    // If we don't have explicit signature for this MIME (like video), pass by default
    return true;
  }

  if (bytes.length < signature.bytes.length) {
    return false;
  }

  for (let i = 0; i < signature.bytes.length; i++) {
    if (bytes[i] !== signature.bytes[i]) {
      return false;
    }
  }

  return true;
}
