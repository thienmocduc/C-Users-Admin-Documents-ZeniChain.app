"use client";

const walletInfo = [
  { key: "Address", val: "0x76AB...CE91", cls: "blue" },
  { key: "Network", val: "Polygon", cls: "purple" },
  { key: "Chain ID", val: "137", cls: "" },
  { key: "Block Height", val: "4,821,043", cls: "" },
  { key: "Gas Fee", val: "< 0.001 $Zeni", cls: "green" },
  { key: "Custody", val: "Privy MPC", cls: "purple" },
];

const txHistory = [
  { icon: "💰", bg: "rgba(0,212,170,0.12)", name: "Nhan tu Pool T3", meta: "05/04 09:00", amount: "+2,100 Zeni", color: "var(--c4)", tag: "Pool", tagClass: "tag-pool" },
  { icon: "↗", bg: "rgba(224,82,82,0.12)", name: "Gui 500 Zeni", meta: "03/04 16:30", amount: "-500 Zeni", color: "var(--red)", tag: "Transfer", tagClass: "tag-clawback" },
  { icon: "⇄", bg: "rgba(74,141,255,0.12)", name: "Swap USDC → Zeni", meta: "01/04 11:22", amount: "+1,200 Zeni", color: "var(--c4)", tag: "Swap", tagClass: "tag-nft" },
];

export default function WalletPage() {
  return (
    <div className="page-grid">
      {/* ═══ LEFT COLUMN ═══ */}
      <div>
        {/* Balance Card */}
        <div className="balance-hero">
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--dim)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
            $ZENI TOKEN BALANCE
          </div>
          <div className="balance-amount">24,850</div>
          <div className="balance-token">$Zeni Token</div>
          <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 4 }}>~ $573 USD</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
            <div className="stat-mini">
              <div className="stat-mini-label">KHA DUNG</div>
              <div className="stat-mini-value" style={{ fontSize: 18, color: "var(--c4)" }}>22,750</div>
              <div className="stat-mini-sub">Available</div>
            </div>
            <div className="stat-mini">
              <div className="stat-mini-label">STAKING</div>
              <div className="stat-mini-value" style={{ fontSize: 18, color: "var(--gold)" }}>2,100</div>
              <div className="stat-mini-sub">Locked 90 ngay</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 14 }}>
            <button className="btn btn-primary" style={{ justifyContent: "center" }}>↗ Gui</button>
            <button className="btn btn-secondary" style={{ justifyContent: "center" }}>↙ Nhan</button>
            <button className="btn btn-secondary" style={{ justifyContent: "center" }}>⇄ Swap</button>
          </div>
        </div>

        {/* AggLayer Bridge */}
        <div className="card">
          <div className="card-title">AGGLAYER BRIDGE</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div className="stat-mini">
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 16 }}>⟠</span>
                <span style={{ fontSize: 11, color: "var(--dim)" }}>Ethereum</span>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, color: "var(--white)" }}>0.042</div>
              <div style={{ fontSize: 11, color: "var(--dim)" }}>ETH</div>
            </div>
            <div className="stat-mini">
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 16 }}>💲</span>
                <span style={{ fontSize: 11, color: "var(--dim)" }}>Polygon</span>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, color: "var(--white)" }}>125.50</div>
              <div style={{ fontSize: 11, color: "var(--dim)" }}>USDC</div>
            </div>
          </div>
          <button className="btn btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
            🌉 Mo AggLayer Bridge
          </button>
        </div>
      </div>

      {/* ═══ RIGHT COLUMN ═══ */}
      <div>
        {/* Wallet Info */}
        <div className="card">
          <div className="card-title">THONG TIN VI</div>
          {walletInfo.map((item) => (
            <div className="chain-info-row" key={item.key}>
              <span className="cir-key">{item.key}</span>
              <span className={`cir-val ${item.cls}`}>{item.val}</span>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button className="btn btn-secondary" style={{ flex: 1, justifyContent: "center" }}>Polygonscan</button>
            <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center" }}>Export Key</button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="card">
          <div className="card-title">LICH SU GIAO DICH VI</div>
          {txHistory.map((tx, i) => (
            <div className="tx-item" key={i}>
              <div className="tx-icon" style={{ background: tx.bg }}>{tx.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="tx-name">{tx.name}</div>
                <div className="tx-meta" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span>{tx.meta}</span>
                  <span className={`tx-tag-chip ${tx.tagClass}`}>{tx.tag}</span>
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
