"use client";
import { create } from "zustand";

interface User {
  name: string;
  email: string;
  rank: string;
  avatar: string;
  zeniId: string;
}

const DEMO_USERS = [
  { email: "duc@zeni.holdings", password: "Zeni@2026", name: "Thien Moc Duc", rank: "KOC Pro", avatar: "T", zeniId: "ZNI-TMD-00421" },
  { email: "admin@zeni.holdings", password: "Zeni@2026", name: "Thien Moc Duc", rank: "KOC Pro", avatar: "T", zeniId: "ZNI-TMD-00421" },
  { email: "0918876586", password: "123456", name: "Thien Moc Duc", rank: "KOC Pro", avatar: "T", zeniId: "ZNI-TMD-00421" },
];

interface AuthStore {
  user: User | null;
  isLoggedIn: boolean;
  login: (emailOrPhone: string, password: string) => boolean;
  loginDemo: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("zeni-user") || "null")
    : null,
  isLoggedIn: typeof window !== "undefined"
    ? !!localStorage.getItem("zeni-user")
    : false,
  login: (emailOrPhone, password) => {
    const found = DEMO_USERS.find(u => u.email === emailOrPhone && u.password === password);
    if (found) {
      const user = { name: found.name, email: found.email, rank: found.rank, avatar: found.avatar, zeniId: found.zeniId };
      localStorage.setItem("zeni-user", JSON.stringify(user));
      set({ user, isLoggedIn: true });
      return true;
    }
    return false;
  },
  loginDemo: () => {
    const demo = DEMO_USERS[0];
    const user = { name: demo.name, email: demo.email, rank: demo.rank, avatar: demo.avatar, zeniId: demo.zeniId };
    localStorage.setItem("zeni-user", JSON.stringify(user));
    set({ user, isLoggedIn: true });
  },
  logout: () => {
    localStorage.removeItem("zeni-user");
    set({ user: null, isLoggedIn: false });
  },
}));
