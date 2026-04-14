"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

export default function RegisterPage() {
  const router = useRouter();
  const loginDemo = useAuthStore((s) => s.loginDemo);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (form.name && form.email && form.password) {
      loginDemo();
      router.push("/dashboard");
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
            Tạo tài khoản
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
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="input-label">Họ và tên</label>
              <input
                type="text"
                value={form.name}
                onChange={update("name")}
                placeholder="Nguyễn Văn A"
                className="input-field"
              />
            </div>

            <div className="mb-3">
              <label className="input-label">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={update("email")}
                placeholder="email@example.com"
                className="input-field"
              />
            </div>

            <div className="mb-3">
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
              className="mb-4 rounded-[10px] px-3 py-3 text-[12px]"
              style={{
                background: "rgba(0,212,170,0.06)",
                border: "1px solid rgba(0,212,170,0.15)",
                color: "var(--c4)",
              }}
            >
              ✓ Tạo Zeni ID — dùng được toàn bộ hệ sinh thái Zeni Holdings
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full justify-center"
              style={{ padding: "14px", fontSize: "15px" }}
            >
              Tạo tài khoản →
            </button>
          </form>

          <div className="mt-[14px] text-center text-[13px]" style={{ color: "var(--dim)" }}>
            Đã có tài khoản?{" "}
            <Link href="/login" className="cursor-pointer font-medium" style={{ color: "var(--c6b)" }}>
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
