"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { CosmicBackground } from "@/components/ui/CosmicBackground";

export default function RegisterPage() {
  const router = useRouter();
  const loginDemo = useAuthStore((s) => s.loginDemo);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (form.name && form.email && form.password) {
      setLoading(true);
      loginDemo();
      setTimeout(() => router.push("/dashboard"), 400);
    }
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center px-4 py-8" style={{ background: "var(--bg)" }}>
      <CosmicBackground />

      <div className="relative z-[1] w-full max-w-[440px]">
        {/* Logo + Branding */}
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center text-[26px] font-black text-white"
            style={{
              background: "linear-gradient(135deg, #00D4AA, #4A8DFF, #6B21F0, #C084FC)",
              clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
              boxShadow: "0 0 40px rgba(107,33,240,0.3)",
            }}
          >
            Z
          </div>
          <h1 className="text-[24px] font-extrabold" style={{ color: "var(--white)" }}>
            Tạo tài khoản
          </h1>
          <p className="mt-1 text-[13px]" style={{ color: "var(--muted)" }}>
            Zeni ID — 1 tài khoản cho toàn hệ sinh thái
          </p>
        </div>

        {/* Register Card */}
        <div
          className="rounded-[20px] p-7"
          style={{
            background: "rgba(15, 18, 32, 0.7)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(139, 69, 255, 0.2)",
          }}
        >
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="input-label">Họ và tên</label>
              <input
                type="text"
                value={form.name}
                onChange={update("name")}
                placeholder="Nguyễn Văn A"
                className="input-field"
              />
            </div>

            <div className="mb-4">
              <label className="input-label">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={update("email")}
                placeholder="email@example.com"
                className="input-field"
              />
            </div>

            <div className="mb-4">
              <label className="input-label">Số điện thoại</label>
              <input
                type="tel"
                value={form.phone}
                onChange={update("phone")}
                placeholder="09xx xxx xxx"
                className="input-field"
              />
            </div>

            <div className="mb-5">
              <label className="input-label">Mật khẩu</label>
              <input
                type="password"
                value={form.password}
                onChange={update("password")}
                placeholder="Tối thiểu 8 ký tự"
                className="input-field"
              />
            </div>

            <div
              className="mb-5 rounded-[10px] px-4 py-3 text-[12px]"
              style={{
                background: "rgba(0,212,170,0.06)",
                border: "1px solid rgba(0,212,170,0.15)",
                color: "var(--c4)",
              }}
            >
              ✓ Tạo Zeni ID — dùng được toàn bộ 5 platform trong hệ sinh thái Zeni Holdings
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full justify-center"
              style={{ padding: "14px", fontSize: "15px", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản →"}
            </button>
          </form>

          <div className="mt-5 text-center text-[13px]" style={{ color: "var(--dim)" }}>
            Đã có tài khoản?{" "}
            <Link href="/login" className="cursor-pointer font-semibold" style={{ color: "var(--c6b)" }}>
              Đăng nhập
            </Link>
          </div>
        </div>

        {/* Features list */}
        <div
          className="mt-4 rounded-[14px] px-5 py-4"
          style={{
            background: "rgba(15,18,32,0.5)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(139,69,255,0.1)",
          }}
        >
          <div className="flex flex-col gap-2">
            {[
              { icon: "🔗", text: "Polygon Mainnet · Gas < 0.001 $ZENI" },
              { icon: "🏥", text: "Dùng tất cả 5 platform Zeni Holdings" },
              { icon: "🔒", text: "KYC 1 lần · Bảo mật AES-256" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-2 text-[11px]" style={{ color: "var(--muted)" }}>
                <span>{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
