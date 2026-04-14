"use client";

import { useState } from "react";

export default function AdminPage() {
  const [challengeName, setChallengeName] = useState("");
  const [challengeReward, setChallengeReward] = useState("");
  const [challengeDuration, setChallengeDuration] = useState("24");
  const [clawbackAddr, setClawbackAddr] = useState("");
  const [clawbackAmt, setClawbackAmt] = useState("");
  const [escrowOnly, setEscrowOnly] = useState(true);

  return (
    <div>
      <div className="section-title">Admin Panel</div>

      {/* Danger Warning */}
      <div className="escrow-banner" style={{ background: "rgba(224,82,82,0.08)", borderColor: "rgba(224,82,82,0.22)" }}>
        <span style={{ fontSize: 18 }}>{"\u26A0\uFE0F"}</span>
        <span style={{ fontSize: 12, color: "var(--red)" }}>
          Admin-only area. All actions are recorded on-chain and irreversible.
        </span>
      </div>

      <div className="page-grid">
        {/* Left column */}
        <div>
          {/* Performance Fund Config */}
          <div className="card">
            <div className="card-title">Performance Fund Config</div>
            {[
              { key: "Min threshold", val: "250,000,000 VND" },
              { key: "Pool rate", val: "2% GMV" },
              { key: "Active Ambassadors", val: "12" },
              { key: "Distribution", val: "Monthly" },
            ].map((row) => (
              <div key={row.key} className="chain-info-row">
                <span className="cir-key">{row.key}</span>
                <span className="cir-val">{row.val}</span>
              </div>
            ))}
          </div>

          {/* Asset Fund Config */}
          <div className="card">
            <div className="card-title">Asset Fund Config</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { pool: "Housing", rate: "0.5%", icon: "\u{1F3E0}" },
                { pool: "Car", rate: "0.3%", icon: "\u{1F697}" },
                { pool: "Travel", rate: "0.2%", icon: "\u2708\uFE0F" },
                { pool: "Career", rate: "1.0%", icon: "\u{1F4BC}" },
              ].map((p) => (
                <div key={p.pool} className="pool-card">
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{p.icon}</div>
                  <div className="pool-name">{p.pool}</div>
                  <div className="pool-pct">{p.rate}</div>
                  <div className="pool-cond">of GMV</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Flash Challenge Creator */}
          <div className="card">
            <div className="card-title">Flash Challenge Creator</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label className="input-label">Challenge Name</label>
                <input
                  className="input-field"
                  placeholder="e.g. Weekend Flash Sale"
                  value={challengeName}
                  onChange={(e) => setChallengeName(e.target.value)}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label className="input-label">Reward (ZENI)</label>
                  <input
                    className="input-field"
                    type="number"
                    placeholder="1000"
                    value={challengeReward}
                    onChange={(e) => setChallengeReward(e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Duration</label>
                  <select
                    className="input-field"
                    value={challengeDuration}
                    onChange={(e) => setChallengeDuration(e.target.value)}
                  >
                    <option value="6">6 hours</option>
                    <option value="12">12 hours</option>
                    <option value="24">24 hours</option>
                    <option value="48">48 hours</option>
                    <option value="72">72 hours</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: "100%" }}>Deploy Challenge</button>
            </div>
          </div>

          {/* Clawback Tool */}
          <div className="card" style={{ borderColor: "rgba(224,82,82,0.25)" }}>
            <div className="card-title" style={{ color: "rgba(224,82,82,0.6)" }}>Clawback Tool</div>
            <div
              style={{
                background: "rgba(224,82,82,0.08)",
                border: "1px solid rgba(224,82,82,0.2)",
                borderRadius: 10,
                padding: "10px 14px",
                fontSize: 11,
                color: "var(--red)",
                marginBottom: 14,
              }}
            >
              Clawback only applies to commissions in escrow (7-day hold). Released funds cannot be clawed back.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label className="input-label">Address / User ID</label>
                <input
                  className="input-field"
                  placeholder="0x... or user ID"
                  value={clawbackAddr}
                  onChange={(e) => setClawbackAddr(e.target.value)}
                />
              </div>
              <div>
                <label className="input-label">Amount (VND)</label>
                <input
                  className="input-field"
                  type="number"
                  placeholder="0"
                  value={clawbackAmt}
                  onChange={(e) => setClawbackAmt(e.target.value)}
                />
              </div>
              <div className="toggle-row" style={{ borderBottom: "none", padding: "4px 0" }}>
                <div className="toggle-info">
                  <div className="toggle-label">Escrow-only</div>
                  <div className="toggle-sub">Only claw back funds still in escrow</div>
                </div>
                <div
                  className={`toggle-switch ${escrowOnly ? "on" : ""}`}
                  onClick={() => setEscrowOnly(!escrowOnly)}
                >
                  <div className="toggle-thumb" />
                </div>
              </div>
              <button
                className="btn"
                style={{
                  width: "100%",
                  background: "rgba(224,82,82,0.15)",
                  color: "var(--red)",
                  borderColor: "rgba(224,82,82,0.3)",
                }}
              >
                Execute Clawback
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
