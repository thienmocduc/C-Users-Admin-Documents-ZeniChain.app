"use client";

const kpis = [
  { label: "GMV", value: "45.2tr", sub: "+12%" },
  { label: "Revenue", value: "6.1tr", sub: "+18%" },
  { label: "Orders", value: "127", sub: "+8%" },
  { label: "New F1", value: "5", sub: "+2" },
  { label: "XP", value: "48,200", sub: "+15%" },
  { label: "NFTs", value: "23", sub: "+3" },
];

const targets = [
  { label: "GMV", current: "45.2tr", target: "60tr", pct: 75 },
  { label: "F1", current: "5", target: "10", pct: 50 },
  { label: "Orders", current: "127", target: "150", pct: 85 },
];

export default function AnalyticsPage() {
  return (
    <div>
      <div className="section-title">Analytics</div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        {kpis.map((k) => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value">{k.value}</div>
            <div style={{ fontSize: 11, color: "var(--c4)", marginTop: 4, fontFamily: "var(--font-mono)" }}>
              {k.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Chart placeholders */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {["GMV by Month", "Revenue by Product"].map((title) => (
          <div
            key={title}
            className="card"
            style={{
              minHeight: 200,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--bg2)",
              border: "1px solid transparent",
              backgroundClip: "padding-box",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: -1,
                borderRadius: 16,
                padding: 1,
                background: "linear-gradient(135deg, var(--c6), var(--c4), var(--c5))",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                pointerEvents: "none",
              }}
            />
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--white)", marginBottom: 8 }}>
              {title}
            </div>
            <div style={{ fontSize: 11, color: "var(--dim)" }}>Chart coming soon</div>
          </div>
        ))}
      </div>

      {/* Monthly Targets */}
      <div className="card">
        <div className="card-title">Monthly Targets</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {targets.map((t) => (
            <div key={t.label}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: "var(--muted)", fontWeight: 500 }}>{t.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--white)" }}>
                  {t.current} / {t.target}
                </span>
              </div>
              <div className="prog-track">
                <div
                  className="prog-fill"
                  style={{
                    width: `${t.pct}%`,
                    background: t.pct >= 80 ? "var(--c4)" : t.pct >= 60 ? "var(--c5)" : "var(--gold)",
                  }}
                />
              </div>
              <div style={{ textAlign: "right", fontSize: 10, color: "var(--dim)", marginTop: 3, fontFamily: "var(--font-mono)" }}>
                {t.pct}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Buttons */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-primary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          PDF
        </button>
        <button className="btn btn-secondary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          CSV
        </button>
        <button className="btn btn-ghost">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Tax Report
        </button>
      </div>
    </div>
  );
}
