"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

const kpis = [
  { label: "TOTAL STAKED", value: "2,100", sub: "$Zeni", color: "var(--white)" },
  { label: "APY", value: "28%", sub: "365-day pool", color: "var(--c4)" },
  { label: "REWARDS", value: "+245", sub: "$Zeni earned", color: "var(--c4)" },
  { label: "LOCK", value: "90", sub: "days remaining", color: "var(--gold)" },
];

const pools = [
  { name: "Flexible", apy: "12%", lock: "Khong khoa", min: "100", badge: null },
  { name: "90 ngay", apy: "18%", lock: "90 ngay", min: "500", badge: null },
  { name: "180 ngay", apy: "24%", lock: "180 ngay", min: "1,000", badge: null },
  { name: "365 ngay", apy: "28%", lock: "365 ngay", min: "2,000", badge: "Pho bien" },
];

const stakingHistory = [
  { action: "Stake", amount: "2,100 Zeni", pool: "90 ngay @ 18%", date: "15/01/2026", status: "Active", statusClass: "status-released" },
  { action: "Claim", amount: "+145 Zeni", pool: "Rewards claimed", date: "15/03/2026", status: "Completed", statusClass: "status-released" },
  { action: "Stake", amount: "500 Zeni", pool: "Flexible @ 12%", date: "01/12/2025", status: "Unstaked", statusClass: "status-escrow" },
];

export default function StakingPage() {
  const [selectedPool, setSelectedPool] = useState(1);
  const [stakeAmount, setStakeAmount] = useState("");
  const { t } = useTranslation();

  const pool = pools[selectedPool];
  const amount = parseFloat(stakeAmount) || 0;
  const apyNum = parseFloat(pool.apy) / 100;
  const estimatedReward = Math.floor(amount * apyNum);

  return (
    <div>
      {/* KPI Grid */}
      <div className="kpi-grid">
        {kpis.map((k) => (
          <div className="kpi-card" key={k.label}>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 4 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="page-grid">
        {/* ═══ LEFT COLUMN ═══ */}
        <div>
          {/* Pool Selection */}
          <div className="card">
            <div className="card-title">{t('staking_choose_pool')}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {pools.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => setSelectedPool(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: `1px solid ${selectedPool === i ? "var(--c6b)" : "var(--border)"}`,
                    background: selectedPool === i ? "rgba(107,33,240,0.12)" : "rgba(255,255,255,0.04)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: selectedPool === i ? "var(--c6b)" : "var(--white)", display: "flex", alignItems: "center", gap: 8 }}>
                      {p.name}
                      {p.badge && (
                        <span style={{
                          fontSize: 9,
                          padding: "2px 8px",
                          borderRadius: 8,
                          background: "rgba(0,212,170,0.12)",
                          color: "var(--c4)",
                          fontWeight: 600,
                          letterSpacing: 0.5,
                        }}>
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 2 }}>Lock: {p.lock} &middot; Min: {p.min} Zeni</div>
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 800, color: selectedPool === i ? "var(--c4)" : "var(--c6b)" }}>
                    {p.apy}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Current Staking */}
          <div className="card">
            <div className="card-title">{t('staking_staked')}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, rgba(107,33,240,0.2), rgba(0,212,170,0.15))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                📈
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, color: "var(--white)" }}>2,100 Zeni</div>
                <div style={{ fontSize: 11, color: "var(--dim)" }}>Pool 90 ngay @ 18% APY</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div className="stat-mini">
                <div className="stat-mini-label">REWARDS</div>
                <div className="stat-mini-value" style={{ fontSize: 18, color: "var(--c4)" }}>+245</div>
                <div className="stat-mini-sub">Zeni earned</div>
              </div>
              <div className="stat-mini">
                <div className="stat-mini-label">UNLOCK</div>
                <div className="stat-mini-value" style={{ fontSize: 18, color: "var(--gold)" }}>15/04</div>
                <div className="stat-mini-sub">Con 1 ngay</div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ RIGHT COLUMN ═══ */}
        <div>
          {/* Stake Input */}
          <div className="card">
            <div className="card-title">STAKE $ZENI</div>

            {/* Amount Input */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: "var(--dim)", fontFamily: "var(--font-mono)" }}>{t('staking_calc_amount')}</span>
                <span style={{ fontSize: 11, color: "var(--dim)" }}>{t('available')}: 22,750 Zeni</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="0"
                  className="input-field"
                  style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700 }}
                />
                <button
                  onClick={() => setStakeAmount("22750")}
                  className="btn btn-secondary"
                  style={{ fontWeight: 700, letterSpacing: 1 }}
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Reward Calculator */}
            <div style={{
              padding: 16,
              borderRadius: 12,
              background: "rgba(0,212,170,0.06)",
              border: "1px solid rgba(0,212,170,0.18)",
              marginBottom: 16,
            }}>
              <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--c4)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
                {t('staking_calc_yearly')}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 800, color: "var(--c4)" }}>+{estimatedReward.toLocaleString()}</span>
                <span style={{ fontSize: 13, color: "var(--dim)" }}>Zeni / nam</span>
              </div>
              <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 4 }}>
                Pool: {pool.name} &middot; APY: {pool.apy} &middot; Lock: {pool.lock}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center", padding: "12px 20px", fontSize: 14 }}>
                Stake {stakeAmount || "0"} Zeni
              </button>
              <button className="btn btn-ghost" style={{ padding: "12px 20px", fontSize: 14 }}>
                Unstake
              </button>
            </div>
          </div>

          {/* Staking History */}
          <div className="card">
            <div className="card-title">{t('staking_history')}</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Action", "Amount", "Pool", "Date", "Status"].map((h) => (
                      <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: "var(--dim)", fontFamily: "var(--font-mono)", fontWeight: 500 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stakingHistory.map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "10px", color: "var(--white)", fontWeight: 500 }}>{row.action}</td>
                      <td style={{ padding: "10px", fontFamily: "var(--font-mono)", color: row.action === "Claim" ? "var(--c4)" : "var(--white)" }}>{row.amount}</td>
                      <td style={{ padding: "10px", color: "var(--dim)" }}>{row.pool}</td>
                      <td style={{ padding: "10px", fontFamily: "var(--font-mono)", color: "var(--dim)" }}>{row.date}</td>
                      <td style={{ padding: "10px" }}>
                        <span className={`status-tag ${row.statusClass}`}>{row.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
