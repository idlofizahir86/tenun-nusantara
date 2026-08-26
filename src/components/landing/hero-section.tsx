import Image from "next/image";
import Link from "next/link";
import { Compass } from "lucide-react";

const DIAMONDS = Array.from({ length: 24 }, (_, i) => i);

export function HeroSection() {
  return (
    <main className="flex w-full flex-row items-center gap-10 px-5 py-10 md:px-20 md:py-10">
      <div className="flex max-w-[600px] flex-1 flex-col items-start gap-8">
        <div className="flex w-full flex-col items-start gap-4">
          {/* Decorative Pattern Border (24 Diamond Dots) */}
          <div className="flex h-2 w-full flex-row items-start justify-between opacity-30">
            {DIAMONDS.map((i) => (
              <div
                key={i}
                className="h-2 w-2 rotate-45 bg-[#FFB319]"
              />
            ))}
          </div>

          <h1 className="font-outfit text-[40px] font-extrabold leading-[110%] text-white md:text-[56px]">
            Mainkan, Jelajahi, Temukan Bakatmu!
          </h1>

          <p className="text-[18px] font-semibold uppercase leading-[25px] text-[#19D29F]">
            Berlayar • Mainkan Tantangannya • Temukan Bakatmu
          </p>

          <p className="text-[16px] font-normal leading-[160%] text-[#E2ECEF]">
            Petualangan edukatif interaktif untuk anak Indonesia. Temukan potensi
            kecerdasan majemukmu lewat kisah petualangan seru melintasi 5 pulau
            nusantara bersama NALA.
          </p>
        </div>

        {/* CTA Button */}
        <Link
          href="/role-selection"
          className="inline-flex items-center justify-center gap-3 rounded-[32px] bg-[#FFB319] px-10 py-[18px] transition-all duration-200 hover:-translate-y-0.5"
          style={{ boxShadow: "0px 8px 24px -4px rgba(255, 179, 25, 0.5)" }}
        >
          <span className="font-outfit text-[18px] font-extrabold uppercase leading-[23px] text-[#0B1D23]">
            Mulai Petualangan
          </span>
          <div className="flex h-6 w-6 items-center justify-center text-[#0B1D23]">
            <Compass className="h-6 w-6" />
          </div>
        </Link>
      </div>

      {/* Hero Artwork */}
      <div
        className="hidden flex-shrink-0 overflow-hidden rounded-3xl border-2 border-[#FFB319] md:block"
        style={{
          width: 640,
          height: 480,
          filter: "drop-shadow(0px 16px 32px rgba(0, 0, 0, 0.5))",
        }}
      >
        <Image
          src="/assets/images/landing/hero-artwork-frame.png"
          alt="Kapal Pinisi Berlayar di Kepulauan Nusantara"
          width={640}
          height={480}
          priority
          className="h-full w-full object-cover"
        />
      </div>
    </main>
  );
}