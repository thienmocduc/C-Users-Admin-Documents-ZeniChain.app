"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useState } from "react";

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [showMenu, setShowMenu] = useState(false);

  if (isConnected && address) {
    return (
      <div style={{ position: "relative" }}>
        <button
          className="btn"
          onClick={() => setShowMenu(!showMenu)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            fontSize: 12,
            fontFamily: "var(--font-mono)",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#00D4AA",
              flexShrink: 0,
            }}
          />
          {address.slice(0, 6)}...{address.slice(-4)}
        </button>
        {showMenu && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: 4,
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 8,
              minWidth: 180,
              zIndex: 100,
            }}
          >
            <div
              style={{
                padding: "8px 12px",
                fontSize: 11,
                color: "var(--dim)",
                fontFamily: "var(--font-mono)",
                wordBreak: "break-all",
              }}
            >
              {address}
            </div>
            <a
              href={`https://polygonscan.com/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                padding: "8px 12px",
                fontSize: 13,
                color: "var(--white)",
                textDecoration: "none",
                borderRadius: 8,
              }}
            >
              View on Polygonscan
            </a>
            <button
              onClick={() => {
                disconnect();
                setShowMenu(false);
              }}
              style={{
                width: "100%",
                padding: "8px 12px",
                fontSize: 13,
                color: "#EF4444",
                background: "none",
                border: "none",
                textAlign: "left",
                cursor: "pointer",
                borderRadius: 8,
              }}
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      className="btn btn-primary"
      onClick={() => {
        const injected = connectors.find((c) => c.id === "injected");
        if (injected) connect({ connector: injected });
      }}
      style={{ padding: "8px 16px", fontSize: 13 }}
    >
      Connect Wallet
    </button>
  );
}
