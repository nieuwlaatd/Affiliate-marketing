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
  title: "Harkuhh — Harkuhh je korting",
  description:
    "Alle werkende kortingscodes en deals op één rustige plek. Harkuhh je korting voordat je afrekent.",
  keywords: ["kortingscode", "korting", "deals", "coupon", "harkuhh", "besparen"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${inter.variable} h-full`} suppressHydrationWarning>
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
