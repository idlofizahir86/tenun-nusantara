-- ============================================================
-- Tenun Nusantara — Tabel kelas guru
--
-- Sebelumnya kelas hanya disimpan di localStorage browser guru
-- (tenun-teacher-classes) sehingga hilang bila storage bersih /
-- origin berubah (mis. port dev berganti). Kini kelas tersimpan
-- di database.
--
-- Kepemilikan mengikuti pola tabel sessions:
--   profile_id  -> akun guru yang login (nullable, guru tamu)
--   device_key  -> key perangkat anonim untuk guru tamu
--
-- Akses hanya lewat service role di /api/classes (RLS aktif tanpa
-- policy publik, sehingga anon tidak bisa membaca langsung).
--
-- Jalankan sekali di Supabase Dashboard → SQL Editor, atau: supabase db push
-- ============================================================

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,          -- kode join siswa (KL-XXXXXX)
  label text not null default '',
  profile_id uuid references auth.users(id) on delete cascade,
  device_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists classes_profile_idx on public.classes(profile_id);
create index if not exists classes_device_idx on public.classes(device_key);

alter table public.classes enable row level security;
