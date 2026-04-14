"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useSidebarStore } from "@/stores/useSidebarStore";
import { useLocaleStore } from "@/stores/useLocaleStore";
import type { Locale } from "@/lib/i18n";

const LANGUAGES = [
  { code: "VI", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "EN", name: "English", flag: "🇺🇸" },
  { code: "ZH", name: "中文", flag: "🇨🇳" },
  { code: "JA", name: "日本語", flag: "🇯🇵" },
  { code: "KO", name: "한국어", flag: "🇰🇷" },
  { code: "TH", name: "ภาษาไทย", flag: "🇹🇭" },
  { code: "ID", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "MS", name: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "HI", name: "हिंदी", flag: "🇮🇳" },
  { code: "AR", name: "العربية", flag: "🇦🇪" },
  { code: "KM", name: "ភាសាខ្មែរ", flag: "🇰🇭" },
  { code: "LO", name: "ພາສາລາວ", flag: "🇱🇦" },
];

interface TopbarProps {
  title?: string;
}

export function Topbar({ title = "Dashboard" }: TopbarProps) {
  const { setMobileOpen } = useSidebarStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { locale: currentLang, setLocale: setCurrentLangStore } = useLocaleStore();
  const [blockNumber, setBlockNumber] = useState(4_821_043);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Simulate block number incrementing
  useEffect(() => {
    const interval = setInterval(() => {
      setBlockNumber((b) => b + Math.floor(Math.random() * 3) + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Close lang dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const currentFlag = LANGUAGES.find((l) => l.code === currentLang)?.flag || "🇻🇳";

  return (
    <header
      className="flex h-14 flex-shrink-0 items-center gap-[10px] px-5 z-[100]"
      style={{
        background: "var(--bg2)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Hamburger - mobile */}
      <button
        className="hidden max-md:block rounded-lg px-2 py-1 text-[20px] cursor-pointer"
        style={{ color: "var(--muted)" }}
        onClick={() => setMobileOpen(true)}
      >
        ☰
      </button>

      {/* Page title */}
      <div className="flex-1 text-[15px] font-semibold" style={{ color: "var(--white)" }}>
        {title}
      </div>

      {/* Chain status */}
      <div
        className="hidden items-center gap-[7px] rounded-[20px] px-3 py-[5px] text-[11px] sm:flex"
        style={{
          background: "rgba(0,212,170,0.07)",
          border: "1px solid rgba(0,212,170,0.2)",
          fontFamily: "var(--font-mono)",
        }}
      >
        <span
          className="h-[6px] w-[6px] rounded-full"
          style={{ background: "#00D4AA", animation: "pdot 2s infinite" }}
        />
        <span style={{ color: "var(--muted)" }}>Zeni Chain</span>
        <span style={{ color: "#00D4AA", fontWeight: 500 }}>
          {blockNumber.toLocaleString()}
        </span>
      </div>

      {/* Language switcher */}
      <div className="relative" ref={langRef}>
        <button
          className="flex items-center gap-[5px] rounded-[20px] px-3 py-[6px] text-[12px] font-semibold cursor-pointer transition-all duration-200"
          style={{
            background: "rgba(107,33,240,0.09)",
            border: "1px solid rgba(139,69,255,0.22)",
            color: "var(--c6b)",
          }}
          onClick={() => setLangOpen(!langOpen)}
        >
          <span>{currentFlag}</span>
          <span>{currentLang}</span>
          <span className="text-[10px]">▾</span>
        </button>

        {langOpen && (
          <div
            className="absolute top-[calc(100%+8px)] right-0 z-[9999] min-w-[210px] max-h-[380px] overflow-y-auto rounded-[14px] p-2"
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--border2)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              backdropFilter: "blur(24px)",
            }}
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                className="flex w-full items-center gap-[10px] rounded-[10px] px-3 py-[9px] transition-all duration-150 cursor-pointer"
                style={{
                  background: currentLang === lang.code ? "rgba(107,33,240,0.15)" : undefined,
                }}
                onMouseEnter={(e) => {
                  if (currentLang !== lang.code) e.currentTarget.style.background = "rgba(107,33,240,0.1)";
                }}
                onMouseLeave={(e) => {
                  if (currentLang !== lang.code) e.currentTarget.style.background = "";
                }}
                onClick={() => {
                  setCurrentLangStore(lang.code as Locale);
                  setLangOpen(false);
                }}
              >
                <span className="w-[22px] flex-shrink-0 text-center text-[16px]">{lang.flag}</span>
                <span
                  className="flex-1 text-left text-[12px] font-medium"
                  style={{ color: currentLang === lang.code ? "var(--c6b)" : "var(--muted)" }}
                >
                  {lang.name}
                </span>
                {currentLang === lang.code && (
                  <span className="text-[11px]" style={{ color: "var(--c6b)" }}>✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Theme toggle */}
      {mounted && (
        <button
          className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] text-[16px] cursor-pointer transition-all duration-150"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid var(--border)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.09)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
      )}

      {/* Notification bell */}
      <button
        className="relative flex h-[34px] w-[34px] items-center justify-center rounded-[10px] text-[16px] cursor-pointer transition-all duration-150"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid var(--border)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.09)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
      >
        🔔
        <span
          className="absolute top-[6px] right-[7px] h-[6px] w-[6px] rounded-full"
          style={{ background: "#E05252", border: "2px solid var(--bg)" }}
        />
      </button>
    </header>
  );
}
