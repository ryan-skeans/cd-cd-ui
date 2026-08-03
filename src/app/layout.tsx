import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import QueryProvider from "@/components/query-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  // Deployments can provide their canonical origin without making local builds depend on it.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "ClaimDefender — Property weather evidence, clearly sourced",
  description:
    "Review source-labeled weather observations, nearby reports, warning context, precipitation, and a property-specific impact timeline in one evidence package.",
  keywords: [
    "property damage evidence",
    "weather evidence package",
    "weather impact timeline",
    "weather archive data",
    "NWS alert records",
    "claim documentation",
  ],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/brand/favicon.svg?v=2", type: "image/svg+xml" },
      { url: "/brand/favicon-32.png?v=2", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "ClaimDefender — Weather evidence. Clearly documented.",
    description: "Property-specific weather observations, reports, warning context, and sources organized into one evidence package.",
    type: "website",
    images: [{ url: "/brand/claim-defender-social.png", width: 1200, height: 630, alt: "ClaimDefender — Weather evidence. Clearly documented." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClaimDefender — Weather evidence. Clearly documented.",
    description: "Property-specific weather records, source context, and report-ready evidence.",
    images: ["/brand/claim-defender-social.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#333629",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
