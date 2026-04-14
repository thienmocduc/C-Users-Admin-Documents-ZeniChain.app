"use client";

import { useState } from "react";

const filters = ["All", "Affiliate", "Pool", "NFT", "XP", "Clawback"];

const transactions = [
  {
    hash: "0x7a3f...e821",
    tag: "affiliate",
    tagLabel: "Affiliate",
    desc: "Commission F1 - Order #A4821",
    amount: "+750 ZENI",
    time: "14/04 14:23",
    block: "4,821,040",
  },
  {
    hash: "0x4b2c...d192",
    tag: "pool",
    tagLabel: "Pool",
    desc: "Ambassador Pool T3/2026 distribution",
    amount: "+2,100 ZENI",
    time: "05/04 09:00",
    block: "4,812,891",
  },
  {
    hash: "0x9e1d...a847",
    tag: "nft",
    tagLabel: "NFT",
    desc: "Mint Badge: KOC Pro (#SBT-0421)",
    amount: "0 ZENI",
    time: "03/04 11:15",
    block: "4,809,221",
  },
  {
    hash: "0x2f8a...c394",
    tag: "affiliate",
    tagLabel: "Affiliate",
    desc: "Revenue sharing - Tran Linh group",
    amount: "+90,000 VND",
    time: "02/04 16:30",
    block: "4,808,102",
  },
  {
    hash: "0x5c3e...b721",
    tag: "xp",
    tagLabel: "XP",
    desc: "XP conversion to ZENI (4,820 XP)",
    amount: "+482 ZENI",
    time: "01/04 08:00",
    block: "4,806,444",
  },
  {
    hash: "0x1d4f...e293",
    tag: "affiliate",
    tagLabel: "Affiliate",
    desc: "KTV Fee referral - Nguyen Hoa",
    amount: "+1,800,000 VND",
    time: "28/03 19:12",
    block: "4,801,230",
  },
  {
    hash: "0x8b2a...f184",
    tag: "clawback",
    tagLabel: "Clawback",
    desc: "Order #A4799 refund - auto clawback",
    amount: "-320,000 VND",
    time: "25/03 10:45",
    block: "4,798,100",
  },
];

export default function OnchainPage() {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? transactions
      : transactions.filter((t) => t.tagLabel === active);

  return (
    <div>
      <div className="section-title">On-Chain</div>

      {/* Filter chips */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {filters.map((f) => (
          <button
            key={f}
            className={`filter-chip ${active === f ? "active" : ""}`}
            onClick={() => setActive(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Transactions */}
      <div>
        {filtered.map((tx, i) => (
          <div key={i} className="onchain-tx">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span className="hash-val">{tx.hash}</span>
              <span className={`tx-tag-chip tag-${tx.tag}`}>{tx.tagLabel}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, color: "var(--white)" }}>{tx.desc}</span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: tx.amount.startsWith("-") ? "var(--red)" : "var(--c4)",
                  whiteSpace: "nowrap",
                }}
              >
                {tx.amount}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 8,
                fontSize: 11,
                color: "var(--dim)",
              }}
            >
              <span>{tx.time}</span>
              <span style={{ fontFamily: "var(--font-mono)" }}>Block #{tx.block}</span>
              <a
                href={`https://polygonscan.com/tx/${tx.hash}`}
                target="_blank"
                rel="noreferrer"
                style={{ marginLeft: "auto", color: "var(--c5)", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}
              >
                Polygonscan
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
