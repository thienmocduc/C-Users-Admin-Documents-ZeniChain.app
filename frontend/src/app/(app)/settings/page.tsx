"use client";

import { useState } from "react";
import { InstallPrompt } from "@/components/ui/InstallPrompt";

const tabList = [
  { id: "profile", label: "Profile" },
  { id: "kyc", label: "KYC" },
  { id: "security", label: "Security" },
  { id: "wallet", label: "Wallet" },
  { id: "preferences", label: "Preferences" },
];

export default function SettingsPage() {
  const [tab, setTab] = useState("profile");
  const [darkMode, setDarkMode] = useState(true);
  const [showBalance, setShowBalance] = useState(true);
  const [chakra, setChakra] = useState(false);
  const [notifCommission, setNotifCommission] = useState(true);
  const [notifNews, setNotifNews] = useState(true);
  const [notifOnchain, setNotifOnchain] = useState(false);
  const [notifRank, setNotifRank] = useState(true);

  return (
    <div>
      <div className="section-title">Settings</div>

      {/* Tab navigation */}
      <div className="settings-tabs-nav">
        {tabList.map((t) => (
          <button
            key={t.id}
            className={`stab ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ===== PROFILE ===== */}
      {tab === "profile" && (
        <div className="page-grid">
          {/* Avatar card */}
          <div className="card" style={{ textAlign: "center" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--c6), var(--c4))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 800,
                color: "#fff",
                margin: "0 auto 12px",
              }}
            >
              TD
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--white)" }}>Thien Duc</div>
            <div style={{ fontSize: 12, color: "var(--c6b)", marginTop: 2 }}>KOC Pro</div>
            <div
              style={{
                marginTop: 14,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "10px 14px",
              }}
            >
              <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "var(--dim)", fontFamily: "var(--font-mono)" }}>
                Zeni ID
              </div>
              <div className="grad-text" style={{ fontSize: 16, fontWeight: 800, fontFamily: "var(--font-mono)", marginTop: 4 }}>
                ZNI-TMD-00421
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="card">
            <div className="card-title">Personal Info</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { label: "Full Name", val: "Thien Moc Duc" },
                { label: "Email", val: "duc@zeni.holdings" },
                { label: "Phone", val: "09xx xxx xxx" },
                { label: "Bio", val: "KOC Pro | Zeni Ambassador" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="input-label">{f.label}</label>
                  <input className="input-field" defaultValue={f.val} />
                </div>
              ))}
            </div>
            <button className="btn btn-primary" style={{ marginTop: 16 }}>Save Changes</button>
          </div>
        </div>
      )}

      {/* ===== KYC ===== */}
      {tab === "kyc" && (
        <div className="card">
          <div className="card-title">KYC Verification</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Step 1 - Done */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: 14,
                borderRadius: 12,
                background: "rgba(0,212,170,0.06)",
                border: "1px solid rgba(0,212,170,0.2)",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "var(--c4)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                {"\u2713"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--white)" }}>Personal Information</div>
                <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 2 }}>Name, DOB, address</div>
              </div>
              <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 8, background: "rgba(0,212,170,0.1)", color: "var(--c4)" }}>
                Complete
              </span>
            </div>

            {/* Step 2 - Pending */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: 14,
                borderRadius: 12,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(107,33,240,0.15)",
                  color: "var(--c6b)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                2
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--white)" }}>Document Upload</div>
                <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 2 }}>ID card / Passport</div>
              </div>
              <button className="btn btn-secondary" style={{ padding: "6px 14px", fontSize: 11 }}>Start</button>
            </div>

            {/* Upload zone preview */}
            <div className="upload-zone">
              <div style={{ fontSize: 28, marginBottom: 6 }}>{"\u{1F4C4}"}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Drag & drop or click to upload</div>
              <div style={{ fontSize: 10, color: "var(--dim)", marginTop: 4 }}>JPG, PNG or PDF. Max 5MB</div>
            </div>

            {/* Step 3 - Locked */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: 14,
                borderRadius: 12,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid var(--border)",
                opacity: 0.5,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  color: "var(--dim)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 14,
                  flexShrink: 0,
                }}
              >
                3
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--white)" }}>Facial Recognition</div>
                <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 2 }}>Selfie verification</div>
              </div>
              <span style={{ fontSize: 10, color: "var(--dim)" }}>{"\u{1F512}"} Locked</span>
            </div>

            {/* KYC Status */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <span style={{ fontSize: 11, color: "var(--dim)" }}>KYC Status:</span>
              <span
                style={{
                  fontSize: 10,
                  padding: "3px 10px",
                  borderRadius: 8,
                  background: "rgba(245,158,11,0.1)",
                  color: "var(--gold)",
                  fontWeight: 600,
                }}
              >
                In Progress
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ===== SECURITY ===== */}
      {tab === "security" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <div className="card-title">Account Security</div>

            {/* Change password */}
            <div className="toggle-row">
              <div className="toggle-info">
                <div className="toggle-label">Change Password</div>
                <div className="toggle-sub">Last changed 30 days ago</div>
              </div>
              <button className="btn btn-secondary" style={{ padding: "6px 14px", fontSize: 11 }}>Change</button>
            </div>

            {/* PIN */}
            <div className="toggle-row">
              <div className="toggle-info">
                <div className="toggle-label">Transaction PIN</div>
                <div className="toggle-sub">6-digit PIN for transactions</div>
              </div>
              <span
                style={{
                  fontSize: 10,
                  padding: "3px 10px",
                  borderRadius: 8,
                  background: "rgba(0,212,170,0.1)",
                  color: "var(--c4)",
                  fontWeight: 600,
                }}
              >
                Active
              </span>
            </div>

            {/* 2FA */}
            <div className="toggle-row" style={{ borderBottom: "none" }}>
              <div className="toggle-info">
                <div className="toggle-label">Two-Factor Authentication (2FA)</div>
                <div className="toggle-sub">Google Authenticator or SMS</div>
              </div>
              <div
                className="toggle-switch"
                onClick={() => {}}
              >
                <div className="toggle-thumb" />
              </div>
            </div>
          </div>

          {/* Login sessions */}
          <div className="card">
            <div className="card-title">Login Sessions</div>
            {[
              { device: "Chrome - Windows 11", time: "Active now", current: true },
              { device: "Safari - iPhone 15", time: "2 hours ago", current: false },
              { device: "Firefox - macOS", time: "3 days ago", current: false },
            ].map((s, i) => (
              <div key={i} className="toggle-row" style={i === 2 ? { borderBottom: "none" } : {}}>
                <div className="toggle-info">
                  <div className="toggle-label">{s.device}</div>
                  <div className="toggle-sub">{s.time}</div>
                </div>
                {s.current ? (
                  <span
                    style={{
                      fontSize: 10,
                      padding: "3px 10px",
                      borderRadius: 8,
                      background: "rgba(0,212,170,0.1)",
                      color: "var(--c4)",
                      fontWeight: 600,
                    }}
                  >
                    Current
                  </span>
                ) : (
                  <button className="btn btn-ghost" style={{ padding: "6px 14px", fontSize: 11 }}>Revoke</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== WALLET ===== */}
      {tab === "wallet" && (
        <div className="card">
          <div className="card-title">Connected Wallet</div>

          {/* Address */}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 14,
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 10, color: "var(--dim)", letterSpacing: 1, textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                  Primary Address
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--c5)", marginTop: 4 }}>
                  0x76AB...CE91
                </div>
              </div>
              <span
                style={{
                  fontSize: 10,
                  padding: "3px 10px",
                  borderRadius: 8,
                  background: "rgba(0,212,170,0.1)",
                  color: "var(--c4)",
                  fontWeight: 600,
                }}
              >
                Privy MPC
              </span>
            </div>
          </div>

          {/* Details */}
          {[
            { key: "Network", val: "Polygon Mainnet" },
            { key: "Custody Model", val: "Privy MPC (non-custodial)" },
            { key: "Daily Limit", val: "50,000,000 VND" },
            { key: "Monthly Limit", val: "500,000,000 VND" },
            { key: "Whitelist", val: "3 addresses" },
          ].map((row) => (
            <div key={row.key} className="chain-info-row">
              <span className="cir-key">{row.key}</span>
              <span className="cir-val">{row.val}</span>
            </div>
          ))}
        </div>
      )}

      {/* ===== PREFERENCES ===== */}
      {tab === "preferences" && (
        <>
        <InstallPrompt />
        <div className="card">
          <div className="card-title">Display</div>

          {/* Toggle rows */}
          <div className="toggle-row">
            <div className="toggle-info">
              <div className="toggle-label">Dark Mode</div>
              <div className="toggle-sub">Switch between dark and light theme</div>
            </div>
            <div className={`toggle-switch ${darkMode ? "on" : ""}`} onClick={() => setDarkMode(!darkMode)}>
              <div className="toggle-thumb" />
            </div>
          </div>

          <div className="toggle-row">
            <div className="toggle-info">
              <div className="toggle-label">Show Balance</div>
              <div className="toggle-sub">Display balance on dashboard</div>
            </div>
            <div className={`toggle-switch ${showBalance ? "on" : ""}`} onClick={() => setShowBalance(!showBalance)}>
              <div className="toggle-thumb" />
            </div>
          </div>

          <div className="toggle-row" style={{ borderBottom: "none" }}>
            <div className="toggle-info">
              <div className="toggle-label">Chakra Effects</div>
              <div className="toggle-sub">Visual effects and animations</div>
            </div>
            <div className={`toggle-switch ${chakra ? "on" : ""}`} onClick={() => setChakra(!chakra)}>
              <div className="toggle-thumb" />
            </div>
          </div>

          {/* Selects */}
          <div style={{ marginTop: 20 }}>
            <div className="card-title">Regional</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div>
                <label className="input-label">Language</label>
                <select className="input-field" defaultValue="vi">
                  <option value="vi">Tieng Viet</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label className="input-label">Currency</label>
                <select className="input-field" defaultValue="VND">
                  <option value="VND">VND</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              <div>
                <label className="input-label">Timezone</label>
                <select className="input-field" defaultValue="UTC+7">
                  <option value="UTC+7">UTC+7 (HCM)</option>
                  <option value="UTC+0">UTC+0</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notification toggles */}
          <div style={{ marginTop: 20 }}>
            <div className="card-title">Notifications</div>

            <div className="toggle-row">
              <div className="toggle-info">
                <div className="toggle-label">Commission alerts</div>
                <div className="toggle-sub">New commissions and payouts</div>
              </div>
              <div className={`toggle-switch ${notifCommission ? "on" : ""}`} onClick={() => setNotifCommission(!notifCommission)}>
                <div className="toggle-thumb" />
              </div>
            </div>

            <div className="toggle-row">
              <div className="toggle-info">
                <div className="toggle-label">News & Updates</div>
                <div className="toggle-sub">Platform news and promotions</div>
              </div>
              <div className={`toggle-switch ${notifNews ? "on" : ""}`} onClick={() => setNotifNews(!notifNews)}>
                <div className="toggle-thumb" />
              </div>
            </div>

            <div className="toggle-row">
              <div className="toggle-info">
                <div className="toggle-label">On-chain events</div>
                <div className="toggle-sub">Transaction confirmations</div>
              </div>
              <div className={`toggle-switch ${notifOnchain ? "on" : ""}`} onClick={() => setNotifOnchain(!notifOnchain)}>
                <div className="toggle-thumb" />
              </div>
            </div>

            <div className="toggle-row" style={{ borderBottom: "none" }}>
              <div className="toggle-info">
                <div className="toggle-label">Rank changes</div>
                <div className="toggle-sub">Rank up / down notifications</div>
              </div>
              <div className={`toggle-switch ${notifRank ? "on" : ""}`} onClick={() => setNotifRank(!notifRank)}>
                <div className="toggle-thumb" />
              </div>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
}
