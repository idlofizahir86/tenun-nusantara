// Tipe TypeScript yang mencerminkan tabel Supabase
// (lihat migrasi 0001_init.sql & 0005_align_identity.sql).
// Catatan: profile_id mengarah ke auth.users(id), bukan tabel profiles.

export interface DbSession {
  id: string;
  profile_id: string | null;
  device_key: string | null;
  game_code: string | null;
  class_code: string | null;
  player: {
    name: string;
    characterId: string;
    motif?: string;
    origin?: string;
  } | null;
  started_at: string;
  last_active_at: string;
  current_island: string | null;
  current_act: number | null;
  xp: number;
  level: number;
  badges: string[];
  completed_islands: string[];
  created_at: string;
}

export interface DbEvent {
  id: string;
  session_id: string;
  profile_id: string | null;
  t: string;
  type: string;
  payload: Record<string, unknown>;
  created_at: string;
}
