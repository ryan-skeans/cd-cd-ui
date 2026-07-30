import type { Metadata } from "next";
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
  title: "Claim Defender AI — Validate Property Damage Claims Instantly",
  description:
    "Verify weather-related roof & property damage claims using historical meteorological data (NOAA) and satellite imagery. AI-powered truth scoring for insurers, adjusters, and contractors.",
  keywords: [
    "property damage claims",
    "roof damage verification",
    "NOAA weather data",
    "satellite imagery",
    "insurance fraud detection",
    "claim verification",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
