import type { Metadata } from "next";
import HomeFunnel from "@/components/Funnel/HomeFunnel";

export const metadata: Metadata = {
  title: "Harkuhh — Find the E-Bike Built for Your Ride",
  description:
    "Start with where you ride. Answer three quick questions and get a ranked, unbiased lineup of electric bikes matched to your terrain, use and budget.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomeFunnel />;
}
