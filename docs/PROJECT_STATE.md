# 🎯 PROJECT STATE - Tenun Nusantara MVP

**Last Updated:** 2026-08-26  
**Status:** 🟢 Active — 5 pulau lengkap + data/sesi, report (siswa & ortu), mute global, navbar role-based, tes E2E lulus

---

## 📊 Overall Progress

| Area | Status | Progress |
|------|--------|----------|
| Foundation & UI Mockup (Sprint 0) | ✅ Done | 100% |
| Kerangka permainan pulau (3 babak + refleksi) | ✅ Done | 100% |
| Aset asli semua pulau (Candi, Harmoni, Terapung, Aksara, Rimba) | ✅ Done | 100% |
| NALA AI (Gemini) + TTS (Edge fallback) | ✅ Done | 100% |
| Lapisan Sesi & Data (event, resume, XP, level, lencana) | ✅ Done | 100% |
| Mute global | ✅ Done | 100% |
| Navbar tunggal + menu berbasis role | ✅ Done | 100% |
| Halaman Report siswa (Peta Bakat) + gate | ✅ Done | 100% |
| Halaman Report orang tua (`/report/ortu`) | ✅ Done | 100% |
| Tes E2E menyeluruh | ✅ Done | 100% |
| Stabilisasi Gemini (fallback model + timeout) | ✅ Done | 100% |
| Resume di dalam minigame (persisten) | ✅ Done | 100% |
| Timer jeda saat modal asesmen | ✅ Done | 100% |
| Supabase: schema, client/server/service, telemetry push | 🟡 Sebagian | 70% |
| Supabase: Auth (login/daftar) + pull lintas perangkat | 🟡 Sebagian | 60% |
| Dashboard Guru (Sprint 3) | 🟡 Stub | 10% |
| Audio BGM/SFX | ⚪ Belum | 0% |
| Deployment | ⚪ Belum | 0% |

---

## ✅ Yang Sudah Selesai

### Alur & UI
- Landing, role-selection (simpan `tenun-role`), char-select, world map.
- Kerangka pulau: 3 babak (minigame) + refleksi; layout satu layar + modal.
- **5 pulau di-wire dengan aset asli**:
  - **Candi**: observe, puzzle16 (drag-drop 16), pipe (aliran air).
  - **Harmoni**: observe (bahan pewarna), tune (gamelan), weave (motif tenun).
  - **Terapung**: observe (pedagang), barter (muatan), mediate (kesepakatan).
  - **Aksara**: observe (naskah), verse (pantun/gurindam), stage (alur).
  - **Rimba**: observe (flora), match (jejak–satwa), filter (lapisan air).
- Semua komponen minigame menerima & memanggil `onWrong` (pencatatan salah klik).

### Data & Sesi (`src/lib/session/session.ts`)
- `sessionId` unik; semua aksi tercatat sebagai **event ber-timestamp** (`tenun-events`).
- Resume posisi pulau + babak.
- XP (asesmen/babak/pulau/refleksi), level 1–6, lencana level & pulau.
- Timer babak habis → modal "Lanjutkan".
- **Resume di dalam minigame**: `usePersistentState` menyimpan state babak (contoh: puzzle16, pipe) ke `tenun-minigame-state`; dipulihkan saat refresh. Timer **berhenti** saat modal asesmen/overlay terbuka.

### Stabilisasi AI (2026-08-26)
- `gemini.ts`: daftar model fallback (`gemini-2.5-flash` → `1.5-flash` → `2.0-flash`); model lama `gemini-3.6-flash` diganti (tidak valid).
- `generate.ts`: `generateWithFallback` mencoba tiap model berurutan + timeout (20s), mengembalikan `null` → fallback narasi statis.
- `report.ts` & `nala-agent.ts` memakai helper tersebut.

### Backend Supabase (parsial, 2026-08-26)
- `supabase/migrations/0001_init.sql`: tabel `profiles`, `sessions`, `events`, `scores` + RLS (owner-only).
- `client.ts` (browser, `@supabase/ssr`), `server.ts` (server + cookies), `service.ts` (admin, server-only).
- `schema.ts`: tipe TS mengikuti tabel.
- `telemetry/route.ts`: POST batch (upsert sesi + event via service role, kaitkan `profile_id`/`device_key` saat login), GET pull per `sessionId` **dan** `?mine=1` (data milik user yang login via cookie auth).
- `telemetry/tracker.ts`: antrean event di localStorage + flush batch saat ≥5 atau `pagehide`; payload menyertakan `profileId`/`deviceKey`.
- `session.ts` → `recordEvent` memanggil `trackEvent` (fire-and-forget).
- `supabase/sync.ts`: `pullRemoteSession`, `pullMyRemoteData` (tarik data user lintas perangkat + merge ke localStorage), `storeAccount`.

### Auth & Login (2026-08-26)
- `hooks/use-auth.ts`: hook Supabase auth (signIn/signUp/signOut/session).
- `stores/auth-store.ts`: store zustand status auth.
- `/login` page: Masuk/Daftar (email+password) + **Lanjut sebagai Tamu** (alur lama tetap jalan).
- `AppNavbar`: tombol akun Masuk/Keluar.
- Setelah login: simpan `tenun-user-id`, lalu `pullMyRemoteData()` untuk restore lintas perangkat.
- Tanpa env/auth, aplikasi tetap berfungsi sebagai tamu (no-op aman).

### AI & Suara
- NALA (Gemini) untuk refleksi & narasi report.
- TTS: ElevenLabs → fallback Edge TTS → fallback Web Speech.
- **Mute global** (`tenun-mute`) di semua halaman; TTS hormat mute.

### Navbar & Role
- Satu `AppNavbar` lintas halaman; menu mengikuti role (siswa/guru/ortu). Navbar landing hanya di halaman landing (tidak ada navbar ganda).

### Report
- **Gate**: report hanya terbuka setelah 5 pulau selesai; jika belum → layar progres.
- **`/report`** (siswa): radar 8 dimensi, Pesan Hangat NALA, Lencana Permata Nusantara, Bakat Dominanmu, Unduh Laporan (print), Bagikan Hasil (share).
- **`/report/ortu`** (orang tua): panel profil, narasi per pulau, rekomendasi karir (Tren 2030), langkah stimulasi, cetak.

---

## 🔄 In Progress / Belum

### Backend & Auth (Supabase): schema ✅, push-sync ✅, login/pull lintas perangkat ✅ (dasar). Belum: middleware session refresh, binding data tamu→akun otomatis, dashboard konsumsi data.
- Dashboard Guru (radar/heatmap kelas, detail siswa, rekomendasi).
- Audio BGM/SFX + integrasi volume global.
- Deployment ke Vercel.

---

## 📋 Next Steps

1. Lihat `docs/EVALUATION_AND_ROADMAP.md` untuk daftar perbaikan & rencana lengkap pasca-E2E.
2. Sprint 1 lanjutan: **middleware session refresh**, **binding data tamu→akun** saat login (merge data lama), dan pengujian nyata lintas perangkat.
3. Sprint 3: Dashboard Guru (konsumsi data dari tabel `sessions`/`events`/`scores`).
4. Sprint 4: perkaya laporan ortu.
5. Sprint 5: polish, aksesibilitas, performa, deploy.

---

## 🐛 Known Issues
- Push telemetri butuh env Supabase terisi (`.env.local`); tanpa itu no-op aman.
- Model Gemini & `GOOGLE_AI_API_KEY` perlu diverifikasi saat production (fallback kini otomatis).
- TTS ElevenLabs 402 (gratis) → selalu fallback Edge (laten 1–3s).
- Resume hanya di level babak (belum di dalam minigame).
- Dashboard guru & beberapa halaman masih stub.

---

## 📝 Catatan Teknis
- `localStorage`:
  - `tenun-player` = `{ name, characterId, motif, origin }`
  - `tenun-progress` = `{ completedIslands: string[] }`
  - `tenun-session` = `{ id, xp, level, badges, completedIslands, currentIsland, currentAct, ... }`
  - `tenun-events` = `SessionEvent[]` (semua aksi)
  - `tenun-assessment` = `{ islandId, answers }`
  - `tenun-role` = `student | teacher | parent`
  - `tenun-mute` = `"1" | "0"`
- Modul kunci: `src/lib/session/session.ts`, `src/lib/scoring/engine.ts`, `src/lib/ai/report.ts`, `src/lib/sound/sound-store.ts`, `src/components/layout/app-navbar.tsx`.
- API: `/api/ai` (NALA), `/api/tts` (Edge), `/api/reports` (narasi Peta Bakat).
- Tema gelap-navy (`#09242B` → `#060F14`) + aksen emas (`#FFB319`) & teal (`#19D29F`).
