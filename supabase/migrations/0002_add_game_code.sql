-- ============================================================
-- Tenun Nusantara — Tambah kolom game_code pada sessions
-- (untuk fitur lanjutkan / bagikan lewat kode pendek, mis. TN-7K3M9X)
--
-- Jalankan sekali di Supabase Dashboard → SQL Editor,
-- atau via: supabase db push
-- ============================================================

alter table public.sessions add column if not exists game_code text;
create index if not exists sessions_game_code_idx on public.sessions(game_code);
