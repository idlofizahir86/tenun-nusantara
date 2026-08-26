"use client";

import { createBrowserClient } from "@supabase/ssr";

// Klien Supabase untuk sisi browser (menggunakan anon/publishable key + cookies).
// Mendukung nama variabel lama (ANON_KEY) maupun baru (PUBLISHABLE_KEY).
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !anonKey) return null;
  return createBrowserClient(url, anonKey);
}
