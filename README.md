# 🧵 Tenun Nusantara — MVP

> **Petualangan Mengenali Dirimu** bersama **NALA**
> Platform gamifikasi edukatif untuk memetakan minat-bakat anak usia 7–14 tahun.

**Status:** 🟢 MVP (Minimum Viable Product) — aktif dikembangkan
**Tim:** ATEAM

---

## 📌 Apa ini?

**Tenun Nusantara** adalah aplikasi web **game edukatif** yang mengajak anak-anak menjelajah **5 pulau** Nusantara. Di setiap pulau, anak menyelesaikan **3 babak permainan** (minigame) + **sesi Refleksi** bersama **NALA**, asisten AI yang hangat dan berbahasa Indonesia.

Dari setiap aksi anak (pilihan, jawaban asesmen, bahkan salah klik), sistem merekam **jejak perilaku** untuk menyusun **"Peta Bakat"** — profil kecerdasan (8 dimensi) dan rekomendasi pengembangan yang personal.

> ⚠️ **Ini MVP**: berfokus membuktikan konsep inti. Beberapa area (backend lengkap, dashboard guru penuh, audio, deploy) masih dalam tahap lanjutan — lihat [Roadmap](#-roadmap).

---

## 🎯 Tujuan & Pengguna

- **Anak (7–14)** — belajar sambil bermain, mengenali kekuatan dirinya.
- **Guru** — memantau perkembangan & potensi siswa.
- **Orang Tua** — membaca laporan perjalanan belajar anak.

Setiap peran memiliki menu & pandangan berbeda (pilih di halaman **role-selection**).

---

## ✨ Fitur Utama

| Area | Fitur |
|------|-------|
| 🏝️ **5 Pulau** | Candi, Harmoni, Terapung, Aksara, Rimba — masing-masing 3 babak + refleksi |
| 🎮 **Minigame** | Observasi, puzzle drag-drop, pipa air, tune gamelan, tenun, barter, mediasi, pantun, wayang, dll. (14 jenis) |
| 🤖 **NALA (AI)** | Narasi adaptif, petunjuk, dan refleksi personal via **Gemini** (dengan fallback statis) |
| 🔊 **TTS** | Suara NALA via **ElevenLabs → Edge TTS → Web Speech** (fallback berjenjang) + **mute global** |
| 📊 **Peta Bakat** | Radar 8 dimensi kecerdasan, bakat dominan, lencana, pesan hangat NALA |
| 🏅 **Gamifikasi** | XP, level (1–6), lencana pulau & level, timer babak |
| 💾 **Data & Sesi** | Event ber-timestamp, resume babak, resume dalam minigame, sinkronisasi ke Supabase |
| 🔐 **Akun (dasar)** | Login/Daftar email+password + mode tamu; pull lintas perangkat |
| 🧭 **Navbar role-based** | Menu menyesuaikan peran; navbar konsisten lintas halaman |

---

## 🛠️ Tech Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript** (strict)
- **TailwindCSS** (tema gelap-navy, aksen emas & teal)
- **Vercel AI SDK** + **Google Gemini** (`@ai-sdk/google`)
- **Supabase** (Auth, PostgreSQL) — `@supabase/ssr`, `@supabase/supabase-js`
- **Zustand** (state), **Framer Motion** (animasi), **lucide-react** (ikon)
- **Edge TTS** (`msedge-tts`), **Web Speech API** (input suara)

---

## 📁 Struktur Proyek (ringkas)

```
src/
├─ app/            # Halaman (route) — landing, auth, student, teacher, parent, api
│  ├─ (marketing)/ # Landing
│  ├─ (auth)/      # Login, role-selection
│  ├─ (student)/   # Map, island, refleksi, report, profil
│  ├─ (teacher)/   # Dashboard
│  └─ api/         # ai, tts, reports, telemetry
├─ components/
│  ├─ game/        # Minigame (14), island-game, reflection-client, modal
│  ├─ layout/      # AppNavbar, sidebar, topbar, orientation-guard
│  ├─ landing/     # Hero, features, nav-bar
│  └─ ui/          # Button, Card, GameAsset, SafeImage, dll.
├─ lib/
│  ├─ ai/          # gemini, generate, nala-agent, prompts, report
│  ├─ session/     # session.ts (event, XP, level, resume)
│  ├─ scoring/     # engine.ts (profil bakat), evidence-rules
│  ├─ supabase/    # client, server, service, schema, sync
│  ├─ sound/       # sound-store (mute global)
│  └─ telemetry/   # tracker (antrean + flush)
├─ hooks/          # use-auth, use-sound, use-tts, use-persistent-state, use-resume
├─ stores/         # auth-store, story-store, student-store
├─ config/         # islands, asset-paths, orientation
└─ types/          # game, story, telemetry, user
```

---

## 🚀 Menjalankan

```bash
# 1) Install dependensi
npm install

# 2) Siapkan env (lihat bagian Env)
cp .env.example .env.local   # lalu isi nilainya

# 3) Jalankan dev server
npm run dev
```

Buka **http://localhost:3000**.

> Aplikasi dirancang **landscape** (layar desktop/laptop/tablet landscape). Di layar kecil/portrait muncul pesan dari *OrientationGuard*.

---

## 🔐 Environment Variables (`.env.local`)

```dotenv
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx   # atau ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=eyJ...service_role...           # RAHASIA, server-only

# Gemini AI
GOOGLE_AI_API_KEY=...        # opsional: GEMINI_MODEL=
# ElevenLabs TTS (opsional, fallback ke Edge)
ELEVENLABS_API_KEY=...
ELEVENLABS_VOICE_ID=...
ELEVENLABS_MODEL_ID=eleven_flash_v2_5

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_ENABLE_VOICE_INPUT=true
NEXT_PUBLIC_ENABLE_TELEMETRY=true
```

> **Keamanan:** `SUPABASE_SERVICE_ROLE_KEY` & `GOOGLE_AI_API_KEY` **jangan** diberi prefix `NEXT_PUBLIC_` (tidak boleh bocor ke browser).

---

## 🗄️ Supabase — Setup

1. Buat project di [Supabase](https://supabase.com).
2. Isi env (URL + publishable/anon + service role).
3. Terapkan **migrasi**: buka **SQL Editor** → tempel isi `supabase/migrations/0001_init.sql` → **Run**. Ini membuat tabel `profiles`, `sessions`, `events`, `scores` + kebijakan RLS.

**Verifikasi cepat:**
```bash
node scripts/verify-supabase.mjs   # menampilkan status koneksi & jumlah baris tiap tabel
```

**Tanpa Supabase?** Aplikasi tetap berjalan penuh sebagai **mode tamu** (data di `localStorage`); sinkronisasi otomatis no-op.

---

## 💾 Data & Sesi (cara kerja)

- **Sesi unik** (`sessionId`) per permainan; semua aksi dicatat sebagai **event** ber-timestamp.
- **XP & level** dihitung dari event nyata; **lencana** untuk level & pulau.
- **Resume**: posisi babak tersimpan; **state minigame** (mis. puzzle) juga disimpan agar refresh tidak me-restart.
- **Mute global** (`tenun-mute`) berlaku di semua halaman & TTS hormat.
- **Telemetri**: event diantrekan di `localStorage` lalu di-flush (saat ≥5 event / keluar halaman) ke `/api/telemetry` → Supabase.

**Kunci `localStorage`:**
`tenun-player`, `tenun-progress`, `tenun-session`, `tenun-events`, `tenun-assessment`, `tenun-role`, `tenun-mute`, `tenun-user-id`, `tenun-device`, `tenun-minigame-state`, `tenun-sync-queue`.

---

## 📜 Scripts

| Command | Fungsi |
|---------|--------|
| `npm run dev` | Dev server |
| `npm run build` | Build produksi |
| `npm run start` | Jalankan hasil build |
| `npm run lint` / `lint:fix` | Lint |
| `npm run type-check` | Cek tipe TypeScript |
| `npm run test` / `test:ui` | Unit test (Vitest) |
| `node scripts/verify-supabase.mjs` | Cek koneksi & tabel Supabase |

---

## 📚 Dokumentasi

Dokumen hidup tersedia di folder **`docs/`**:

| Dokumen | Isi |
|---------|-----|
| `PROJECT_STATE.md` | Status terkini & progres |
| `SPRINT_PLAN.md` | Rencana sprint + status aktual |
| `DECISION_LOG.md` | Keputusan arsitektur/teknis |
| `ASSET_CHECKLIST.md` | Daftar aset |
| `EVALUATION_AND_ROADMAP.md` | Temuan, evaluasi, rencana ke depan |

---

## 🧭 Roadmap

**Selesai (MVP inti):** 5 pulau, framework minigame, NALA AI + TTS, lapisan sesi/data, mute global, navbar role-based, Peta Bakat (siswa & orang tua), gate report, stabilisasi Gemini, resume minigame, timer jeda, auth+login dasar, push telemetri ke Supabase.

**Lanjutan:** middleware session refresh · binding data tamu→akun · Dashboard Guru penuh (radar/heatmap kelas) · audio BGM/SFX · laporan ortu diperkaya · aksesibilitas & responsif · deploy ke Vercel.

Lihat **`docs/EVALUATION_AND_ROADMAP.md`** untuk detail lengkap.

---

## 📝 Catatan / Disclaimer

- **MVP untuk edukasi** — tidak dimaksudkan sebagai diagnosis psikologis formal; "Peta Bakat" adalah alat reflektif, bukan tes baku.
- Data permainan untuk mode tamu hanya di perangkat (browser); gunakan **akun** untuk sinkronisasi lintas perangkat.
- Beberapa fitur AI/TTS memerlukan API key yang valid di production.

---

## 🏆 Kredit

**Dibuat oleh ATEAM** — dengan semangat abizzz. 🇮🇩

