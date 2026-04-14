"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const items = [
  { href: "/dashboard", icon: "🏠", label: "Home" },
  { href: "/affiliate", icon: "🤝", label: "Affiliate" },
  { href: "/voucher", icon: "🎟", label: "Voucher" },
  { href: "/staking", icon: "🔒", label: "Staking" },
  { href: "/settings", icon: "👤", label: "Tài khoản" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[200] hidden h-[60px] items-center justify-around px-1 max-md:flex"
      style={{
        background: "var(--bg2)",
        borderTop: "1px solid var(--border)",
        backdropFilter: "blur(20px)",
      }}
    >
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-1 flex-col items-center gap-[3px] rounded-[10px] px-3 py-[6px] transition-all duration-150"
            style={{
              background: active ? "rgba(107,33,240,0.1)" : undefined,
            }}
          >
            <span className="text-[18px]">{item.icon}</span>
            <span
              className="text-[9px] font-medium"
              style={{ color: active ? "var(--c6b)" : "var(--dim)" }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
