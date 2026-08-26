// Tipe TypeScript yang mencerminkan tabel Supabase (lihat migrasi 0001_init.sql).

export interface DbProfile {
  id: string;
  auth_user_id: string | null;
  name: string;
  character_id: string | null;
  motif: string | null;
  origin: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbSession {
  id: string;
  profile_id: string | null;
  device_key: string | null;
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

export interface DbScore {
  id: string;
  session_id: string;
  profile_id: string | null;
  island_id: string | null;
  act: number | null;
  trait: string | null;
  value: number;
  created_at: string;
}
