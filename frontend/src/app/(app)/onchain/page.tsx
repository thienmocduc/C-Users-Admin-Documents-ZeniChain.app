"use client";

import { useState, useEffect } from "react";
import {
  ZENI_TOKEN, TREASURY_CONTRACT, DEPLOYER_ADDRESS, BADGE_CONTRACT, AFFILIATE_CONTRACT,
  ZENI_PRICE_USD, POLYGON_RPC,
} from "@/lib/contracts";

interface ChainData {
  totalSupply: string;
  treasuryBalance: string;
  deployerBalance: string;
  blockNumber: number;
  gasPrice: string;
  founderPool: string;
  treasuryPool: string;
  investorPool: string;
  ipoPool: string;
  ecosystemPool: string;
  animaActivated: boolean;
  animaRequested: boolean;
  loading: boolean;
}

const SUBSIDIARIES = ["ANIMA Care", "WellKOC", "NexBuild", "Zeni Digital", "Biotea84"];

const CONTRACTS_LIST = [
  { name: "$ZENI Token (ERC-20)", address: ZENI_TOKEN, status: "Live" },
  { name: "ZeniTreasury", address: TREASURY_CONTRACT, status: "Live" },
  { name: "AffiliateCommission", address: AFFILIATE_CONTRACT, status: "Live" },
  { name: "ZeniBadge (SBT)", address: BADGE_CONTRACT, status: "Live" },
];

function formatZeni(wei: string): string {
  const num = Number(wei) / 1e18;
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toFixed(0);
}

function formatUsd(wei: string): string {
  const zeni = Number(wei) / 1e18;
  const usd = zeni * ZENI_PRICE_USD;
  if (usd >= 1_000_000) return "$" + (usd / 1_000_000).toFixed(1) + "M";
  if (usd >= 1_000) return "$" + (usd / 1_000).toFixed(1) + "K";
  return "$" + usd.toFixed(2);
}

export default function OnchainPage() {
  const [data, setData] = useState<ChainData>({
    totalSupply: "0", treasuryBalance: "0", deployerBalance: "0",
    blockNumber: 0, gasPrice: "0",
    founderPool: "0", treasuryPool: "0", investorPool: "0", ipoPool: "0", ecosystemPool: "0",
    animaActivated: false, animaRequested: false, loading: true,
  });

  useEffect(() => {
    async function fetchChainData() {
      try {
        const { ethers } = await import("ethers");
        const provider = new ethers.JsonRpcProvider(POLYGON_RPC);

        const erc20 = new ethers.Contract(ZENI_TOKEN, [
          "function balanceOf(address) view returns (uint256)",
          "function totalSupply() view returns (uint256)",
        ], provider);

        const treasury = new ethers.Contract(TREASURY_CONTRACT, [
          "function getGeneralPools() view returns (uint256,uint256,uint256,uint256,uint256)",
          "function getTotalLocked() view returns (uint256)",
          "function getSubsidiaryInfo(string) view returns (bool,bool,uint256,uint256,uint256,uint256,uint256,uint256)",
        ], provider);

        const [totalSupply, treasuryBal, deployerBal, blockNum, feeData, pools, animaInfo] = await Promise.all([
          erc20.totalSupply(),
          erc20.balanceOf(TREASURY_CONTRACT),
          erc20.balanceOf(DEPLOYER_ADDRESS),
          provider.getBlockNumber(),
          provider.getFeeData(),
          treasury.getGeneralPools(),
          treasury.getSubsidiaryInfo("ANIMA Care"),
        ]);

        setData({
          totalSupply: totalSupply.toString(),
          treasuryBalance: treasuryBal.toString(),
          deployerBalance: deployerBal.toString(),
          blockNumber: blockNum,
          gasPrice: feeData.gasPrice ? (Number(feeData.gasPrice) / 1e9).toFixed(1) : "0",
          founderPool: pools[0].toString(),
          treasuryPool: pools[1].toString(),
          investorPool: pools[2].toString(),
          ipoPool: pools[3].toString(),
          ecosystemPool: pools[4].toString(),
          animaActivated: animaInfo[0],
          animaRequested: animaInfo[1],
          loading: false,
        });
      } catch (err) {
        console.error("Chain fetch error:", err);
        setData((d) => ({ ...d, loading: false }));
      }
    }
    fetchChainData();
  }, []);

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-[28px]">⛓</span>
        <h1 className="text-[24px] font-extrabold" style={{ color: "var(--white)" }}>On-Chain Data</h1>
        {!data.loading && (
          <span className="flex items-center gap-[6px] rounded-[20px] px-3 py-1 text-[11px]"
            style={{ background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.2)", fontFamily: "var(--font-mono)" }}>
            <span className="h-[6px] w-[6px] rounded-full" style={{ background: "#00D4AA", animation: "pdot 2s infinite" }} />
            <span style={{ color: "#00D4AA" }}>Live · Block #{data.blockNumber.toLocaleString()}</span>
          </span>
        )}
      </div>
      <p className="text-[13px] mb-5" style={{ color: "var(--muted)" }}>
        Dữ liệu thật từ Polygon Mainnet · Giá tham chiếu: $0.05/ZENI
      </p>

      {data.loading ? (
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          <div className="text-[24px] mb-3">⏳</div>
          <div style={{ color: "var(--muted)" }}>Đang tải dữ liệu từ Polygon...</div>
        </div>
      ) : (
        <>
          {/* KPI Row */}
          <div className="kpi-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
            <div className="kpi-card">
              <div className="kpi-label">TOTAL SUPPLY</div>
              <div className="kpi-value" style={{ color: "#00D4AA" }}>{formatZeni(data.totalSupply)}</div>
              <div className="text-[11px] mt-1" style={{ color: "var(--dim)" }}>{formatUsd(data.totalSupply)}</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">TREASURY LOCKED</div>
              <div className="kpi-value" style={{ color: "#8B45FF" }}>{formatZeni(data.treasuryBalance)}</div>
              <div className="text-[11px] mt-1" style={{ color: "var(--dim)" }}>{formatUsd(data.treasuryBalance)}</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">GAS PRICE</div>
              <div className="kpi-value" style={{ color: "#4A8DFF" }}>{data.gasPrice}</div>
              <div className="text-[11px] mt-1" style={{ color: "var(--dim)" }}>Gwei</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">SUBSIDIARIES</div>
              <div className="kpi-value" style={{ color: "#F59E0B" }}>{data.animaActivated ? "1" : "0"}/5</div>
              <div className="text-[11px] mt-1" style={{ color: "var(--dim)" }}>Activated</div>
            </div>
          </div>

          <div className="page-grid">
            {/* Left: Treasury Pools */}
            <div>
              <div className="card">
                <div className="card-title">GENERAL POOLS · TREASURY CONTRACT</div>
                {[
                  { name: "Founder (Chairman)", val: data.founderPool, color: "#C084FC" },
                  { name: "Treasury / DAO", val: data.treasuryPool, color: "#4A8DFF" },
                  { name: "Investors", val: data.investorPool, color: "#8B45FF" },
                  { name: "IPO SGX 2031", val: data.ipoPool, color: "#F59E0B" },
                  { name: "Ecosystem Fund", val: data.ecosystemPool, color: "#00D4AA" },
                ].map((p) => (
                  <div key={p.name} className="chain-info-row">
                    <span className="cir-key">{p.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="cir-val" style={{ color: p.color }}>{formatZeni(p.val)}</span>
                      <span className="text-[10px]" style={{ color: "var(--dim)", fontFamily: "var(--font-mono)" }}>
                        {formatUsd(p.val)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subsidiaries Status */}
              <div className="card">
                <div className="card-title">SUBSIDIARIES · 5 × 100M ZENI</div>
                {SUBSIDIARIES.map((name, i) => {
                  const isAnima = name === "ANIMA Care";
                  const activated = isAnima && data.animaActivated;
                  const pending = isAnima && data.animaRequested && !data.animaActivated;
                  return (
                    <div key={name} className="chain-info-row">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{
                          background: activated ? "#00D4AA" : pending ? "#F59E0B" : "var(--dim)"
                        }} />
                        <span className="cir-key" style={{ color: "var(--white)", fontWeight: 500 }}>{name}</span>
                      </div>
                      <span className="text-[10px] px-2 py-1 rounded-lg font-semibold" style={{
                        fontFamily: "var(--font-mono)",
                        background: activated ? "rgba(0,212,170,0.1)" : pending ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.04)",
                        color: activated ? "#00D4AA" : pending ? "#F59E0B" : "var(--dim)",
                      }}>
                        {activated ? "Active · 100M" : pending ? "Pending 7 days" : "Locked · 100M"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Smart Contracts + Wallet */}
            <div>
              {/* Smart Contracts */}
              <div className="card">
                <div className="card-title">SMART CONTRACTS · POLYGON MAINNET</div>
                {CONTRACTS_LIST.map((c) => (
                  <div key={c.name} className="flex items-center gap-3 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: "#00D4AA" }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold" style={{ color: "var(--white)" }}>{c.name}</div>
                      <a
                        href={`https://polygonscan.com/address/${c.address}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] hover:underline truncate block"
                        style={{ color: "var(--c5b)", fontFamily: "var(--font-mono)" }}
                      >
                        {c.address}
                      </a>
                    </div>
                    <span className="text-[9px] px-2 py-1 rounded-lg font-semibold"
                      style={{ fontFamily: "var(--font-mono)", background: "rgba(0,212,170,0.1)", color: "#00D4AA" }}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Multi-sig Signers */}
              <div className="card">
                <div className="card-title">MULTI-SIG · 2/3 REQUIRED</div>
                {[
                  { role: "Chairman", addr: DEPLOYER_ADDRESS, icon: "👑" },
                  { role: "CEO Recovery", addr: "0xf20Dbb66063df65c787868ef15dA4f1eBE36105a", icon: "🔑" },
                  { role: "CTO Recovery", addr: "0x834E18FDaf150E9dd07dD962EAE77F7CFa342674", icon: "🔑" },
                ].map((s) => (
                  <div key={s.role} className="chain-info-row">
                    <div className="flex items-center gap-2">
                      <span>{s.icon}</span>
                      <span className="cir-key" style={{ color: "var(--white)" }}>{s.role}</span>
                    </div>
                    <a
                      href={`https://polygonscan.com/address/${s.addr}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] hover:underline"
                      style={{ color: "var(--c5b)", fontFamily: "var(--font-mono)" }}
                    >
                      {s.addr.slice(0, 6)}...{s.addr.slice(-4)}
                    </a>
                  </div>
                ))}
              </div>

              {/* Network Info */}
              <div className="card">
                <div className="card-title">NETWORK INFO</div>
                {[
                  { key: "Network", val: "Polygon Mainnet", color: "#8B45FF" },
                  { key: "Chain ID", val: "137", color: "var(--white)" },
                  { key: "Block Height", val: data.blockNumber.toLocaleString(), color: "#00D4AA" },
                  { key: "Gas Price", val: data.gasPrice + " Gwei", color: "#4A8DFF" },
                  { key: "Token Price", val: "$0.05 / ZENI", color: "#F59E0B" },
                  { key: "FDV", val: formatUsd(data.totalSupply), color: "#C084FC" },
                ].map((r) => (
                  <div key={r.key} className="chain-info-row">
                    <span className="cir-key">{r.key}</span>
                    <span className="cir-val" style={{ color: r.color }}>{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
