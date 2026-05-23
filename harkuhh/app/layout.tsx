import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// import Script removed to use raw script for React 19 resource management

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://harkuhh.vercel.app"),
  title: {
    default: "Harkuhh — Find Your Perfect E-Bike",
    template: "%s | Harkuhh",
  },
  description:
    "Data-driven e-bike reviews, comparisons and the best deals. Use the E-Bike Finder to match the electric bike that fits your budget, terrain and riding style.",
  keywords: [
    "electric bike",
    "ebike",
    "e-bike finder",
    "best ebikes",
    "ebike comparison",
    "ebike reviews",
    "ebike deals",
  ],
  openGraph: {
    title: "Harkuhh — Find Your Perfect E-Bike",
    description:
      "Use the E-Bike Finder to match the electric bike that fits your budget, terrain and riding style.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        <script src="/theme.js" async />
      </head>
      <body className="flex min-h-full flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
