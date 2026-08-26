import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tenun Nusantara - Mainkan, Jelajahi, Temukan Bakatmu!",
  description:
    "Petualangan edukatif interaktif untuk anak Indonesia. Temukan potensi kecerdasan majemukmu lewat kisah petualangan seru melintasi 5 pulau nusantara bersama NALA.",
};

export default function MarketingPage() {
  return (
    <div
      className="flex min-h-screen w-full flex-col items-center"
      style={{ background: "linear-gradient(180deg, #09242B 0%, #060F14 100%)" }}
    >
      <div className="flex w-full max-w-[1440px] flex-col">
        <HeroSection />
        <FeaturesSection />
      </div>
    </div>
  );
}