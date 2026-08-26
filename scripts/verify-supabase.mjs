// Verifikasi koneksi Supabase dari .env.local (read-only).
// TIDAK menampilkan isi kunci — hanya status.
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv(path) {
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return out;
}

const env = loadEnv(".env.local");
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const service = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !service) {
  console.log("❌ URL / SERVICE_ROLE tidak ditemukan di .env.local");
  process.exit(1);
}

console.log("🔗 URL:", url);
console.log("🔑 service role terdeteksi:", service ? "ya (panjang " + service.length + ")" : "tidak");

const db = createClient(url, service, { auth: { persistSession: false } });

const tables = ["profiles", "sessions", "events", "scores"];
let ok = true;
for (const t of tables) {
  try {
    const { data, error } = await db.from(t).select("*").limit(1);
    if (error) {
      console.log(`  - ${t}: ❌ ${error.message}`);
      ok = false;
    } else {
      console.log(`  - ${t}: ✅ ada (${data?.length ?? 0} baris)`);
    }
  } catch (e) {
    console.log(`  - ${t}: ❌ ${e.message}`);
    ok = false;
  }
}
console.log(ok ? "\n🎉 Semua tabel siap." : "\n⚠️ Ada tabel yang belum ada — jalankan migrasi 0001_init.sql.");
console.log(ok ? "(SELECT dari keempat tabel berhasil — tabel pasti ada di schema public project ini.)" : "(Tabel belum dibuat — jalankan isi supabase/migrations/0001_init.sql di SQL Editor, lalu cek lagi.)");
