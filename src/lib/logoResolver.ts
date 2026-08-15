/**
 * Findely High-Reliability Logo Resolver
 * Generates robust, non-failing logo URLs with multiple cloud CDN fallbacks
 */

export function getCompanyLogoUrl(domain?: string, name?: string, customLogo?: string): string {
  if (customLogo && customLogo.startsWith("http") && !customLogo.includes("clearbit.com")) {
    return customLogo;
  }

  const cleanDomain = domain ? domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase() : "";
  const cleanName = name || (cleanDomain ? cleanDomain.split(".")[0] : "Company");

  if (cleanDomain && cleanDomain.includes(".")) {
    // Google High-Res Favicon CDN (99.99% uptime, never CORS blocked)
    return `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`;
  }

  // High-contrast Apple-style SVG Initials Tile fallback
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=1D2E1B&textColor=A9C632&fontWeight=800`;
}

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>, name: string = "Company") {
  const target = e.currentTarget;
  const fallback = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=1D2E1B&textColor=A9C632&fontWeight=800`;
  if (target.src !== fallback) {
    target.src = fallback;
  }
}
