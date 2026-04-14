"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const recentTx = [
  { icon: "💰", bg: "rgba(0,212,170,0.12)", name: "Hoa hong F1 - don #A4821", meta: "Hom nay 14:23", amount: "+750 Zeni", amountColor: "var(--c4)", status: "Released", statusClass: "status-released" },
  { icon: "🏆", bg: "rgba(107,33,240,0.12)", name: "Pool Dai Su thang 3/2026", meta: "05/04 09:00", amount: "+2,100 Zeni", amountColor: "var(--c4)", status: "Released", statusClass: "status-released" },
  { icon: "⏳", bg: "rgba(245,158,11,0.12)", name: "Gioi thieu KTV - Nguyen Hoa", meta: "02/04", amount: "+3,000 Zeni", amountColor: "var(--gold)", status: "Escrow", statusClass: "status-escrow" },
  { icon: "🎫", bg: "rgba(74,141,255,0.12)", name: "Mint NFT Voucher ANIMA 40%", meta: "03/04 11:15", amount: "-2,000 XP", amountColor: "var(--red)", status: "On-chain", statusClass: "status-released" },
  { icon: "👤", bg: "rgba(0,212,170,0.12)", name: "Gioi thieu Pro - Tran Linh", meta: "01/04", amount: "+110 Zeni", amountColor: "var(--c4)", status: "Released", statusClass: "status-released" },
];

const stats = [
  { label: "ANIMA XP", value: "48,200", sub: "+350 hom nay", color: "var(--c4)" },
  { label: "HOA HONG THANG", value: "3.2M", sub: "+18% vs T3", color: "var(--c4)" },
  { label: "ESCROW", value: "850K", sub: "Release 20/04", color: "var(--gold)" },
  { label: "NFT VOUCHER", value: "3", sub: "2 active", color: "var(--c5)" },
];

const actions = [
  { icon: "↗", label: "Send" },
  { icon: "↙", label: "Receive" },
  { icon: "⇄", label: "Swap" },
  { icon: "🌉", label: "Bridge" },
];

export default function DashboardPage() {
  const { t } = useTranslation();
  return (
    <div className="page-grid">
      {/* ═══ LEFT COLUMN ═══ */}
      <div>
        {/* Balance Hero */}
        <div className="balance-hero">
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--dim)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
            {t('total_assets')}
          </div>
          <div className="balance-amount">24,850</div>
          <div className="balance-token">$Zeni Token</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 12, color: "var(--dim)" }}>~ $573 USD</span>
            <span style={{ fontSize: 12, color: "var(--c4)", fontFamily: "var(--font-mono)" }}>+2.4%</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
          {actions.map((a) => (
            <button key={a.label} className="btn" style={{ flexDirection: "column", justifyContent: "center", padding: "12px 8px", gap: 4, fontSize: 11 }}>
              <span style={{ fontSize: 18 }}>{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>

        {/* Stats 2x2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {stats.map((s) => (
            <div className="stat-mini" key={s.label}>
              <div className="stat-mini-label">{s.label}</div>
              <div className="stat-mini-value">{s.value}</div>
              <div className="stat-mini-sub" style={{ color: s.color }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ RIGHT COLUMN ═══ */}
      <div>
        {/* Recent Transactions */}
        <div className="card">
          <div className="card-title">{t('onchain_tx_history')}</div>
          {recentTx.map((tx, i) => (
            <div className="tx-item" key={i}>
              <div className="tx-icon" style={{ background: tx.bg }}>{tx.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="tx-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tx.name}</div>
                <div className="tx-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span>{tx.meta}</span>
                  <span className={`status-tag ${tx.statusClass}`}>{tx.status}</span>
                </div>
              </div>
              <div style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600, color: tx.amountColor, flexShrink: 0 }}>
                {tx.amount}
              </div>
            </div>
          ))}
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <button className="btn-ghost btn" style={{ fontSize: 12 }}>{t('see_all')}</button>
          </div>
        </div>

        {/* Rank Card */}
        <div className="card" style={{ marginTop: 16 }}>
          <div className="card-title">{t('dash_rank_title')}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, rgba(107,33,240,0.2), rgba(139,69,255,0.15))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
              👑
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "var(--white)" }}>KOC Pro</div>
              <div style={{ fontSize: 12, color: "var(--dim)" }}>Tra phi 19$/thang &middot; Het han 11/05/2026</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            <span className="rank-pill">F1: 30%</span>
            <span className="rank-pill">Nhom: 20%</span>
            <span className="rank-pill" style={{ color: "var(--c4)", borderColor: "rgba(0,212,170,0.25)", background: "rgba(0,212,170,0.1)" }}>GMV: 45.2tr</span>
          </div>
        </div>

        {/* Ambassador Progress */}
        <div className="card" style={{ marginTop: 16 }}>
          <div className="card-title">{t('dash_progress_title')}</div>
          {[
            { label: "Team A GMV", val: "180tr / 250tr", pct: 72, color: "var(--c6b)" },
            { label: "Team B GMV", val: "95tr / 250tr", pct: 38, color: "var(--c5)" },
          ].map((p) => (
            <div key={p.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
                <span style={{ color: "var(--muted)" }}>{p.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--white)" }}>{p.val} ({p.pct}%)</span>
              </div>
              <div className="prog-track">
                <div className="prog-fill" style={{ width: `${p.pct}%`, background: `linear-gradient(90deg, ${p.color}, ${p.color}88)` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
