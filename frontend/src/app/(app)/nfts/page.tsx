"use client";

import { useAccount } from "wagmi";
import { useUserBadges, useBadgeStats } from "@/hooks/useOnChain";
import { BADGE_CONTRACT } from "@/lib/contracts";

const BADGE_TYPE_MAP: Record<number, { emoji: string; name: string }> = {
  0: { emoji: "🏅", name: "KOC Pro" },
  1: { emoji: "🤝", name: "First Referral" },
  2: { emoji: "🔥", name: "7-Day Streak" },
  3: { emoji: "🌟", name: "Pioneer" },
  4: { emoji: "💎", name: "Diamond" },
  5: { emoji: "📦", name: "100 Orders" },
  6: { emoji: "🏆", name: "Top GMV" },
  7: { emoji: "🗳", name: "Governance" },
};

const ALL_BADGE_TYPES = [0, 1, 2, 3, 4, 5, 6, 7];

export default function NftsPage() {
  const { address, isConnected } = useAccount();
  const { data: userBadgeData, isLoading } = useUserBadges(address);
  const { data: globalStats } = useBadgeStats();

  const ownedTypes = new Set(userBadgeData?.badges.map((b) => b.badgeType) ?? []);
  const totalOwned = userBadgeData?.totalOwned ?? 0;
  const shortContract = `${BADGE_CONTRACT.slice(0, 6)}...${BADGE_CONTRACT.slice(-4)}`;

  return (
    <div>
      <div className="section-title">NFT Badges</div>

      {/* Not connected state */}
      {!isConnected && (
        <div className="card" style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔗</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--white)", marginBottom: 6 }}>
            Ket noi wallet de xem badges
          </div>
          <div style={{ fontSize: 12, color: "var(--dim)" }}>
            Click &quot;Connect Wallet&quot; o thanh tren de xem SBT cua ban
          </div>
        </div>
      )}

      {/* Milestone SBT */}
      <div className="card">
        <div className="card-title">
          Milestone SBT {isConnected && !isLoading && `(${totalOwned} / ${ALL_BADGE_TYPES.length} owned)`}
          {isLoading && " (Loading...)"}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
          {ALL_BADGE_TYPES.map((type) => {
            const info = BADGE_TYPE_MAP[type] ?? { emoji: "❓", name: `Badge #${type}` };
            const owned = isConnected ? ownedTypes.has(type) : false;
            const badge = userBadgeData?.badges.find((b) => b.badgeType === type);

            return (
              <div key={type} className={`badge-item ${owned ? "badge-owned" : ""}`}>
                <div style={{ fontSize: 32, lineHeight: 1 }}>{info.emoji}</div>
                <div className="badge-name">{info.name}</div>
                <div className={`badge-id ${owned ? "owned" : "locked"}`}>
                  {owned ? `#SBT-${String(badge?.tokenId ?? type).padStart(4, "0")}` : "🔒 Locked"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contract Info */}
      <div className="card">
        <div className="card-title">Contract Info</div>
        {[
          { key: "Token Standard", val: "ERC-721 SBT" },
          { key: "Network", val: "Polygon Mainnet" },
          { key: "Contract", val: shortContract, mono: true },
          { key: "Transferable", val: "No (Soul-bound)" },
          { key: "Total Minted (global)", val: globalStats ? String(globalStats.totalMinted) : "Loading..." },
          { key: "Your Badges", val: isConnected ? `${totalOwned} / ${ALL_BADGE_TYPES.length}` : "Not connected" },
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
