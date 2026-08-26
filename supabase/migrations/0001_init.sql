-- ============================================================
-- Tenun Nusantara — Inisialisasi Schema (Supabase/PostgreSQL)
-- Jalankan via: supabase db push / psql
-- ============================================================

create extension if not exists "pgcrypto";

-- Profil pemain (satu baris per anak/user)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete cascade,
  name text not null default '',
  character_id text,
  motif text,
  origin text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Sesi permainan (data progres, XP, level, lencana)
create table if not exists public.sessions (
  id uuid primary key,
  profile_id uuid references public.profiles(id) on delete cascade,
  device_key text,           -- key anonim per perangkat (MVP tanpa login)
  started_at timestamptz not null default now(),
  last_active_at timestamptz not null default now(),
  current_island text,
  current_act int,
  xp int not null default 0,
  level int not null default 1,
  badges jsonb not null default '[]'::jsonb,
  completed_islands text[] not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists sessions_device_idx on public.sessions(device_key);
create index if not exists sessions_profile_idx on public.sessions(profile_id);

-- Event telemetri / jejak aksi anak
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  t timestamptz not null default now(),
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists events_session_idx on public.events(session_id, t);

-- Skor asesmen bakat per dimensi (untuk Peta Bakat / rekomendasi)
create table if not exists public.scores (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.sessions(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  island_id text,
  act int,
  trait text,
  value int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists scores_profile_idx on public.scores(profile_id);

-- ============================================================
-- Row Level Security: setiap user hanya bisa mengakses datanya sendiri
-- ============================================================
alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.events enable row level security;
alter table public.scores enable row level security;

-- profiles
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = auth_user_id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = auth_user_id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = auth_user_id);

-- sessions
create policy "sessions_select_own" on public.sessions
  for select using (auth.uid() = profile_id);
create policy "sessions_insert_own" on public.sessions
  for insert with check (auth.uid() = profile_id);
create policy "sessions_update_own" on public.sessions
  for update using (auth.uid() = profile_id);

-- events
create policy "events_select_own" on public.events
  for select using (auth.uid() = profile_id);
create policy "events_insert_own" on public.events
  for insert with check (auth.uid() = profile_id);

-- scores
create policy "scores_select_own" on public.scores
  for select using (auth.uid() = profile_id);
create policy "scores_insert_own" on public.scores
  for insert with check (auth.uid() = profile_id);
