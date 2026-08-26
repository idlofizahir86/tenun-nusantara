import Link from "next/link";

const islands = [
  {
    id: "candi",
    name: "Pulau Candi",
    description: "Logika & Analytical Thinking",
    color: "candi-stone",
    emoji: "🏛️",
  },
  {
    id: "terapung",
    name: "Pulau Terapung",
    description: "Interpersonal & Kepemimpinan",
    color: "terapung-blue",
    emoji: "🛶",
  },
  {
    id: "rimba",
    name: "Pulau Rimba",
    description: "Naturalis & Sustainability",
    color: "rimba-green",
    emoji: "🌿",
  },
  {
    id: "harmoni",
    name: "Pulau Harmoni",
    description: "Seni & Creative Thinking",
    color: "harmoni-magenta",
    emoji: "🎭",
  },
  {
    id: "aksara",
    name: "Pulau Aksara",
    description: "Linguistik & Narrative Literacy",
    color: "aksara-gold",
    emoji: "📜",
  },
];

export function IslandsPreview() {
  return (
    <section className="relative w-full bg-gradient-to-b from-warm-cream to-batik-gold/10 py-24">
      <div className="mx-auto max-w-7xl px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span className="font-caveat text-2xl text-nusantara-red">
            Jelajahi Nusantara
          </span>
          <h2 className="mt-2 font-fredoka text-5xl font-bold text-deep-indigo">
            5 Pulau Menanti
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-nunito text-lg text-deep-indigo/70">
            Setiap pulau menyimpan tantangan unik yang akan mengungkap potensi
            tersembunyimu
          </p>
        </div>

        {/* Islands Grid */}
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
          {islands.map((island) => (
            <div
              key={island.id}
              className="group relative aspect-[3/4] overflow-hidden rounded-3xl bg-white shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-hard"
            >
              {/* Background gradient per island */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-${island.color}/20 to-${island.color}/5`}
              />

              {/* Emoji as placeholder (ganti dengan Image nanti) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl transition-transform duration-300 group-hover:scale-110">
                  {island.emoji}
                </span>
              </div>

              {/* Content overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-deep-indigo/90 via-deep-indigo/60 to-transparent p-6">
                <h3 className="font-fredoka text-xl font-semibold text-warm-cream">
                  {island.name}
                </h3>
                <p className="mt-1 font-nunito text-sm text-warm-cream/80">
                  {island.description}
                </p>
              </div>

              {/* Hover border */}
              <div
                className={`absolute inset-0 rounded-3xl border-2 border-${island.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/role-selection"
            className="inline-flex items-center gap-2 rounded-full border-2 border-deep-indigo px-8 py-4 font-fredoka text-lg font-semibold text-deep-indigo transition-all hover:bg-deep-indigo hover:text-warm-cream"
          >
            Mulai Petualanganmu
          </Link>
        </div>
      </div>
    </section>
  );
}