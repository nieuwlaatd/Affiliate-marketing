import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import { PostHogProvider } from "./providers";
// import Script removed to use raw script for React 19 resource management

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bestbikeforme.com"),
  title: {
    default: "Best Bike For Me | Find the Right E-Bike for Your Ride",
    template: "%s | Best Bike For Me",
  },
  description:
    "Compare 88+ electric bikes with unbiased, data-driven reviews. Answer a few questions about your terrain, riding style and budget to get a ranked lineup of e-bikes that actually fit.",
  keywords: [
    "best electric bike",
    "e-bike finder",
    "electric bike comparison",
    "e-bike reviews",
    "best ebike for commuting",
    "electric bike quiz",
    "compare e-bikes side by side",
    "best ebike under 1500",
    "class 3 ebike",
    "folding electric bike",
  ],
  openGraph: {
    siteName: "Best Bike For Me",
    title: "Best Bike For Me | Find the Right E-Bike for Your Ride",
    description:
      "Compare 88+ electric bikes with unbiased reviews. Take our quiz to find the e-bike that fits your terrain, style and budget.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Bike For Me | Find the Right E-Bike for Your Ride",
    description:
      "Compare 88+ electric bikes with unbiased reviews. Take our quiz to find the e-bike that fits your terrain, style and budget.",
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
        <script
          type="text/javascript"
          src="http://classic.avantlink.com/affiliate_app_confirm.php?mode=js&authResponse=5b23d2d53cdcedb17ed011938908d903b3fb25a5"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Best Bike For Me",
            url: "https://www.bestbikeforme.com",
            description: "Unbiased, data-driven e-bike reviews and comparison tools to help riders find the right electric bike.",
          })}}
        />
      </head>
      <body className="flex min-h-full flex-col antialiased">
        <PostHogProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Analytics />
        </PostHogProvider>
      </body>
    </html>
  );
}
