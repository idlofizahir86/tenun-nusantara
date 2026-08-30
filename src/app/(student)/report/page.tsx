"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw, Download, Share2 } from "lucide-react";
import { computeTalentProfile, type ReportEvent } from "@/lib/scoring/engine";
import { getSession, type SessionEvent } from "@/lib/session/session";
import { AppNavbar } from "@/components/layout/app-navbar";

const AVATARS: Record<string, string> = {
  bayu: "/assets/images/characters/npcs/char_bayu.png",
  siti: "/assets/images/characters/npcs/char_siti.png",
  nyoman: "/assets/images/characters/npcs/char_nyoman.png",
  ulan: "/assets/images/characters/npcs/char_ulan.png",
};

export default function ReportPage() {
  const router = useRouter();
  const [player, setPlayer] = useState<{ name: string; characterId: string }>({
    name: "Penjelajah",
    characterId: "siti",
  });
  const [narrative, setNarrative] = useState("");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ReturnType<typeof computeTalentProfile> | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const events = (localStorage.getItem("tenun-events")
        ? JSON.parse(localStorage.getItem("tenun-events") || "[]")
        : []) as SessionEvent[];
      const session = getSession();
      const prog = localStorage.getItem("tenun-progress");
      // Hitung pulau UNIK yang diselesaikan (memainkan ulang tidak menambah).
      let completed = new Set(session.completedIslands).size;
      if (prog) {
        const d = JSON.parse(prog);
        completed = Array.isArray(d?.completedIslands)
          ? new Set(d.completedIslands as string[]).size
          : completed;
      }
      setProfile(computeTalentProfile(events as ReportEvent[], completed));
    } catch {
      setProfile(null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tenun-player");
      if (raw) {
        const d = JSON.parse(raw);
        setPlayer({ name: d.name || "Penjelajah", characterId: d.characterId || "siti" });
      }
    } catch {
      // abaikan
    }
  }, []);

  async function loadNarrative() {
    if (!profile) return;
    setLoading(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName: player.name,
          profile,
          islandsCompleted: profile.islandsCompleted,
          totalActsCompleted: profile.totalActsCompleted,
        }),
      });
      const data = await res.json();
      setNarrative(data.narrative || "");
    } catch {
      setNarrative("");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (profile) loadNarrative();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#060F14] text-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw size={28} className="animate-spin text-[#FFB319]" />
          <p className="font-nunito text-white/70">Menyiapkan petamu...</p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#060F14] text-center">
        <div className="flex flex-col items-center gap-4">
          <p className="font-nunito text-white/80">
            Belum ada data petualangan. Selesaikan minimal satu pulau dulu ya!
          </p>
          <button
            onClick={() => router.push("/map")}
            className="rounded-full bg-[#FFB319] px-6 py-3 font-outfit font-bold text-[#0B1D23]"
          >
            Kembali ke Peta
          </button>
        </div>
      </main>
    );
  }

  const top3 = [...profile.traits].sort((a, b) => b.score - a.score).slice(0, 3);
  const completedIslands = getSession().completedIslands;

  // Report hanya bisa diakses setelah SEMUA pulau selesai dijelajahi.
  const ALL_ISLAND_IDS = ["candi", "rimba", "harmoni", "aksara", "terapung"];
  const allDone = ALL_ISLAND_IDS.every((id) => completedIslands.includes(id));
  const doneCount = ALL_ISLAND_IDS.filter((id) => completedIslands.includes(id)).length;

  const ISLAND_META = [
    { id: "candi", label: "Candi" },
    { id: "rimba", label: "Rimba" },
    { id: "harmoni", label: "Harmoni" },
    { id: "aksara", label: "Aksara" },
    { id: "terapung", label: "Pasar" },
  ];

  if (!allDone) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#09242B] to-[#060F14] text-white">
        <AppNavbar active="peta-bakat" />
        <div className="mx-auto flex w-full max-w-[720px] flex-col items-center gap-6 px-6 py-16 text-center">
          <h1 className="font-outfit text-3xl font-extrabold text-[#FFB319] md:text-[40px]">Peta Bakatmu</h1>
          <p className="max-w-md font-nunito text-sm leading-relaxed text-white/80">
            Peta Bakat akan terbuka setelah kamu <b className="text-[#FFB319]">menjelajahi kelima pulau Nusantara</b>.
            Teruslah berpetualang bersama NALA!
          </p>

          {/* progress count */}
          <div className="rounded-2xl border border-[#19D29F]/40 bg-[#0F3943] px-6 py-4">
            <span className="font-outfit text-lg font-extrabold text-white">
              {doneCount} <span className="text-white/60">/</span> {ALL_ISLAND_IDS.length} pulau
            </span>
            <div className="mt-2 h-2 w-56 overflow-hidden rounded bg-[#09242B]">
              <div className="h-full rounded bg-[#19D29F]" style={{ width: `${(doneCount / ALL_ISLAND_IDS.length) * 100}%` }} />
            </div>
          </div>

          {/* island badges */}
          <div className="flex items-center justify-center gap-4">
            {ISLAND_META.map((is) => {
              const unlocked = completedIslands.includes(is.id);
              return (
                <div key={is.id} className={`flex flex-col items-center gap-1.5 ${unlocked ? "" : "opacity-40"}`}>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${unlocked ? "border-[#FFB319] bg-[#FFB319] shadow-[0_4px_12px_#FFB319]" : "border-[#FFB319] bg-[#09242B]"}`}>
                    <div className={`h-4 w-4 rotate-45 ${unlocked ? "bg-[#09242B]" : "border-2 border-[#FFB319]"}`} />
                  </div>
                  <span className="font-manrope text-[10px] text-[#E2ECEF]">{is.label}</span>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => router.push("/map")}
            className="mt-2 inline-flex items-center gap-2 rounded-[32px] bg-[#FFB319] px-8 py-3 font-outfit font-extrabold uppercase text-[#0B1D23] transition-transform hover:scale-105"
          >
            Lanjut Berpetualang
          </button>
        </div>
      </main>
    );
  }

  const STRENGTH_DESC: Record<string, string> = {
    linguistik: "Sangat lihai merangkai kata, bercerita, dan memahami makna dari setiap bacaan serta tulisan.",
    logika: "Pandai menganalisis pola, mengurutkan struktur, dan memecahkan teka-teki dengan penalaran yang tajam.",
    visual: "Memiliki kepekaan visual yang kaya, menyusun dan merancang karya dengan harmoni bentuk dan warna.",
    kinestetik: "Lincah dan aktif, belajar paling baik lewat gerakan, praktik langsung, dan pengalaman nyata.",
    musikal: "Peka terhadap nada, irama, dan bunyi, mudah menangkap keindahan musik serta suara.",
    sosial: "Menjalin kerja sama dengan hangat, menjadi pemimpin sekaligus teman yang mendukung orang lain.",
    intrapersonal: "Tegar dan reflektif, mengenali perasaan serta tujuan diri, mandiri dan percaya diri.",
    naturalis: "Sensitif pada alam dan makhluk hidup, fasih memahami ekosistem dan kelestarian lingkungan.",
  };

  function handleDownload() {
    window.print();
  }

  async function handleShare() {
    const url = window.location.href;
    const text = narrative || `Lihat Peta Bakat ${player.name}!`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `Peta Bakat ${player.name}`, text, url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Tautan berhasil disalin!");
      }
    } catch {
      // dibatalkan
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#09242B] to-[#060F14] text-white">
      {/* NAVBAR */}
      <AppNavbar active="peta-bakat" />

      <div className="mx-auto w-full max-w-[1200px] px-6 lg:px-[80px] pb-16">
        {/* Title + profile */}
        <div className="flex flex-col gap-4 pt-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-outfit text-3xl font-extrabold text-[#FFB319] md:text-[40px]">Peta Bakatmu</h1>
            <p className="font-nunito text-sm text-white/70">
              Analisis kecerdasan majemuk dari eksplorasi pulau Nusantara-mu.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={handleDownload} className="inline-flex items-center gap-2 rounded-[32px] bg-[#FFB319] px-5 py-2.5 font-outfit text-sm font-extrabold uppercase text-[#0B1D23] transition-transform hover:scale-105">
              <Download size={16} /> Unduh Laporan
            </button>
            <button onClick={handleShare} className="inline-flex items-center gap-2 rounded-[32px] border border-[#19D29F] bg-[#0F3943] px-5 py-2.5 font-outfit text-sm font-bold text-[#19D29F] transition-colors hover:bg-[#144955]">
              <Share2 size={16} /> Bagikan Hasil
            </button>
            <div className="flex items-center gap-3 rounded-2xl border border-[#FFB319] bg-[#0F3943] px-4 py-2">
              <Image
                src={AVATARS[player.characterId] ?? AVATARS.siti}
                alt={player.name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full border border-[#FFB319] object-cover"
              />
              <div className="flex flex-col">
                <span className="font-outfit text-sm font-bold text-white">{player.name}</span>
                <span className="font-nunito text-[11px] text-[#19D29F]">
                  {profile.islandsCompleted} pulau • {profile.totalActsCompleted} babak
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main: radar + companion */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Radar card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 rounded-3xl border border-[#FFB319] bg-[#0F3943]/60 p-6"
          >
            <h2 className="font-outfit text-lg font-extrabold uppercase tracking-wider text-[#FFB319]">
              Grafik Potensi Majemuk
            </h2>
            <TalentRadar traits={profile.traits} />
            <div className="mt-2 grid w-full grid-cols-2 gap-2">
              {profile.traits.map((t) => (
                <div key={t.key} className="flex items-center justify-between rounded-xl bg-[#060F14]/50 px-3 py-2">
                  <span className="font-nunito text-xs font-semibold text-white/80">
                    {t.emoji} {t.label}
                  </span>
                  <span className="font-outfit text-sm font-extrabold text-[#FFB319]">{t.score}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right column: NALA bubble + badges */}
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl border-2 border-[#FFB319] bg-white p-6 text-[#09242B]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#09242B] text-[#FFB319]">
                  <Sparkles size={18} />
                </div>
                <span className="font-outfit text-lg font-extrabold">Pesan Hangat NALA</span>
              </div>
              <p className="mt-3 font-manrope text-sm leading-relaxed text-[#09242B]/90">
                {loading && !narrative ? (
                  <span className="inline-flex items-center gap-2">
                    <RefreshCw size={16} className="animate-spin" /> NALA sedang menulis...
                  </span>
                ) : (
                  `“${narrative || "Ayo terus jelajah Nusantara, bakatmu bersinar!"}”`
                )}
              </p>
              <button
                onClick={loadNarrative}
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#09242B] px-4 py-1.5 font-outfit text-xs font-bold text-[#09242B] transition-colors hover:bg-[#09242B] hover:text-white"
              >
                <RefreshCw size={13} /> Tulis ulang
              </button>
            </motion.div>

            <div className="rounded-3xl bg-[#0F3943] p-5">
              <span className="font-outfit text-sm font-bold uppercase tracking-wider text-[#FFB319]">
                Lencana Permata Nusantara
              </span>
              <div className="mt-4 flex items-center justify-between">
                {ISLAND_META.map((is) => {
                  const unlocked = completedIslands.includes(is.id);
                  return (
                    <div key={is.id} className={`flex flex-col items-center gap-1.5 ${unlocked ? "" : "opacity-40"}`}>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${unlocked ? "border-[#FFB319] bg-[#FFB319] shadow-[0_4px_12px_#FFB319]" : "border-[#FFB319] bg-[#09242B]"}`}>
                        <div className={`h-4 w-4 rotate-45 ${unlocked ? "bg-[#09242B]" : "border-2 border-[#FFB319]"}`} />
                      </div>
                      <span className="font-manrope text-[10px] text-[#E2ECEF]">{is.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bakat Dominan */}
        <section className="mt-10">
          <h2 className="font-outfit text-[22px] font-bold text-white">Bakat Dominanmu</h2>
          <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-3">
            {top3.map((t) => (
              <div key={t.key} className="rounded-2xl border border-[#FFB319] bg-[#0F3943] p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-[#09242B] text-lg text-[#FFB319]">
                    {t.emoji}
                  </div>
                  <h3 className="font-outfit text-lg font-bold text-[#FFB319]">{t.label}</h3>
                </div>
                <p className="mt-3 font-manrope text-[13px] leading-relaxed text-[#E2ECEF]">
                  {STRENGTH_DESC[t.key] || "Bakat yang terus berkembang lewat setiap petualangan."}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

// ---- Radar chart (N titik) ----
function TalentRadar({ traits }: { traits: { key: string; label: string; score: number; emoji?: string }[] }) {
  const N = traits.length;
  const cx = 140;
  const cy = 140;
  const R = 105;

  const point = (i: number, r: number) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / N;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  // polygon data (0..1)
  const dataPts = traits.map((t, i) => point(i, (R * t.score) / 100));
  const dataPoly = dataPts.map((p) => `${p.x},${p.y}`).join(" ");

  // grid rings (0.33, 0.66, 1.0)
  const rings = [0.33, 0.66, 1.0].map((f) =>
    traits.map((_, i) => {
      const p = point(i, R * f);
      return `${p.x},${p.y}`;
    }).join(" ")
  );

  return (
    <svg viewBox="0 0 280 280" className="w-[280px] h-[280px]">
      {/* rings */}
      {rings.map((poly, idx) => (
        <polygon key={idx} points={poly} fill="rgba(15,57,67,0.2)" stroke="#124B56" strokeWidth="1" strokeDasharray="4" />
      ))}
      {/* axes */}
      {traits.map((_, i) => {
        const p = point(i, R);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#124B56" strokeWidth="1.2" />;
      })}
      {/* data */}
      <polygon points={dataPoly} fill="rgba(255,179,25,0.25)" stroke="#FFB319" strokeWidth="2.5" />
      {dataPts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="5" fill="#FFB319" stroke="#fff" strokeWidth="1.5" />
      ))}
      {/* labels */}
      {traits.map((t, i) => {
        const p = point(i, R + 26);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" className="fill-white/80" fontSize="10" fontWeight="700">
            {t.emoji}
          </text>
        );
      })}
    </svg>
  );
}
