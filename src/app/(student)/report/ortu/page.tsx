"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, Check, Compass, Ticket, Users } from "lucide-react";
import { computeTalentProfile, type ReportEvent } from "@/lib/scoring/engine";
import { getSession, getEvents, type SessionEvent } from "@/lib/session/session";
import { loadGame, normalizeGameCode } from "@/lib/session/game-store";
import { AppNavbar } from "@/components/layout/app-navbar";
import { ISLAND_BLURB } from "@/lib/report/guidance";
import { ParentReportView } from "@/components/report/parent-report-view";
import type { ParentReportInput } from "@/lib/report/parent-report";
import { LoadingShip } from "@/components/ui/loading-ship";

const AVATARS: Record<string, string> = {
  bayu: "/assets/images/characters/npcs/char_bayu.png",
  siti: "/assets/images/characters/npcs/char_siti.png",
  nyoman: "/assets/images/characters/npcs/char_nyoman.png",
  ulan: "/assets/images/characters/npcs/char_ulan.png",
};

const ALL_ISLAND_IDS = ["candi", "rimba", "harmoni", "aksara", "terapung"];

const ISLAND_META = [
  { id: "candi", name: "Pulau Candi", emoji: "🏛️", desc: ISLAND_BLURB.candi.desc },
  { id: "rimba", name: "Pulau Rimba", emoji: "🌿", desc: ISLAND_BLURB.rimba.desc },
  { id: "harmoni", name: "Pulau Harmoni", emoji: "🎵", desc: ISLAND_BLURB.harmoni.desc },
  { id: "aksara", name: "Pulau Aksara", emoji: "📜", desc: ISLAND_BLURB.aksara.desc },
  { id: "terapung", name: "Pulau Pasar Terapung", emoji: "⛵", desc: ISLAND_BLURB.terapung.desc },
];

type Phase = "lookup" | "progress" | "report";
type LookupState = "idle" | "loading" | "notfound";

export default function ParentReportPage() {
  const [phase, setPhase] = useState<Phase>("lookup");
  const [lookup, setLookup] = useState<LookupState>("idle");
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ParentReportInput | null>(null);

  const doneCount = data
    ? ALL_ISLAND_IDS.filter((id) => data.completedIslands.includes(id)).length
    : 0;
  const allDone = data ? doneCount === ALL_ISLAND_IDS.length : false;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = normalizeGameCode(input);
    if (!code) {
      setError("Masukkan kode game anakmu terlebih dahulu.");
      return;
    }
    setError(null);
    setLookup("loading");
    const ok = await loadGame(code);
    if (!ok) {
      setLookup("notfound");
      return;
    }
    const session = getSession();
    const events = getEvents();
    const completedIslands = [...new Set(session.completedIslands || [])];
    const player = session.player || { name: "Penjelajah", characterId: "siti" };
    const profile = computeTalentProfile(events as ReportEvent[], completedIslands.length);
    const child: ParentReportInput = {
      gameCode: code,
      player: {
        name: player.name || "Penjelajah",
        characterId: player.characterId || "siti",
        motif: player.motif,
      },
      xp: Number(session.xp || 0),
      level: Number(session.level || 1),
      startedAt: session.startedAt || "",
      lastActiveAt: session.lastActiveAt || "",
      classCode: session.classCode,
      completedIslands,
      badges: Array.isArray(session.badges) ? session.badges : [],
      profile,
      events: events as SessionEvent[],
    };
    setData(child);
    setLookup("idle");
    setPhase(completedIslands.length === ALL_ISLAND_IDS.length ? "report" : "progress");
  }

  function reset() {
    setPhase("lookup");
    setLookup("idle");
    setError(null);
    setData(null);
    setInput("");
  }

  // ===== Fase 1: input kode game anak =====
  if (phase === "lookup") {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#09242B] to-[#060F14] text-white">
        <AppNavbar active="laporan-ortu" />
        <div className="mx-auto flex w-full max-w-[620px] flex-col items-center px-6 py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#144955] text-[#FFB319]">
            <Users size={30} />
          </span>
          <h1 className="mt-5 font-outfit text-3xl font-extrabold text-[#FFB319] md:text-[40px]">
            Laporan Orang Tua
          </h1>
          <p className="mt-3 max-w-md font-manrope text-sm leading-relaxed text-[#8DA2A6]">
            Masukkan <b className="text-[#19D29F]">kode game</b> milik anakmu untuk melihat kemajuan petualangan
            dan Peta Bakat mereka.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 w-full">
            <div className="flex h-[56px] items-center gap-3 rounded-xl border-[1.5px] border-[#FFB319] bg-[#0F3943] px-4">
              <Ticket className="h-5 w-5 shrink-0 text-[#FFB319]" />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Kode game anak (mis. TN-AB12CD)"
                className="w-full bg-transparent font-manrope text-[16px] font-normal text-white uppercase outline-none placeholder:text-[#5A7378]"
              />
            </div>

            {error && (
              <p className="mt-3 rounded-lg bg-[#E63946]/15 px-3 py-2 font-manrope text-xs text-[#FF8A94]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={lookup === "loading"}
              className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[32px] bg-[#FFB319] font-outfit text-base font-extrabold uppercase text-[#0B1D23] transition hover:brightness-110 disabled:opacity-60"
            >
              {lookup === "loading" ? (
                <LoadingShip size={22} inline />
              ) : (
                <Compass size={18} />
              )}
              Lihat Kemajuan Anak
            </button>
          </form>

          {lookup === "notfound" && (
            <div className="mt-6 w-full rounded-2xl border border-[#E63946]/40 bg-[#0F3943] p-5 text-left">
              <p className="font-manrope text-sm text-[#FF8A94]">
                Kode <b>{normalizeGameCode(input)}</b> tidak ditemukan.
              </p>
              <p className="mt-1 font-manrope text-xs text-[#8DA2A6]">
                Pastikan kode sesuai yang tampil di layar permainan anak (berawalan TN-). Coba lagi atau hubungi
                guru untuk bantuan.
              </p>
            </div>
          )}

          <p className="mt-8 font-manrope text-xs text-[#5A7378]">
            Kode game terlihat di Peta Nusantara dan Peta Bakat anak (format TN-XXXXXX).
          </p>
        </div>
      </main>
    );
  }

  if (!data) return null;

  // ===== Fase 2: anak belum selesai → detail progress =====
  if (phase === "progress") {
    const remaining = ALL_ISLAND_IDS.filter((id) => !data.completedIslands.includes(id));
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#09242B] to-[#060F14] text-white">
        <AppNavbar active="laporan-ortu" />
        <div className="mx-auto w-full max-w-[900px] px-6 py-10 lg:px-[40px]">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 font-manrope text-sm font-bold text-[#19D29F] hover:text-[#FFB319]"
          >
            <ArrowLeft size={16} /> Cari kode lain
          </button>

          {/* Header anak */}
          <section className="mt-5 flex flex-col items-start justify-between gap-5 rounded-3xl border border-[#FFB319] bg-[#0F3943] p-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-5">
              <Image
                src={AVATARS[data.player.characterId] ?? AVATARS.siti}
                alt={data.player.name}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full border-2 border-[#FFB319] object-cover"
              />
              <div className="flex flex-col gap-1">
                <h1 className="font-outfit text-2xl font-extrabold text-[#FFB319]">{data.player.name}</h1>
                <p className="font-manrope text-sm text-[#E2ECEF]">
                  {data.player.motif || "Petualang Nusantara"} • Kode {data.gameCode}
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-[#19D29F]/40 bg-[#09242B] px-5 py-3">
              <span className="font-outfit text-xl font-extrabold text-white">
                {doneCount} <span className="text-white/50">/</span> {ALL_ISLAND_IDS.length}
              </span>
              <div className="mt-1 font-manrope text-xs uppercase tracking-wider text-[#19D29F]">
                pulau selesai
              </div>
            </div>
          </section>

          {/* Peringatan belum selesai */}
          <section className="mt-6 rounded-3xl border border-[#FFB319]/40 bg-[#0F3943] p-6">
            <h2 className="font-outfit text-lg font-extrabold text-white">
              Peta Bakat belum terbuka 🚀
            </h2>
            <p className="mt-2 font-manrope text-sm leading-relaxed text-[#E2ECEF]">
              <b className="text-[#FFB319]">{data.player.name}</b> masih menjelajahi Nusantara. Laporan lengkap
              (Peta Bakat 8 dimensi, rekomendasi karir, dan langkah stimulasi) akan terbuka setelah{" "}
              <b className="text-[#19D29F]">semua 5 pulau selesai</b>. Berikut detail kemajuan mereka:
            </p>

            {/* Statistik */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Pulau Selesai", value: `${doneCount}/${ALL_ISLAND_IDS.length}` },
                { label: "XP Terkumpul", value: data.xp },
                { label: "Level", value: data.level },
                { label: "Asesmen Bakat", value: data.profile.assessmentCount },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-[#09242B] p-4">
                  <div className="font-outfit text-2xl font-extrabold text-[#FFB319]">{s.value}</div>
                  <div className="font-manrope text-xs font-bold uppercase tracking-wider text-[#8DA2A6]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-5">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#09242B]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FFB319] to-[#19D29F]"
                  style={{ width: `${(doneCount / ALL_ISLAND_IDS.length) * 100}%` }}
                />
              </div>
              <p className="mt-2 font-manrope text-xs text-[#8DA2A6]">
                Tinggal <b className="text-[#FFB319]">{remaining.length} pulau lagi</b> untuk membuka laporan.
              </p>
            </div>
          </section>

          {/* Rincian pulau */}
          <section className="mt-6 flex flex-col gap-3">
            <h2 className="font-outfit text-lg font-extrabold text-white">Rincian Pulau</h2>
            {ALL_ISLAND_IDS.map((id, idx) => {
              const meta = ISLAND_META.find((m) => m.id === id)!;
              const done = data.completedIslands.includes(id);
              return (
                <div
                  key={id}
                  className={`flex items-start gap-4 rounded-2xl border p-5 ${
                    done ? "border-[#19D29F]/40 bg-[#0F3943]" : "border-[#FFB319]/20 bg-[#0F3943]/60"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full border-2 ${
                      done ? "border-[#19D29F] bg-[#19D29F]/20 text-[#19D29F]" : "border-[#FFB319]/40 text-[#FFB319]"
                    }`}
                  >
                    {done ? <Check size={16} /> : idx + 1}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className={`font-outfit text-base font-extrabold ${done ? "text-white" : "text-[#8DA2A6]"}`}>
                      {meta.emoji} {meta.name}
                    </span>
                    <span className={`font-manrope text-xs leading-relaxed ${done ? "text-[#8DA2A6]" : "text-[#5A7378]"}`}>
                      {done ? meta.desc : "Belum dijelajahi — arahkan si kecil ke pulau ini di Peta Nusantara."}
                    </span>
                  </div>
                </div>
              );
            })}
          </section>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={reset}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[32px] border border-[#19D29F] bg-[#0F3943] font-outfit text-base font-bold uppercase text-[#19D29F] transition hover:bg-[#144955] sm:w-auto sm:flex-1"
            >
              <Users size={18} /> Cek Kode Lain
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ===== Fase 3: anak sudah selesai → laporan lengkap & detail =====
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#09242B] to-[#060F14] text-white">
      <AppNavbar active="laporan-ortu" />
      <div className="mx-auto w-full max-w-[1200px] border-x border-[#FFB319]/40 px-5 py-8 lg:px-[80px]">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 font-manrope text-sm font-bold text-[#19D29F] hover:text-[#FFB319]"
        >
          <ArrowLeft size={16} /> Cari kode lain
        </button>
        <div className="mt-5">
          <ParentReportView data={data} />
        </div>
      </div>
    </main>
  );
}
