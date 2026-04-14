"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!emailOrPhone || !password) {
      setError("Vui lòng nhập email/SĐT và mật khẩu.");
      return;
    }
    const success = login(emailOrPhone, password);
    if (success) {
      router.push("/dashboard");
    } else {
      setError("Sai email/SĐT hoặc mật khẩu. Vui lòng thử lại.");
    }
  }

  return (
    <div
      className="flex min-h-dvh items-center justify-center px-4"
      style={{ background: "var(--bg)" }}
    >
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="mb-6 text-center">
          <div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center text-[20px] font-black text-white"
            style={{
              background: "linear-gradient(135deg, #00D4AA, #4A8DFF, #6B21F0, #C084FC)",
              clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
            }}
          >
            Z
          </div>
          <h1 className="text-[20px] font-bold" style={{ color: "var(--white)" }}>
            Đăng nhập
          </h1>
        </div>

        {/* Card */}
        <div
          className="rounded-[20px] p-7"
          style={{
            background: "var(--bg2)",
            border: "1px solid var(--border2)",
          }}
        >
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="input-label">Email / Số điện thoại</label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="email@example.com"
                className="input-field"
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
                onKeyDown={(e) => { if (e.key === "Enter") handleLogin(e); }}
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
              className="btn btn-primary w-full justify-center"
              style={{ padding: "14px", fontSize: "15px" }}
            >
              Đăng nhập →
            </button>
          </form>

          <div className="mt-[14px] text-center text-[13px]" style={{ color: "var(--dim)" }}>
            Chưa có tài khoản?{" "}
            <Link href="/register" className="cursor-pointer font-medium" style={{ color: "var(--c6b)" }}>
              Đăng ký ngay
            </Link>
          </div>

          <div
            className="mt-4 rounded-[10px] px-3 py-3 text-center text-[11px]"
            style={{
              background: "rgba(0,212,170,0.06)",
              color: "var(--c4)",
            }}
          >
            Demo: duc@zeni.holdings / Zeni@2026
          </div>
        </div>
      </div>
    </div>
  );
}
