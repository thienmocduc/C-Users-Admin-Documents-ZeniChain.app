"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { CosmicBackground } from "@/components/ui/CosmicBackground";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const loginDemo = useAuthStore((s) => s.loginDemo);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!emailOrPhone || !password) {
      setError("Vui lòng nhập email/SĐT và mật khẩu.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu tối thiểu 6 ký tự.");
      return;
    }
    setLoading(true);
    try {
      const success = await login(emailOrPhone, password);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Đăng nhập thất bại. Vui lòng thử lại.");
        setLoading(false);
      }
    } catch {
      setError("Lỗi hệ thống. Vui lòng thử lại sau.");
      setLoading(false);
    }
  }

  function handleDemo() {
    setLoading(true);
    loginDemo();
    setTimeout(() => router.push("/dashboard"), 300);
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center px-4" style={{ background: "var(--bg)" }}>
      <CosmicBackground />

      <div className="relative z-[1] w-full max-w-[440px]">
        {/* Logo + Branding */}
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-4 flex h-16 w-16 flex-shrink-0 items-center justify-center text-[26px] font-black text-white"
            style={{
              background: "linear-gradient(135deg, #00D4AA, #4A8DFF, #6B21F0, #C084FC)",
              clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
              boxShadow: "0 0 40px rgba(107,33,240,0.3)",
            }}
          >
            Z
          </div>
          <h1 className="text-[24px] font-extrabold" style={{ color: "var(--white)" }}>
            Đăng nhập
          </h1>
          <p className="mt-1 text-[13px]" style={{ color: "var(--muted)" }}>
            Zeni Chain · Web3 Wellness Platform
          </p>
        </div>

        {/* Login Card */}
        <div
          className="rounded-[20px] p-7"
          style={{
            background: "rgba(15, 18, 32, 0.7)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(139, 69, 255, 0.2)",
          }}
        >
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="input-label">Email / Số điện thoại</label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="email@example.com"
                className="input-field"
                autoComplete="email"
              />
            </div>

            <div className="mb-5">
              <label className="input-label">Mật khẩu</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div
                className="mb-4 rounded-[10px] px-[14px] py-[10px] text-[12px]"
                style={{
                  background: "rgba(224,82,82,0.1)",
                  border: "1px solid rgba(224,82,82,0.25)",
                  color: "#E05252",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full justify-center"
              style={{ padding: "14px", fontSize: "15px", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập →"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "rgba(139,69,255,0.15)" }} />
            <span className="text-[11px]" style={{ color: "var(--dim)" }}>hoặc</span>
            <div className="flex-1 h-px" style={{ background: "rgba(139,69,255,0.15)" }} />
          </div>

          {/* Demo Login Button */}
          <button
            onClick={handleDemo}
            disabled={loading}
            className="btn btn-secondary w-full justify-center"
            style={{ padding: "12px", fontSize: "13px" }}
          >
            ⚡ Đăng nhập Demo
          </button>

          <div className="mt-5 text-center text-[13px]" style={{ color: "var(--dim)" }}>
            Chưa có tài khoản?{" "}
            <Link href="/register" className="cursor-pointer font-semibold" style={{ color: "var(--c6b)" }}>
              Đăng ký ngay
            </Link>
          </div>
        </div>

        {/* Powered by */}
        <div
          className="mt-4 rounded-[14px] px-4 py-3 text-center text-[11px]"
          style={{
            background: "rgba(0,212,170,0.06)",
            border: "1px solid rgba(0,212,170,0.12)",
            color: "var(--c4)",
            backdropFilter: "blur(12px)",
          }}
        >
          Powered by Polygon · Secured by Supabase
        </div>
      </div>
    </div>
  );
}
