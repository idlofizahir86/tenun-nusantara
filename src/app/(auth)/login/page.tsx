"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, UserPlus, Compass } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useShipLoading } from "@/hooks/use-ship-loading";
import { storeAccount, pullMyRemoteData } from "@/lib/supabase/sync";
import { LoadingShip } from "@/components/ui/loading-ship";
import { ShipScreen } from "@/components/ui/ship-screen";

type Mode = "signin" | "signup";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const { isBusy, run } = useShipLoading();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (!email || !password) {
      setError("Isi email dan kata sandi terlebih dahulu.");
      return;
    }
    const destination = await run(async (): Promise<string | null> => {
      if (mode === "signin") {
        const { user } = await signIn(email, password);
        if (user) {
          storeAccount(user.id);
          await pullMyRemoteData();
          return returnTo || "/role-selection";
        }
      } else {
        const { user } = await signUp(email, password);
        if (user) {
          storeAccount(user.id);
          return returnTo || "/role-selection";
        }
        setInfo("Akun berhasil dibuat. Silakan cek email untuk konfirmasi, lalu masuk.");
      }
      return null;
    });
    // kapal sempat tampil minimal ~1.2 detik sebelum berpindah halaman
    if (destination) router.push(destination);
  }

  function goGuest() {
    router.push("/role-selection");
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-[#09242B] to-[#060F14] px-4">
      <div className="w-full max-w-md rounded-3xl border border-[#FFB319] bg-[#0F3943]/80 p-8 shadow-2xl backdrop-blur">
        <div className="mb-6 text-center">
          <h1 className="font-outfit text-3xl font-extrabold text-white">
            Tenun <span className="text-[#FFB319]">Nusantara</span>
          </h1>
          <p className="mt-1 font-nunito text-sm text-[#E2ECEF]">
            {mode === "signin" ? "Masuk untuk melanjutkan petualanganmu" : "Buat akun baru"}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="mb-6 grid grid-cols-2 gap-1 rounded-full bg-[#09242B] p-1">
          {(["signin", "signup"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError(null);
                setInfo(null);
              }}
              className={`rounded-full py-2 font-outfit text-sm font-bold transition-colors ${
                mode === m ? "bg-[#FFB319] text-[#0B1D23]" : "text-[#E2ECEF] hover:text-white"
              }`}
            >
              {m === "signin" ? "Masuk" : "Daftar"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-nunito text-xs text-[#8DA2A6]">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kamu@contoh.id"
              className="rounded-xl border border-[#FFB319]/40 bg-[#09242B] px-4 py-3 font-nunito text-sm text-white placeholder:text-[#5A7378] focus:border-[#FFB319] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-nunito text-xs text-[#8DA2A6]">
              Kata Sandi
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="rounded-xl border border-[#FFB319]/40 bg-[#09242B] px-4 py-3 font-nunito text-sm text-white placeholder:text-[#5A7378] focus:border-[#FFB319] focus:outline-none"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-[#E63946]/15 px-3 py-2 font-nunito text-xs text-[#FF8A94]">
              {error}
            </p>
          )}
          {info && (
            <p className="rounded-lg bg-[#19D29F]/15 px-3 py-2 font-nunito text-xs text-[#19D29F]">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={isBusy}
            className="inline-flex items-center justify-center gap-2 rounded-[32px] bg-[#FFB319] py-3 font-outfit text-sm font-extrabold uppercase text-[#0B1D23] transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {isBusy ? (
              <LoadingShip size={22} inline />
            ) : mode === "signin" ? (
              <LogIn className="h-5 w-5" />
            ) : (
              <UserPlus className="h-5 w-5" />
            )}
            {mode === "signin" ? "Masuk" : "Daftar"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-[#5A7378]">
          <span className="h-px flex-1 bg-[#1B4450]" />
          <span className="font-nunito text-xs">atau</span>
          <span className="h-px flex-1 bg-[#1B4450]" />
        </div>

        <button
          type="button"
          onClick={goGuest}
          className="inline-flex w-full items-center justify-center gap-2 rounded-[32px] border border-[#FFB319]/40 py-3 font-outfit text-sm font-bold uppercase text-white transition-colors hover:bg-[#144955]"
        >
          <Compass className="h-5 w-5 text-[#19D29F]" />
          Lanjut sebagai Tamu
        </button>
      </div>

      <ShipScreen
        show={isBusy}
        label={mode === "signin" ? "Berlayar ke akunmu…" : "Menyiapkan akunmu…"}
      />
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
