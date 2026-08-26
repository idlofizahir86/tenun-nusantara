import { Castle, Network, UserRound } from "lucide-react";

const features = [
  {
    icon: Castle,
    title: "5 Pulau Petualangan",
    description:
      "Setiap pulau menguji potensi anak lewat cara bermain yang seru dan menantang.",
  },
  {
    icon: Network,
    title: "Asesmen Senyap (Stealth)",
    description:
      "Menakar minat dan bakat tanpa membuat anak merasa sedang diuji lewat tantangan natural.",
  },
  {
    icon: UserRound,
    title: "Kawan AI NALA",
    description:
      "NALA siap mendampingi perjalanan belajar anak, merefleksikan proses berpikir mereka.",
  },
];

export function FeaturesSection() {
  return (
    <section className="flex w-full flex-col items-start gap-6 px-5 pb-20 pt-10 md:px-20 md:pb-20">
      <h2 className="font-outfit text-[22px] font-bold leading-7 text-white">
        Kenapa Harus Berlayar?
      </h2>

      <div className="flex w-full flex-col gap-6 md:flex-row">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="flex flex-1 flex-col items-start gap-4 rounded-2xl border border-[#FFB319] bg-[#0F3943] p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#09242B] text-[#FFB319]">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-outfit text-[18px] font-bold leading-[23px] text-[#FFB319]">
                {feature.title}
              </h3>
              <p className="text-[14px] font-normal leading-[150%] text-[#E2ECEF]">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}