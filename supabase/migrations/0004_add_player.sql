-- ============================================================
-- Tenun Nusantara — Tambah kolom player pada sessions
-- (profil pemain: nama, karakter, motif, origin) agar Dashboard
--  Guru menampilkan data siswa yang sebenarnya, bukan "Penjelajah".
--
-- Jalankan sekali di Supabase Dashboard → SQL Editor,
-- atau via: supabase db push
-- ============================================================

alter table public.sessions add column if not exists player jsonb;
