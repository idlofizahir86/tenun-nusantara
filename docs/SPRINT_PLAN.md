# 📅 SPRINT PLAN - NALA (Tenun Nusantara)

**Total Duration:** 10 working days  
**MVP Target:** Pulau Candi complete + basic dashboards

---

## 📌 STATUS AKTUAL (2026-08-26)

Rencana sprint asli di bawah bersifat **guideline**. Implementasi nyata telah melampaui target MVP dengan pendekatan yang disesuaikan (semua 5 pulau langsung dibangun, bukan hanya Pulau Candi; persistence memakai `localStorage` dulu, backend ditunda).

| Sprint | Rencana | Status Nyata |
|--------|---------|--------------|
| 0 Foundation + UI Mockup | ✅ | ✅ 100% |
| 1 Core Infra (Supabase, AI, Ink, telemetry) | — | 🟡 Sebagian: AI Gemini ✅, telemetry/sesi ✅ (localStorage), Supabase & Ink **belum** |
| 2 Student Flow (Pulau Candi) | — | ✅ **Semua 5 pulau** dibangun + refleksi + reward |
| 3 Teacher Dashboard | — | 🟡 Stub (`/dashboard`) |
| 4 Parent Report | — | ✅ `/report/ortu` + Peta Bakat siswa ✅ |
| 5 Polish & Deployment | — | 🟡 Aksesibilitas/performa/deploy belum |

> ✅ DONE tambahan di luar rencana: **lapisan sesi/data** (event, resume, XP, level, lencana), **mute global**, **navbar role-based**, **gate report**, **Peta Bakat + laporan ortu**, **tes E2E menyeluruh**.
>
> 📋 Detail lengkap evaluasi & roadmap: `docs/EVALUATION_AND_ROADMAP.md`.

---

## Sprint 0: Foundation (Hari 1) ✅ DONE

### Goals
- Setup project infrastructure
- Configure all development tools
- Establish design system
- Create living documentation

### Tasks
- [x] Create package.json with all dependencies
- [x] Configure TypeScript (strict mode)
- [x] Configure TailwindCSS with Nusantara palette
- [x] Setup ESLint + Prettier
- [x] Setup Husky + lint-staged
- [x] Create project folder structure
- [x] Create PROJECT_STATE.md
- [x] Create SPRINT_PLAN.md
- [x] Create DECISION_LOG.md
- [x] Define base types (User, Story, Telemetry)
- [x] Setup Next.js App Router structure
- [x] Configure environment variables template
- [x] Install dependencies
- [x] Build passes (`npm run build`)

### Deliverables
- ✅ Fully configured Next.js project
- ✅ All dependencies installed
- ✅ Design system tokens defined
- ✅ Living documentation in place

### ⭐ Bonus (UI Mockup, awal Sprint 2)
- [x] Tema global gelap-navy + font Outfit & Manrope
- [x] Landing page persis mockup (NavBar + Hero + Features)
- [x] NavBar global di root layout
- [x] Role selection page
- [x] Character select page (Siapa Penjelajahmu?)
- [x] World map page (kapal animasi, CTA Berlayar, fullscreen, level & lencana dinamis)

---

## Sprint 1: Core Infrastructure (Hari 1-2)

### Goals
- Setup Supabase (auth, database, storage)
- Integrate Gemini AI via Vercel AI SDK
- Setup Ink.js story engine
- Implement telemetry tracking system

### Tasks
- [ ] Create Supabase project
- [ ] Design database schema (users, events, scores, trends)
- [ ] Implement Row Level Security (RLS) policies
- [ ] Setup Supabase client (browser + server)
- [ ] Configure Gemini API integration
- [ ] Create NALA AI agent system prompt
- [ ] Setup Ink.js story engine
- [ ] Create first story file (Pulau Candi - Babak 1)
- [ ] Implement telemetry tracking hook
- [ ] Create event logging system
- [ ] Setup basic authentication flow

### Deliverables
- ✅ Supabase fully configured
- ✅ AI agent ready for integration
- ✅ Story engine working
- ✅ Telemetry system capturing events
- ✅ Auth flow functional

---

## Sprint 2: Student Flow - Pulau Candi (Hari 3-5)

### Goals
- Build complete student experience for Pulau Candi
- Implement all 3 acts + reflection
- Create reward system

### Tasks
- [ ] Create role selection page
- [ ] Create student login page (simple, no email)
- [ ] Build Peta Nusantara (main menu)
- [ ] Create island briefing component
- [ ] Implement Babak 1: Observasi Lapangan
  - [ ] Narrative choice system
  - [ ] Telemetry tracking
- [ ] Implement Babak 2: Puzzle Pola Relief
  - [ ] Drag & drop puzzle
  - [ ] Pattern matching logic
  - [ ] Hint system
- [ ] Implement Babak 3: Rekayasa Aliran Air
  - [ ] Pipe connection puzzle
  - [ ] Water flow animation
  - [ ] Decision narrative
- [ ] Create Api Unggun reflection
  - [ ] Voice input (Web Speech API)
  - [ ] Text input alternative
  - [ ] NALA response generation
- [ ] Build reward screen
- [ ] Create student profile (Koleksi Tenun)
- [ ] Test complete flow end-to-end

### Deliverables
- ✅ Complete Pulau Candi experience
- ✅ All telemetry captured
- ✅ Reflection working (voice + text)
- ✅ Rewards unlocked
- ✅ Profile updated

---

## Sprint 3: Teacher Dashboard (Hari 6-7)

### Goals
- Build teacher dashboard with class insights
- Implement radar chart & heatmap
- Create student detail view

### Tasks
- [ ] Create teacher login page
- [ ] Build dashboard overview
- [ ] Implement radar chart (Profil Pelajar Pancasila)
- [ ] Create heatmap visualization
- [ ] Build student list view
- [ ] Create student detail page
  - [ ] Narrative insights
  - [ ] Journey map
  - [ ] Reflection transcript
- [ ] Implement differentiated learning recommendations
- [ ] Add export to PDF functionality
- [ ] Test with sample data

### Deliverables
- ✅ Teacher dashboard functional
- ✅ Class insights visible
- ✅ Student details accessible
- ✅ Recommendations generated
- ✅ PDF export working

---

## Sprint 4: Parent Report (Hari 8-9)

### Goals
- Build parent-facing report
- Implement "Surat dari NALA" narrative
- Create Jembatan 2030 recommendations

### Tasks
- [ ] Create parent login page
- [ ] Build parent home page
- [ ] Implement "Baca Surat dari NALA" flow
- [ ] Create narrative report generation
- [ ] Build radar chart (individual child)
- [ ] Implement Jembatan 2030 section
- [ ] Create activity recommendations
- [ ] Add PDF download
- [ ] Add share to teacher functionality
- [ ] Test report generation

### Deliverables
- ✅ Parent report accessible
- ✅ Narrative report generated
- ✅ 2030 skills mapped
- ✅ Activities recommended
- ✅ PDF downloadable

---

## Sprint 5: Polish & Deployment (Hari 10)

### Goals
- Fix all bugs
- Optimize performance
- Deploy to Vercel
- Create documentation

### Tasks
- [ ] Bug fixes from testing
- [ ] Performance optimization
  - [ ] Image optimization
  - [ ] Code splitting
  - [ ] Lazy loading
- [ ] Accessibility audit
- [ ] Mobile responsiveness check
- [ ] Cross-browser testing
- [ ] Setup Vercel deployment
- [ ] Configure custom domain (optional)
- [ ] Create user documentation
- [ ] Create developer documentation
- [ ] Final testing
- [ ] MVP launch 🚀

### Deliverables
- ✅ All bugs fixed
- ✅ Performance optimized
- ✅ Accessibility compliant
- ✅ Deployed to Vercel
- ✅ Documentation complete
- ✅ MVP ready for users

---

## 📊 Sprint Velocity Tracking

| Sprint | Planned | Completed | Velocity |
|--------|---------|-----------|----------|
| Sprint 0 | 12 tasks | 12 tasks | 100% |
| Sprint 1 | 11 tasks | - | - |
| Sprint 2 | 15 tasks | - | - |
| Sprint 3 | 9 tasks | - | - |
| Sprint 4 | 9 tasks | - | - |
| Sprint 5 | 11 tasks | - | - |

---

## 🎯 MVP Success Criteria

- [ ] Siswa dapat menyelesaikan Pulau Candi tanpa bantuan
- [ ] Telemetri tercatat untuk semua interaksi
- [ ] Laporan guru tersedia dalam < 1 menit
- [ ] Laporan orang tua naratif dan actionable
- [ ] Aplikasi berjalan smooth di Chromebook
- [ ] Zero critical bugs