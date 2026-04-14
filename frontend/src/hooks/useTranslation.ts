"use client";
import { useLocaleStore } from "@/stores/useLocaleStore";
import { TRANSLATIONS, type Locale } from "@/lib/i18n";

export function useTranslation() {
  const locale = useLocaleStore((s) => s.locale);
  const t = (key: string): string => {
    return TRANSLATIONS[locale]?.[key] || TRANSLATIONS["VI"]?.[key] || key;
  };
  return { t, locale };
}
