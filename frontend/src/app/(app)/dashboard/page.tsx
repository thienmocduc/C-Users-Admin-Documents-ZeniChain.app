"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { useAccount } from "wagmi";
import { useZeniBalance, useAffiliateStats, useBadgeStats } from "@/hooks/useOnChain";
import { ZENI_PRICE_USD } from "@/lib/contracts";

function formatNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return n.toLocaleString();
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

const recentTx = [
  { icon: "💰", bg: "rgba(0,212,170,0.12)", name: "Hoa hong F1 - don #A4821", meta: "Hom nay 14:23", amount: "+750 Zeni", amountColor: "var(--c4)", status: "Released", statusClass: "status-released" },
  { icon: "🏆", bg: "rgba(107,33,240,0.12)", name: "Pool Dai Su thang 3/2026", meta: "05/04 09:00", amount: "+2,100 Zeni", amountColor: "var(--c4)", status: "Released", statusClass: "status-released" },
  { icon: "⏳", bg: "rgba(245,158,11,0.12)", name: "Gioi thieu KTV - Nguyen Hoa", meta: "02/04", amount: "+3,000 Zeni", amountColor: "var(--gold)", status: "Escrow", statusClass: "status-escrow" },
  { icon: "🎫", bg: "rgba(74,141,255,0.12)", name: "Mint NFT Voucher ANIMA 40%", meta: "03/04 11:15", amount: "-2,000 XP", amountColor: "var(--red)", status: "On-chain", statusClass: "status-released" },
  { icon: "👤", bg: "rgba(0,212,170,0.12)", name: "Gioi thieu Pro - Tran Linh", meta: "01/04", amount: "+110 Zeni", amountColor: "var(--c4)", status: "Released", statusClass: "status-released" },
];

// Stats will be computed from on-chain data inside the component

const actions = [
  { icon: "↗", label: "Send" },
  { icon: "↙", label: "Receive" },
  { icon: "⇄", label: "Swap" },
  { icon: "🌉", label: "Bridge" },
];

export default function DashboardPage() {
  const { t } = useTranslation();
  const { address, isConnected } = useAccount();
  const { data: balanceData, isLoading: balLoading } = useZeniBalance(address);
  const { data: affStats } = useAffiliateStats();
  const { data: badgeStats } = useBadgeStats();

  const balance = balanceData ? Number(balanceData.balance) : 0;
  const usdValue = balance * ZENI_PRICE_USD;

  return (
    <div className="page-grid">
      {/* ═══ LEFT COLUMN ═══ */}
      <div>
        {/* Balance Hero */}
        <div className="balance-hero">
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--dim)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
            {t('total_assets')}
          </div>
          {!isConnected ? (
            <div style={{ padding: "12px 0" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "var(--white)", fontFamily: "var(--font-mono)" }}>---</div>
              <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 4 }}>Ket noi wallet de xem balance</div>
            </div>
          ) : balLoading ? (
            <div style={{ padding: "12px 0" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "var(--dim)", fontFamily: "var(--font-mono)" }}>Loading...</div>
            </div>
          ) : (
            <>
              <div className="balance-amount">{formatNum(balance)}</div>
              <div className="balance-token">$Zeni Token</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <span style={{ fontSize: 12, color: "var(--dim)" }}>~ ${usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD</span>
              </div>
            </>
          )}
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

        {/* Stats 2x2 — On-chain data */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div className="stat-mini">
            <div className="stat-mini-label">TOTAL ESCROW</div>
            <div className="stat-mini-value">{affStats ? formatNum(Number(affStats.totalEscrow)) : "---"}</div>
            <div className="stat-mini-sub" style={{ color: "var(--gold)" }}>$ZENI in escrow</div>
          </div>
          <div className="stat-mini">
            <div className="stat-mini-label">TOTAL RELEASED</div>
            <div className="stat-mini-value">{affStats ? formatNum(Number(affStats.totalReleased)) : "---"}</div>
            <div className="stat-mini-sub" style={{ color: "var(--c4)" }}>$ZENI paid out</div>
          </div>
          <div className="stat-mini">
            <div className="stat-mini-label">COMMISSIONS</div>
            <div className="stat-mini-value">{affStats?.commissionCount ?? "---"}</div>
            <div className="stat-mini-sub" style={{ color: "var(--c5)" }}>Total on-chain</div>
          </div>
          <div className="stat-mini">
            <div className="stat-mini-label">NFT BADGES</div>
            <div className="stat-mini-value">{badgeStats?.totalMinted ?? "---"}</div>
            <div className="stat-mini-sub" style={{ color: "var(--c6b)" }}>SBT minted</div>
          </div>
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
