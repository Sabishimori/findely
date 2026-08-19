import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://findely.app"),
  title: {
    default: "Findely — Find Where Real Tech is Built | 2.5D Spatial Startup Map",
    template: "%s | Findely",
  },
  description:
    "Explore 3,900+ verified frontier startup jobs and boutique tech studios across San Francisco, Bengaluru, London, and Tokyo. 100% direct ATS links, 0% ghost jobs, and transparent CTC salary intelligence.",
  keywords: [
    "Findely",
    "Tech Jobs",
    "Startup Map",
    "Bengaluru Startups",
    "San Francisco Startups",
    "Direct ATS Jobs",
    "0 Ghost Jobs",
    "AI Engineers",
    "UI/UX Designers",
    "Boutique Design Studios",
    "Transparent Salaries LPA",
    "Greenhouse Jobs",
    "Lever Jobs",
    "Ashby Jobs",
  ],
  authors: [{ name: "Sagar S.", url: "https://x.com/sabishimor1" }, { name: "Findely Team" }],
  creator: "Sagar S.",
  publisher: "Findely",
  alternates: {
    canonical: "https://findely.app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/main-logo.png", type: "image/png" }
    ],
    shortcut: "/icon.svg",
    apple: "/apple-touch-icon.svg",
  },
  openGraph: {
    title: "Findely — Find Where Real Tech is Built",
    description:
      "Interactive 2.5D spatial map with 0 ghost jobs and 100% direct ATS pipelines. Explore verified roles across SF, Bengaluru, London & Tokyo.",
    url: "https://findely.app",
    siteName: "Findely",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Findely — Find Where Real Tech is Built. 2.5D Map with 0 Ghost Jobs",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Findely — Find Where Real Tech is Built",
    description:
      "Interactive 2.5D spatial map with 0 ghost jobs and 100% direct ATS pipelines. Explore verified roles across SF, Bengaluru, London & Tokyo.",
    images: ["/og-image.png"],
    creator: "@sabishimor1",
    site: "@findely",
  },
};

import { AuthProvider } from "@/lib/authContext";
import CustomCursor from "@/components/CustomCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://findely.app/#website",
        "url": "https://findely.app",
        "name": "Findely",
        "description": "Spatial career exploration engine for frontier startups, 0 ghost jobs, and direct ATS pipelines.",
        "publisher": {
          "@type": "Organization",
          "name": "Findely",
          "url": "https://findely.app",
          "logo": {
            "@type": "ImageObject",
            "url": "https://findely.app/main-logo.png"
          }
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://findely.app/?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "SoftwareApplication",
        "name": "Findely",
        "operatingSystem": "Web",
        "applicationCategory": "BusinessApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "2.5D GPU spatial startup discovery engine mapping 3,900+ active roles with 0% ghost jobs."
      }
    ]
  };

  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="h-full w-full overflow-hidden font-urbanist tracking-[-0.02em] bg-[#F7F9F2] text-[#1D2E1B] dark:bg-[#131E12] dark:text-white">
        <AuthProvider>
          {children}
          <CustomCursor />
        </AuthProvider>
      </body>
    </html>
  );
}
