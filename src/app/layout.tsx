import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://findely.app"),
  title: "Findely — Spatial Job Discovery & Candidate Portfolio",
  description:
    "Spatial career exploration engine for frontier startups, verified tech hubs, and modern candidate portfolios with zero arbitrary layout shifts.",
  keywords: [
    "Tech Jobs",
    "Startup Map",
    "Spatial Job Discovery",
    "Candidate Portfolio",
    "AI Engineers",
    "UI/UX Designers",
    "Findely",
  ],
  authors: [{ name: "Findely Team" }],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/main-logo.svg", type: "image/svg+xml" }
    ],
    shortcut: "/icon.svg",
    apple: "/apple-icon.svg",
  },
  openGraph: {
    title: "Findely — Spatial Job Discovery & Candidate Portfolio",
    description: "Explore 17,000+ verified frontier startup jobs across interactive 2.5D GPU basemaps.",
    url: "https://findely.app",
    siteName: "Findely",
    images: [
      {
        url: "/main-logo.svg",
        width: 1200,
        height: 630,
        alt: "Findely Brand Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Findely — Spatial Job Discovery & Candidate Portfolio",
    description: "Explore verified companies hiring worldwide in a 2.5D GPU spatial workspace.",
    images: ["/main-logo.svg"],
  },
};

import { AuthProvider } from "@/lib/authContext";
import CustomCursor from "@/components/CustomCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="h-full w-full overflow-hidden font-urbanist tracking-[-0.02em] bg-[#F7F9F2] text-[#1D2E1B] dark:bg-[#131E12] dark:text-white">
        <AuthProvider>
          {children}
          <CustomCursor />
        </AuthProvider>
      </body>
    </html>
  );
}
