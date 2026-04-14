"use client";

import { useState } from "react";

const incomeRows = [
  { label: "F1 Truc tiep", amount: "1.2M", pct: 46, color: "var(--c4)" },
  { label: "Revenue Sharing", amount: "480K", pct: 18, color: "var(--c5)" },
  { label: "Pro Ref", amount: "320K", pct: 12, color: "var(--c6b)" },
  { label: "KTV Ref", amount: "180K", pct: 7, color: "var(--c7)" },
  { label: "Pool", amount: "420K", pct: 16, color: "var(--gold)" },
];

const filters = ["All", "F1", "Group", "Pro", "KTV", "Pool"];

const commissionHistory = [
  { icon: "💰", bg: "rgba(0,212,170,0.12)", name: "F1 - Don #A4821 - Le Minh", meta: "11/04 14:23", amount: "+750 Zeni", color: "var(--c4)", status: "Released", statusClass: "status-released" },
  { icon: "👥", bg: "rgba(107,33,240,0.12)", name: "Revenue sharing - Tran Linh", meta: "11/04 10:00", amount: "+320 Zeni", color: "var(--c4)", status: "Released", statusClass: "status-released" },
  { icon: "⏳", bg: "rgba(245,158,11,0.12)", name: "KTV Fee ref - Nguyen Hoa", meta: "02/04", amount: "+3,000 Zeni", color: "var(--gold)", status: "Escrow", statusClass: "status-escrow" },
  { icon: "🏆", bg: "rgba(74,141,255,0.12)", name: "Pool Dai Su T3/2026", meta: "05/04", amount: "+2,100 Zeni", color: "var(--c4)", status: "Released", statusClass: "status-released" },
  { icon: "👤", bg: "rgba(0,212,170,0.12)", name: "Pro ref - Hoang Nam", meta: "01/04", amount: "+110 Zeni", color: "var(--c4)", status: "Released", statusClass: "status-released" },
];

export default function AffiliatePage() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="page-grid">
      {/* ═══ LEFT COLUMN ═══ */}
      <div>
        {/* Rank Hero */}
        <div className="rank-hero">
          <div style={{ fontSize: 11, color: "rgba(240,244,255,0.4)", letterSpacing: 2, textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
            RANK HIEN TAI
          </div>
          <div style={{ fontSize: 42, marginBottom: 4 }}>👑</div>
          <div className="rank-name" style={{ fontSize: 26 }}>KOC Pro</div>
          <div className="rank-sub">Tra phi 19$/thang &middot; Het han 11/05/2026</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <span className="rank-pill">F1 30%</span>
            <span className="rank-pill">Group 20%</span>
            <span className="rank-pill" style={{ color: "var(--c4)", borderColor: "rgba(0,212,170,0.25)", background: "rgba(0,212,170,0.1)" }}>GMV 45.2tr</span>
          </div>
        </div>

        {/* Affiliate Code */}
        <div className="aff-code-wrap">
          <div className="aff-code-label">MA GIOI THIEU</div>
          <div className="aff-code-text">ANIMA-DUC-4821</div>
          <button className="btn btn-secondary" style={{ marginTop: 12, width: "100%", justifyContent: "center", fontSize: 12 }}>
            📋 Copy link gioi thieu
          </button>
        </div>

        {/* Team Stats */}
        <div className="card">
          <div className="card-title">DOI NHOM</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div className="stat-mini">
              <div className="stat-mini-label">TONG F1</div>
              <div className="stat-mini-value" style={{ fontSize: 20 }}>12</div>
              <div className="stat-mini-sub">8 active</div>
            </div>
            <div className="stat-mini">
              <div className="stat-mini-label">STREAK</div>
              <div className="stat-mini-value" style={{ fontSize: 20 }}>14</div>
              <div className="stat-mini-sub" style={{ color: "var(--c4)" }}>+2% F1 bonus</div>
            </div>
          </div>

          {/* Ambassador Progress */}
          <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--dim)", fontFamily: "var(--font-mono)", marginBottom: 10 }}>
            TIEN DO DAI SU
          </div>
          {[
            { label: "Team A GMV", val: "180tr / 250tr", pct: 72, color: "var(--c6b)" },
            { label: "Team B GMV", val: "95tr / 250tr", pct: 38, color: "var(--c5)" },
          ].map((p) => (
            <div key={p.label} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 12 }}>
                <span style={{ color: "var(--muted)" }}>{p.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--white)" }}>{p.val}</span>
              </div>
              <div className="prog-track">
                <div className="prog-fill" style={{ width: `${p.pct}%`, background: p.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ RIGHT COLUMN ═══ */}
      <div>
        {/* Escrow Banner */}
        <div className="escrow-banner">
          <span style={{ fontSize: 20 }}>⏳</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--gold)" }}>850K Zeni dang trong escrow</div>
            <div style={{ fontSize: 11, color: "var(--dim)" }}>Tu dong release sau 7 ngay xac nhan</div>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--gold)", flexShrink: 0 }}>Release: 20/04</div>
        </div>

        {/* Monthly Income Breakdown */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div className="card-title" style={{ marginBottom: 0 }}>THU NHAP THANG 04/2026</div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700, color: "var(--white)" }}>2.6M</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {incomeRows.map((row) => (
              <div key={row.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 6, height: 6, borderRadius: 3, background: row.color, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "var(--muted)", flex: 1, minWidth: 0 }}>{row.label}</span>
                <div style={{ width: 100, flexShrink: 0 }}>
                  <div className="prog-track" style={{ height: 5 }}>
                    <div className="prog-fill" style={{ width: `${row.pct}%`, background: row.color }} />
                  </div>
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: "var(--white)", width: 60, textAlign: "right", flexShrink: 0 }}>{row.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Commission History */}
        <div className="card">
          <div className="card-title">LICH SU HOA HONG</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
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
          {commissionHistory.map((tx, i) => (
            <div className="tx-item" key={i}>
              <div className="tx-icon" style={{ background: tx.bg }}>{tx.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="tx-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tx.name}</div>
                <div className="tx-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span>{tx.meta}</span>
                  <span className={`status-tag ${tx.statusClass}`}>{tx.status}</span>
                </div>
              </div>
              <div style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600, color: tx.color, flexShrink: 0 }}>
                {tx.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
