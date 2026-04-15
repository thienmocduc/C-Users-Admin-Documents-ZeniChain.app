"use client";

import { useAccount } from "wagmi";
import { useTranslation } from "@/hooks/useTranslation";
import { useZeniBalance } from "@/hooks/useOnChain";
import { ZENI_PRICE_USD } from "@/lib/contracts";

const txHistory = [
  { icon: "💰", bg: "rgba(0,212,170,0.12)", name: "Nhan tu Pool T3", meta: "05/04 09:00", amount: "+2,100 Zeni", color: "var(--c4)", tag: "Pool", tagClass: "tag-pool" },
  { icon: "↗", bg: "rgba(224,82,82,0.12)", name: "Gui 500 Zeni", meta: "03/04 16:30", amount: "-500 Zeni", color: "var(--red)", tag: "Transfer", tagClass: "tag-clawback" },
  { icon: "⇄", bg: "rgba(74,141,255,0.12)", name: "Swap USDC → Zeni", meta: "01/04 11:22", amount: "+1,200 Zeni", color: "var(--c4)", tag: "Swap", tagClass: "tag-nft" },
];

function formatNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function WalletPage() {
  const { t } = useTranslation();
  const { address, isConnected } = useAccount();
  const { data: balanceData, isLoading } = useZeniBalance(address);

  const balance = balanceData ? Number(balanceData.balance) : 0;
  const usdValue = balance * ZENI_PRICE_USD;
  const shortAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected";

  const walletInfo = [
    { key: "Address", val: shortAddr, cls: "blue" },
    { key: "Network", val: "Polygon Mainnet", cls: "purple" },
    { key: "Chain ID", val: "137", cls: "" },
    { key: "Status", val: isConnected ? "Connected" : "Disconnected", cls: isConnected ? "green" : "" },
    { key: "Gas Fee", val: "< 0.001 $Zeni", cls: "green" },
  ];

  return (
    <div className="page-grid">
      {/* LEFT COLUMN */}
      <div>
        {/* Balance Card */}
        <div className="balance-hero">
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--dim)", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
            $ZENI TOKEN BALANCE
          </div>

          {!isConnected ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div className="text-[20px] mb-2">🔗</div>
              <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 4 }}>
                Ket noi wallet de xem balance
              </div>
              <div style={{ fontSize: 12, color: "var(--dim)" }}>
                Click &quot;Connect Wallet&quot; o thanh tren
              </div>
            </div>
          ) : isLoading ? (
            <div style={{ textAlign: "center", padding: 20 }}>
              <div style={{ color: "var(--muted)" }}>Dang tai...</div>
            </div>
          ) : (
            <>
              <div className="balance-amount">{formatNum(balance)}</div>
              <div className="balance-token">$Zeni Token</div>
              <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 4 }}>
                ~ ${usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
              </div>
            </>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 14 }}>
            <button className="btn btn-primary" style={{ justifyContent: "center" }}>{t("btn_send")}</button>
            <button className="btn btn-secondary" style={{ justifyContent: "center" }}>{t("btn_receive")}</button>
            <button className="btn btn-secondary" style={{ justifyContent: "center" }}>{t("btn_swap")}</button>
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
            {t("wallet_open_bridge")}
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div>
        {/* Wallet Info */}
        <div className="card">
          <div className="card-title">{t("wallet_info")}</div>
          {walletInfo.map((item) => (
            <div className="chain-info-row" key={item.key}>
              <span className="cir-key">{item.key}</span>
              <span className={`cir-val ${item.cls}`}>{item.val}</span>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            {isConnected && address ? (
              <a
                href={`https://polygonscan.com/address/${address}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                style={{ flex: 1, justifyContent: "center", textDecoration: "none", display: "flex" }}
              >
                Polygonscan
              </a>
            ) : (
              <button className="btn btn-secondary" style={{ flex: 1, justifyContent: "center" }} disabled>
                Polygonscan
              </button>
            )}
          </div>
        </div>

        {/* Transaction History */}
        <div className="card">
          <div className="card-title">{t("wallet_tx_history")}</div>
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
