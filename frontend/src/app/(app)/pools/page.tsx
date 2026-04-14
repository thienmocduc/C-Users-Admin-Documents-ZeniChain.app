"use client";

const ambassadorPools = [
  { emoji: "🌟", name: "Dai Su", pct: "2%", cond: "2 team >= 250tr/team" },
  { emoji: "🥈", name: "Silver", pct: "2%", cond: "2 team >= 500tr/team" },
  { emoji: "🥇", name: "Gold", pct: "2%", cond: "2 team >= 1ty/team" },
  { emoji: "💎", name: "Diamond", pct: "2%", cond: "2 team >= 2ty/team" },
  { emoji: "🦅", name: "Phuong Hoang", pct: "2%", cond: "2 team >= 5ty/team" },
  { emoji: "🐉", name: "Thien Long", pct: "2%", cond: "2 team >= 10ty/team" },
];

const careerPools = [
  { emoji: "🏠", name: "Housing Fund", pct: "3%", cond: "Rank Diamond+" },
  { emoji: "🚗", name: "Car Fund", pct: "3%", cond: "Rank Phuong Hoang+" },
  { emoji: "✈️", name: "Travel Fund", pct: "3%", cond: "Rank Thien Long" },
];

const globalInfo = [
  { key: "Tong quy Performance", val: "2% x 6 pool = 12% GMV" },
  { key: "Tong quy Career", val: "3% x 3 pool = 9% GMV" },
  { key: "GMV he thong T4/2026", val: "45.2 ty VND", cls: "green" },
  { key: "Pool T4 du kien", val: "~9.5 ty VND", cls: "purple" },
  { key: "So Dai Su hien tai", val: "12 nguoi" },
  { key: "Chia deu moi pool", val: "Theo ty le ca nhan" },
];

export default function PoolsPage() {
  return (
    <div>
      {/* Performance Fund */}
      <div className="pool-section-wrap">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--dim)", fontFamily: "var(--font-mono)", marginBottom: 4 }}>
              PERFORMANCE FUND
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--white)" }}>
              Pool <span className="grad-text">Dai Su</span>
            </div>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--c6b)" }}>6 levels</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
          {ambassadorPools.map((pool) => (
            <div className="pool-card" key={pool.name}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{pool.emoji}</div>
              <div className="pool-name">{pool.name}</div>
              <div className="pool-pct">{pool.pct} GMV</div>
              <div className="pool-cond">{pool.cond}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Career Dedication Fund */}
      <div className="pool-section-wrap">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--dim)", fontFamily: "var(--font-mono)", marginBottom: 4 }}>
              CAREER DEDICATION FUND
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--white)" }}>
              Quy <span className="grad-text">Su Nghiep</span>
            </div>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--c6b)" }}>3 levels</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
          {careerPools.map((pool) => (
            <div className="pool-card" key={pool.name}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{pool.emoji}</div>
              <div className="pool-name">{pool.name}</div>
              <div className="pool-pct">{pool.pct} GMV</div>
              <div className="pool-cond">{pool.cond}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Pool Info */}
      <div className="card">
        <div className="card-title">THONG TIN POOL TOAN CAU</div>
        {globalInfo.map((item) => (
          <div className="chain-info-row" key={item.key}>
            <span className="cir-key">{item.key}</span>
            <span className={`cir-val ${item.cls || ""}`}>{item.val}</span>
          </div>
        ))}

        {/* Progress */}
        <div style={{ marginTop: 16, padding: 14, background: "rgba(255,255,255,0.04)", borderRadius: 12, border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "var(--dim)", fontFamily: "var(--font-mono)", marginBottom: 10 }}>
            TIEN DO CUA BAN
          </div>
          {[
            { label: "Team A GMV", val: "180tr / 250tr", pct: 72, color: "var(--c6b)" },
            { label: "Team B GMV", val: "95tr / 250tr", pct: 38, color: "var(--c5)" },
          ].map((p) => (
            <div key={p.label} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 12 }}>
                <span style={{ color: "var(--muted)" }}>{p.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--white)" }}>{p.val} ({p.pct}%)</span>
              </div>
              <div className="prog-track">
                <div className="prog-fill" style={{ width: `${p.pct}%`, background: p.color }} />
              </div>
            </div>
          ))}
          <div style={{
            marginTop: 10,
            padding: "8px 14px",
            borderRadius: 10,
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.2)",
            fontSize: 11,
            color: "var(--gold)",
            textAlign: "center",
          }}>
            Can 2 team dat toi thieu 250tr GMV moi team de tro thanh Dai Su
          </div>
        </div>
      </div>
    </div>
  );
}
