-- ============================================================
-- Tenun Nusantara — Selaraskan identitas ke auth.users + buang skema mati
--
-- Konteks: aplikasi memakai auth.users.id sebagai identitas (RLS
-- `auth.uid() = profile_id`, filter `?mine=1`). Namun FK lama
-- mengarah ke public.profiles(id) yang TIDAK PERNAH diisi — sehingga
-- penulisan telemetri untuk user login gagal karena violasi FK.
--
-- Perbaikan:
--  1) sessions.profile_id & events.profile_id -> references auth.users(id)
--  2) Hapus tabel yang tidak dipakai kode: scores (redundan — skor
--     dihitung ulang saat dibaca) dan profiles (digantikan sessions.player).
--
-- Jalankan sekali di Supabase Dashboard → SQL Editor, atau: supabase db push
-- ============================================================

-- 1) Selaraskan foreign key ke auth.users(id)
alter table public.sessions drop constraint if exists sessions_profile_id_fkey;
alter table public.sessions
  add constraint sessions_profile_id_fkey
  foreign key (profile_id) references auth.users(id) on delete cascade;

alter table public.events drop constraint if exists events_profile_id_fkey;
alter table public.events
  add constraint events_profile_id_fkey
  foreign key (profile_id) references auth.users(id) on delete cascade;

-- 2) Hapus skema mati (tidak ada referensi di kode)
drop table if exists public.scores;
drop table if exists public.profiles;
