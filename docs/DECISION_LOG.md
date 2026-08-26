# 📝 DECISION LOG - NALA (Tenun Nusantara)

Dokumen ini mencatat semua keputusan arsitektur dan teknis beserta alasannya.

---

## Decision #001: Next.js 14 with App Router

**Date:** 2026-02-21  
**Status:** ✅ Approved

### Context
Kita perlu memilih framework frontend untuk aplikasi web NALA.

### Decision
Menggunakan Next.js 14 dengan App Router (bukan Pages Router).

### Rationale
- **Vercel Native:** Deploy dan optimize otomatis di Vercel
- **App Router:** Lebih modern, better performance, React Server Components
- **TypeScript Support:** Excellent out-of-the-box
- **SEO Friendly:** Server-side rendering built-in
- **API Routes:** Backend logic in same project
- **Community:** Large ecosystem, easy to find solutions

### Alternatives Considered
- **React + Vite:** More manual setup, no SSR
- **Remix:** Steeper learning curve, smaller community
- **Pages Router:** Legacy approach, missing new features

### Consequences
- ✅ Modern architecture
- ✅ Better performance
- ⚠️ Need to learn App Router patterns
- ⚠️ Some libraries may not fully support App Router yet

---

## Decision #002: Supabase for Backend

**Date:** 2026-02-21  
**Status:** ✅ Approved

### Context
Kita perlu backend-as-a-service untuk auth, database, dan storage.

### Decision
Menggunakan Supabase (PostgreSQL + Auth + Storage + Realtime).

### Rationale
- **PostgreSQL:** Powerful relational database
- **Free Tier:** Generous limits for MVP
- **Auth Built-in:** Email, OAuth, magic links
- **Row Level Security:** Fine-grained access control
- **Realtime:** Live updates for dashboards
- **TypeScript:** Auto-generated types from schema
- **Edge Functions:** Serverless functions if needed

### Alternatives Considered
- **Firebase:** NoSQL, less flexible for complex queries
- **Custom Backend:** More work, more maintenance
- **Prisma + PlanetScale:** More setup, no auth built-in

### Consequences
- ✅ Fast development
- ✅ Scalable architecture
- ✅ Good free tier
- ⚠️ Vendor lock-in (but can migrate if needed)
- ⚠️ Need to learn Supabase-specific patterns

---

## Decision #003: Gemini API via Vercel AI SDK

**Date:** 2026-02-21  
**Status:** ✅ Approved

### Context
Kita perlu LLM untuk NALA AI agent (narasi adaptif, refleksi, laporan).

### Decision
Menggunakan Google Gemini API melalui Vercel AI SDK.

### Rationale
- **Free Tier:** Gemini 1.5 Flash has generous free limits
- **Vercel AI SDK:** Unified interface, easy streaming
- **Performance:** Fast response times
- **Multilingual:** Good Indonesian support
- **Fallback:** Can switch to OpenAI if needed

### Alternatives Considered
- **OpenAI GPT-4:** More expensive, but more capable
- **Anthropic Claude:** Good, but less free tier
- **Self-hosted LLM:** Too complex for MVP

### Consequences
- ✅ Cost-effective
- ✅ Easy integration
- ✅ Good performance
- ⚠️ Rate limits on free tier
- ⚠️ Need to monitor usage

---

## Decision #004: Ink.js for Story Engine

**Date:** 2026-02-21  
**Status:** ✅ Approved

### Context
Kita perlu engine untuk cerita interaktif dengan branching narrative.

### Decision
Menggunakan Ink.js (JavaScript port of Ink by Inkle).

### Rationale
- **JSON-based:** Stories as data, not code
- **Branching:** Complex narrative trees
- **Variables:** Track player state
- **Lightweight:** Small bundle size
- **Writer-friendly:** Non-programmers can write stories

### Alternatives Considered
- **Custom engine:** More work, less flexible
- **Twine:** Desktop tool, not web-native
- **ChoiceScript:** Less flexible

### Consequences
- ✅ Separation of content and code
- ✅ Easy to iterate on stories
- ✅ Small footprint
- ⚠️ Need to learn Ink syntax
- ⚠️ Limited to text-based narratives

---

## Decision #005: Zustand for State Management

**Date:** 2026-02-21  
**Status:** ✅ Approved

### Context
Kita perlu state management untuk React app.

### Decision
Menggunakan Zustand (bukan Redux atau Context API).

### Rationale
- **Simple:** Minimal boilerplate
- **Lightweight:** Small bundle size
- **TypeScript:** Excellent type inference
- **No Provider:** Works outside React tree
- **Devtools:** Good debugging support

### Alternatives Considered
- **Redux:** Too much boilerplate for our needs
- **Context API:** Performance issues with frequent updates
- **Jotai:** Similar, but less mature

### Consequences
- ✅ Fast development
- ✅ Easy to understand
- ✅ Good performance
- ⚠️ Smaller community than Redux

---

## Decision #006: TailwindCSS for Styling

**Date:** 2026-02-21  
**Status:** ✅ Approved

### Context
Kita perlu CSS framework untuk styling.

### Decision
Menggunakan TailwindCSS dengan custom design system.

### Rationale
- **Utility-first:** Fast development
- **Customizable:** Easy to implement design system
- **Performance:** Purges unused CSS
- **Consistency:** Enforces design tokens
- **Responsive:** Mobile-first approach

### Alternatives Considered
- **Styled Components:** More runtime overhead
- **CSS Modules:** More files to manage
- **Bootstrap:** Less customizable

### Consequences
- ✅ Fast styling
- ✅ Consistent design
- ✅ Small bundle
- ⚠️ Verbose HTML
- ⚠️ Need to learn utility classes

---

## Decision #007: Web Speech API for Voice Input

**Date:** 2026-02-21  
**Status:** ✅ Approved

### Context
Anak usia 7 tahun mungkin belum lancar membaca, perlu voice input.

### Decision
Menggunakan Web Speech API (browser built-in).

### Rationale
- **No Cost:** Free, built into browsers
- **No Setup:** No API keys needed
- **Privacy:** Processing done by browser
- **Sufficient:** Good enough for MVP

### Alternatives Considered
- **Google Speech-to-Text:** More accurate, but costs money
- **Whisper API:** Very accurate, but expensive
- **Custom STT:** Too complex

### Consequences
- ✅ Zero cost
- ✅ Easy integration
- ✅ Privacy-friendly
- ⚠️ Browser-dependent
- ⚠️ Less accurate than paid services
- ⚠️ Requires HTTPS

---

## Decision #008: Framer Motion for Animations

**Date:** 2026-02-21  
**Status:** ✅ Approved

### Context
Kita perlu library untuk animasi dan transisi.

### Decision
Menggunakan Framer Motion.

### Rationale
- **React-native:** Built for React
- **Declarative:** Easy to use
- **Powerful:** Complex animations possible
- **Performance:** GPU-accelerated
- **Gestures:** Built-in gesture support

### Alternatives Considered
- **React Spring:** Similar, but less features
- **GSAP:** More powerful, but larger bundle
- **CSS Animations:** Limited control

### Consequences
- ✅ Smooth animations
- ✅ Easy to implement
- ✅ Good performance
- ⚠️ Adds to bundle size
- ⚠️ Learning curve for advanced features

---

## Decision #009: Recharts for Data Visualization

**Date:** 2026-02-21  
**Status:** ✅ Approved

### Context
Kita perlu charts untuk dashboard guru dan laporan orang tua.

### Decision
Menggunakan Recharts.

### Rationale
- **React-native:** Built for React
- **D3-based:** Powerful under the hood
- **Simple API:** Easy to use
- **Responsive:** Works on all screen sizes
- **Customizable:** Can match design system

### Alternatives Considered
- **Chart.js:** Good, but less React-native
- **Victory:** Similar, but less popular
- **Custom D3:** Too much work

### Consequences
- ✅ Fast development
- ✅ Good looking charts
- ✅ Responsive
- ⚠️ Bundle size
- ⚠️ Limited customization for very specific needs

---

## Decision #010: MVP Scope - Pulau Candi Only

**Date:** 2026-02-21  
**Status:** ✅ Approved

### Context
Kita perlu menentukan scope untuk MVP.

### Decision
MVP hanya mencakup Pulau Candi (1 pulau, 3 babak).

### Rationale
- **Focus:** Ship faster, learn faster
- **Validation:** Test core concept first
- **Resource:** Limited team, limited time
- **Iteration:** Can add more islands later

### Alternatives Considered
- **All 5 islands:** Too much for MVP
- **2-3 islands:** Still too much
- **Half island:** Not enough to test concept

### Consequences
- ✅ Faster to market
- ✅ Easier to test
- ✅ Can iterate based on feedback
- ⚠️ Limited content for users
- ⚠️ Need to manage expectations

---

## 📊 Decision Summary

| # | Decision | Status | Impact |
|---|----------|--------|--------|
| 001 | Next.js 14 App Router | ✅ | High |
| 002 | Supabase | ✅ | High |
| 003 | Gemini + Vercel AI SDK | ✅ | High |
| 004 | Ink.js | ✅ | Medium |
| 005 | Zustand | ✅ | Medium |
| 006 | TailwindCSS | ✅ | High |
| 007 | Web Speech API | ✅ | Medium |
| 008 | Framer Motion | ✅ | Low |
| 009 | Recharts | ✅ | Medium |
| 010 | MVP = Pulau Candi | ✅ | High |

---

## 🔄 Review Schedule

Decision log akan di-review setiap akhir sprint untuk memastikan keputusan masih relevan.

## Decision #011: Landscape-Only Orientation

**Date:** 2026-02-21  
**Status:** ✅ Approved

### Context
Aplikasi game dirancang untuk orientasi landscape (16:9) karena:
- Mini-games membutuhkan horizontal space luas
- Story scenes dengan 2-column layout
- Dashboard guru & laporan orang tua butuh layar lebar
- Pengalaman immersive seperti game console

### Decision
Enforce landscape-only dengan orientation guard yang menampilkan pesan ramah jika user menggunakan portrait mode atau layar terlalu kecil.

### Rules
- Minimum width: 1024px
- Minimum aspect ratio: 1.5 (mendekati 16:9)
- Portrait mode: tampilkan pesan "Putar perangkat Anda"
- Landscape kecil: tampilkan pesan "Gunakan perangkat lebih besar"

### Implementation
- Hook: `useOrientation`
- Component: `OrientationGuard` (wrap di root layout)
- Config: `src/config/orientation.ts`

### Consequences
- ✅ Pengalaman game optimal
- ✅ Layout konsisten
- ⚠️ User mobile portrait tidak bisa akses
- ⚠️ Perlu pesan yang informatif & ramah

---

## Decision #012: Project Naming

**Date:** 2026-02-21  
**Status:** ✅ Approved

### Context
Perlu nama project yang jelas dan mencerminkan MVP scope.

### Decision
Rename dari `nala-tenun-nusantara` → `tenun-nusantara-mvp`

### Rationale
- "Tenun Nusantara" adalah nama brand utama
- "-mvp" menandakan ini adalah versi minimum viable product
- NALA adalah nama AI agent, bukan nama project
- Lebih jelas untuk deployment & repository

### Consequences
- ✅ Nama lebih representatif
- ✅ Mudah dikenali sebagai MVP
- ⚠️ Perlu update semua referensi

---

## Decision #013: Dark Navy Design Theme

**Date:** 2026-08-21  
**Status:** ✅ Approved

### Context
Mockup HTML yang disediakan menggunakan tema gelap-navy, bukan tema terang (warm-cream) sebelumnya.

### Decision
Mengadopsi tema gelap-navy sebagai identitas visual utama:
- Background gradient `#09242B → #060F14`
- Aksen emas `#FFB319`, teal `#19D29F`
- Diterapkan global di `globals.css` (html + body) dan komponen

### Consequences
- ✅ Konsisten dengan mockup & branding
- ✅ Semua halaman ikut tema gelap
- ⚠️ Perlu menyesuaikan placeholder lama yang masih memakai `text-deep-indigo` (kontras rendah di latar gelap)

---

## Decision #014: Fonts Outfit & Manrope

**Date:** 2026-08-21  
**Status:** ✅ Approved

### Context
Mockup memakai Google Fonts Outfit (judul) & Manrope (body), berbeda dari font awal (Fredoka/Nunito/Caveat).

### Decision
Menambahkan font **Outfit** & **Manrope** via `next/font` dengan CSS variable, dan utility `font-outfit` / `font-manrope` di Tailwind. Font lama tetap dipertahankan.

### Consequences
- ✅ Sesuai mockup
- ✅ Self-hosted (performance, no layout shift)

---

## Decision #015: NavBar Global di Root Layout

**Date:** 2026-08-21  
**Status:** ✅ Approved

### Context
Perlu navbar konsisten di semua halaman.

### Decision
Menempatkan `<NavBar />` di **root layout** sehingga muncul di semua halaman. Halaman yang punya top bar sendiri (mis. map) menyesuaikan.

### Consequences
- ✅ Satu sumber navbar, mudah dirawat
- ✅ Konsisten lintas halaman

---

## Decision #016: Player Data & Progress via localStorage

**Date:** 2026-08-21  
**Status:** ✅ Approved

### Context
Belum ada backend; butuh cara sederhana menyimpan pilihan pemain (char-select) dan progress pulau untuk MVP.

### Decision
Menyimpan data sementara di browser `localStorage`:
- `tenun-player` = `{ name, characterId, motif, origin }`
- `tenun-progress` = `{ completedIslands: string[] }`

Level & Lencana Bakat di map dihitung dinamis dari `completedIslands`.

### Consequences
- ✅ Cepat, tanpa setup backend
- ✅ Level & lencana otomatis ter-update
- ⚠️ Sementara (per device), nanti diganti Supabase saat Sprint 1

---

## Decision #017: Fullscreen untuk Mode Game

**Date:** 2026-08-21  
**Status:** ✅ Approved

### Context
Halaman map (mode game) perlu pengalaman immersive fullscreen.

### Decision
Menyediakan tombol "Layar Penuh" (dan toggle di tombol pengaturan) memakai Fullscreen API. Fullscreen otomatis diblokir browser tanpa user gesture, jadi disediakan prompt tombol.

### Consequences
- ✅ Pengalaman immersive
- ⚠️ Perlu user gesture (klik) untuk masuk fullscreen

---

## Decision #018: MVP Scope diperluas → 5 Pulau

**Date:** 2026-08-26  
**Status:** ✅ Approved (revisi Decision #010)

### Context
Framework permainan + data sudah solid, tim ingin menghadirkan seluruh pengalaman, bukan hanya Pulau Candi.

### Decision
Membangun **kelima pulau** dengan aset asli (Candi, Harmoni, Terapung, Aksara, Rimba), masing-masing 3 babak + refleksi. Framework minigame dibuat generik agar mudah menambah pulau baru.

### Consequences
- ✅ Pengalaman lengkap & bernilai (E2E lulus)
- ✅ Gate report (butuh 5 pulau) memberi tujuan bermain
- ⚠️ Scope lebih besar dari rencana awal MVP

---

## Decision #019: Lapisan Sesi & Data (event, resume, XP, level)

**Date:** 2026-08-26  
**Status:** ✅ Approved

### Context
Dibutuhkan pencatatan perilaku anak yang kaya (untuk Peta Bakat & rekomendasi), bukan sekadar "pulau selesai".

### Decision
Membuat `src/lib/session/session.ts`:
- `sessionId` unik per permainan; semua aksi dicatat sebagai **event** (`tenun-events`) ber-timestamp (`session_start`, `island_start`, `act_start`, `assessment_answer`, `act_complete`, `island_complete`, `minigame_wrong`, `hint_opened`, `timeout_continue`, `level_up`, `badge_earned`, ...).
- Resume posisi pulau + babak (`tenun-session`).
- XP & leveling (1–6), lencana level & pulau.

### Consequences
- ✅ Data kaya untuk profil bakat & narasi laporan
- ✅ Progres tersimpan saat terputus
- ⚠️ Tetap di localStorage (batas ~5MB) — rencana migrasi ke Supabase

---

## Decision #020: Pencatatan Salah Klik (onWrong)

**Date:** 2026-08-26  
**Status:** ✅ Approved

### Context
Kesalahan anak adalah sinyal pedagogis penting (area yang perlu latihan).

### Decision
Semua komponen minigame menerima prop `onWrong?` dan memanggilnya saat jawaban salah → direkam sebagai event `minigame_wrong` (dengan detail opsi).

### Consequences
- ✅ Profil bakat lebih akurat (tidak hanya jawaban benar)
- ✅ Dashboard/report bisa menunjukkan area lemah

---

## Decision #021: Mute Global

**Date:** 2026-08-26  
**Status:** ✅ Approved

### Context
Butuh kontrol suara menyeluruh (terutama di ruang kelas) di semua halaman.

### Decision
`src/lib/sound/sound-store.ts` (key `tenun-mute`) + hook `useSound`; tombol mute di navbar. `useTTS.speak` menjadi no-op saat mute dan menghentikan audio yang sedang berjalan.

### Consequences
- ✅ Konsisten lintas halaman
- ✅ TTS hormat mute
- ⚠️ Belum mencakup BGM/SFX (folder audio masih kosong)

---

## Decision #022: Navbar Role-Based (satu navbar, tanpa dobel)

**Date:** 2026-08-26  
**Status:** ✅ Approved (revisi Decision #015)

### Context
Muncul navbar ganda (navbar landing + navbar halaman) dan menu harus menyesuaikan role (siswa/guru/ortu).

### Decision
- Navbar landing (`nav-bar.tsx`) memakai `HIDDEN_PATHS` sehingga hanya tampil di halaman landing.
- `AppNavbar` dipakai di halaman utama; menu mengikuti `tenun-role`: siswa → (Peta Bakat, Peta), guru → (Dashboard Guru, Peta), ortu → (Laporan Orang Tua, Peta).

### Consequences
- ✅ Satu header, tidak dobel
- ✅ Menu relevan per role
- ⚠️ Link navbar disembunyikan di mobile (`hidden md:flex`) — perlu menu mobile (roadmap)

---

## Decision #023: Report Siswa — Gate 5 Pulau + Bagian Lengkap

**Date:** 2026-08-26  
**Status:** ✅ Approved

### Context
Laporan Peta Bakat harus kaya & akurat; hanya masuk akal setelah seluruh pulau dijelajahi.

### Decision
`/report` (siswa) hanya terbuka setelah **5 pulau selesai** (jika belum → layar progres X/5). Isi: radar 8 dimensi bakat, Pesan Hangat NALA (Gemini), Lencana Permata Nusantara, Bakat Dominanmu (top 3), Unduh Laporan (print), Bagikan Hasil (share). Profil dihitung dari event via `src/lib/scoring/engine.ts`.

### Consequences
- ✅ Laporan lengkap & personal
- ✅ Gate memberi insentif menyelesaikan semua pulau
- ⚠️ Narasi Gemini kadang 500 tanpa key/model valid → perlu fallback/cache (roadmap)

---

## Decision #024: Report Orang Tua (/report/ortu)

**Date:** 2026-08-26  
**Status:** ✅ Approved

### Context
Orang tua butuh laporan yang bisa dibaca & rekomendasi untuk anak.

### Decision
`/report/ortu`: panel profil, "Bagaimana {nama} menyelesaikan tantangan?", narasi per pulau, rekomendasi karir masa depan (Tren 2030), langkah stimulasi, tombol cetak laporan.

### Consequences
- ✅ Menjawab kebutuhan orang tua
- ✅ Data dari sesi/asesmen nyata

---

## Decision #025: Ringkasan UI/UX baru

**Date:** 2026-08-26  
**Status:** ✅ Approved

- Radar chart dipakai untuk Peta Bakat (8 dimensi) — menggantikan kebutuhan Recharts di halaman ini (SVG ringan).
- Level dihitung dari XP (bukan hanya jumlah pulau) via `levelFromXp`.
- Timer babak (3 mnt) → modal "Lanjutkan"/"Kembali ke Peta".

### Consequences
- ✅ Tampilan konsisten dengan tema
- ✅ Gamification lebih dalam (XP/level/lencana)

---

## Decision #026: Stabilisasi Gemini (fallback model + timeout)

**Date:** 2026-08-26  
**Status:** ✅ Approved

### Context
Nama model default `gemini-3.6-flash` tidak valid → narasi/refleksi kadang gagal; tanpa timeout bisa menggantung.

### Decision
- `gemini.ts`: daftar model fallback `["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"]` (`GEMINI_MODEL` bila di-set diutamakan).
- `generate.ts`: `generateWithFallback` mencoba tiap model berurutan + `AbortController` timeout 20s → `null` bila semua gagal.
- `report.ts` & `nala-agent.ts` memakai helper tsb; bila `null` → narasi statis.

### Consequences
- ✅ Tidak menggantung / tidak langsung gagal
- ✅ Narasi tetap muncul walau satu model error
- ⚠️ Perlu `GOOGLE_AI_API_KEY` valid di production

---

## Decision #027: Resume di dalam minigame + timer jeda

**Date:** 2026-08-26  
**Status:** ✅ Approved

### Context
Resume hanya di level babak; refresh di tengah puzzle me-restart. Timer juga terus berjalan saat modal asesmen terbuka.

### Decision
- `hooks/use-resume.ts` (context `resumeKey`) + `hooks/use-persistent-state.ts` (`usePersistentState` → localStorage `tenun-minigame-state`, namespace `{resumeKey}:{componentKey}`).
- `Minigame` membungkus konten dalam `ResumeKeyProvider`; `IslandGame` mengirim `resumeKey={island.id}-{actIndex}` dan memanggil `clearPersistentState` saat babak selesai.
- Contoh diadopsi: `puzzle16` (placed) & `pipe` (placed). Minigame lain bisa mengikuti pola yang sama.
- Timer di `IslandGame` berhenti saat `interruptOpen || actComplete`.

### Consequences
- ✅ Refresh di tengah puzzle tidak kehilangan progres (untuk minigame yang mengadopsi)
- ✅ Waktu tidak "mencuri" saat asesmen/overlay
- ⚠️ Adopsi bertahap ke minigame lain

---

## Decision #028: Backend Supabase (schema + push telemetri)

**Date:** 2026-08-26  
**Status:** 🟡 Parsial

### Context
Data hanya di localStorage (single-device). Ingin fondasi backend untuk dashboard guru, laporan ortu lintas perangkat, dan keamanan data.

### Decision
- `supabase/migrations/0001_init.sql`: tabel `profiles`, `sessions`, `events`, `scores` + RLS owner-only.
- `lib/supabase/client.ts` (browser, `@supabase/ssr`), `server.ts` (server + cookies), `service.ts` (admin, server-only), `schema.ts` (tipe).
- `api/telemetry/route.ts`: POST batch (upsert sesi + event via service role), GET pull per `sessionId`.
- `telemetry/tracker.ts`: antrean event di localStorage + flush saat ≥5 / `pagehide`; `session.recordEvent` memanggil `trackEvent` (fire-and-forget).
- Tanpa env Supabase, semua no-op aman.

### Consequences
- ✅ Data kini bisa di-push ke backend bila env diisi
- ✅ Fondasi untuk dashboard & auth
- ✅ **Auth & pull lintas perangkat** kini ada (lihat #029)
- ⚠️ Service role di route handler aman (server-only); autentikasi user ditangani #029

---

## Decision #029: Auth + Login + Pull Lintas Perangkat

**Date:** 2026-08-26  
**Status:** ✅ Approved (dasar)

### Context
Data baru bisa di-push ke Supabase; pengguna ingin data tersambung ke akun agar bisa dilanjutkan dari perangkat lain.

### Decision
- `hooks/use-auth.ts`: hook Supabase auth (signIn/signUp/signOut/session) via browser client.
- `stores/auth-store.ts`: store zustand status auth.
- `/login` page: **Masuk/Daftar** (email+password) + **Lanjut sebagai Tamu** (alur tanpa akun tetap berfungsi).
- `AppNavbar`: tombol akun Masuk/Keluar.
- Setelah login: simpan `tenun-user-id`, `pullMyRemoteData()` → `/api/telemetry?mine=1` (server membaca user dari cookie auth) → merge ke localStorage.
- Push telemetri kini menyertakan `profile_id` & `device_key` bila login.

### Consequences
- ✅ Akun & sinkronisasi lintas perangkat (dasar)
- ✅ Mode tamu tetap jalan bila tanpa login/env
- ⚠️ Belum ada middleware session refresh
- ⚠️ Binding data **tamu → akun** (menggabungkan progres lama ke akun) belum otomatis — perlu tindak lanjut
- ⚠️ Email signup perlu konfirmasi email tergantung konfigurasi Supabase