"use client";

import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed / running as standalone
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsStandalone(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setInstalled(true);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setInstalled(true);
    }
    setDeferredPrompt(null);
  }

  if (isStandalone) {
    return (
      <div className="card">
        <div className="card-title">CÀI ĐẶT APP</div>
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-[18px]"
            style={{ background: "rgba(0,212,170,0.12)" }}
          >
            ✅
          </div>
          <div>
            <div className="text-[13px] font-semibold" style={{ color: "var(--white)" }}>
              App đã được cài đặt
            </div>
            <div className="text-[11px]" style={{ color: "var(--dim)" }}>
              Bạn đang sử dụng Zeni Chain dạng standalone app
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (installed) {
    return (
      <div className="card">
        <div className="card-title">CÀI ĐẶT APP</div>
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-[18px]"
            style={{ background: "rgba(0,212,170,0.12)" }}
          >
            ✅
          </div>
          <div>
            <div className="text-[13px] font-semibold" style={{ color: "var(--white)" }}>
              Cài đặt thành công!
            </div>
            <div className="text-[11px]" style={{ color: "var(--dim)" }}>
              Zeni Chain đã được thêm vào màn hình chính
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-title">CÀI ĐẶT APP</div>
      <div className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-[20px] font-black text-white"
          style={{
            background: "linear-gradient(135deg, #00D4AA, #4A8DFF, #6B21F0, #C084FC)",
            clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
          }}
        >
          Z
        </div>
        <div className="flex-1">
          <div className="mb-1 text-[14px] font-semibold" style={{ color: "var(--white)" }}>
            Cài đặt Zeni Chain App
          </div>
          <div className="mb-3 text-[12px] leading-[1.6]" style={{ color: "var(--muted)" }}>
            Thêm vào màn hình chính để truy cập nhanh như app native. Không cần tải từ App Store.
          </div>
          <div className="flex gap-2">
            {deferredPrompt ? (
              <button
                className="btn btn-primary"
                style={{ padding: "8px 20px", fontSize: "12px" }}
                onClick={handleInstall}
              >
                📲 Cài đặt ngay
              </button>
            ) : (
              <div className="text-[11px] leading-[1.6]" style={{ color: "var(--dim)" }}>
                <strong>Cách cài đặt:</strong>
                <br />
                • <strong>iPhone/iPad:</strong> Safari → Chia sẻ → Thêm vào MH chính
                <br />
                • <strong>Android:</strong> Chrome → Menu ⋮ → Cài đặt ứng dụng
                <br />
                • <strong>Desktop:</strong> Chrome → Thanh địa chỉ → icon cài đặt ⊕
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
