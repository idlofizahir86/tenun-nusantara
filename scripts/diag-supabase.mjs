// Diagnostik Supabase — menampilkan error mentah + mencoba daftar tabel via OpenAPI.
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

const db = createClient(url, service, { auth: { persistSession: false } });

console.log("== Cek per tabel (error mentah) ==");
for (const t of ["profiles", "sessions", "events", "scores"]) {
  const { data, error } = await db.from(t).select("*").limit(1);
  console.log(`- ${t}: data=${JSON.stringify(data)} error=${error ? error.message : "null"}`);
}

console.log("\n== Coba OpenAPI root (beberapa Accept) ==");
const accepts = [
  "application/vnd.pgrst.openapi+json",
  "application/openapi+json",
  "application/json",
];
for (const acc of accepts) {
  try {
    const res = await fetch(url + "/rest/v1/", {
      headers: { apikey: service, Authorization: "Bearer " + service, Accept: acc },
    });
    const text = await res.text();
    let names = [];
    if (res.ok) {
      try {
        const spec = JSON.parse(text);
        names = Object.keys(spec.paths || {})
          .map((p) => p.split("/")[1])
          .filter(Boolean);
      } catch {}
    }
    console.log(`- Accept=${acc} -> HTTP ${res.status}; tables: ${names.join(", ") || "(kosong)"}`);
  } catch (e) {
    console.log(`- Accept=${acc} -> error: ${e.message}`);
  }
}
