import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ success: false, error: "URL is required" }, { status: 400 });
    }

    let targetUrl = url.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = `https://${targetUrl}`;
    }

    let hostname = "";
    try {
      hostname = new URL(targetUrl).hostname;
    } catch {
      return NextResponse.json({ success: false, error: "Invalid URL format" }, { status: 400 });
    }

    // Default fallbacks
    let name = hostname.replace(/^www\./, "").split(".")[0];
    name = name.charAt(0).toUpperCase() + name.slice(1);
    let tagline = "";
    let logoUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=256`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const html = await res.text();

        // 1. Extract Title / Name
        const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/i) ||
                             html.match(/<meta\s+name=["']twitter:title["']\s+content=["'](.*?)["']/i);
        const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);

        const rawTitle = ogTitleMatch?.[1] || titleMatch?.[1] || "";
        if (rawTitle) {
          // Clean title (e.g. "Linear | Issue Tracking" -> "Linear")
          const cleanTitle = rawTitle.split(/[-–—|•:]/)[0].trim();
          if (cleanTitle && cleanTitle.length < 40) {
            name = cleanTitle;
          }
        }

        // 2. Extract Description / Tagline
        const ogDescMatch = html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/i) ||
                            html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i) ||
                            html.match(/<meta\s+name=["']twitter:description["']\s+content=["'](.*?)["']/i);
        if (ogDescMatch?.[1]) {
          let desc = ogDescMatch[1].trim();
          if (desc.length > 80) {
            desc = desc.slice(0, 77) + "...";
          }
          tagline = desc;
        }

        // 3. Extract Icons (Apple Touch Icon, SVG Favicon, OG Image)
        const appleIconMatch = html.match(/<link\s+[^>]*rel=["']apple-touch-icon["'][^>]*href=["'](.*?)["']/i);
        const iconMatch = html.match(/<link\s+[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["'](.*?)["']/i);
        const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/i);

        const rawIcon = appleIconMatch?.[1] || iconMatch?.[1] || ogImageMatch?.[1];
        if (rawIcon) {
          try {
            logoUrl = new URL(rawIcon, targetUrl).href;
          } catch {
            logoUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=256`;
          }
        } else {
          logoUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=256`;
        }
      }
    } catch (fetchErr) {
      console.warn("[Metadata Fetch Warning]: Could not fetch site directly, using fallbacks", fetchErr);
    }

    return NextResponse.json({
      success: true,
      data: {
        name,
        tagline: tagline || `Next-generation software platform and tools by ${name}`,
        logoUrl,
        hostname,
        targetUrl,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to parse URL metadata" }, { status: 500 });
  }
}
