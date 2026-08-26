"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Pencil, Ticket, Anchor } from "lucide-react";

const DIAMONDS = Array.from({ length: 24 }, (_, i) => i);

const characters = [
  {
    id: "bayu",
    name: "Bayu",
    origin: "Sumatera",
    motif: "Motif Songket",
    image: "/assets/images/characters/npcs/char_bayu.png",
  },
  {
    id: "siti",
    name: "Siti",
    origin: "Jawa",
    motif: "Motif Parang",
    image: "/assets/images/characters/npcs/char_siti.png",
  },
  {
    id: "nyoman",
    name: "Nyoman",
    origin: "Bali",
    motif: "Motif Endek",
    image: "/assets/images/characters/npcs/char_nyoman.png",
  },
  {
    id: "ulan",
    name: "Ulan",
    origin: "Papua",
    motif: "Motif Asmat",
    image: "/assets/images/characters/npcs/char_ulan.png",
  },
];

export default function CharSelectPage() {
  const router = useRouter();
  const [selected, setSelected] = useState(characters[1]); // Siti default (active)
  const [name, setName] = useState("");
  const [teacherCode, setTeacherCode] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Simpan pilihan pemain agar dipakai di halaman map
    localStorage.setItem(
      "tenun-player",
      JSON.stringify({
        name,
        characterId: selected.id,
        motif: selected.motif,
        origin: selected.origin,
      })
    );
    router.push("/map");
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <main className="flex w-full max-w-[1440px] flex-col gap-12 px-5 py-10 md:px-20">
        {/* Header Section */}
        <header className="flex w-full flex-col gap-2">
          <h1 className="font-outfit text-[40px] font-extrabold leading-[50px] text-[#FFB319]">
            Siapa Penjelajahmu?
          </h1>
          <p className="text-[16px] font-normal leading-[22px] text-[#E2ECEF]">
            Pilih teman perjalanan dan ketik namamu untuk memulai ekspedisi di Nusantara!
          </p>

          {/* Decorative Diamond Pattern */}
          <div className="mt-2 flex h-2 w-full flex-row items-center justify-between opacity-30">
            {DIAMONDS.map((i) => (
              <div key={i} className="h-2 w-2 rotate-45 bg-[#FFB319]" />
            ))}
          </div>
        </header>

        {/* Content Form & Preview */}
        <div className="flex w-full flex-col gap-12 lg:flex-row">
          {/* Selection & Input Forms */}
          <form id="explorer-form" onSubmit={handleSubmit} className="flex flex-1 flex-col gap-6">
            {/* Character Selector */}
            <div>
              <h2
                className="font-outfit text-[20px] font-bold leading-[25px] text-white"
                style={{ marginBottom: 24 }}
              >
                Pilih Karakter Dasar:
              </h2>
              <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
                {characters.map((char) => {
                  const active = selected.id === char.id;
                  return (
                    <button
                      type="button"
                      key={char.id}
                      onClick={() => setSelected(char)}
                      aria-pressed={active}
                      className={`flex flex-col items-center gap-3 rounded-2xl p-4 transition-all duration-200 ${
                        active
                          ? "border-2 border-[#FFB319] bg-[#0F3943]"
                          : "border-2 border-white/10 bg-[#09242B] hover:-translate-y-0.5 hover:border-[#FFB319]/50"
                      }`}
                    >
                      <Image
                        src={char.image}
                        alt={char.name}
                        width={100}
                        height={100}
                        className="h-[100px] w-[100px] rounded-full border-2 border-[#FFB319] object-cover"
                      />
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-outfit text-[16px] font-bold leading-5 text-white">
                          {char.name}
                        </span>
                        <span className="text-[12px] leading-4 text-[#8DA2A6]">{char.origin}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Player Name */}
            <div className="flex w-full flex-col gap-2">
              <label
                htmlFor="player-name"
                className="mb-2 block font-outfit text-[16px] font-bold leading-5 text-white"
              >
                Tulis Namamu:
              </label>
              <div className="flex h-[54px] items-center gap-3 rounded-xl border-[1.5px] border-[#FFB319] bg-[#0F3943] px-4">
                <Pencil className="h-5 w-5 shrink-0 text-[#FFB319]" />
                <input
                  id="player-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama..."
                  required
                  className="w-full bg-transparent font-manrope text-[16px] font-normal text-white outline-none placeholder:text-white/50"
                />
              </div>
            </div>

            {/* Input Referral/Teacher Code */}
            <div className="flex w-full flex-col gap-2">
              <label
                htmlFor="teacher-code"
                className="mb-2 block font-outfit text-[16px] font-bold leading-5 text-white"
              >
                Apakah Kamu punya kode khusus dari Gurumu?
              </label>
              <div className="flex h-[54px] items-center gap-3 rounded-xl border-[1.5px] border-[#FFB319] bg-[#0F3943] px-4">
                <Ticket className="h-5 w-5 shrink-0 text-[#FFB319]" />
                <input
                  id="teacher-code"
                  value={teacherCode}
                  onChange={(e) => setTeacherCode(e.target.value)}
                  placeholder="Masukkan kode khusus (opsional)"
                  className="w-full bg-transparent font-manrope text-[16px] font-normal text-white outline-none placeholder:text-white/50"
                />
              </div>
            </div>
          </form>

          {/* Preview Box */}
          <aside className="flex h-[446px] w-full flex-shrink-0 flex-col items-center gap-6 rounded-3xl border-2 border-[#FFB319] bg-[#0F3943] p-8 lg:w-[400px]">
            <h2 className="font-outfit text-[18px] font-bold uppercase leading-[23px] text-[#FFB319]">
              Pratinjau Penjelajah
            </h2>
            <Image
              src={selected.image}
              alt={`${name} Preview`}
              width={240}
              height={240}
              className="h-[240px] w-[240px] rounded-full border-4 border-[#FFB319] object-cover"
            />
            <div className="flex w-full flex-col items-center gap-2">
              <span className="font-outfit text-[28px] font-extrabold leading-[35px] text-white">
                {name || selected.name}
              </span>
              <div className="flex items-center rounded-xl bg-[#09242B] px-3 py-1.5 text-[12px] font-bold leading-4 text-[#19D29F]">
                <span>Sash Tenun: {selected.motif}</span>
              </div>
            </div>
          </aside>
        </div>

        {/* Action Footer */}
        <footer className="flex w-full justify-end">
          <button
            type="submit"
            form="explorer-form"
            className="inline-flex items-center justify-center gap-3 rounded-[32px] bg-[#FFB319] px-10 py-[18px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0px_8px_24px_-4px_rgba(255,179,25,0.6)]"
          >
            <span className="font-outfit text-[18px] font-extrabold uppercase leading-[23px] text-[#0B1D23]">
              Mulai Berlayar
            </span>
            <div className="flex h-6 w-6 items-center justify-center text-[#0B1D23]">
              <Anchor className="h-6 w-6" />
            </div>
          </button>
        </footer>
      </main>
    </div>
  );
}
