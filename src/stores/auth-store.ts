"use client";

import { create } from "zustand";
import type { User } from "@supabase/supabase-js";

// Store status autentikasi ringan (zustand).
interface AuthState {
  user: User | null;
  status: "loading" | "guest" | "authenticated";
  setUser: (u: User | null) => void;
  setStatus: (s: AuthState["status"]) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "loading",
  setUser: (user) => set({ user }),
  setStatus: (status) => set({ status }),
}));
