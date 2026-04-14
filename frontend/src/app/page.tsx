"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CosmicBackground } from "@/components/ui/CosmicBackground";

/* ═══ SCROLL REVEAL HOOK ═══ */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.01, rootMargin: "0px 0px 200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

/* ═══ ANIMATED COUNTER ═══ */
function Counter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const { ref, visible } = useReveal();
  useEffect(() => {
    if (!visible) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setVal(Math.round(end * ease));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, end, duration]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ═══ TYPING TERMINAL ═══ */
function Terminal() {
  const lines = [
    { cmd: "$ zeni deploy --network polygon", delay: 0 },
    { out: "✓ ZeniToken deployed → 0x2d0E...5EC1", delay: 1200 },
    { out: "✓ AffiliateCommission → 0x1d59...0714", delay: 2000 },
    { out: "✓ ZeniBadge (SBT) → 0xB157...D79D", delay: 2800 },
    { cmd: "$ zeni tokenomics --show", delay: 4000 },
    { out: "  Total Supply: 1,000,000,000 ZENI", delay: 4800 },
    { out: "  Price: $0.05 · FDV: $50,000,000", delay: 5400 },
    { out: "  Pools: 10 · Vesting: Active", delay: 6000 },
    { cmd: "$ zeni status", delay: 7000 },
    { out: "  Network: Polygon Mainnet ⚡", delay: 7600 },
    { out: "  Gas: <0.001 ZENI · Finality: 2s", delay: 8200 },
    { out: "  KOC Network: 5,500+ active", delay: 8800 },
  ];

  const [shown, setShown] = useState<number>(0);

  useEffect(() => {
    const timers = lines.map((l, i) =>
      setTimeout(() => setShown(i + 1), l.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="terminal">
      <div className="terminal-bar">
        <div className="terminal-dots">
          <span style={{ background: "#FF5F57" }} />
          <span style={{ background: "#FFBD2E" }} />
          <span style={{ background: "#28CA41" }} />
        </div>
        <span className="terminal-title">zeni-chain — polygon</span>
      </div>
      <div className="terminal-body">
        {lines.slice(0, shown).map((l, i) => (
          <div key={i} className={l.cmd ? "term-cmd" : "term-out"}>
            {l.cmd || l.out}
          </div>
        ))}
        {shown < lines.length && <span className="cursor-blink">▌</span>}
      </div>
    </div>
  );
}

/* ═══ REVEAL SECTION WRAPPER ═══ */
function Reveal({ children, className = "", delay = 0, instant = false }: { children: React.ReactNode; className?: string; delay?: number; instant?: boolean }) {
  const { ref, visible } = useReveal();
  const show = instant || visible;
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(30px)",
        transition: instant ? "none" : `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ═══ MAIN LANDING PAGE ═══ */
export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="landing-root">
      <CosmicBackground />
      {/* ═══ NAVBAR ═══ */}
      <nav className={`land-nav ${scrollY > 50 ? "nav-scrolled" : ""}`}>
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <div className="logo-hex">Z</div>
            <span className="logo-text">Zeni<span className="logo-accent"> Chain</span></span>
          </Link>

          <div className="nav-links">
            {[
              { label: "Tính năng", href: "#features" },
              { label: "Zeni ID", href: "#zenid" },
              { label: "Hệ sinh thái", href: "#eco" },
              { label: "Tokenomics", href: "#token" },
            ].map((l) => (
              <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
            ))}
          </div>

          <div className="nav-actions">
            <Link href="/login" className="btn-nav-login">Đăng nhập</Link>
            <Link href="/register" className="btn-nav-signup">Bắt đầu miễn phí</Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="hero-section">
        {/* Animated gradient orbs */}
        <div className="hero-orb orb-1" style={{ transform: `translate(${scrollY * 0.05}px, ${scrollY * -0.08}px)` }} />
        <div className="hero-orb orb-2" style={{ transform: `translate(${scrollY * -0.03}px, ${scrollY * -0.06}px)` }} />
        <div className="hero-orb orb-3" style={{ transform: `translate(${scrollY * 0.04}px, ${scrollY * 0.03}px)` }} />

        {/* Grid lines */}
        <div className="hero-grid" />

        <div className="hero-content">
          <Reveal instant>
            <div className="hero-badge">
              <span className="badge-dot" />
              <span>Polygon CDK · Live on Mainnet</span>
            </div>
          </Reveal>

          <Reveal instant>
            <h1 className="hero-title">
              Blockchain cho
              <br />
              <span className="hero-gradient-text">Wellness & Commerce</span>
              <br />
              <span className="hero-region">khu vực ASEAN</span>
            </h1>
          </Reveal>

          <Reveal instant>
            <p className="hero-desc">
              Nền tảng Web3 duy nhất có real utility từ hệ sinh thái wellness thật.
              <br className="hidden md:block" />
              Kiếm $ZENI từ doanh số thật, không đầu cơ, không farming.
            </p>
          </Reveal>

          <Reveal instant>
            <div className="hero-cta">
              <Link href="/register" className="btn-hero-primary">
                <span>Tạo Zeni ID miễn phí</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
              <Link href="/dashboard" className="btn-hero-secondary">Xem Demo</Link>
            </div>
          </Reveal>

          <Reveal instant>
            <div className="hero-stats-row">
              {[
                { val: 20, suffix: "M+", label: "$ZENI Staked" },
                { val: 5500, suffix: "+", label: "KOC Network" },
                { val: 45, suffix: "tr", label: "GMV / Tháng" },
                { val: 2, suffix: "s", label: "Finality" },
              ].map((s) => (
                <div key={s.label} className="hero-stat">
                  <div className="hero-stat-val">
                    <Counter end={s.val} suffix={s.suffix} />
                  </div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Terminal preview */}
        <Reveal instant className="hero-terminal-wrap">
          <Terminal />
        </Reveal>
      </section>

      {/* ═══ FEATURES / WHY ═══ */}
      <section className="section" id="features">
          <div className="section-header">
            <span className="section-tag">Tính năng</span>
            <h2 className="section-title">Tại sao chọn Zeni Chain?</h2>
            <p className="section-desc">Không giống bất kỳ blockchain nào — được xây dựng cho kinh doanh thật</p>
          </div>

        <div className="features-grid">
          {[
            {
              icon: "💡", title: "Real Utility", subtitle: "Không đầu cơ",
              desc: "$ZENI earned từ doanh số thật qua ANIMA Care, WellKOC, Biotea84. Token có demand thật từ voucher, gas fee, governance.",
              gradient: ["#00D4AA", "#4A8DFF"], tag: "Unique",
            },
            {
              icon: "🤝", title: "KOC Network", subtitle: "On-Chain",
              desc: "30% hoa hồng F1 + Revenue sharing on-chain. Escrow 7 ngày, clawback smart contract. Minh bạch 100%.",
              gradient: ["#8B45FF", "#C084FC"], tag: "Smart Contract",
            },
            {
              icon: "🪪", title: "Zeni ID", subtitle: "1 tài khoản = 5 platform",
              desc: "Như Google Account — đăng ký 1 lần, KYC 1 lần, dùng toàn bộ hệ sinh thái. Không tạo tài khoản riêng.",
              gradient: ["#4A8DFF", "#00D4AA"], tag: "Decentralized SSO",
            },
            {
              icon: "🎟", title: "NFT Voucher", subtitle: "Đổi XP = dịch vụ thật",
              desc: "XP từ đơn hàng → Mint NFT Voucher → Đổi dịch vụ ANIMA Care. Voucher chuyển nhượng, bán lại được.",
              gradient: ["#F59E0B", "#EF4444"], tag: "ERC-1155",
            },
            {
              icon: "⚡", title: "Polygon CDK", subtitle: "Ultra-low gas",
              desc: "Gas dưới 0.001 $ZENI. Finality 2 giây. Settlement về Ethereum L1. ~2,400 TPS.",
              gradient: ["#00D4AA", "#8B45FF"], tag: "L2 Security",
            },
            {
              icon: "🌏", title: "ASEAN-Native", subtitle: "12 ngôn ngữ",
              desc: "VI · EN · ZH · JA · KO · TH · ID · MS · HI · AR · KM · LO. Giao diện và cộng đồng cho Đông Nam Á.",
              gradient: ["#A855F7", "#4A8DFF"], tag: "SGX IPO 2031",
            },
          ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-glow" style={{ background: `radial-gradient(circle at 50% 0%, ${f.gradient[0]}15, transparent 70%)` }} />
                <div className="feature-line" style={{ background: `linear-gradient(90deg, ${f.gradient[0]}, ${f.gradient[1]})` }} />
                <div className="feature-icon" style={{ background: `${f.gradient[0]}18` }}>{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-subtitle">{f.subtitle}</div>
                <div className="feature-desc">{f.desc}</div>
                <span className="feature-tag" style={{ color: f.gradient[0], background: `${f.gradient[0]}12`, borderColor: `${f.gradient[0]}30` }}>{f.tag}</span>
              </div>
          ))}
        </div>
      </section>

      {/* ═══ ZENI ID ═══ */}
      <section className="section section-alt" id="zenid">
        <div className="zenid-container">
          <div className="zenid-left">
            <span className="section-tag">Zeni ID</span>
            <h2 className="section-title" style={{ textAlign: "left" }}>
              1 tài khoản.<br /><span className="hero-gradient-text">Toàn bộ hệ sinh thái.</span>
            </h2>
            <p className="zenid-desc">
              Như Google Account — bạn có 1 tài khoản Google để vào Gmail, YouTube, Google Meet. Zeni ID là 1 tài khoản cho toàn bộ hệ sinh thái.
            </p>
            <div className="zenid-checks">
              {[
                { icon: "✓", text: "Đăng ký 1 lần — dùng được toàn bộ 5 platform", color: "#00D4AA" },
                { icon: "✓", text: "KYC 1 lần — chính chủ, bảo mật AES-256", color: "#8B45FF" },
                { icon: "✓", text: "$ZENI và XP chảy xuyên suốt toàn hệ sinh thái", color: "#4A8DFF" },
              ].map((c) => (
                <div key={c.text} className="zenid-check">
                  <span className="check-icon" style={{ background: `${c.color}20`, color: c.color }}>{c.icon}</span>
                  <span>{c.text}</span>
                </div>
              ))}
            </div>
            <Link href="/register" className="btn-hero-primary" style={{ marginTop: 24 }}>
              <span>Tạo Zeni ID ngay</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>

          <div className="zenid-right">
            <div className="zenid-card-grid">
              {[
                { icon: "🏥", name: "ANIMA Care", tag: "Wellness · Miễn phí", color: "#00D4AA" },
                { icon: "🎯", name: "WellKOC", tag: "Commerce · Pro", color: "#8B45FF" },
                { icon: "🍃", name: "Biotea84", tag: "Marketplace", color: "#00D4AA" },
                { icon: "💻", name: "Zeni Digital", tag: "SaaS Suite", color: "#4A8DFF" },
                { icon: "🏗", name: "NexBuild", tag: "Construction", color: "#F59E0B" },
                { icon: "⛓", name: "Zeni Chain", tag: "Infrastructure", color: "#8B45FF", special: true },
              ].map((p) => (
                <div key={p.name} className={`zenid-platform ${p.special ? "zenid-special" : ""}`}>
                  <div className="zenid-p-icon" style={{ background: `${p.color}18` }}>{p.icon}</div>
                  <div>
                    <div className="zenid-p-name" style={p.special ? { color: "#8B45FF" } : {}}>{p.name}</div>
                    <div className="zenid-p-tag">{p.tag}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="zenid-footer">🔒 1 Zeni ID · KYC 1 lần · Bảo mật AES-256</div>
          </div>
        </div>
      </section>

      {/* ═══ ECOSYSTEM ═══ */}
      <section className="section" id="eco">
          <div className="section-header">
            <span className="section-tag">Hệ sinh thái</span>
            <h2 className="section-title">Zeni Holdings Ecosystem</h2>
            <p className="section-desc">5 platform, 1 infrastructure, 1 token, 1 tài khoản</p>
          </div>

        <div className="eco-grid">
          {[
            { icon: "🏥", name: "ANIMA Care Global", desc: "Chuỗi Wellness: Clinics · KTV · ANIMA 119 · Đào tạo", status: "Active", active: true },
            { icon: "🎯", name: "WellKOC", desc: "Social Commerce: KOC Network · Live · Affiliate · NFT", status: "Active", active: true },
            { icon: "🍃", name: "Biotea84", desc: "Supply Chain Trà: Vùng nguyên liệu → Marketplace B2B", status: "Active", active: true },
            { icon: "💻", name: "Zeni Digital", desc: "SaaS: ZeniOS · ZeniERP · ZeniPay · Zeni Studio", status: "Building", active: false },
            { icon: "🏗", name: "NexBuild Holdings", desc: "Construction Tech: 11 modules · BIM · Digital Twin", status: "2028", active: false },
          ].map((eco) => (
              <div key={eco.name} className="eco-card-v2">
                <div className="eco-icon-v2">{eco.icon}</div>
                <div className="eco-name-v2">{eco.name}</div>
                <div className="eco-desc-v2">{eco.desc}</div>
                <span className={`eco-status-v2 ${eco.active ? "eco-active" : "eco-building"}`}>{eco.status}</span>
              </div>
          ))}
        </div>
      </section>

      {/* ═══ TOKENOMICS ═══ */}
      <section className="section section-alt" id="token">
          <div className="section-header">
            <span className="section-tag">Tokenomics</span>
            <h2 className="section-title">$ZENI Token</h2>
            <p className="section-desc">1 tỷ hard cap · Polygon Mainnet · Real demand từ hệ sinh thái</p>
          </div>

        <div className="token-grid">
          {[
            { val: 1000000000, displayVal: "1B", label: "Hard Cap", sub: "Không inflate thêm", color: "#00D4AA" },
            { val: 0.05, displayVal: "$0.05", label: "Public Price", sub: "FDV: $50M", color: "#8B45FF" },
            { val: 20, displayVal: "20%", label: "XP → ZENI", sub: "200M tokens", color: "#4A8DFF" },
            { val: 10, displayVal: "10%", label: "Founder Lock", sub: "Cliff 1yr + Vest 5yr", color: "#A855F7" },
            { val: 15, displayVal: "15%", label: "Investors", sub: "Cliff 6mo + Vest 2yr", color: "#F59E0B" },
          ].map((t) => (
              <div key={t.label} className="token-card">
                <div className="token-val" style={{ color: t.color }}>{t.displayVal}</div>
                <div className="token-label">{t.label}</div>
                <div className="token-sub">{t.sub}</div>
              </div>
          ))}
        </div>

          <div className="token-contract">
            <div className="token-contract-label">Smart Contract (Polygon Mainnet)</div>
            <div className="token-contract-addr">
              <span className="contract-dot" />
              0x2d0Ec889F3889F0a364b82039db9F8Bef78f5EC1
            </div>
          </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="section cta-section">
          <div className="cta-box">
            <h2 className="cta-title">Sẵn sàng bắt đầu?</h2>
            <p className="cta-desc">Tạo Zeni ID miễn phí. KYC 1 lần. Dùng được toàn bộ hệ sinh thái Zeni Holdings.</p>
            <div className="cta-btns">
              <Link href="/register" className="btn-hero-primary">
                <span>Tạo Zeni ID miễn phí</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
              <Link href="/dashboard" className="btn-hero-secondary">Xem Demo App</Link>
            </div>
          </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="land-footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <div className="logo-hex" style={{ width: 28, height: 28, fontSize: 12 }}>Z</div>
            <span className="logo-text" style={{ fontSize: 16 }}>Zeni<span className="logo-accent"> Chain</span></span>
          </div>
          <div className="footer-copy">Polygon CDK · zenichain.app · © 2026 Zeni Holdings. SGX IPO Target 2031.</div>
        </div>
      </footer>
    </div>
  );
}

