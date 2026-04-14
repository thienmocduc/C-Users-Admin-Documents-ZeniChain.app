"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSidebarStore } from "@/stores/useSidebarStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTranslation } from "@/hooks/useTranslation";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { mobileOpen, setMobileOpen } = useSidebarStore();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { t } = useTranslation();

  const navSections = [
    { label: t("nav_overview"), items: [{ href: "/dashboard", icon: "📊", text: t("nav_dashboard") }] },
    { label: t("nav_assets"), items: [{ href: "/wallet", icon: "💎", text: t("nav_wallet") }] },
    {
      label: t("nav_business"),
      items: [
        { href: "/affiliate", icon: "🤝", text: t("nav_affiliate") },
        { href: "/voucher", icon: "🎟", text: t("nav_voucher") },
        { href: "/pools", icon: "🏆", text: t("nav_pools") },
      ],
    },
    {
      label: t("nav_blockchain"),
      items: [
        { href: "/onchain", icon: "🔗", text: t("nav_onchain") },
        { href: "/nfts", icon: "🏅", text: t("nav_nfts") },
      ],
    },
    {
      label: t("nav_growth"),
      items: [
        { href: "/staking", icon: "🔒", text: t("nav_staking"), badge: "28%", badgeType: "teal" as const },
        { href: "/governance", icon: "🗳", text: t("nav_governance"), badge: "DAO", badgeType: "violet" as const },
        { href: "/analytics", icon: "📈", text: t("nav_analytics") },
        { href: "/tokenomics", icon: "💎", text: "Tokenomics" },
      ],
    },
    {
      label: t("nav_system"),
      items: [
        { href: "/admin", icon: "🛡", text: t("nav_admin") },
        { href: "/settings", icon: "⚙️", text: t("nav_settings") },
      ],
    },
  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[140] md:hidden"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          glass-panel glass-sidebar
          flex h-dvh w-[220px] flex-shrink-0 flex-col overflow-y-auto z-[150]
          max-md:fixed max-md:top-0 max-md:bottom-0 max-md:left-0
          ${mobileOpen ? "max-md:translate-x-0 max-md:shadow-[8px_0_32px_rgba(0,0,0,0.5)]" : "max-md:-translate-x-full"}
          transition-transform duration-300
        `}
      >
        {/* Logo */}
        <div className="px-4 pt-[14px] pb-[12px] border-b border-[var(--border)]">
          <div className="flex items-center gap-[10px]">
            <img
              src="/logo-tree-120.png"
              alt="Zeni Chain"
              width={32}
              height={32}
              className="flex-shrink-0 object-contain"
              style={{ filter: "drop-shadow(0 0 6px rgba(0,180,255,0.3))" }}
            />
            <div>
              <div className="text-[16px] font-bold text-[var(--white)]">
                Zeni<span className="text-[var(--c6b)]"> Chain</span>
              </div>
              <div className="mt-[2px] text-[9px] uppercase tracking-[1.5px] text-[var(--dim)]" style={{ fontFamily: "var(--font-mono)" }}>
                Polygon · Web3
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
          {navSections.map((section) => (
            <div key={section.label} className="mb-[2px]">
              <div className="nav-section-label px-4 pt-2 pb-1 text-[9px] uppercase tracking-[2px]" style={{ fontFamily: "var(--font-mono)" }}>
                {section.label}
              </div>
              {section.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`nav-item-base my-[1px] flex items-center gap-[10px] px-4 py-[9px] transition-all duration-150 ${active ? "nav-item-active" : ""}`}
                  >
                    <div className="nav-icon-box flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[14px]">
                      {item.icon}
                    </div>
                    <span className="nav-text-base flex-1 text-[12px]">
                      {item.text}
                    </span>
                    {item.badge && (
                      <span
                        className="nav-badge-chip rounded-lg px-[7px] py-[2px] text-[9px] font-semibold"
                        style={{
                          fontFamily: "var(--font-mono)",
                          background: item.badgeType === "teal" ? "rgba(0,212,170,0.12)" : "rgba(107,33,240,0.14)",
                          color: item.badgeType === "teal" ? "#00D4AA" : "#8B45FF",
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User card + logout */}
        <div className="mt-auto p-3 border-t border-[var(--border)]">
          <Link
            href="/settings"
            onClick={() => setMobileOpen(false)}
            className="user-card-box flex items-center gap-[10px] rounded-xl px-3 py-[10px] transition-all duration-200"
          >
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[10px] text-[13px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, #00D4AA, #4A8DFF, #6B21F0)" }}
            >
              {user?.avatar || "T"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12px] font-semibold text-[var(--white)]">
                {user?.name || "Thien Moc Duc"}
              </div>
              <div className="text-[10px] text-[var(--c6b)]">
                💎 {user?.rank || "KOC Pro"}
              </div>
            </div>
            <span className="text-[12px] text-[var(--dim)]">›</span>
          </Link>
          <button
            onClick={() => { logout(); router.push("/login"); }}
            className="logout-btn mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-[8px] text-[11px] font-medium transition-all duration-200 cursor-pointer"
          >
            🚪 Đăng xuất
          </button>
        </div>
      </aside>
    </>
  );
}
