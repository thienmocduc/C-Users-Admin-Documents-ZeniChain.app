"use client";
import { create } from "zustand";

interface User {
  name: string;
  email: string;
  rank: string;
  avatar: string;
  zeniId: string;
}

interface AuthStore {
  user: User | null;
  isLoggedIn: boolean;
  login: (emailOrPhone: string, password: string) => Promise<boolean>;
  loginDemo: () => void;
  logout: () => void;
}

// Demo user for development only — no real credentials
const DEMO_USER: User = {
  name: "Demo User",
  email: "demo@zenichain.app",
  rank: "Starter",
  avatar: "D",
  zeniId: "ZNI-DEMO-00000",
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("zeni-user") || "null")
    : null,
  isLoggedIn: typeof window !== "undefined"
    ? !!localStorage.getItem("zeni-user")
    : false,

  login: async (emailOrPhone, password) => {
    try {
      // TODO: Replace with Supabase Auth when ready
      // const { data, error } = await supabase.auth.signInWithPassword({ email: emailOrPhone, password });
      // For now, validate non-empty fields only
      if (!emailOrPhone || !password || password.length < 6) {
        return false;
      }
      // Temporary: accept any valid-looking credentials for demo
      const user: User = {
        name: emailOrPhone.split("@")[0] || "User",
        email: emailOrPhone,
        rank: "Starter",
        avatar: (emailOrPhone[0] || "U").toUpperCase(),
        zeniId: `ZNI-USR-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      };
      localStorage.setItem("zeni-user", JSON.stringify(user));
      set({ user, isLoggedIn: true });
      return true;
    } catch {
      return false;
    }
  },

  loginDemo: () => {
    localStorage.setItem("zeni-user", JSON.stringify(DEMO_USER));
    set({ user: DEMO_USER, isLoggedIn: true });
  },

  logout: () => {
    localStorage.removeItem("zeni-user");
    set({ user: null, isLoggedIn: false });
  },
}));
