"use client";
import { create } from "zustand";
import type { Locale } from "@/lib/i18n";

interface LocaleStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleStore>((set) => ({
  locale: "VI",
  setLocale: (locale) => {
    set({ locale });
    if (typeof window !== "undefined") localStorage.setItem("zeni-locale", locale);
  },
}));
