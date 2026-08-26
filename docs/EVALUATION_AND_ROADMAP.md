# 🧭 EVALUASI & ROADMAP — Tenun Nusantara MVP

**Dibuat:** 2026-08-26 (setelah tes E2E menyeluruh)
**Status:** Dokumentasi hasil evaluasi pasca-E2E + rencana ke depan

Dokumen ini mencatat **hasil tes E2E**, **temuan yang bisa dievaluasi/diperbaiki**, dan **rencana pengembangan ke depan**.

---

## ✅ Hasil Tes E2E (menyeluruh)

Diuji langsung di browser (viewport 1366×768, mode hening/landscape):

| Item | Status | Catatan |
|------|--------|---------|
| Alur dari start (role → char-select → map → pulau → refleksi → report) | ✅ | Berjalan penuh |
| Semua 5 pulau selesai (Harmoni, Rimba, Candi, Terapung, Aksara) | ✅ | observe/tune/weave, match/filter, puzzle16/pipe, barter/mediate, verse/stage |
| Gate report (harus semua pulau selesai) | ✅ | Gated di 1/5, terbuka di 5/5 |
| Pencatatan data (event, salah klik, asesmen, babak, pulau) | ✅ | 19+ event, `minigame_wrong` tercatat |
| XP/Level/Lencana | ✅ | Level 6 (maks), XP 1310, badge level-2..6 + island-* (5) |
| Sesi ber-ID & resume | ✅ | sessionId sama lintas pulau; resume babak |
| Narasi report dari Gemini | ✅ | Personal ("kecerdasan Visual-Ruang...") |
| Unduh Laporan (print) | ✅ | `window.print()` terpanggil |
| Bagikan Hasil (share) | ✅ | `navigator.share` dgn data benar |
| Mute global (berlaku semua halaman) | ✅ | `tenun-mute`, tombol di navbar, TTS hormat |
| Navbar tunggal + menu berbasis role | ✅ | 1 `<header>`; siswa/guru/ortu beda menu |

---

## 🔍 Temuan yang Bisa Dievaluasi / Diperbaiki

### Teknis
- ✅ **Gemini (FIXED 2026-08-26)**: model lama `gemini-3.6-flash` (tidak valid) diganti daftar fallback `gemini-2.5-flash → 1.5-flash → 2.0-flash` + `generateWithFallback` (timeout 20s → narasi statis bila semua gagal). Pastikan `GOOGLE_AI_API_KEY` terisi saat production.
- ✅ **Timer (FIXED 2026-08-26)**: timer kini **berhenti** saat modal asesmen/overlay terbuka (tidak "mencuri" waktu).
- ✅ **Resume di dalam babak (FIXED 2026-08-26)**: `usePersistentState` menyimpan state minigame (contoh puzzle16 & pipe) → refresh tidak me-restart. Babak lain bisa mengadopsi pola yang sama.
- 🟡 **Persistence**: push-sync ke Supabase sudah ada (`/api/telemetry` + antrean klien); masih butuh **auth & pull lintas perangkat** agar benar multi-device.
- **TTS**: ElevenLabs selalu 402 (gratis dilarang library voices) → Edge TTS sebagai fallback (laten 1–3s). Bisa cache audio atau tambah tombol "stop".
- **puzzle16 (drag-drop)**: memakai HTML5 DnD; `playwright.dragTo` tidak memicu handler React → otomasi butuh dispatch `DragEvent` + `DataTransfer`. Untuk pengalaman tablet, tambahkan dukungan sentuh/pointer.
- **Reflection submit**: pernah ada isu saat mengirim jawaban; perlu dipastikan stabil (Gemini + fallback).

### UI/UX & Aksesibilitas
- **Radar chart** (SVG) belum punya `aria-label`/teks alternatif untuk screen reader.
- Beberapa label memakai emoji saja; tambahkan `title`/`aria-label` bila perlu.
- Kontras warna & ukuran font perlu audit untuk anak/aksesibilitas.
- Halaman guru (`/dashboard`) & ortu (`/report/ortu`) masih ringkas (stub); perlu diperkaya (Sprint 3 & 4).
- Belum ada audio BGM/SFX (folder `public/assets/audio/` kosong) — mute saat ini hanya untuk TTS suara NALA.

### Produk
- ✅ Auth/login kini ada (email+password + mode tamu). Satu pemain tetap di `localStorage` untuk tamu; akun terhubung ke Supabase bila login.
- Belum ada variasi konten antar sesi (naskah/posisi selalu sama).
- Belum ada leaderboard/achievement tambahan, progres per-akt yang bisa dilanjutkan penuh.

---

## 🚀 Rencana Ke Depan (Roadmap)

### Jangka Pendek (stabilisasi) — ✅ sebagian besar selesai (2026-08-26)
1. ✅ Gemini: fallback model + timeout.
2. ⏳ Optimasi TTS (cache audio, tombol "stop", fallback stabil).
3. ✅ Resume di dalam babak (pola `usePersistentState`; perlu diadopsi ke lebih banyak minigame).
4. ✅ Timer berhenti saat modal asesmen/refleksi.
5. ⏳ Integrasi mute ke BGM/SFX (bila audio ditambahkan) + NALA companion hormat mute.

### Jangka Menengah (produk lengkap)
6. 🟡 **Backend & Auth (Sprint 1)**: schema + client/server/service + push-sync ✅; **auth/login + pull lintas perangkat ✅ (dasar)** — tersisa: middleware session refresh & binding data tamu→akun.
7. **Dashboard Guru (Sprint 3)**: radar/heatmap kelas, detail siswa, rekomendasi pembelajaran, ekspor PDF — konsumsi tabel `sessions/events/scores`.
8. **Laporan Orang Tua (Sprint 4)**: perbaiki/isi data nyata, "Surat dari NALA", Jembatan 2030, rekomendasi aktivitas, bagikan ke guru.
9. **Audio**: tambahkan BGM & SFX, master volume + mute global mencakup semua audio.

### Jangka Panjang
10. Konten lebih kaya: variasi naskah/minigame, lebih banyak pulau, tingkat kesulitan adaptif.
11. Aksesibilitas & responsif penuh (mobile/tablet portrait alternatif, ARIA, kontras).
12. Achievement, leaderboard, progres lintas sesi, laporan periodik (mingguan/bulanan).
13. Optimasi performa (image, code-splitting, lazy) + audit lintas browser.
14. **Deploy ke Vercel** + domain + monitoring (error tracking, analytics).
15. Evaluasi dampak pedagogis: korelasi asesmen → peta bakat → rekomendasi (validasi dengan data nyata).

---

## 📌 Prinsip yang Dipegang
- **Data-first**: semua aksi user tercatat sebagai event (termasuk salah klik, waktu, pilihan) → menjadi dasar profil & rekomendasi.
- **Satu navbar utama** lintas halaman, menu mengikuti peran (siswa/guru/ortu).
- **Report = reward lengkap**: baru terbuka setelah seluruh pulau dijelajahi, agar data kaya & narasi akurat.
- **Offline-first sementara** (localStorage) dengan jalur migrasi ke Supabase.
