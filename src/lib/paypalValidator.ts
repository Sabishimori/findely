/**
 * PayPal Transaction ID & Payment Reference Validation Engine
 * Validates authentic PayPal Transaction IDs, PAYID Order IDs, and Payer Emails.
 * Rejects keyboard-mashing, dummy placeholders, and non-conforming strings.
 */

export interface PaypalValidationResult {
  isValid: boolean;
  type?: "transaction_id" | "order_id" | "payer_email";
  normalized?: string;
  error?: string;
}

export function validatePaypalTransactionId(rawInput: string): PaypalValidationResult {
  if (!rawInput || typeof rawInput !== "string") {
    return {
      isValid: false,
      error: "PayPal Transaction ID or Payer Email is required.",
    };
  }

  const input = rawInput.trim();

  // 1. Minimum & Maximum Length Check
  if (input.length < 5 || input.length > 50) {
    return {
      isValid: false,
      error: "Reference must be a valid 17-character PayPal Transaction ID or Payer Email.",
    };
  }

  const lower = input.toLowerCase();

  // 2. Exact match dummy keywords
  const exactDummyKeywords = ["test", "dummy", "sample", "qwerty", "asdfgh", "random", "fake", "none", "null", "undefined", "123456789"];
  if (exactDummyKeywords.includes(lower)) {
    return {
      isValid: false,
      error: "Test / placeholder values are not accepted. Please enter your genuine PayPal Transaction ID or Payer Email.",
    };
  }

  // 3. Check character diversity (reject repetitive patterns like 'sasdadsdasdasdasdad' or 'aaaa1111')
  const cleanChars = lower.replace(/[^a-z0-9]/g, "");
  const uniqueChars = new Set(cleanChars);
  if (cleanChars.length >= 10 && uniqueChars.size < 5) {
    return {
      isValid: false,
      error: "Invalid repetitive transaction code. Please paste the exact transaction ID from your PayPal confirmation.",
    };
  }

  // Check repeating 2/3-char chunks (e.g. 'asdasdasdasd' or 'dadadada')
  if (/(..+)\1\1\1/.test(cleanChars)) {
    return {
      isValid: false,
      error: "Invalid repetitive transaction format. Please enter your authentic PayPal Transaction ID.",
    };
  }

  // 4. Pattern A: PayPal Payer Email Address (e.g. buyer@example.com)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailRegex.test(input)) {
    return {
      isValid: true,
      type: "payer_email",
      normalized: input.toLowerCase(),
    };
  }

  // 5. Pattern B: Standard PayPal 17-Character Alphanumeric Transaction ID (e.g. 5X94817263541829Z)
  const paypalTxRegex = /^[A-Z0-9]{17}$/i;
  if (paypalTxRegex.test(input)) {
    return {
      isValid: true,
      type: "transaction_id",
      normalized: input.toUpperCase(),
    };
  }

  // 6. Pattern C: PayPal Order PAYID (e.g. PAYID-M94817263541829Z)
  const paypalPayIdRegex = /^PAYID-[A-Z0-9]{12,25}$/i;
  if (paypalPayIdRegex.test(input)) {
    return {
      isValid: true,
      type: "order_id",
      normalized: input.toUpperCase(),
    };
  }

  // 7. Pattern D: PayPal Standard Invoice / Authorization ID (12 to 24 alphanumeric characters with mixed letters & numbers)
  const hasLetters = /[a-zA-Z]/.test(input);
  const hasNumbers = /[0-9]/.test(input);
  const alphanumericOnly = /^[a-zA-Z0-9_-]{12,25}$/.test(input);

  if (alphanumericOnly && hasLetters && hasNumbers && uniqueChars.size >= 5) {
    return {
      isValid: true,
      type: "transaction_id",
      normalized: input.toUpperCase(),
    };
  }

  return {
    isValid: false,
    error: "Invalid format. PayPal Transaction IDs are 17 characters (e.g. 5X94817263541829Z) or your PayPal Payer email.",
  };
}
