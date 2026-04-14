"use client";

import { useState } from "react";

const filters = ["All", "Wellness", "Product", "Training", "Food"];

const vouchers = [
  { emoji: "🏥", merchant: "ANIMA Care Ha Noi", desc: "Trung tam chua lanh - 98 Hoang Quoc Viet", discount: "40%", xp: "2,000", remaining: "48/100", category: "Wellness" },
  { emoji: "💊", merchant: "ANIMA 119 - 1 hop", desc: "San pham ANIMA 119 - Mua truc tiep", discount: "25%", xp: "1,000", remaining: "92/200", category: "Product" },
  { emoji: "🎓", merchant: "Khoa Dao Tao KTV", desc: "ANIMA Care Academy - 1 thang FREE", discount: "FREE", xp: "3,000", remaining: "5/20", category: "Training" },
  { emoji: "🌿", merchant: "Thao Moc Nhiet Khai Mach", desc: "ANIMA Care - Dich vu 60 phut", discount: "35%", xp: "1,500", remaining: "75/100", category: "Wellness" },
];

const holdingVouchers = [
  { name: "ANIMA Care - 40% OFF", tokenId: "#NFT-4821", mint: "03/04/2026", expiry: "03/05/2026", daysLeft: 19, totalDays: 30, pct: 63 },
  { name: "ANIMA 119 - 25% OFF", tokenId: "#NFT-3912", mint: "28/03/2026", expiry: "12/04/2026", daysLeft: 0, totalDays: 15, pct: 0 },
];

const xpGuide = [
  { action: "Mua don hang ANIMA", xp: "+100 XP / don", icon: "🛒" },
  { action: "GMV tich luy 10tr", xp: "+500 XP", icon: "📊" },
  { action: "Gioi thieu KTV", xp: "+300 XP", icon: "👥" },
  { action: "Gioi thieu Pro Ref", xp: "+200 XP", icon: "🤝" },
  { action: "Thang hang Rank", xp: "+1,000 XP", icon: "🏆" },
];

export default function VoucherPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div>
      {/* XP Balance */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--dim)", fontFamily: "var(--font-mono)" }}>XP KHA DUNG</div>
          <div style={{ fontSize: 32, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--white)" }}>
            12,480 <span style={{ fontSize: 14, color: "var(--gold)" }}>XP</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {filters.map((f) => (
            <button
              key={f}
              className={`filter-chip ${activeFilter === f ? "active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Voucher Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14, marginBottom: 24 }}>
        {vouchers.map((v, i) => (
          <div className="card" key={i} style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(107,33,240,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                {v.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--white)" }}>{v.merchant}</div>
                <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 2 }}>{v.desc}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{
                padding: "6px 14px",
                borderRadius: 10,
                background: "linear-gradient(135deg, rgba(0,212,170,0.15), rgba(0,212,170,0.05))",
                border: "1px solid rgba(0,212,170,0.3)",
                fontFamily: "var(--font-mono)",
                fontSize: 20,
                fontWeight: 800,
                color: "var(--c4)"
              }}>
                {v.discount}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600, color: "var(--gold)" }}>{v.xp} XP</div>
                <div style={{ fontSize: 10, color: "var(--dim)" }}>Con {v.remaining}</div>
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              🎫 Mint NFT Voucher
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Row: Holding + XP Guide */}
      <div className="page-grid">
        {/* Holding Vouchers */}
        <div className="card">
          <div className="card-title">NFT VOUCHER DANG GIU</div>
          {holdingVouchers.map((v, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 14,
              marginBottom: i < holdingVouchers.length - 1 ? 10 : 0,
              opacity: v.daysLeft === 0 ? 0.45 : 1,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--white)" }}>{v.name}</div>
                  <div style={{ fontSize: 10, color: "var(--dim)", fontFamily: "var(--font-mono)" }}>{v.tokenId}</div>
                </div>
                {v.daysLeft > 0 ? (
                  <button className="btn btn-secondary" style={{ padding: "6px 14px", fontSize: 11 }}>Su dung</button>
                ) : (
                  <span style={{ fontSize: 11, color: "var(--red)", fontWeight: 600 }}>Het han</span>
                )}
              </div>
              {v.daysLeft > 0 && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 5 }}>
                    <span style={{ color: "var(--dim)" }}>Con {v.daysLeft} ngay</span>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--c4)" }}>{v.pct}%</span>
                  </div>
                  <div className="prog-track">
                    <div className="prog-fill" style={{ width: `${v.pct}%`, background: "var(--c4)" }} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* XP Earn Guide */}
        <div className="card">
          <div className="card-title">XP EARN GUIDE</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {xpGuide.map((item) => (
              <div key={item.action} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize: 18, width: 32, textAlign: "center" }}>{item.icon}</span>
                <span style={{ flex: 1, fontSize: 12, color: "var(--muted)" }}>{item.action}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: "var(--c4)" }}>{item.xp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
