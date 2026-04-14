"use client";

const badges = [
  { emoji: "\u{1F3C5}", name: "KOC Pro", id: "#SBT-0421", owned: true },
  { emoji: "\u{1F91D}", name: "First Referral", id: "#SBT-0001", owned: true },
  { emoji: "\u{1F525}", name: "7-Day Streak", id: "#SBT-0142", owned: true },
  { emoji: "\u{1F31F}", name: "Pioneer", id: "#SBT-0003", owned: true },
  { emoji: "\u{1F48E}", name: "Diamond", id: "#SBT-???", owned: false },
  { emoji: "\u{1F4E6}", name: "100 Orders", id: "#SBT-???", owned: false },
  { emoji: "\u{1F3C6}", name: "Top GMV", id: "#SBT-???", owned: false },
  { emoji: "\u{1F5F3}", name: "Governance", id: "#SBT-???", owned: false },
];

export default function NftsPage() {
  return (
    <div>
      <div className="section-title">NFT Badges</div>

      {/* Milestone SBT */}
      <div className="card">
        <div className="card-title">Milestone SBT</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
          {badges.map((b, i) => (
            <div key={i} className={`badge-item ${b.owned ? "badge-owned" : ""}`}>
              <div style={{ fontSize: 32, lineHeight: 1 }}>{b.emoji}</div>
              <div className="badge-name">{b.name}</div>
              <div className={`badge-id ${b.owned ? "owned" : "locked"}`}>
                {b.owned ? b.id : "\u{1F512} Locked"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Streak System */}
      <div className="card">
        <div className="card-title">Streak System</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div className="stat-mini" style={{ flex: 1, minWidth: 160 }}>
            <div className="stat-mini-label">Current Streak</div>
            <div className="stat-mini-value" style={{ color: "var(--gold)" }}>
              14 <span style={{ fontSize: 14, color: "var(--dim)" }}>days</span>
            </div>
            <div className="stat-mini-sub">{"\u{1F525}"} Keep going!</div>
          </div>
          <div className="stat-mini" style={{ flex: 1, minWidth: 160 }}>
            <div className="stat-mini-label">Next Reward</div>
            <div className="stat-mini-value" style={{ color: "var(--c4)" }}>30</div>
            <div className="stat-mini-sub">16 days remaining</div>
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
            <span style={{ color: "var(--muted)" }}>Progress to 30-day badge</span>
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--c6b)" }}>14 / 30</span>
          </div>
          <div className="prog-track">
            <div className="prog-fill" style={{ width: "46.7%", background: "linear-gradient(90deg, var(--c6), var(--c4))" }} />
          </div>
        </div>
      </div>

      {/* Contract Info */}
      <div className="card">
        <div className="card-title">Contract Info</div>
        {[
          { key: "Token Standard", val: "ERC-721 SBT" },
          { key: "Network", val: "Polygon Mainnet" },
          { key: "Contract", val: "0xB157...D79D", mono: true },
          { key: "Transferable", val: "No (Soul-bound)" },
          { key: "Owned", val: "4 / 8 badges" },
        ].map((row) => (
          <div key={row.key} className="chain-info-row">
            <span className="cir-key">{row.key}</span>
            <span className={`cir-val ${row.mono ? "purple" : ""}`}>{row.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
