"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { RefreshCw, Printer } from "lucide-react";
import { computeTalentProfile, type ReportEvent } from "@/lib/scoring/engine";
import { getSession, type SessionEvent } from "@/lib/session/session";
import { AppNavbar } from "@/components/layout/app-navbar";

const AVATARS: Record<string, string> = {
  bayu: "/assets/images/characters/npcs/char_bayu.png",
  siti: "/assets/images/characters/npcs/char_siti.png",
  nyoman: "/assets/images/characters/npcs/char_nyoman.png",
  ulan: "/assets/images/characters/npcs/char_ulan.png",
};

const ISLAND_BLURB: Record<string, { name: string; desc: string }> = {
  candi: {
    name: "Pulau Candi",
    desc: "Saat menyusun kepingan struktur candi, ia menunjukkan konsentrasi mendalam dan menganalisis pola geometri dengan teliti. Ini menandakan penalaran logis yang kuat.",
  },
  rimba: {
    name: "Pulau Rimba",
    desc: "Sangat peka dalam mengelompokkan ragam fauna dan menyelesaikan tantangan filtrasi. Kepedulian alamnya menonjol, merefleksikan kecerdasan ekologis alami.",
  },
  harmoni: {
    name: "Pulau Harmoni",
    desc: "Menyusun nada gamelan dan motif tenun dengan kepekaan rasa. Kemampuan ini menandakan bakat seni, kreativitas, dan apresiasi estetika yang indah.",
  },
  aksara: {
    name: "Pulau Aksara",
    desc: "Merangkai bait pantun, gurindam, dan alur wayang dengan luwes. Ini menunjukkan kecintaan pada bahasa, sastra, dan kemampuan bercerita.",
  },
  terapung: {
    name: "Pulau Pasar Terapung",
    desc: "Berkolaborasi, bertukar dagangan, dan menengahi perselisihan dengan adil. Ini merefleksikan kecerdasan interpersonal dan jiwa kepemimpinan.",
  },
};

const CAREERS: Record<string, { title: string; tag: string; desc: string }> = {
  logika: {
    title: "Data Analyst / AI Ethicist",
    tag: "Logika-Matematika",
    desc: "Kemampuan memetakan pola dan memecahkan masalah kompleks sangat ideal untuk bidang Big Data dan teknologi masa depan.",
  },
  naturalis: {
    title: "Conservation Scientist",
    tag: "Naturalis",
    desc: "Kecintaan ekologis membuka jalan bagi kepemimpinan konservasi hutan, energi hijau, dan kelestarian lingkungan.",
  },
  visual: {
    title: "Creative Director",
    tag: "Seni-Kreativitas",
    desc: "Berbakat mengawinkan unsur tradisi nusantara ke dalam desain multimedia, gim, dan kriya kontemporer.",
  },
  linguistik: {
    title: "Penulis / Jurnalis",
    tag: "Linguistik",
    desc: "Kemampuan merangkai kata dan bercerita sangat cocok untuk dunia tulis-menulis, sastra, dan komunikasi.",
  },
  musikal: {
    title: "Komposer / Produser Musik",
    tag: "Musikal",
    desc: "Kepekaan nada dan irama dapat berkembang menjadi profesi seni pertunjukan dan produksi musik.",
  },
  sosial: {
    title: "Pemimpin Komunitas / Diplomat",
    tag: "Interpersonal",
    desc: "Kemampuan bekerja sama dan menengahi konflik ideal untuk kepemimpinan, diplomasi, dan organisasi.",
  },
  intrapersonal: {
    title: "Peneliti / Ilmuwan",
    tag: "Intrapersonal",
    desc: "Sifat reflektif dan mandiri cocok untuk riset, analisis mendalam, dan pengembangan diri.",
  },
  kinestetik: {
    title: "Atlet / Koreografer",
    tag: "Kinestetik",
    desc: "Kelincahan dan energi fisik dapat berkembang menjadi profesi olahraga, tari, dan praktik langsung.",
  },
};

const NEXT_STEPS: Record<string, string[]> = {
  logika: [
    "Berikan buku bertema misteri detektif atau teka-teki logika matematika ringan di rumah.",
    "Ajak bermain puzzle, catur, atau permainan strategi yang melatih pola berpikir.",
    "Biasakan bertanya 'bagaimana' dan 'mengapa' agar nalar analitisnya terus terasah.",
  ],
  naturalis: [
    "Ajak berkunjung ke taman nasional atau kebun raya sambil mengamati flora-fauna.",
    "Berikan tanggung jawab merawat tanaman atau hewan peliharaan sederhana.",
    "Dukung kegiatan daur ulang dan peduli lingkungan di sekitar rumah.",
  ],
  linguistik: [
    "Sediakan banyak buku bacaan bergambar dan bacakan cerita setiap hari.",
    "Ajak bercerita ulang dan menulis jurnal atau cerita pendek sederhana.",
    "Dukung mengikuti lomba bercerita, membaca puisi, atau menulis.",
  ],
};

export default function ParentReportPage() {
  const [player, setPlayer] = useState<{ name: string; characterId: string }>({
    name: "Penjelajah",
    characterId: "siti",
  });
  const [profile, setProfile] = useState<ReturnType<typeof computeTalentProfile> | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tenun-player");
      if (raw) {
        const d = JSON.parse(raw);
        setPlayer({ name: d.name || "Penjelajah", characterId: d.characterId || "siti" });
      }
      const events = (localStorage.getItem("tenun-events")
        ? JSON.parse(localStorage.getItem("tenun-events") || "[]")
        : []) as SessionEvent[];
      const session = getSession();
      const prog = localStorage.getItem("tenun-progress");
      let list = [...new Set(session.completedIslands)];
      if (prog) {
        const d = JSON.parse(prog);
        list = Array.isArray(d?.completedIslands)
          ? [...new Set(d.completedIslands as string[])]
          : list;
      }
      setCompleted(list);
      setProfile(computeTalentProfile(events as ReportEvent[], list.length));
    } catch {
      setProfile(null);
    } finally {
      setReady(true);
    }
  }, []);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#060F14] text-center">
        <RefreshCw size={28} className="animate-spin text-[#FFB319]" />
      </main>
    );
  }

  const name = player.name || "Penjelajah";
  const topTrait = profile?.topTrait || "intrapersonal";
  const top3 = profile ? [...profile.traits].sort((a, b) => b.score - a.score).slice(0, 3) : [];
  const doneIslands = ISLAND_BLURB ? completed.filter((id) => ISLAND_BLURB[id]) : [];
  const careers = top3.map((t) => CAREERS[t.key]).filter(Boolean);
  const steps = NEXT_STEPS[topTrait] || NEXT_STEPS.logika;
  const today = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#09242B] to-[#060F14] text-white">
      {/* NAVBAR */}
      <AppNavbar active="laporan-ortu" />

      <div className="mx-auto w-full max-w-[1200px] border-x border-[#FFB319]/40 px-6 py-10 lg:px-[120px]">
        {/* Top panel */}
        <section className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-[#FFB319] bg-[#0F3943] p-6 sm:flex-row sm:items-center lg:p-8">
          <div className="flex items-center gap-5">
            <Image
              src={AVATARS[player.characterId] ?? AVATARS.siti}
              alt={name}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full border-2 border-[#FFB319] object-cover"
            />
            <div className="flex flex-col gap-1">
              <h1 className="font-outfit text-2xl font-extrabold text-[#FFB319]">{name}</h1>
              <p className="font-manrope text-sm text-[#E2ECEF]">Petualang Nusantara • Tanggal: {today}</p>
            </div>
          </div>
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl bg-[#FFB319] px-6 py-3 font-outfit text-sm font-bold uppercase text-[#0B1D23] transition hover:brightness-110">
            <Printer size={16} /> Cetak Laporan
          </button>
        </section>

        {/* Narrative */}
        <section className="mt-10">
          <h2 className="font-outfit text-[22px] font-bold text-[#FFB319]">Bagaimana {name} Menyelesaikan Tantangan?</h2>
          {doneIslands.length === 0 ? (
            <p className="mt-4 font-manrope text-sm text-white/70">
              Belum ada pulau yang diselesaikan. Ajak {name} menjelajahi pulau-pulau Nusantara untuk mengungkap bakatnya!
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
              {doneIslands.map((id) => (
                <div key={id} className="rounded-2xl bg-[#0F3943] p-6">
                  <h3 className="font-outfit text-lg font-bold text-[#FFB319]">{ISLAND_BLURB[id].name}</h3>
                  <p className="mt-2 font-manrope text-sm leading-relaxed text-[#E2ECEF]">{ISLAND_BLURB[id].desc}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Careers */}
        <section className="mt-10">
          <div className="flex flex-col gap-1.5">
            <h2 className="font-outfit text-[22px] font-bold text-white">Rekomendasi Karir Masa Depan (Tren 2030)</h2>
            <p className="font-manrope text-sm text-[#8DA2A6]">NALA memetakan bakat dominan pada bidang studi dan profesi masa depan.</p>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-3">
            {careers.map((c, i) => (
              <div key={i} className="rounded-2xl border border-[#FFB319] bg-[#0F3943] p-5">
                <h3 className="font-outfit text-base font-extrabold text-white">{c.title}</h3>
                <span className="mt-2 inline-block self-start rounded bg-[#09242B] px-2 py-0.5 font-manrope text-[11px] text-[#FFB319]">
                  Koneksi Bakat: {c.tag}
                </span>
                <p className="mt-3 font-manrope text-[13px] leading-relaxed text-[#E2ECEF]">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Next steps */}
        <section className="mt-10 rounded-3xl border border-[#FFB319] bg-[#0F3943] p-6 lg:p-8">
          <h2 className="font-outfit text-xl font-extrabold text-[#FFB319]">Langkah Stimulasi Selanjutnya</h2>
          <div className="mt-4 flex flex-col gap-4">
            {steps.map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#FFB319] font-outfit text-xs font-extrabold text-[#0B1D23]">
                  {i + 1}
                </div>
                <p className="font-manrope text-sm leading-relaxed text-[#E2ECEF]">{s}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
