-- ============================================================
-- Tenun Nusantara — Tambah kolom class_code pada sessions
-- (untuk fitur Dashboard Guru: kode kelas yang dimasukkan siswa
--  di char-select, agar guru bisa menarik data siswanya).
--
-- Jalankan sekali di Supabase Dashboard → SQL Editor,
-- atau via: supabase db push
-- ============================================================

alter table public.sessions add column if not exists class_code text;
create index if not exists sessions_class_code_idx on public.sessions(class_code);
