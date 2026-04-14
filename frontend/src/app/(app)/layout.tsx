"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { useAuthStore } from "@/stores/useAuthStore";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/wallet": "Ví & Tài sản",
  "/affiliate": "Affiliate",
  "/voucher": "NFT Voucher",
  "/pools": "Pool Đại Sứ",
  "/onchain": "On-Chain",
  "/nfts": "NFT Badges",
  "/staking": "Staking",
  "/governance": "Governance",
  "/analytics": "Analytics",
  "/admin": "Admin Panel",
  "/settings": "Tài khoản",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const title = pageTitles[pathname] || "Zeni Chain";

  // Auth guard - redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return (
      <div className="flex h-dvh items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="text-center">
          <div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center text-[20px] font-black text-white"
            style={{
              background: "linear-gradient(135deg, #00D4AA, #4A8DFF, #6B21F0, #C084FC)",
              clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
            }}
          >
            Z
          </div>
          <div className="text-[13px]" style={{ color: "var(--muted)" }}>Đang chuyển hướng...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh overflow-hidden" style={{ background: "var(--bg)" }}>
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto p-6 max-md:px-3 max-md:py-4 max-md:pb-20">
          {children}
        </main>
      </div>
      <BottomNav />

      {/* Chat FAB */}
      <button className="chat-fab" title="Chat hỗ trợ">
        💬
      </button>
    </div>
  );
}
