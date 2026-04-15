"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useAffiliateData, useAffiliateStats } from "@/hooks/useOnChain";

function formatZeni(val: string | number): string {
  const n = Number(val);
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

const COMM_TYPE_LABELS: Record<string, string> = {
  f1_direct: "Hoa hong F1",
  group_income: "Revenue Sharing",
  pro_fee_referral: "Gioi thieu Pro",
  ktv_fee_referral: "Gioi thieu KTV",
  ambassador_pool: "Pool Dai Su",
};

export default function AffiliatePage() {
  const [filter, setFilter] = useState<"all" | "released" | "escrow">("all");
  const { address, isConnected } = useAccount();
  const { data: userData, isLoading } = useAffiliateData(address);
  const { data: globalStats } = useAffiliateStats();

  const commissions = userData?.userCommissions ?? [];
  const filtered = commissions.filter((c) => {
    if (filter === "released") return c.released;
    if (filter === "escrow") return !c.released && !c.clawedBack;
    return true;
  });

  return (
    <div>
      <div className="section-title">Affiliate</div>

      {/* Not connected */}
      {!isConnected && (
        <div className="card" style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🤝</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--white)", marginBottom: 6 }}>
            Ket noi wallet de xem hoa hong
          </div>
          <div style={{ fontSize: 12, color: "var(--dim)" }}>
            Affiliate commission duoc luu on-chain minh bach 100%
          </div>
        </div>
      )}

      {/* Global Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 20 }}>
        <div className="kpi-card">
          <div className="kpi-label">Total Escrow</div>
          <div className="kpi-value" style={{ color: "var(--gold)" }}>
            {globalStats ? formatZeni(globalStats.totalEscrow) : "---"}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Released</div>
          <div className="kpi-value" style={{ color: "var(--c4)" }}>
            {globalStats ? formatZeni(globalStats.totalReleased) : "---"}
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Commissions</div>
          <div className="kpi-value">{globalStats?.commissionCount ?? "---"}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Escrow Days</div>
          <div className="kpi-value">{globalStats?.escrowDays ?? "---"}</div>
        </div>
      </div>

      {/* User Commissions */}
      {isConnected && (
        <div className="card">
          <div className="card-title">
            YOUR COMMISSIONS {isLoading && "(Loading...)"}
          </div>

          {/* Filter chips */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {(["all", "released", "escrow"] as const).map((f) => (
              <button
                key={f}
                className={`filter-chip ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "Tat ca" : f === "released" ? "Da nhan" : "Escrow"}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 24, color: "var(--dim)" }}>
              {isLoading ? "Dang tai du lieu tu blockchain..." : "Chua co commission nao"}
            </div>
          ) : (
            filtered.map((c) => (
              <div className="tx-item" key={c.id}>
                <div
                  className="tx-icon"
                  style={{
                    background: c.released
                      ? "rgba(0,212,170,0.12)"
                      : c.clawedBack
                      ? "rgba(224,82,82,0.12)"
                      : "rgba(245,158,11,0.12)",
                  }}
                >
                  {c.released ? "💰" : c.clawedBack ? "↩" : "⏳"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="tx-name">
                    {COMM_TYPE_LABELS[c.commissionType] ?? c.commissionType}
                  </div>
                  <div className="tx-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span>{c.subsidiary}</span>
                    <span
                      className={`status-tag ${
                        c.released ? "status-released" : c.clawedBack ? "status-clawback" : "status-escrow"
                      }`}
                    >
                      {c.released ? "Released" : c.clawedBack ? "Clawback" : "Escrow"}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "right",
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    fontWeight: 600,
                    color: c.released ? "var(--c4)" : "var(--gold)",
                    flexShrink: 0,
                  }}
                >
                  +{formatZeni(c.amount)} ZENI
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Escrow Info */}
      <div className="card">
        <div className="card-title">HOW ESCROW WORKS</div>
        <div className="escrow-banner">
          <span style={{ fontSize: 20, flexShrink: 0 }}>⏳</span>
          <div style={{ fontSize: 13, color: "var(--white)" }}>
            Moi commission duoc hold trong smart contract {globalStats?.escrowDays ?? 7} ngay.
            Sau {globalStats?.escrowDays ?? 7} ngay, bat ky ai cung co the goi release.
            Admin co the clawback truoc khi release neu co gian lan.
          </div>
        </div>
        {[
          { key: "Contract", val: "0x1d59...0714", cls: "purple" },
          { key: "Escrow Period", val: `${globalStats?.escrowDays ?? 7} days` },
          { key: "On-chain", val: "Polygon Mainnet", cls: "green" },
          { key: "Transparency", val: "100% verifiable on Polygonscan" },
        ].map((row) => (
          <div key={row.key} className="chain-info-row">
            <span className="cir-key">{row.key}</span>
            <span className={`cir-val ${row.cls ?? ""}`}>{row.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
