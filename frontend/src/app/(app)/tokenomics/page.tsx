"use client";

import { useState } from "react";

/* ═══ DATA ═══ */
const TOTAL_SUPPLY = 1_000_000_000;
const PUBLIC_PRICE = 0.05;
const FDV = 50_000_000;

const allocations = [
  { name: "XP → ZENI Conversion", pct: 20, amount: 200_000_000, color: "#00D4AA", vesting: "Dynamic rate, phát dần", wallet: "Ví riêng", desc: "Pool chuyển đổi XP sang $ZENI cho toàn hệ sinh thái" },
  { name: "Treasury / DAO", pct: 20, amount: 200_000_000, color: "#4A8DFF", vesting: "Admin/Governance", wallet: "Ví riêng", desc: "Quỹ quản trị phi tập trung, cộng đồng biểu quyết" },
  { name: "Huy động vốn (Investors)", pct: 15, amount: 150_000_000, color: "#8B45FF", vesting: "Cliff 6th + Vest 2yr", wallet: "Deployer wallet", desc: "Seed, Private, Strategic rounds — Chairman quyết định" },
  { name: "Founder (Chairman)", pct: 10, amount: 100_000_000, color: "#C084FC", vesting: "Cliff 1yr + Vest 5yr", wallet: "Ví riêng", desc: "Founder Class voting 1:10 — quyền biểu quyết x10" },
  { name: "Ecosystem Fund", pct: 10, amount: 100_000_000, color: "#F59E0B", vesting: "Admin quản lý", wallet: "Ví riêng", desc: "Phát triển hệ sinh thái, partnership, integration" },
  { name: "Team Công Nghệ", pct: 5, amount: 50_000_000, color: "#00D4AA", vesting: "Cliff 1yr + Vest 3yr", wallet: "Ví riêng", desc: "Đội ngũ phát triển blockchain, frontend, backend" },
  { name: "Team Clever Vận Hành", pct: 5, amount: 50_000_000, color: "#4A8DFF", vesting: "Cliff 1yr + Vest 3yr", wallet: "Ví riêng", desc: "CEO (1%) + Team vận hành (4%)" },
  { name: "Marketing / Events", pct: 5, amount: 50_000_000, color: "#A855F7", vesting: "Admin quản lý", wallet: "Ví riêng", desc: "Campaign, airdrop, community building" },
  { name: "Quỹ Dự Phòng (Reserve)", pct: 5, amount: 50_000_000, color: "#E05252", vesting: "Admin quản lý", wallet: "Ví riêng", desc: "Dự phòng rủi ro, emergency fund" },
];

const priceTiers = [
  { phase: "Seed Round", price: "$0.01", discount: "-80%", status: "coming" },
  { phase: "Private Sale", price: "$0.03", discount: "-40%", status: "coming" },
  { phase: "Public Price", price: "$0.05", discount: "Giá gốc", status: "active" },
  { phase: "Target 2028", price: "$0.10+", discount: "+100%", status: "future" },
  { phase: "IPO SGX 2031", price: "$0.50+", discount: "+900%", status: "future" },
];

const xpRates = [
  { platform: "ANIMA Care", icon: "🏥", rate: "1,000 XP = 1 ZENI", note: "Core, ưu tiên", color: "#00D4AA" },
  { platform: "WellKOC", icon: "🎯", rate: "1,250 XP = 1 ZENI", note: "Margin thấp hơn", color: "#8B45FF" },
  { platform: "NexBuild", icon: "🏗", rate: "833 XP = 1 ZENI", note: "B2B deal lớn", color: "#F59E0B" },
  { platform: "Zeni Digital", icon: "💻", rate: "2,000 XP = 1 ZENI", note: "SaaS, dễ earn", color: "#4A8DFF" },
];

const vestingSchedule = [
  { role: "Founder (Chairman)", cliff: "1 năm", vest: "5 năm tuyến tính", amount: "100M", voting: "10x" },
  { role: "Team Công Nghệ", cliff: "1 năm", vest: "3 năm tuyến tính", amount: "50M", voting: "1x" },
  { role: "CEO (Vận hành)", cliff: "1 năm", vest: "3 năm tuyến tính", amount: "10M", voting: "1x" },
  { role: "Team Clever", cliff: "1 năm", vest: "3 năm tuyến tính", amount: "40M", voting: "1x" },
  { role: "Investors", cliff: "6 tháng", vest: "2 năm tuyến tính", amount: "150M", voting: "1x" },
];

const contracts = [
  { name: "$ZENI Token (ERC-20)", address: "0x2d0Ec889F3889F0a364b82039db9F8Bef78f5EC1", status: "Live" },
  { name: "AffiliateCommission", address: "0x1d5963FcCfC548275293e51f0F6C7aC482E0b714", status: "Live" },
  { name: "ZeniBadge (SBT)", address: "0xB157c83beEeA7c7ebDB2CEa305135e3deCAeD79D", status: "Live" },
  { name: "VestingContract", address: "Chưa deploy", status: "Ready" },
];

const feeStructure = [
  { action: "Transfer / Mua bán $ZENI", fee: "0.05 ZENI", type: "Cố định" },
  { action: "Rút hoa hồng từ nền tảng", fee: "0.5%", type: "% giá trị" },
  { action: "Mint NFT Voucher", fee: "XP cost", type: "Theo voucher" },
  { action: "Mint SBT Badge", fee: "Free", type: "Miễn phí" },
  { action: "Governance Vote", fee: "Free", type: "Miễn phí" },
];

/* ═══ COMPONENT ═══ */
export default function TokenomicsPage() {
  const [selectedAlloc, setSelectedAlloc] = useState<number | null>(null);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[28px]">💎</span>
          <h1 className="text-[24px] font-extrabold" style={{ color: "var(--white)" }}>
            Tokenomics $ZENI
          </h1>
        </div>
        <p className="text-[14px]" style={{ color: "var(--muted)" }}>
          1 tỷ hard cap · Polygon Mainnet · Real demand từ hệ sinh thái wellness
        </p>
      </div>

      {/* KPI Overview */}
      <div className="kpi-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
        {[
          { label: "TOTAL SUPPLY", value: "1B", sub: "Hard cap", color: "#00D4AA" },
          { label: "GIÁ CÔNG BỐ", value: "$0.05", sub: "Per ZENI", color: "#8B45FF" },
          { label: "FDV", value: "$50M", sub: "Fully Diluted", color: "#4A8DFF" },
          { label: "CHAIRMAN", value: "31%", sub: "310M ZENI", color: "#C084FC" },
          { label: "VOTING POWER", value: "82%", sub: "Founder 10x", color: "#F59E0B" },
          { label: "NETWORK", value: "Polygon", sub: "Mainnet", color: "#00D4AA" },
        ].map((k) => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ color: k.color }}>{k.value}</div>
            <div className="text-[11px] mt-1" style={{ color: "var(--dim)" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Allocation Donut + Table */}
      <div className="page-grid" style={{ gap: 20 }}>
        {/* Left: Allocation visual */}
        <div>
          <div className="card">
            <div className="card-title">PHÂN BỔ TOKEN · 10 POOLS</div>

            {/* Visual bar chart */}
            <div className="mb-4">
              <div className="flex rounded-xl overflow-hidden h-8 mb-3">
                {allocations.map((a, i) => (
                  <div
                    key={i}
                    className="cursor-pointer transition-opacity duration-200"
                    style={{
                      width: `${a.pct}%`,
                      background: a.color,
                      opacity: selectedAlloc === null || selectedAlloc === i ? 1 : 0.3,
                    }}
                    onClick={() => setSelectedAlloc(selectedAlloc === i ? null : i)}
                    title={`${a.name}: ${a.pct}%`}
                  />
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-[6px]">
              {allocations.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-2 py-[6px] rounded-lg cursor-pointer transition-all duration-150"
                  style={{
                    background: selectedAlloc === i ? "rgba(139,69,255,0.1)" : undefined,
                  }}
                  onClick={() => setSelectedAlloc(selectedAlloc === i ? null : i)}
                >
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: a.color }} />
                  <span className="flex-1 text-[12px] font-medium" style={{ color: "var(--white)" }}>
                    {a.name}
                  </span>
                  <span className="text-[12px] font-bold" style={{ color: a.color, fontFamily: "var(--font-mono)" }}>
                    {a.pct}%
                  </span>
                  <span className="text-[11px]" style={{ color: "var(--dim)", fontFamily: "var(--font-mono)" }}>
                    {(a.amount / 1_000_000).toFixed(0)}M
                  </span>
                </div>
              ))}
            </div>

            {/* Selected allocation detail */}
            {selectedAlloc !== null && (
              <div
                className="mt-4 rounded-xl p-4"
                style={{ background: "rgba(139,69,255,0.08)", border: `1px solid ${allocations[selectedAlloc].color}30` }}
              >
                <div className="text-[14px] font-bold mb-1" style={{ color: allocations[selectedAlloc].color }}>
                  {allocations[selectedAlloc].name}
                </div>
                <div className="text-[12px] mb-2" style={{ color: "var(--muted)" }}>
                  {allocations[selectedAlloc].desc}
                </div>
                <div className="flex gap-4 flex-wrap">
                  <div>
                    <div className="text-[9px] uppercase tracking-[1px]" style={{ color: "var(--dim)", fontFamily: "var(--font-mono)" }}>VESTING</div>
                    <div className="text-[12px] font-semibold" style={{ color: "var(--white)" }}>{allocations[selectedAlloc].vesting}</div>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase tracking-[1px]" style={{ color: "var(--dim)", fontFamily: "var(--font-mono)" }}>WALLET</div>
                    <div className="text-[12px] font-semibold" style={{ color: "var(--white)" }}>{allocations[selectedAlloc].wallet}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* XP Conversion Rates */}
          <div className="card">
            <div className="card-title">XP → ZENI CONVERSION RATE</div>
            <p className="text-[12px] mb-4" style={{ color: "var(--dim)" }}>
              Pool: 20% tổng cung = 200,000,000 ZENI · Rate riêng từng subsidiary
            </p>
            <div className="flex flex-col gap-3">
              {xpRates.map((r) => (
                <div key={r.platform} className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-[18px]"
                    style={{ background: `${r.color}18` }}
                  >
                    {r.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold" style={{ color: "var(--white)" }}>{r.platform}</div>
                    <div className="text-[11px]" style={{ color: "var(--dim)" }}>{r.note}</div>
                  </div>
                  <div
                    className="text-[12px] font-bold"
                    style={{ color: r.color, fontFamily: "var(--font-mono)" }}
                  >
                    {r.rate}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-[10px]" style={{ color: "var(--dim)" }}>
              * Rate có thể điều chỉnh. Càng nhiều user → rate tăng → khan hiếm
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div>
          {/* Price Tiers */}
          <div className="card">
            <div className="card-title">GIÁ TOKEN THEO GIAI ĐOẠN</div>
            <div className="flex flex-col gap-2">
              {priceTiers.map((p) => (
                <div
                  key={p.phase}
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{
                    background: p.status === "active"
                      ? "rgba(107,33,240,0.12)"
                      : "rgba(255,255,255,0.03)",
                    border: p.status === "active"
                      ? "1px solid rgba(139,69,255,0.3)"
                      : "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <div
                    className="h-2 w-2 rounded-full flex-shrink-0"
                    style={{
                      background: p.status === "active" ? "#8B45FF"
                        : p.status === "coming" ? "#F59E0B"
                        : "var(--dim)",
                    }}
                  />
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold" style={{ color: "var(--white)" }}>{p.phase}</div>
                  </div>
                  <div className="text-[18px] font-bold" style={{ color: p.status === "active" ? "#8B45FF" : "var(--white)", fontFamily: "var(--font-mono)" }}>
                    {p.price}
                  </div>
                  <div
                    className="text-[11px] font-semibold px-2 py-1 rounded-lg"
                    style={{
                      fontFamily: "var(--font-mono)",
                      background: p.discount.startsWith("+") ? "rgba(0,212,170,0.1)" : p.discount.startsWith("-") ? "rgba(245,158,11,0.1)" : "rgba(139,69,255,0.1)",
                      color: p.discount.startsWith("+") ? "#00D4AA" : p.discount.startsWith("-") ? "#F59E0B" : "#8B45FF",
                    }}
                  >
                    {p.discount}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vesting Schedule */}
          <div className="card">
            <div className="card-title">VESTING SCHEDULE</div>
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(139,69,255,0.1)" }}>
                    <th className="text-left pb-2 font-semibold" style={{ color: "var(--muted)" }}>Đối tượng</th>
                    <th className="text-center pb-2 font-semibold" style={{ color: "var(--muted)" }}>Cliff</th>
                    <th className="text-center pb-2 font-semibold" style={{ color: "var(--muted)" }}>Vest</th>
                    <th className="text-right pb-2 font-semibold" style={{ color: "var(--muted)" }}>Số lượng</th>
                    <th className="text-right pb-2 font-semibold" style={{ color: "var(--muted)" }}>Vote</th>
                  </tr>
                </thead>
                <tbody>
                  {vestingSchedule.map((v) => (
                    <tr key={v.role} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                      <td className="py-2 font-medium" style={{ color: "var(--white)" }}>{v.role}</td>
                      <td className="py-2 text-center" style={{ color: "#F59E0B", fontFamily: "var(--font-mono)" }}>{v.cliff}</td>
                      <td className="py-2 text-center" style={{ color: "#4A8DFF", fontFamily: "var(--font-mono)" }}>{v.vest}</td>
                      <td className="py-2 text-right font-bold" style={{ color: "var(--white)", fontFamily: "var(--font-mono)" }}>{v.amount}</td>
                      <td className="py-2 text-right" style={{ color: v.voting === "10x" ? "#C084FC" : "var(--dim)", fontFamily: "var(--font-mono)", fontWeight: v.voting === "10x" ? 700 : 400 }}>
                        {v.voting}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fee Structure */}
          <div className="card">
            <div className="card-title">PHÍ GIAO DỊCH</div>
            <div className="flex flex-col gap-[2px]">
              {feeStructure.map((f) => (
                <div key={f.action} className="chain-info-row">
                  <span className="cir-key">{f.action}</span>
                  <div className="flex items-center gap-2">
                    <span className="cir-val" style={{ color: f.fee === "Free" ? "var(--c4)" : "var(--white)" }}>{f.fee}</span>
                    <span className="text-[10px] px-2 py-[2px] rounded-md" style={{ background: "rgba(139,69,255,0.08)", color: "var(--dim)", fontFamily: "var(--font-mono)" }}>
                      {f.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Contracts */}
          <div className="card">
            <div className="card-title">SMART CONTRACTS · POLYGON MAINNET</div>
            <div className="flex flex-col gap-2">
              {contracts.map((c) => (
                <div key={c.name} className="flex items-center gap-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <div
                    className="h-2 w-2 rounded-full flex-shrink-0"
                    style={{ background: c.status === "Live" ? "#00D4AA" : "#F59E0B" }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold" style={{ color: "var(--white)" }}>{c.name}</div>
                    <div className="text-[10px] truncate" style={{ color: "var(--c5b)", fontFamily: "var(--font-mono)" }}>
                      {c.address}
                    </div>
                  </div>
                  <span
                    className="text-[9px] px-2 py-1 rounded-lg font-semibold"
                    style={{
                      fontFamily: "var(--font-mono)",
                      background: c.status === "Live" ? "rgba(0,212,170,0.1)" : "rgba(245,158,11,0.1)",
                      color: c.status === "Live" ? "#00D4AA" : "#F59E0B",
                    }}
                  >
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <a
                href="https://polygonscan.com/token/0x2d0Ec889F3889F0a364b82039db9F8Bef78f5EC1"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ fontSize: "11px", padding: "6px 14px" }}
              >
                🔗 Xem trên Polygonscan
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Chairman Summary */}
      <div className="card" style={{ borderColor: "rgba(192,132,252,0.2)", marginTop: 4 }}>
        <div className="card-title">CHAIRMAN OWNERSHIP SUMMARY</div>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <div>
            <div className="text-[11px] mb-1" style={{ color: "var(--dim)", fontFamily: "var(--font-mono)" }}>SỞ HỮU TRỰC TIẾP</div>
            <div className="text-[28px] font-extrabold" style={{ color: "#C084FC", fontFamily: "var(--font-mono)" }}>31%</div>
            <div className="text-[12px]" style={{ color: "var(--muted)" }}>= 310,000,000 ZENI</div>
            <div className="mt-2 text-[11px]" style={{ color: "var(--dim)" }}>
              Founder 10% + Team CN 5% + CEO 1% + Investors 15%
            </div>
          </div>
          <div>
            <div className="text-[11px] mb-1" style={{ color: "var(--dim)", fontFamily: "var(--font-mono)" }}>VOTING POWER</div>
            <div className="text-[28px] font-extrabold" style={{ color: "#F59E0B", fontFamily: "var(--font-mono)" }}>82%</div>
            <div className="text-[12px]" style={{ color: "var(--muted)" }}>Founder Class × 10 voting power</div>
            <div className="mt-2 text-[11px]" style={{ color: "var(--dim)" }}>
              Không cần bán token — dùng equity IPO SGX thay thế
            </div>
          </div>
          <div>
            <div className="text-[11px] mb-1" style={{ color: "var(--dim)", fontFamily: "var(--font-mono)" }}>IPO TARGET</div>
            <div className="text-[28px] font-extrabold grad-text" style={{ fontFamily: "var(--font-mono)" }}>2031</div>
            <div className="text-[12px]" style={{ color: "var(--muted)" }}>SGX Singapore · $3.8B target</div>
            <div className="mt-2 text-[11px]" style={{ color: "var(--dim)" }}>
              Giá target: $0.50+ per ZENI
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
