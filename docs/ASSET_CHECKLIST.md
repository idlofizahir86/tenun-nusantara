# 🖼️ ASSET CHECKLIST - Tenun Nusantara MVP

**Last Updated:** 2026-08-26

Daftar aset yang tersedia di `public/assets/`. ✅ = sudah ada & dipakai, ⬜ = belum tersedia.
Referensi path aset per pulau: `src/config/asset-paths.ts` (helper `getIslandAsset`, `getActBackground`, `getReflectionBackground`).

---

## 🎨 Images (`public/assets/images/`)

### Logo (`images/logo/`)
- ✅ `nala-logo.svg`
- ✅ `tenun-nusantara-logo.png`
- ✅ `tenun-nusantara-logo.svg`

### Landing (`images/landing/`)
- ✅ `hero-artwork-frame.png` (kapal pinisi — dipakai di Hero)
- ✅ `hero-bg.jpg`
- ✅ `island-preview-candi.jpg`
- ✅ `island-preview-harmoni.jpg`
- ✅ `island-preview-pasar.jpg`
- ✅ `island-preview-rimba.jpg`
- ✅ `island-preview-aksara.jpg`

### Map (`images/map/`)
- ✅ `map-indonesia.png` (latar peta — dipakai di Map)
- ✅ `island_candi.png`
- ✅ `island_harmoni.png`
- ✅ `island_rimba.png`
- ✅ `island_aksara.png`
- ✅ `island_terapung.png`

### Karakter (`images/characters/npcs/`)
- ✅ `char_bayu.png` (Sumatera)
- ✅ `char_siti.png` (Jawa)
- ✅ `char_nyoman.png` (Bali)
- ✅ `char_ulan.png` (Papua)
- ⬜ `images/characters/nala/` — avatar NALA (fallback ke komponen NalaAvatar/emoji)

### Pulau detail (`images/islands/`) — ✅ SEMUA DI-WIRE
Masing-masing pulau punya `background`, `fallbackBackground`, dan `backgrounds` per babak (act1..3 + refleksi).

- `candi/` — ✅ latar candi, relief, pipa air (observe/puzzle16/pipe)
- `harmoni/` — ✅ latar gamelan & motif tenun (observe/tune/weave)
- `terapung/` — ✅ latar pasar terapung, barang dagangan (observe/barter/mediate)
- `aksara/` — ✅ latar naskah & wayang (observe/verse/stage)
- `rimba/` — ✅ latar hutan, flora & satwa (observe/match/filter)

> Nama file aktual dikelola di `src/config/asset-paths.ts`. Jika file hilang, `GameAsset` otomatis fallback ke emoji (tidak crash).

### Lainnya
- `images/motifs/` — motif tenun/batik
- `images/ui/` — ikon & pattern UI

---

## 🔤 Fonts (`public/assets/fonts/`)
- ✅ `Caveat/`
- ✅ `Fredoka/`
- ✅ `Nunito/`
- ✅ Outfit & Manrope via `next/font` (Google Fonts) — dipakai utama

---

## 🔊 Audio (`public/assets/audio/`)
- Folder: `bgm/`, `sfx/`, `voice/`
- ⬜ Semua masih kosong — **roadmap**: tambah BGM & SFX, integrasi volume global (mute)
- Suara NALA saat ini via **TTS** (Edge/Web Speech), bukan file audio

---

## 📝 Catatan
- Path dipakai dengan prefix `/assets/...` (root `public/`).
- Aset minigame dirender via `GameAsset` (gambar → fallback emoji bila gagal).
- Saat menambah aset baru, daftarkan di `src/config/asset-paths.ts` agar konsisten.
