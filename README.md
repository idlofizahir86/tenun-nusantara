# 🧵 Tenun Nusantara

**AI Agent Pemetaan Minat & Bakat** — sebuah game petualangan naratif berbasis budaya Nusantara yang memetakan minat dan bakat pemain melalui *stealth assessment* (penilaian tersembunyi lewat gameplay).

Pemain berlayar menjelajahi lima pulau ajaib, menyelesaikan tantangan dan mini-game, lalu ditemani oleh **NALA** — pemandu AI — untuk mengumpulkan 5 Benang Pelangi. Di akhir petualangan, pemain menerima laporan personal berupa "Gulungan Tenun" yang memetakan bakat dominannya.

---

## ✨ Fitur Utama

- **Satu file, tanpa build** — seluruh game berada dalam `index.html` (HTML + CSS + JavaScript), tanpa dependency eksternal.
- **Stealth assessment** — bakat pemain dinilai diam-diam dari pilihan dan cara bermain, bukan lewat kuesioner.
- **6 dimensi bakat** — Logika-Matematika, Sosial-Interpersonal, Seni-Kreatif, Linguistik-Bahasa, Naturalis-Alam, dan Intrapersonal-Reflektif.
- **10 jenis mini-game** — drag & drop, tap, meracik, ritme, memori, menelusuri garis, timbangan, dan lainnya (2 per pulau, dipilih acak).
- **Sistem adaptif** — tingkat keyakinan (*confidence*) dihitung dari triangulasi sinyal lintas pulau; bonus waktu diberikan sesuai performa.
- **Laporan personal** — radar chart, narasi bakat, Profil Pelajar Pancasila (P3), dan rekomendasi jalur karier menuju 2030.
- **Input suara** — refleksi bisa diketik atau diucapkan (Web Speech API).
- **Efek suara** — dibangkitkan real-time via Web Audio API (tanpa file audio).
- **Slot LLM** — fungsi `nalaNarrate()` siap dihubungkan ke Gemini/OpenAI untuk narasi dinamis, dengan *fallback* lokal bila offline.
- **Ekspor PDF** — laporan dapat disimpan/dicetak lewat fungsi print browser.

---

## 🚀 Cara Menjalankan

Karena aplikasi ini adalah file HTML statis tanpa build, cukup:

1. Buka `index.html` langsung di browser modern (Chrome, Edge, Firefox, Safari), **atau**
2. Jalankan lewat server statis lokal agar semua aset termuat dengan benar:

```bash
# Python 3
python -m http.server 8000

# atau Node.js
npx serve
```

Lalu buka `http://localhost:8000` di browser.

> 💡 Disarankan memakai server lokal agar aset gambar dan fitur browser (suara, dsb.) berjalan optimal.

---

## 🎮 Alur Permainan

1. **Layar Awal** — logo aplikasi & tombol mulai petualangan.
2. **Pilih Karakter** — pilih avatar (cowok/cewek) dan tulis nama.
3. **Perkenalan NALA** — pemandu AI menyapa dan menjelaskan misi.
4. **Lima Pulau** — tiap pulau punya 3 babak: pilihan naratif → 2 mini-game → dilema moral → refleksi di api unggun.
5. **Finale** — krisis besar di Puncak Tenun yang menguji gaya kepemimpinan.
6. **Gulungan Tenun** — laporan akhir berisi peta bakat, P3, dan rekomendasi karier.

---

## 📁 Struktur Proyek

```
tenun-nusantara-nala/
├── index.html          # Seluruh game (HTML, CSS, JS)
├── README.md
└── assets/             # Gambar latar, karakter, & aset UI
    ├── logo_app.png            # Logo aplikasi (favicon & layar awal)
    ├── nala-default.png        # Avatar NALA (default/happy/thinking)
    ├── char_boy.png            # Avatar karakter
    ├── char_girl.png
    ├── indonesia-village.png   # Latar pulau & scene
    ├── floating-market.png
    ├── tropical-rainforest.png
    ├── library-magical.png
    ├── nusantara-peak-mountain.png
    ├── 5-magical-tenun.png     # Hero image
    ├── ancient-parchment-scroll.png  # Latar laporan
    ├── frame-box-dialog-no_bg.png
    └── wooder-boat.png         # Animasi perahu
```

---

## 🧠 Cara Kerja Penilaian (Stealth Assessment)

Setiap pilihan dan aksi pemain merekam **sinyal** ke salah satu dari 6 dimensi bakat melalui fungsi `recordSignal()`. Tingkat keyakinan tiap dimensi dihitung dari:

- **Total bobot sinyal** yang terkumpul.
- **Triangulasi** — jumlah pulau berbeda yang menghasilkan sinyal dimensi tersebut (semakin tersebar, semakin dipercaya).

Gaya bermain (cepat/hati-hati, kolaboratif, presisi) juga dianalisis lewat `playStyle()` untuk memperkaya narasi laporan.

---

## 🔌 Mengaktifkan Narasi AI (LLM)

Narasi NALA secara default memakai *fallback* lokal. Untuk narasi dinamis, isi fungsi `nalaNarrate()` di `index.html` dengan panggilan ke API LLM (contoh Gemini tersedia sebagai komentar di dalam kode). Bila gagal/offline, game otomatis kembali ke narasi lokal agar tetap berjalan.

---

## 🛠️ Teknologi

- **HTML5 / CSS3 / Vanilla JavaScript** — tanpa framework atau build tool.
- **Web Audio API** — efek suara real-time.
- **Web Speech API** — input suara untuk refleksi.
- **Canvas API** — radar chart & mini-game menelusuri garis.

---

## 📄 Lisensi

Proyek edukatif. Sesuaikan lisensi sesuai kebutuhan Anda.
