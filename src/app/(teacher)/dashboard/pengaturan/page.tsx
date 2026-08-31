"use client";

import { useState } from "react";
import { Check, Copy, Info, Pencil, Plus, Settings, Trash2 } from "lucide-react";
import {
  createClass,
  deleteClass,
  listClasses,
  renameClass,
  setActiveClassCode,
  type TeacherClass,
} from "@/lib/teacher/class-store";
import { LoadingShip } from "@/components/ui/loading-ship";

function copyText(text: string) {
  try {
    navigator.clipboard?.writeText(text);
  } catch {
    // abaikan
  }
}

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

export default function PengaturanPage() {
  const [classes, setClasses] = useState<TeacherClass[]>(() => listClasses());
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");

  function refresh() {
    setClasses(listClasses());
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    // biar kapal sempat tampil sekejap & mencegah pencet ganda
    await new Promise((r) => setTimeout(r, 600));
    const cls = createClass(label);
    setLabel("");
    setBusy(false);
    refresh();
    setActiveClassCode(cls.code);
    copyText(cls.code);
    setCopied(cls.code);
    try {
      window.dispatchEvent(new Event("tenun:classchange"));
    } catch {
      // abaikan
    }
  }

  async function handleCopy(code: string) {
    copyText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  }

  function handleDelete(id: string) {
    deleteClass(id);
    refresh();
    try {
      window.dispatchEvent(new Event("tenun:classchange"));
    } catch {
      // abaikan
    }
  }

  function handleRename(id: string) {
    renameClass(id, editLabel);
    setEditId(null);
    setEditLabel("");
    refresh();
    try {
      window.dispatchEvent(new Event("tenun:classchange"));
    } catch {
      // abaikan
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <h1 className="font-outfit text-2xl font-extrabold text-white">
          Pengaturan <span className="text-[#FFB319]">Kelas</span>
        </h1>
        <p className="font-manrope text-sm text-[#8DA2A6]">
          Kelola beberapa kelas sekaligus. Setiap kelas punya label dan kode unik untuk dibagikan ke siswa.
        </p>
      </section>

      {/* Cara siswa bergabung */}
      <section className="flex items-start gap-4 rounded-3xl border border-[#19D29F]/30 bg-[#0F3943] p-6">
        <Info size={22} className="mt-0.5 flex-none text-[#19D29F]" />
        <div className="flex flex-col gap-2">
          <h2 className="font-outfit text-base font-extrabold text-white">Bagaimana siswa bergabung?</h2>
          <ol className="flex list-inside list-decimal flex-col gap-1.5 font-manrope text-sm leading-relaxed text-[#E2ECEF]">
            <li>Buat kelas di bawah ini — sistem menghasilkan kode unik (mis. <b className="text-[#FFB319]">KL-7K3M9X</b>).</li>
            <li>Bagikan kode + label kelas ke siswa.</li>
            <li>Siswa memasukkan kode itu di kolom <i>&quot;kode khusus dari guru&quot;</i> saat memilih karakter.</li>
            <li>Setelah bermain, data siswa muncul di Ringkasan, Sebaran, Daftar, dan Laporan kelas ini.</li>
          </ol>
        </div>
      </section>

      {/* Buat kelas baru */}
      <section className="rounded-3xl border border-[#FFB319]/30 bg-[#0F3943] p-6">
        <h2 className="font-outfit text-lg font-extrabold text-white">Buat Kelas Baru</h2>
        <form onSubmit={handleCreate} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <div className="flex h-11 flex-1 items-center gap-2 rounded-xl border border-[#FFB319]/40 bg-[#09242B] px-4">
            <Settings size={16} className="text-[#8DA2A6]" />
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Label kelas (mis. 7A, Kelas Tenun Pagi)"
              className="w-full bg-transparent font-manrope text-sm text-white outline-none placeholder:text-[#5A7378]"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[32px] bg-[#FFB319] px-6 font-outfit text-sm font-extrabold uppercase text-[#0B1D23] transition hover:brightness-110 disabled:opacity-60"
          >
            {busy ? <LoadingShip size={20} inline /> : <Plus size={18} />}
            Buat & Salin Kode
          </button>
        </form>
      </section>

      {/* Daftar kelas */}
      <section className="flex flex-col gap-3">
        <h2 className="font-outfit text-lg font-extrabold text-white">Daftar Kelas ({classes.length})</h2>
        {classes.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-[#FFB319]/40 bg-[#0F3943]/50 px-6 py-10 text-center font-manrope text-sm text-[#8DA2A6]">
            Belum ada kelas. Buat kelas pertama untuk mulai mengumpulkan data siswa.
          </p>
        ) : (
          classes.map((c) => (
            <div key={c.id} className="flex flex-col gap-3 rounded-2xl border border-[#FFB319]/30 bg-[#0F3943] p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 flex-col gap-1">
                {editId === c.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      className="h-9 flex-1 rounded-lg border border-[#FFB319]/40 bg-[#09242B] px-3 font-manrope text-sm text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRename(c.id)}
                      className="rounded-lg bg-[#FFB319] px-3 py-2 font-manrope text-xs font-bold text-[#0B1D23]"
                    >
                      Simpan
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditId(null)}
                      className="rounded-lg bg-[#144955] px-3 py-2 font-manrope text-xs font-bold text-white"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="font-outfit text-base font-extrabold text-white">{c.label}</span>
                    <span className="font-manrope text-xs text-[#8DA2A6]">
                      Dibuat {fmtDate(c.createdAt)}
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="flex h-10 items-center gap-2 rounded-xl bg-[#09242B] px-3 font-manrope text-sm font-bold text-[#19D29F]">
                  {c.code}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(c.code)}
                  title="Salin kode"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FFB319]/40 bg-[#0F3943] text-[#FFB319] transition hover:bg-[#144955]"
                >
                  {copied === c.code ? <Check size={16} /> : <Copy size={16} />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditId(c.id);
                    setEditLabel(c.label);
                  }}
                  title="Ubah nama"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FFB319]/40 bg-[#0F3943] text-[#8DA2A6] transition hover:bg-[#144955]"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(c.id)}
                  title="Hapus kelas"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E63946]/40 bg-[#0F3943] text-[#FF8A94] transition hover:bg-[#3a1b22]"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
