import type { Metadata } from "next";
import HomeFunnel from "@/components/Funnel/HomeFunnel";

export const metadata: Metadata = {
  title: "Find My E-Bike Quiz | 60-Second Personalized Match",
  description:
    "Answer 6 quick questions about your terrain, riding style, budget and body to get a ranked lineup of electric bikes matched to you. No account needed.",
  alternates: { canonical: "/e-bikes/quiz" },
  openGraph: {
    title: "Find My E-Bike Quiz | 60-Second Personalized Match",
    description:
      "Answer 6 quick questions and get a ranked lineup of electric bikes matched to your terrain, style and budget.",
    type: "website",
  },
};

export default function QuizPage() {
  return <HomeFunnel />;
}
