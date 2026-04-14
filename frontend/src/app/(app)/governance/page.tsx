"use client";

import { useTranslation } from "@/hooks/useTranslation";

const proposals = [
  {
    id: "ZGP-009",
    title: "Increase staking reward pool to 350M ZENI",
    status: "voting",
    yesPct: 68,
    noPct: 32,
    yesVotes: "4.2M",
    noVotes: "2.0M",
    timeLeft: "3 days left",
  },
  {
    id: "ZGP-008",
    title: "Reduce gas fee to 0.03 ZENI/tx",
    status: "voting",
    yesPct: 85,
    noPct: 15,
    yesVotes: "6.1M",
    noVotes: "1.1M",
    timeLeft: "5 days left",
  },
  {
    id: "ZGP-007",
    title: "Open Travel Pool for Ruby rank",
    status: "passed",
    yesPct: 92,
    noPct: 8,
    yesVotes: "8.4M",
    noVotes: "0.7M",
    timeLeft: "Ended 01/04",
  },
  {
    id: "ZGP-006",
    title: "Add Biotea84 to affiliate ecosystem",
    status: "passed",
    yesPct: 78,
    noPct: 22,
    yesVotes: "5.6M",
    noVotes: "1.6M",
    timeLeft: "Ended 25/03",
  },
];

export default function GovernancePage() {
  const { t } = useTranslation();
  return (
    <div>
      <div className="section-title">{t('nav_governance')}</div>

      {/* Voting Power */}
      <div className="card" style={{ borderColor: "rgba(139, 69, 255, 0.3)" }}>
        <div className="card-title">{t('gov_voting_power')}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 32, fontWeight: 900, fontFamily: "var(--font-mono)", color: "var(--white)" }}>
            2,100
          </span>
          <span style={{ fontSize: 14, color: "var(--c6b)" }}>vZENI</span>
        </div>
        <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 6 }}>
          KOC Pro 1.5x bonus applied
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--c4)", marginTop: 4 }}>
          = 3,150 effective vZENI
        </div>
      </div>

      {/* DAO Stats */}
      <div className="kpi-grid">
        {[
          { label: "Total Proposals", value: "9" },
          { label: "Active", value: "2" },
          { label: "Passed", value: "7" },
          { label: "Treasury", value: "18.2M" },
        ].map((s) => (
          <div key={s.label} className="kpi-card">
            <div className="kpi-label">{s.label}</div>
            <div className="kpi-value">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Proposals */}
      <div className="card">
        <div className="card-title">{t('gov_proposals_active')}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {proposals.map((p) => (
            <div
              key={p.id}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14,
                padding: 16,
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--c5)" }}>{p.id}</span>
                <span
                  style={{
                    fontSize: 10,
                    padding: "3px 10px",
                    borderRadius: 8,
                    fontWeight: 600,
                    background: p.status === "voting" ? "rgba(0,212,170,0.1)" : "rgba(107,33,240,0.1)",
                    color: p.status === "voting" ? "var(--c4)" : "var(--c6b)",
                  }}
                >
                  {p.status === "voting" ? "Voting" : "Passed"}
                </span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--dim)" }}>{p.timeLeft}</span>
              </div>

              {/* Title */}
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--white)", marginBottom: 12 }}>
                {p.title}
              </div>

              {/* Vote bars */}
              <div style={{ marginBottom: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                  <span style={{ color: "var(--c4)" }}>Yes {p.yesPct}%</span>
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--dim)" }}>{p.yesVotes} vZENI</span>
                </div>
                <div className="prog-track">
                  <div className="prog-fill" style={{ width: `${p.yesPct}%`, background: "var(--c4)" }} />
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
                  <span style={{ color: "var(--red)" }}>No {p.noPct}%</span>
                  <span style={{ fontFamily: "var(--font-mono)", color: "var(--dim)" }}>{p.noVotes} vZENI</span>
                </div>
                <div className="prog-track">
                  <div className="prog-fill" style={{ width: `${p.noPct}%`, background: "var(--red)" }} />
                </div>
              </div>

              {/* Vote button for active */}
              {p.status === "voting" && (
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <button className="btn btn-primary" style={{ flex: 1 }}>Vote</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Create Proposal */}
      <button className="btn btn-secondary" style={{ width: "100%" }}>
        {t('gov_create_proposal')}
      </button>
    </div>
  );
}
