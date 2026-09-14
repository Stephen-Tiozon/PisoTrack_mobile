/**
 * PisoTrack — Complete UI (Single File)
 * Stack: React 18/19 + recharts
 * Usage: Drop this file anywhere and import as default export.
 * Fonts: Add to your CSS/HTML:
 *   @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
 */

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  // @ts-ignore: recharts is a web library not installed in this mobile project
} from "recharts";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  primary500: "#4F46E5",
  primary400: "#6C63FF",
  green: "#10B981",
  red: "#EF4444",
  yellow: "#F59E0B",
  n900: "#0F0F1A",
  n800: "#1A1A2E",
  n700: "#252540",
  n100: "#F1F0FF",
  white: "#FFFFFF",
};

const S = {
  jakarta: "'Plus Jakarta Sans', sans-serif",
  inter: "'Inter', sans-serif",
};

const gradientBg = `linear-gradient(135deg, ${C.primary500}, ${C.primary400})`;

// ─── Shared helpers ───────────────────────────────────────────────────────────

function GradientText({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span
      style={{
        background: gradientBg,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function CoinLogo({ size = 32 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        background: gradientBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7.5" stroke="white" strokeWidth="1.5" />
        <path
          d="M9 4.5v1.5m0 6v1.5M6.5 7C6.5 6.09 7.57 5.25 9 5.25S11.5 6.09 11.5 7c0 1.13-1.13 1.5-2.5 1.88C7.63 9.25 6.5 9.62 6.5 10.75S7.57 12.75 9 12.75 11.5 11.91 11.5 11"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  style,
  href,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  href?: string;
}) {
  const base: React.CSSProperties = {
    background: gradientBg,
    color: C.white,
    fontFamily: S.inter,
    fontWeight: 600,
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "opacity 0.2s, transform 0.15s",
    textDecoration: "none",
    ...style,
  };
  if (href) return <a href={href} style={base}>{children}</a>;
  return (
    <button
      onClick={onClick}
      style={base}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
    >
      {children}
    </button>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

function Navbar({ onShowApp }: { onShowApp: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = ["Features", "How It Works", "Screenshots", "Download"];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "rgba(15,15,26,0.94)" : "rgba(15,15,26,0.55)",
        backdropFilter: "blur(16px)",
        borderBottom: scrolled ? `1px solid ${C.n700}` : "1px solid transparent",
        transition: "all 0.3s",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "0 24px",
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <CoinLogo size={34} />
          <span style={{ fontFamily: S.jakarta, fontWeight: 700, fontSize: 20, color: C.white }}>PisoTrack</span>
        </div>

        {/* Desktop nav */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="desktop-nav">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
              style={{ fontFamily: S.inter, fontSize: 14, color: C.n100, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.primary400)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.n100)}
            >
              {l}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }} className="desktop-nav">
          <button
            onClick={onShowApp}
            style={{
              padding: "8px 18px",
              borderRadius: 999,
              border: `1px solid ${C.primary500}`,
              background: "transparent",
              color: C.primary400,
              fontFamily: S.inter,
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(79,70,229,0.12)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          >
            Preview App
          </button>
          <PrimaryButton href="#download" style={{ padding: "10px 20px", fontSize: 13 }}>
            ⬇ Download APK
          </PrimaryButton>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="mobile-only"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: C.n100 }}
          aria-label="Menu"
        >
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
            <rect y="0" width="22" height="2" rx="1" fill="currentColor"
              style={{ transformOrigin: "11px 1px", transform: open ? "rotate(45deg) translateY(7px)" : "none", transition: "transform 0.3s" }} />
            <rect y="7" width="22" height="2" rx="1" fill="currentColor"
              style={{ opacity: open ? 0 : 1, transition: "opacity 0.2s" }} />
            <rect y="14" width="22" height="2" rx="1" fill="currentColor"
              style={{ transformOrigin: "11px 15px", transform: open ? "rotate(-45deg) translateY(-7px)" : "none", transition: "transform 0.3s" }} />
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        style={{
          maxHeight: open ? 260 : 0,
          overflow: "hidden",
          background: C.n800,
          borderTop: open ? `1px solid ${C.n700}` : "none",
          transition: "max-height 0.3s",
        }}
        className="mobile-only"
      >
        <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          {links.map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
              style={{ fontFamily: S.inter, fontSize: 15, color: C.n100, textDecoration: "none", padding: "8px 0" }}
              onClick={() => setOpen(false)}
            >{l}</a>
          ))}
          <PrimaryButton href="#download" style={{ padding: "14px", fontSize: 14, marginTop: 8 }}>
            ⬇ Download APK
          </PrimaryButton>
        </div>
      </div>
    </nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function MiniPhone() {
  const txs = [
    { icon: "🚌", name: "Jeepney", amount: "-₱15", color: C.red, synced: true },
    { icon: "🍱", name: "Street Food", amount: "-₱75", color: C.red, synced: false },
    { icon: "💰", name: "Salary", amount: "+₱5,800", color: C.green, synced: true },
  ];
  return (
    <div
      style={{
        width: 270,
        height: 560,
        background: C.n800,
        border: `2px solid ${C.n700}`,
        borderRadius: 44,
        overflow: "hidden",
        boxShadow: `0 0 80px rgba(79,70,229,0.28), 0 24px 60px rgba(0,0,0,0.55)`,
        flexShrink: 0,
      }}
    >
      {/* Status */}
      <div style={{ background: C.n900, padding: "12px 20px 6px", display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: S.inter, fontSize: 11, fontWeight: 600, color: C.white }}>9:41</span>
        <div style={{ display: "flex", gap: 4 }}>
          {["signal", "wifi", "batt"].map((i) => (
            <div key={i} style={{ width: i === "batt" ? 22 : 14, height: 10, borderRadius: 2, background: "rgba(255,255,255,0.3)" }} />
          ))}
        </div>
      </div>
      {/* Content */}
      <div style={{ padding: "12px 16px", background: C.n900, height: "calc(100% - 34px)", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: S.inter, fontSize: 11, color: C.n100, opacity: 0.7 }}>Good morning 👋</div>
            <div style={{ fontFamily: S.jakarta, fontWeight: 700, fontSize: 16, color: C.white }}>Stephen</div>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: gradientBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: S.inter, fontWeight: 700, fontSize: 13, color: C.white }}>S</div>
        </div>
        <div style={{ background: gradientBg, borderRadius: 20, padding: 16, marginBottom: 12 }}>
          <div style={{ fontFamily: S.inter, fontSize: 10, color: "rgba(255,255,255,0.7)" }}>Total Balance</div>
          <div style={{ fontFamily: S.jakarta, fontWeight: 800, fontSize: 24, color: C.white, margin: "6px 0" }}>₱ 2,450.00</div>
          <div style={{ display: "flex", gap: 16 }}>
            <div><div style={{ fontFamily: S.inter, fontSize: 9, color: "rgba(255,255,255,0.65)" }}>↑ Income</div><div style={{ fontFamily: S.inter, fontSize: 12, fontWeight: 600, color: "#86EFAC" }}>₱5,800</div></div>
            <div><div style={{ fontFamily: S.inter, fontSize: 9, color: "rgba(255,255,255,0.65)" }}>↓ Expenses</div><div style={{ fontFamily: S.inter, fontSize: 12, fontWeight: 600, color: "#FCA5A5" }}>₱3,350</div></div>
          </div>
        </div>
        <div style={{ fontFamily: S.jakarta, fontWeight: 600, fontSize: 13, color: C.white, marginBottom: 8 }}>Recent</div>
        {txs.map((tx, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid rgba(37,37,64,0.5)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: C.n800, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{tx.icon}</div>
              <div>
                <div style={{ fontFamily: S.inter, fontSize: 12, fontWeight: 600, color: C.white }}>{tx.name}</div>
                <div style={{ fontFamily: S.inter, fontSize: 10, color: C.n100, opacity: 0.55 }}>Sep 12</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3 }}>
              <div style={{ fontFamily: S.inter, fontSize: 12, fontWeight: 600, color: tx.color }}>{tx.amount}</div>
              <div style={{ padding: "2px 6px", borderRadius: 99, background: tx.synced ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)", color: tx.synced ? C.green : C.yellow, fontFamily: S.inter, fontSize: 9, fontWeight: 600 }}>
                {tx.synced ? "✓ Synced" : "⏳ Pending"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Hero({ onShowApp }: { onShowApp: () => void }) {
  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        background: C.n900,
        display: "flex",
        alignItems: "center",
        paddingTop: 72,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow */}
      <div style={{ position: "absolute", top: 0, right: 0, width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(79,70,229,0.22) 0%, transparent 70%)", transform: "translate(20%,-20%)", pointerEvents: "none" }} />
      {/* Grid */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "80px 24px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="hero-grid">
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 540 }}>
          <div style={{ display: "inline-flex", width: "fit-content", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 999, border: `1px solid ${C.primary500}`, background: "rgba(79,70,229,0.08)", fontFamily: S.inter, fontWeight: 600, fontSize: 13, color: C.primary400 }}>
            🇵🇭 Made for Filipinos
          </div>
          <h1 style={{ fontFamily: S.jakarta, fontWeight: 800, fontSize: "clamp(36px,4vw,58px)", lineHeight: 1.13, color: C.white, margin: 0 }}>
            Track every <GradientText>piso</GradientText>.<br />Zero internet needed.
          </h1>
          <p style={{ fontFamily: S.inter, fontSize: 18, color: C.n100, lineHeight: 1.75, margin: 0, opacity: 0.85, maxWidth: 480 }}>
            PisoTrack helps students and commuters log jeepney fares, food expenses, and daily spending — even without Wi-Fi.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <PrimaryButton href="#download" style={{ padding: "16px 32px", fontSize: 15 }}>⬇ Download APK</PrimaryButton>
            <button
              onClick={onShowApp}
              style={{ padding: "16px 28px", borderRadius: 999, border: `1px solid ${C.n700}`, background: "transparent", color: C.n100, fontFamily: S.inter, fontWeight: 600, fontSize: 15, cursor: "pointer", transition: "border-color 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.primary500; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.n700; }}
            >
              Preview App →
            </button>
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", paddingTop: 4 }}>
            {["Free", "Offline-First", "No Ads"].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: S.inter, fontSize: 13, color: C.n100 }}>
                <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill={C.green} fillOpacity="0.18" /><path d="M5 8l2 2 4-4" stroke={C.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Right: phone */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
          <div style={{ position: "absolute", left: -20, bottom: 60, zIndex: 2, padding: "10px 16px", borderRadius: 16, background: C.n800, border: `1px solid ${C.n700}`, transform: "rotate(-4deg)", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}>
            <div style={{ fontFamily: S.inter, fontSize: 11, color: C.n100, opacity: 0.65 }}>Latest</div>
            <div style={{ fontFamily: S.jakarta, fontWeight: 700, fontSize: 15, color: C.white }}>💸 ₱45 — Jeepney</div>
          </div>
          <div style={{ position: "absolute", right: -10, top: 60, zIndex: 2, padding: "10px 16px", borderRadius: 16, background: C.n800, border: `1px solid ${C.n700}`, transform: "rotate(3deg)", boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}>
            <div style={{ fontFamily: S.inter, fontSize: 11, color: C.green }}>📊 This week</div>
            <div style={{ fontFamily: S.jakarta, fontWeight: 700, fontSize: 15, color: C.white }}>Saved ₱320</div>
          </div>
          <div style={{ position: "absolute", right: 20, bottom: 80, zIndex: 2, display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 999, background: "rgba(79,70,229,0.2)", border: "1px solid rgba(79,70,229,0.4)" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.primary400, animation: "pulse 1.5s infinite" }} />
            <span style={{ fontFamily: S.inter, fontSize: 12, color: C.primary400, fontWeight: 600 }}>🔄 Syncing...</span>
          </div>
          <MiniPhone />
        </div>
      </div>
    </section>
  );
}

// ─── FEATURES ─────────────────────────────────────────────────────────────────

const FEATURES = [
  { icon: "⚡", title: "Instant Logging", desc: "Add an expense in under 3 seconds. No loading screen, no internet required." },
  { icon: "📡", title: "Auto Wi-Fi Sync", desc: "When you reconnect, PisoTrack silently syncs your data to the cloud." },
  { icon: "📊", title: "Smart Insights", desc: "Weekly and monthly breakdowns show where your money actually goes." },
  { icon: "🏷️", title: "Filipino Categories", desc: "Pre-built tags: Jeepney, Tricycle, Street Food, Load, Utilities, and more." },
  { icon: "🔒", title: "Private & Secure", desc: "Your data stays on your phone until YOU choose to sync it." },
  { icon: "🆓", title: "100% Free", desc: "No premium tiers. No ads. No tricks. Just a tool that works." },
];

function Features() {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <section id="features" style={{ background: C.n900, padding: "96px 24px" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontFamily: S.inter, fontWeight: 600, fontSize: 12, letterSpacing: 2, color: C.primary400, textTransform: "uppercase", marginBottom: 16 }}>WHY PISOTRACK</div>
          <h2 style={{ fontFamily: S.jakarta, fontWeight: 700, fontSize: "clamp(26px,3vw,40px)", color: C.white, margin: "0 0 16px" }}>Built for real Filipino life.</h2>
          <p style={{ fontFamily: S.inter, fontSize: 16, color: C.n100, opacity: 0.75, maxWidth: 460, margin: "0 auto" }}>No frills. No subscription. Just fast, offline expense tracking.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: 28,
                borderRadius: 24,
                background: C.n800,
                border: `1px solid ${hovered === i ? C.primary500 : C.n700}`,
                boxShadow: hovered === i ? `0 8px 40px rgba(79,70,229,0.2)` : `0 4px 24px rgba(79,70,229,0.06)`,
                transform: hovered === i ? "translateY(-4px)" : "none",
                transition: "all 0.22s",
                cursor: "default",
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 16, background: "rgba(79,70,229,0.14)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontFamily: S.jakarta, fontWeight: 600, fontSize: 18, color: C.white, margin: "0 0 10px" }}>{f.title}</h3>
              <p style={{ fontFamily: S.inter, fontSize: 14, color: C.n100, opacity: 0.72, lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    { num: "01", emoji: "⬇️", title: "Install the APK", body: "Download the free APK file directly to your Android device. No Play Store needed." },
    { num: "02", emoji: "✏️", title: "Log Your Expenses", body: "Tap the + button, enter the amount and category. Done in 3 seconds — offline." },
    { num: "03", emoji: "☁️", title: "Sync When Ready", body: "Connect to Wi-Fi and PisoTrack automatically backs up your data securely." },
  ];
  return (
    <section id="how-it-works" style={{ background: `linear-gradient(180deg, ${C.n900} 0%, ${C.n800} 100%)`, padding: "96px 24px" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <div style={{ fontFamily: S.inter, fontWeight: 600, fontSize: 12, letterSpacing: 2, color: C.primary400, textTransform: "uppercase", marginBottom: 16 }}>HOW IT WORKS</div>
          <h2 style={{ fontFamily: S.jakarta, fontWeight: 700, fontSize: "clamp(26px,3vw,40px)", color: C.white, margin: 0 }}>Simple as 1-2-3.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))", gap: 48, position: "relative" }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <div style={{ position: "relative", marginBottom: 20 }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(79,70,229,0.12)", border: "1px solid rgba(79,70,229,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>
                  {step.emoji}
                </div>
                <div style={{ position: "absolute", top: -6, right: -6, width: 26, height: 26, borderRadius: "50%", background: gradientBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: S.jakarta, fontWeight: 800, fontSize: 10, color: C.white }}>
                  {i + 1}
                </div>
              </div>
              <div style={{ fontFamily: S.jakarta, fontWeight: 800, fontSize: 52, lineHeight: 1, background: gradientBg, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", opacity: 0.35, marginBottom: 8 }}>{step.num}</div>
              <h3 style={{ fontFamily: S.jakarta, fontWeight: 700, fontSize: 20, color: C.white, margin: "0 0 12px" }}>{step.title}</h3>
              <p style={{ fontFamily: S.inter, fontSize: 15, color: C.n100, opacity: 0.72, lineHeight: 1.68, margin: 0, maxWidth: 260 }}>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SCREENSHOTS ──────────────────────────────────────────────────────────────

function ScreenshotPhone({ label, active, onClick, children }: { label: string; active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <div onClick={onClick} style={{ flexShrink: 0, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, transition: "all 0.3s", transform: active ? "scale(1.06) translateY(-14px)" : "scale(0.87)", opacity: active ? 1 : 0.5 }}>
      <div style={{ width: 210, height: 440, borderRadius: 36, background: C.n900, border: `2px solid ${active ? C.primary500 : C.n700}`, overflow: "hidden", boxShadow: active ? `0 16px 56px rgba(79,70,229,0.32)` : `0 8px 24px rgba(0,0,0,0.38)` }}>
        <div style={{ background: "rgba(0,0,0,0.3)", padding: "8px 16px", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: S.inter, fontSize: 9, fontWeight: 600, color: C.white }}>9:41</span>
          <div style={{ display: "flex", gap: 3 }}>{[10, 14, 18].map((w) => <div key={w} style={{ width: w, height: 6, borderRadius: 1, background: "rgba(255,255,255,0.3)" }} />)}</div>
        </div>
        <div style={{ height: "calc(100% - 28px)", overflowY: "auto", overflowX: "hidden" }}>{children}</div>
      </div>
      <span style={{ fontFamily: S.inter, fontSize: 13, fontWeight: 600, color: active ? C.primary400 : C.n100, opacity: active ? 1 : 0.5 }}>{label}</span>
    </div>
  );
}

function Screenshots() {
  const [active, setActive] = useState(1);

  const screenDefs = [
    {
      label: "Onboarding",
      content: (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16, padding: "24px 20px" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: gradientBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, boxShadow: "0 0 32px rgba(79,70,229,0.45)" }}>🪙</div>
          <h2 style={{ fontFamily: S.jakarta, fontWeight: 800, fontSize: 18, color: C.white, textAlign: "center", margin: 0 }}>Welcome to PisoTrack</h2>
          <p style={{ fontFamily: S.inter, fontSize: 12, color: C.n100, opacity: 0.75, textAlign: "center", lineHeight: 1.6, margin: 0 }}>Your offline-first expense tracker for everyday Filipinos.</p>
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ width: 20, height: 7, borderRadius: 99, background: C.primary500 }} />
            <div style={{ width: 7, height: 7, borderRadius: 99, background: C.n700 }} />
            <div style={{ width: 7, height: 7, borderRadius: 99, background: C.n700 }} />
          </div>
          <button style={{ width: "100%", padding: "12px", borderRadius: 999, background: gradientBg, color: C.white, border: "none", fontFamily: S.inter, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Get Started</button>
        </div>
      ),
    },
    {
      label: "Dashboard",
      content: (
        <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div><div style={{ fontFamily: S.inter, fontSize: 10, color: C.n100, opacity: 0.65 }}>Good morning 👋</div><div style={{ fontFamily: S.jakarta, fontWeight: 700, fontSize: 14, color: C.white }}>Stephen</div></div>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: gradientBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: C.white, fontFamily: S.inter }}>S</div>
          </div>
          <div style={{ background: gradientBg, borderRadius: 18, padding: "14px" }}>
            <div style={{ fontFamily: S.inter, fontSize: 9, color: "rgba(255,255,255,0.7)" }}>Total Balance</div>
            <div style={{ fontFamily: S.jakarta, fontWeight: 800, fontSize: 20, color: C.white, margin: "4px 0" }}>₱ 2,450.00</div>
            <div style={{ display: "flex", gap: 12 }}>
              <div><div style={{ fontFamily: S.inter, fontSize: 8, color: "rgba(255,255,255,0.65)" }}>↑ Income</div><div style={{ fontFamily: S.inter, fontSize: 10, fontWeight: 600, color: "#86EFAC" }}>₱5,800</div></div>
              <div><div style={{ fontFamily: S.inter, fontSize: 8, color: "rgba(255,255,255,0.65)" }}>↓ Expenses</div><div style={{ fontFamily: S.inter, fontSize: 10, fontWeight: 600, color: "#FCA5A5" }}>₱3,350</div></div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {["➕", "📥", "🔄", "📊"].map((ic, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: C.n800, border: `1px solid ${C.n700}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{ic}</div>
                <span style={{ fontFamily: S.inter, fontSize: 8, color: C.n100, opacity: 0.65 }}>{["Add", "Income", "Sync", "Report"][i]}</span>
              </div>
            ))}
          </div>
          {[{ icon: "🚌", n: "Jeepney", a: "-₱15", c: C.red }, { icon: "🍱", n: "Street Food", a: "-₱75", c: C.red }].map((tx, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid rgba(37,37,64,0.5)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 9, background: C.n800, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>{tx.icon}</div>
                <div style={{ fontFamily: S.inter, fontSize: 11, fontWeight: 600, color: C.white }}>{tx.n}</div>
              </div>
              <div style={{ fontFamily: S.inter, fontSize: 11, fontWeight: 600, color: tx.c }}>{tx.a}</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: "Add Expense",
      content: (
        <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: C.white, fontSize: 18 }}>←</span>
            <span style={{ fontFamily: S.jakarta, fontWeight: 700, fontSize: 13, color: C.white }}>Add Expense</span>
            <span style={{ fontFamily: S.inter, fontSize: 11, fontWeight: 600, color: C.primary400 }}>Done</span>
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <span style={{ padding: "6px 16px", borderRadius: 999, background: C.red, color: C.white, fontFamily: S.inter, fontSize: 11, fontWeight: 600 }}>Expense</span>
            <span style={{ padding: "6px 16px", borderRadius: 999, background: C.n800, color: C.n100, fontFamily: S.inter, fontSize: 11, fontWeight: 600, border: `1px solid ${C.n700}` }}>Income</span>
          </div>
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <div style={{ fontFamily: S.jakarta, fontWeight: 800, fontSize: 36, color: C.white }}>₱ 0.00</div>
            <div style={{ width: 80, height: 2, background: C.primary500, margin: "6px auto 0" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
            {["1","2","3","4","5","6","7","8","9",".","0","⌫"].map((k) => (
              <div key={k} style={{ padding: "10px", borderRadius: 14, background: C.n800, border: `1px solid ${C.n700}`, textAlign: "center", fontFamily: S.inter, fontWeight: 600, fontSize: 14, color: C.white, cursor: "pointer" }}>{k}</div>
            ))}
          </div>
          <button style={{ width: "100%", padding: "12px", borderRadius: 999, background: gradientBg, color: C.white, border: "none", fontFamily: S.inter, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Save Expense</button>
        </div>
      ),
    },
    {
      label: "Transactions",
      content: (
        <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontFamily: S.jakarta, fontWeight: 700, fontSize: 16, color: C.white }}>Transactions</div>
          <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
            {["All","Today","Week","Month"].map((f, i) => (
              <span key={f} style={{ padding: "4px 10px", borderRadius: 999, background: i === 0 ? C.primary500 : C.n800, color: C.white, fontFamily: S.inter, fontSize: 10, fontWeight: 600, whiteSpace: "nowrap", border: `1px solid ${i === 0 ? C.primary500 : C.n700}` }}>{f}</span>
            ))}
          </div>
          {[
            { icon: "🚌", n: "Jeepney", d: "Sep 12", a: "-₱15", c: C.red, s: true },
            { icon: "🍱", n: "Street Food", d: "Sep 12", a: "-₱75", c: C.red, s: false },
            { icon: "📱", n: "Load", d: "Sep 11", a: "-₱50", c: C.red, s: true },
            { icon: "💰", n: "Salary", d: "Sep 10", a: "+₱5,800", c: C.green, s: true },
            { icon: "🛺", n: "Tricycle", d: "Sep 10", a: "-₱25", c: C.red, s: true },
          ].map((tx, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid rgba(37,37,64,0.4)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: 10, background: C.n800, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{tx.icon}</div>
                <div>
                  <div style={{ fontFamily: S.inter, fontSize: 11, fontWeight: 600, color: C.white }}>{tx.n}</div>
                  <div style={{ fontFamily: S.inter, fontSize: 9, color: C.n100, opacity: 0.55 }}>{tx.d}</div>
                </div>
              </div>
              <div style={{ fontFamily: S.inter, fontSize: 11, fontWeight: 600, color: tx.c }}>{tx.a}</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: "Analytics",
      content: (
        <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: S.jakarta, fontWeight: 700, fontSize: 16, color: C.white }}>Reports</span>
            <span style={{ fontFamily: S.inter, fontSize: 11, color: C.primary400, fontWeight: 600 }}>‹ Sep ›</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ padding: "12px", borderRadius: 16, background: C.n800, border: `1px solid ${C.n700}` }}>
              <div style={{ fontFamily: S.inter, fontSize: 9, color: C.n100, opacity: 0.65, marginBottom: 4 }}>Total Spent</div>
              <div style={{ fontFamily: S.jakarta, fontWeight: 700, fontSize: 17, color: C.red }}>₱3,350</div>
            </div>
            <div style={{ padding: "12px", borderRadius: 16, background: C.n800, border: `1px solid ${C.n700}` }}>
              <div style={{ fontFamily: S.inter, fontSize: 9, color: C.n100, opacity: 0.65, marginBottom: 4 }}>Saved vs Last</div>
              <div style={{ fontFamily: S.jakarta, fontWeight: 700, fontSize: 17, color: C.green }}>+₱420</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <PieChart width={90} height={90}>
              <Pie data={[{ v: 37 }, { v: 29 }, { v: 20 }, { v: 14 }]} dataKey="v" cx={40} cy={40} innerRadius={26} outerRadius={42} strokeWidth={0}>
                {[C.primary500, C.green, C.yellow, C.red].map((c, i) => <Cell key={i} fill={c} />)}
              </Pie>
            </PieChart>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
              {[["🚌 Transport", C.primary500], ["🍱 Food", C.green], ["📱 Load", C.yellow], ["Others", C.red]].map(([l, c], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: c as string, flexShrink: 0 }} />
                  <span style={{ fontFamily: S.inter, fontSize: 10, color: C.n100 }}>{l as string}</span>
                </div>
              ))}
            </div>
          </div>
          {[["🚌 Transport", "65%", C.primary500], ["🍱 Food", "45%", C.green], ["📱 Load", "30%", C.yellow]].map(([l, w, c], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: S.inter, fontSize: 10, color: C.n100, width: 80, flexShrink: 0 }}>{l as string}</span>
              <div style={{ flex: 1, height: 10, borderRadius: 99, background: C.n700 }}>
                <div style={{ width: w as string, height: "100%", borderRadius: 99, background: c as string, transition: "width 0.8s" }} />
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <section id="screenshots" style={{ background: C.n900, padding: "96px 0 80px", overflow: "hidden" }}>
      <div style={{ textAlign: "center", marginBottom: 56, padding: "0 24px" }}>
        <h2 style={{ fontFamily: S.jakarta, fontWeight: 700, fontSize: "clamp(26px,3vw,40px)", color: C.white, margin: "0 0 12px" }}>See it in action.</h2>
        <p style={{ fontFamily: S.inter, fontSize: 16, color: C.n100, opacity: 0.72, margin: 0 }}>Every screen designed for speed and clarity.</p>
      </div>
      <div style={{ display: "flex", gap: 28, overflowX: "auto", padding: "20px 80px 40px", scrollBehavior: "smooth" }}
        className="scrollbar-hidden">
        {screenDefs.map((s, i) => (
          <ScreenshotPhone key={i} label={s.label} active={active === i} onClick={() => setActive(i)}>{s.content}</ScreenshotPhone>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 8 }}>
        {screenDefs.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} style={{ width: active === i ? 24 : 8, height: 8, borderRadius: 99, background: active === i ? C.primary500 : C.n700, border: "none", cursor: "pointer", transition: "all 0.3s" }} />
        ))}
      </div>
    </section>
  );
}

// ─── DOWNLOAD ─────────────────────────────────────────────────────────────────

function Download() {
  return (
    <section id="download" style={{ background: `linear-gradient(135deg, ${C.n800} 0%, ${C.n900} 100%)`, padding: "112px 24px", position: "relative", overflow: "hidden", textAlign: "center" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(79,70,229,0.32) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ fontFamily: S.jakarta, fontWeight: 800, fontSize: "clamp(30px,4vw,50px)", color: C.white, margin: "0 0 18px" }}>Ready to track smarter?</h2>
        <p style={{ fontFamily: S.inter, fontSize: 18, color: "rgba(255,255,255,0.72)", lineHeight: 1.68, margin: "0 auto 44px", maxWidth: 460 }}>
          Download PisoTrack APK for free. No sign-up required to get started.
        </p>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <a
            href="#"
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "18px 36px", borderRadius: 999, background: C.white, color: C.primary500, fontFamily: S.inter, fontWeight: 700, fontSize: 16, textDecoration: "none", boxShadow: "0 8px 40px rgba(79,70,229,0.28)", transition: "transform 0.2s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 3l14 9-14 9V3z" fill={C.primary500} /></svg>
            Download APK (v1.0)
          </a>
          <span style={{ fontFamily: S.inter, fontSize: 12, color: "rgba(255,255,255,0.45)" }}>Android 8.0+ · ~12MB · Free</span>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 64, marginTop: 64, flexWrap: "wrap" }}>
          {[["100%", "Free forever"], ["< 3s", "To log an expense"], ["0", "Ads or subscriptions"]].map(([num, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: S.jakarta, fontWeight: 800, fontSize: 36, background: gradientBg, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{num}</div>
              <div style={{ fontFamily: S.inter, fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  const cols = [
    { title: "Product", links: ["Features", "Download", "Changelog", "Roadmap"] },
    { title: "Developer", links: ["GitHub Repo", "API Docs", "Contribute", "License"] },
    { title: "Contact", links: ["Email Us", "Report a Bug", "Send Feedback", "Privacy Policy"] },
  ];
  return (
    <footer style={{ background: C.n900, borderTop: `1px solid ${C.n700}` }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "64px 24px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }} className="footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <CoinLogo size={32} />
              <span style={{ fontFamily: S.jakarta, fontWeight: 700, fontSize: 18, color: C.white }}>PisoTrack</span>
            </div>
            <p style={{ fontFamily: S.inter, fontSize: 14, color: C.n100, opacity: 0.58, lineHeight: 1.7, marginBottom: 20 }}>Track every piso. Anytime. Anywhere.</p>
            <div style={{ display: "flex", gap: 10 }}>
              {["GH", "FB"].map((s) => (
                <a key={s} href="#" style={{ width: 36, height: 36, borderRadius: 10, background: C.n800, border: `1px solid ${C.n700}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: S.inter, fontSize: 11, fontWeight: 700, color: C.n100, textDecoration: "none", transition: "border-color 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = C.primary500; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = C.n700; }}
                >{s}</a>
              ))}
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h4 style={{ fontFamily: S.jakarta, fontWeight: 600, fontSize: 14, color: C.white, margin: "0 0 16px" }}>{col.title}</h4>
              {col.links.map((l) => (
                <a key={l} href="#" style={{ display: "block", fontFamily: S.inter, fontSize: 14, color: C.n100, opacity: 0.58, textDecoration: "none", marginBottom: 10, transition: "all 0.15s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "1"; (e.currentTarget as HTMLAnchorElement).style.color = C.primary400; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = "0.58"; (e.currentTarget as HTMLAnchorElement).style.color = C.n100; }}
                >{l}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${C.n700}`, paddingTop: 28, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontFamily: S.inter, fontSize: 13, color: "rgba(241,240,255,0.4)" }}>© 2026 PisoTrack. Built with ❤️ for Filipino students and commuters.</span>
          <span style={{ fontFamily: S.inter, fontSize: 13, color: "rgba(241,240,255,0.4)" }}>v1.0.0 · Android 8.0+</span>
        </div>
      </div>
    </footer>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────

function LandingPage({ onShowApp }: { onShowApp: () => void }) {
  return (
    <div style={{ background: C.n900 }}>
      <Navbar onShowApp={onShowApp} />
      <Hero onShowApp={onShowApp} />
      <Features />
      <HowItWorks />
      <Screenshots />
      <Download />
      <Footer />
    </div>
  );
}

// ─── APP DEMO ─────────────────────────────────────────────────────────────────

type AppScreen = "onboarding" | "signin" | "home" | "add" | "transactions" | "reports" | "settings";

const ALL_TRANSACTIONS = [
  { icon: "🚌", name: "Jeepney", category: "Transport", date: "Sep 12, 2026", amount: "-₱15", color: C.red, synced: true },
  { icon: "🍱", name: "Street Food", category: "Food", date: "Sep 12, 2026", amount: "-₱75", color: C.red, synced: false },
  { icon: "📱", name: "Load", category: "Utilities", date: "Sep 11, 2026", amount: "-₱50", color: C.red, synced: true },
  { icon: "💰", name: "Salary", category: "Income", date: "Sep 10, 2026", amount: "+₱5,800", color: C.green, synced: true },
  { icon: "🛺", name: "Tricycle", category: "Transport", date: "Sep 10, 2026", amount: "-₱25", color: C.red, synced: true },
  { icon: "🍜", name: "Merienda", category: "Food", date: "Sep 9, 2026", amount: "-₱45", color: C.red, synced: true },
];

const SPEND_DATA = [
  { day: "Mon", amount: 120 },
  { day: "Tue", amount: 85 },
  { day: "Wed", amount: 200 },
  { day: "Thu", amount: 65 },
  { day: "Fri", amount: 320 },
  { day: "Sat", amount: 180 },
  { day: "Sun", amount: 95 },
];

const PIE_DATA = [
  { name: "Transport", value: 870 },
  { name: "Food", value: 600 },
  { name: "Load", value: 400 },
  { name: "Utilities", value: 320 },
  { name: "Others", value: 160 },
];

const PIE_COLORS = [C.primary500, C.green, C.yellow, C.red, "#8B5CF6"];

// ── App phone frame ────

function AppFrame({ children, syncState }: { children: React.ReactNode; syncState: string | null }) {
  return (
    <div style={{ width: 390, background: C.n900, border: `2px solid ${C.n700}`, borderRadius: 44, overflow: "hidden", boxShadow: "0 0 80px rgba(79,70,229,0.26), 0 24px 60px rgba(0,0,0,0.55)", display: "flex", flexDirection: "column" }}>
      {/* Status bar */}
      <div style={{ background: C.n900, padding: "12px 24px 6px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span style={{ fontFamily: S.inter, fontSize: 13, fontWeight: 600, color: C.white }}>9:41</span>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          <svg width="14" height="10" viewBox="0 0 14 10" fill="white" opacity="0.85">
            <rect x="0" y="3.5" width="2" height="6.5" rx="0.5" /><rect x="3" y="2" width="2" height="8" rx="0.5" /><rect x="6" y="0.5" width="2" height="9.5" rx="0.5" /><rect x="9" y="0" width="2" height="10" rx="0.5" />
          </svg>
          <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
            <rect x="0.5" y="0.5" width="20" height="11" rx="3" stroke="white" strokeOpacity="0.4" />
            <rect x="2" y="2" width="13" height="8" rx="1.5" fill="white" />
            <path d="M22 4v4a2 2 0 000-4z" fill="white" fillOpacity="0.4" />
          </svg>
        </div>
      </div>

      {/* Sync banner */}
      {syncState && (
        <div style={{
          margin: "4px 12px",
          padding: "8px 14px",
          borderRadius: 12,
          background: syncState === "offline" ? "rgba(245,158,11,0.14)" : syncState === "syncing" ? "rgba(79,70,229,0.14)" : "rgba(16,185,129,0.14)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 14 }}>{syncState === "offline" ? "📡" : syncState === "syncing" ? "🔄" : "✅"}</span>
          <span style={{ fontFamily: S.inter, fontSize: 12, fontWeight: 600, color: syncState === "offline" ? C.yellow : syncState === "syncing" ? C.primary400 : C.green }}>
            {syncState === "offline" ? "You're offline — expenses saved locally" : syncState === "syncing" ? "Syncing your data..." : "All data synced ✓"}
          </span>
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>{children}</div>
    </div>
  );
}

// ── App screens ────

function AppOnboarding({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(0);
  const slides = [
    { emoji: "🪙", title: "Welcome to PisoTrack", sub: "Your offline-first expense tracker. Built for everyday Filipinos.", cta: "Get Started" },
    { emoji: "📡", title: "Works Without Internet", sub: "Log jeepney fares and daily expenses instantly — syncs to cloud when Wi-Fi is available.", cta: "Next" },
    { emoji: "⚡", title: "Add Expenses in 3 Seconds", sub: "Tap. Type. Done. PisoTrack is designed to be fast above everything else.", cta: "Start Tracking →" },
  ];
  const s = slides[step];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", height: 720, padding: "48px 32px" }}>
      <div />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, textAlign: "center" }}>
        <div style={{ width: 110, height: 110, borderRadius: "50%", background: gradientBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, boxShadow: "0 0 48px rgba(79,70,229,0.48)" }}>{s.emoji}</div>
        <h1 style={{ fontFamily: S.jakarta, fontWeight: 800, fontSize: 26, color: C.white, margin: 0, lineHeight: 1.2 }}>{s.title}</h1>
        <p style={{ fontFamily: S.inter, fontSize: 15, color: C.n100, opacity: 0.78, lineHeight: 1.7, margin: 0, maxWidth: 300 }}>{s.sub}</p>
        <div style={{ display: "flex", gap: 8 }}>
          {slides.map((_, i) => <div key={i} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 99, background: i === step ? C.primary500 : C.n700, transition: "width 0.3s" }} />)}
        </div>
      </div>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
        <PrimaryButton onClick={() => step < 2 ? setStep(step + 1) : onNext()} style={{ width: "100%", padding: 16, fontSize: 15 }}>{s.cta}</PrimaryButton>
        <button onClick={onNext} style={{ background: "none", border: "none", color: C.primary400, fontFamily: S.inter, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Skip</button>
      </div>
    </div>
  );
}

function AppSignIn({ onNext }: { onNext: () => void }) {
  return (
    <div style={{ padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <CoinLogo size={52} />
        <h2 style={{ fontFamily: S.jakarta, fontWeight: 800, fontSize: 24, color: C.white, margin: 0 }}>Welcome back</h2>
        <p style={{ fontFamily: S.inter, fontSize: 14, color: C.n100, opacity: 0.6, margin: 0 }}>Sign in to your PisoTrack account</p>
      </div>
      {[{ label: "Email", ph: "you@example.com", type: "email" }, { label: "Password", ph: "••••••••", type: "password" }].map((f) => (
        <div key={f.label}>
          <label style={{ fontFamily: S.inter, fontWeight: 600, fontSize: 12, color: C.n100, display: "block", marginBottom: 6 }}>{f.label}</label>
          <input type={f.type} placeholder={f.ph} style={{ width: "100%", height: 52, padding: "0 16px", borderRadius: 12, background: C.n800, border: `1px solid ${C.n700}`, color: C.white, fontFamily: S.inter, fontSize: 14, outline: "none", boxSizing: "border-box" }}
            onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = C.primary500; }}
            onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = C.n700; }}
          />
        </div>
      ))}
      <div style={{ textAlign: "right", marginTop: -8 }}>
        <button style={{ background: "none", border: "none", color: C.primary400, fontFamily: S.inter, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Forgot Password?</button>
      </div>
      <PrimaryButton onClick={onNext} style={{ width: "100%", padding: 16, fontSize: 15 }}>Sign In</PrimaryButton>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1, height: 1, background: C.n700 }} />
        <span style={{ fontFamily: S.inter, fontSize: 13, color: C.n100, opacity: 0.45 }}>or</span>
        <div style={{ flex: 1, height: 1, background: C.n700 }} />
      </div>
      <button onClick={onNext} style={{ width: "100%", padding: "16px", borderRadius: 999, border: `1px solid ${C.n700}`, background: "transparent", color: C.n100, fontFamily: S.inter, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
        Continue without account (Offline Mode)
      </button>
      <p style={{ textAlign: "center", fontFamily: S.inter, fontSize: 14, color: C.n100, opacity: 0.6, margin: 0 }}>
        Don&apos;t have an account? <button style={{ background: "none", border: "none", color: C.primary400, fontWeight: 600, cursor: "pointer", fontFamily: S.inter, fontSize: 14 }}>Sign Up</button>
      </p>
    </div>
  );
}

function AppHome({ onNav }: { onNav: (s: AppScreen) => void }) {
  return (
    <div style={{ padding: "16px 20px 100px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: S.inter, fontSize: 13, color: C.n100, opacity: 0.65 }}>Good morning, 👋</div>
          <div style={{ fontFamily: S.jakarta, fontWeight: 700, fontSize: 21, color: C.white }}>Stephen</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.n800, border: `1px solid ${C.n700}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.n100} strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg>
            <div style={{ position: "absolute", top: -2, right: -2, width: 10, height: 10, borderRadius: "50%", background: C.red, border: `2px solid ${C.n900}` }} />
          </div>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: gradientBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: S.inter, fontWeight: 700, fontSize: 13, color: C.white }}>S</div>
        </div>
      </div>

      {/* Balance card */}
      <div style={{ background: gradientBg, borderRadius: 24, padding: 22, boxShadow: "0 8px 32px rgba(79,70,229,0.35)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <span style={{ fontFamily: S.inter, fontSize: 12, color: "rgba(255,255,255,0.72)" }}>Total Balance</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
        </div>
        <div style={{ fontFamily: S.jakarta, fontWeight: 800, fontSize: 38, color: C.white, margin: "8px 0" }}>₱ 2,450.00</div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div><div style={{ fontFamily: S.inter, fontSize: 11, color: "rgba(255,255,255,0.65)" }}>↑ Income</div><div style={{ fontFamily: S.inter, fontSize: 15, fontWeight: 600, color: "#86EFAC" }}>₱5,800</div></div>
          <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.2)" }} />
          <div><div style={{ fontFamily: S.inter, fontSize: 11, color: "rgba(255,255,255,0.65)" }}>↓ Expenses</div><div style={{ fontFamily: S.inter, fontSize: 15, fontWeight: 600, color: "#FCA5A5" }}>₱3,350</div></div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {[
          { icon: "➕", label: "Add", screen: "add" as AppScreen },
          { icon: "📥", label: "Income", screen: "add" as AppScreen },
          { icon: "🔄", label: "Sync", screen: "home" as AppScreen },
          { icon: "📊", label: "Reports", screen: "reports" as AppScreen },
        ].map((a) => (
          <button key={a.label} onClick={() => onNav(a.screen)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer" }}>
            <div style={{ width: 56, height: 56, borderRadius: 18, background: C.n800, border: `1px solid ${C.n700}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{a.icon}</div>
            <span style={{ fontFamily: S.inter, fontSize: 11, color: C.n100, opacity: 0.7 }}>{a.label}</span>
          </button>
        ))}
      </div>

      {/* Recent */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: S.jakarta, fontWeight: 600, fontSize: 16, color: C.white }}>Recent</span>
        <button onClick={() => onNav("transactions")} style={{ background: "none", border: "none", color: C.primary400, fontFamily: S.inter, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>See All →</button>
      </div>

      {ALL_TRANSACTIONS.slice(0, 4).map((tx, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid rgba(37,37,64,0.5)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: C.n800, border: `1px solid ${C.n700}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{tx.icon}</div>
            <div>
              <div style={{ fontFamily: S.inter, fontSize: 14, fontWeight: 600, color: C.white }}>{tx.name}</div>
              <div style={{ fontFamily: S.inter, fontSize: 12, color: C.n100, opacity: 0.5 }}>{tx.date}</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <div style={{ fontFamily: S.inter, fontSize: 15, fontWeight: 600, color: tx.color }}>{tx.amount}</div>
            <div style={{ padding: "2px 8px", borderRadius: 99, background: tx.synced ? "rgba(16,185,129,0.13)" : "rgba(245,158,11,0.13)", color: tx.synced ? C.green : C.yellow, fontFamily: S.inter, fontSize: 10, fontWeight: 600 }}>
              {tx.synced ? "✓ Synced" : "⏳ Pending"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AppAddExpense({ onBack }: { onBack: () => void }) {
  const [amount, setAmount] = useState("0");
  const [type, setType] = useState<"expense" | "income">("expense");
  const [cat, setCat] = useState("Jeepney");
  const cats = ["🚌 Jeepney", "🛺 Tricycle", "🍱 Food", "📱 Load", "🏠 Rent", "💊 Medicine", "🎓 School", "⚡ Utilities"];
  const press = (k: string) => {
    if (k === "⌫") setAmount((a) => (a.length > 1 ? a.slice(0, -1) : "0"));
    else if (k === "." && amount.includes(".")) return;
    else setAmount((a) => (a === "0" ? k : a + k));
  };
  return (
    <div style={{ padding: "16px 20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: C.n100, display: "flex" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
        </button>
        <span style={{ fontFamily: S.jakarta, fontWeight: 700, fontSize: 17, color: C.white }}>Add {type === "expense" ? "Expense" : "Income"}</span>
        <button style={{ background: "none", border: "none", color: C.primary400, fontFamily: S.inter, fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Done</button>
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        {(["expense", "income"] as const).map((t) => (
          <button key={t} onClick={() => setType(t)} style={{ padding: "8px 24px", borderRadius: 999, border: `1px solid ${type === t ? "transparent" : C.n700}`, background: type === t ? (t === "expense" ? C.red : C.green) : C.n800, color: C.white, fontFamily: S.inter, fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all 0.2s", textTransform: "capitalize" }}>
            {t === "expense" ? "Expense" : "Income"}
          </button>
        ))}
      </div>

      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <div style={{ fontFamily: S.jakarta, fontWeight: 800, fontSize: 52, color: C.white }}>₱ {amount}</div>
        <div style={{ width: 120, height: 2, background: C.primary500, margin: "10px auto 0" }} />
      </div>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        {cats.map((c) => {
          const label = c.split(" ").slice(1).join(" ");
          return (
            <button key={c} onClick={() => setCat(label)} style={{ padding: "8px 14px", borderRadius: 999, border: `1px solid ${cat === label ? C.primary500 : C.n700}`, background: cat === label ? C.primary500 : C.n800, color: C.white, fontFamily: S.inter, fontWeight: 600, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }}>
              {c}
            </button>
          );
        })}
      </div>

      <input placeholder="Add a note (optional)" style={{ width: "100%", height: 52, padding: "0 16px", borderRadius: 12, background: C.n800, border: `1px solid ${C.n700}`, color: C.white, fontFamily: S.inter, fontSize: 14, outline: "none", boxSizing: "border-box" }}
        onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = C.primary500; }}
        onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = C.n700; }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 12, background: C.n800, border: `1px solid ${C.n700}` }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.primary400} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
        <span style={{ fontFamily: S.inter, fontSize: 14, color: C.n100 }}>Today, Sep 12</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 12, background: "rgba(245,158,11,0.09)", border: "1px solid rgba(245,158,11,0.2)" }}>
        <span style={{ fontSize: 14 }}>💾</span>
        <span style={{ fontFamily: S.inter, fontSize: 12, color: C.yellow, fontWeight: 500 }}>Will sync when Wi-Fi is available</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        {["1","2","3","4","5","6","7","8","9",".","0","⌫"].map((k) => (
          <button key={k} onClick={() => press(k)} style={{ padding: "16px", borderRadius: 18, background: C.n800, border: `1px solid ${C.n700}`, color: C.white, fontFamily: S.inter, fontWeight: 600, fontSize: 18, cursor: "pointer", transition: "transform 0.1s, background 0.1s" }}
            onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.93)"; (e.currentTarget as HTMLButtonElement).style.background = C.n700; }}
            onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; (e.currentTarget as HTMLButtonElement).style.background = C.n800; }}
          >{k}</button>
        ))}
      </div>

      <PrimaryButton style={{ width: "100%", padding: 16, fontSize: 15 }}>Save Expense</PrimaryButton>
    </div>
  );
}

function AppTransactions() {
  const [filter, setFilter] = useState("All");
  return (
    <div style={{ padding: "16px 20px 100px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: S.jakarta, fontWeight: 700, fontSize: 21, color: C.white }}>Transactions</span>
        <div style={{ display: "flex", gap: 12 }}>
          {["search", "filter"].map((ic) => (
            <button key={ic} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.n100} strokeWidth="2" opacity={0.7}>
                {ic === "search" ? <><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></> : <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></>}
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        {["All", "Today", "This Week", "This Month"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 16px", borderRadius: 999, border: `1px solid ${filter === f ? C.primary500 : C.n700}`, background: filter === f ? C.primary500 : C.n800, color: C.white, fontFamily: S.inter, fontWeight: 600, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }}>
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: S.inter, fontWeight: 600, fontSize: 13, color: C.n100, opacity: 0.6 }}>September 2026</span>
        <span style={{ fontFamily: S.inter, fontWeight: 600, fontSize: 13, color: C.red }}>−₱870</span>
      </div>

      {ALL_TRANSACTIONS.map((tx, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid rgba(37,37,64,0.5)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: C.n800, border: `1px solid ${C.n700}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{tx.icon}</div>
            <div>
              <div style={{ fontFamily: S.inter, fontSize: 14, fontWeight: 600, color: C.white }}>{tx.name}</div>
              <div style={{ fontFamily: S.inter, fontSize: 12, color: C.n100, opacity: 0.5 }}>{tx.date}</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <div style={{ fontFamily: S.inter, fontSize: 15, fontWeight: 600, color: tx.color }}>{tx.amount}</div>
            <div style={{ padding: "2px 8px", borderRadius: 99, background: tx.synced ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)", color: tx.synced ? C.green : C.yellow, fontFamily: S.inter, fontSize: 10, fontWeight: 600 }}>
              {tx.synced ? "✓ Synced" : "⏳ Pending"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AppReports() {
  return (
    <div style={{ padding: "16px 20px 100px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: S.jakarta, fontWeight: 700, fontSize: 21, color: C.white }}>Reports</span>
        <span style={{ fontFamily: S.inter, fontSize: 14, fontWeight: 600, color: C.primary400 }}>‹ Sep 2026 ›</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[{ label: "Total Spent", val: "₱3,350", color: C.red, sub: "September" }, { label: "Saved vs Last", val: "+₱420", color: C.green, sub: "+14% better" }].map((c) => (
          <div key={c.label} style={{ padding: 18, borderRadius: 20, background: C.n800, border: `1px solid ${C.n700}` }}>
            <div style={{ fontFamily: S.inter, fontSize: 11, color: C.n100, opacity: 0.62, marginBottom: 6 }}>{c.label}</div>
            <div style={{ fontFamily: S.jakarta, fontWeight: 700, fontSize: 24, color: c.color }}>{c.val}</div>
            <div style={{ fontFamily: S.inter, fontSize: 11, color: c.color, opacity: 0.7, marginTop: 4 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: 18, borderRadius: 20, background: C.n800, border: `1px solid ${C.n700}` }}>
        <div style={{ fontFamily: S.jakarta, fontWeight: 600, fontSize: 15, color: C.white, marginBottom: 14 }}>Spending Breakdown</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <PieChart width={130} height={130}>
            <Pie data={PIE_DATA} cx={60} cy={60} innerRadius={38} outerRadius={58} dataKey="value" strokeWidth={0}>
              {PIE_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
            </Pie>
          </PieChart>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            {PIE_DATA.map((d, i) => (
              <div key={d.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: PIE_COLORS[i], flexShrink: 0 }} />
                  <span style={{ fontFamily: S.inter, fontSize: 12, color: C.n100 }}>{d.name}</span>
                </div>
                <span style={{ fontFamily: S.inter, fontSize: 12, color: C.n100, opacity: 0.55 }}>₱{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: 18, borderRadius: 20, background: C.n800, border: `1px solid ${C.n700}` }}>
        <div style={{ fontFamily: S.jakarta, fontWeight: 600, fontSize: 15, color: C.white, marginBottom: 14 }}>7-Day Spending</div>
        <ResponsiveContainer width="100%" height={130}>
          <LineChart data={SPEND_DATA}>
            <XAxis dataKey="day" tick={{ fill: C.n100, opacity: 0.5, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: C.n800, border: `1px solid ${C.n700}`, borderRadius: 10, fontFamily: S.inter, fontSize: 12 }}
              itemStyle={{ color: C.primary400 }}
              labelStyle={{ color: C.white }}
              formatter={(v: any) => [`₱${v}`, "Spent"]}
            />
            <Line type="monotone" dataKey="amount" stroke={C.primary400} strokeWidth={2.5} dot={{ fill: C.primary400, r: 4, strokeWidth: 0 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ padding: 18, borderRadius: 20, background: C.n800, border: `1px solid ${C.n700}` }}>
        <div style={{ fontFamily: S.jakarta, fontWeight: 600, fontSize: 15, color: C.white, marginBottom: 14 }}>Top Categories</div>
        {[
          { label: "🚌 Transport", w: "65%", color: C.primary500, val: "₱870" },
          { label: "🍱 Food", w: "45%", color: C.green, val: "₱600" },
          { label: "📱 Load", w: "30%", color: C.yellow, val: "₱400" },
          { label: "🏠 Rent", w: "24%", color: "#8B5CF6", val: "₱320" },
        ].map((b) => (
          <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span style={{ fontFamily: S.inter, fontSize: 12, color: C.n100, width: 110, flexShrink: 0 }}>{b.label}</span>
            <div style={{ flex: 1, height: 12, borderRadius: 99, background: C.n700 }}>
              <div style={{ width: b.w, height: "100%", borderRadius: 99, background: b.color, transition: "width 0.8s" }} />
            </div>
            <span style={{ fontFamily: S.inter, fontSize: 12, color: C.n100, opacity: 0.6, width: 44, textAlign: "right" }}>{b.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppSettings() {
  const sections = [
    { title: "Account", items: [{ icon: "👤", label: "Profile", value: "" }, { icon: "🔒", label: "Change Password", value: "" }, { icon: "🔔", label: "Notifications", value: "On" }] },
    { title: "Data", items: [{ icon: "☁️", label: "Sync Status", value: "2 mins ago" }, { icon: "📤", label: "Export Data", value: "CSV / PDF" }, { icon: "🗑️", label: "Clear Local Data", value: "" }] },
    { title: "Preferences", items: [{ icon: "💱", label: "Currency", value: "PHP ₱" }, { icon: "🌙", label: "Theme", value: "Dark" }, { icon: "📅", label: "Week Starts", value: "Monday" }] },
    { title: "About", items: [{ icon: "📋", label: "Version", value: "v1.0.0" }, { icon: "📄", label: "Privacy Policy", value: "" }, { icon: "💬", label: "Send Feedback", value: "" }, { icon: "⭐", label: "Rate the App", value: "" }] },
  ];
  return (
    <div style={{ padding: "16px 20px 100px", display: "flex", flexDirection: "column", gap: 16 }}>
      <span style={{ fontFamily: S.jakarta, fontWeight: 700, fontSize: 21, color: C.white }}>Settings</span>

      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px", borderRadius: 20, background: C.n800, border: `1px solid ${C.n700}` }}>
        <div style={{ width: 54, height: 54, borderRadius: "50%", background: gradientBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: S.jakarta, fontWeight: 700, fontSize: 20, color: C.white }}>S</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: S.jakarta, fontWeight: 700, fontSize: 16, color: C.white }}>Stephen Cruz</div>
          <div style={{ fontFamily: S.inter, fontSize: 13, color: C.n100, opacity: 0.55 }}>stephen@pisotrack.ph</div>
        </div>
        <button style={{ padding: "8px 14px", borderRadius: 999, background: "rgba(79,70,229,0.14)", color: C.primary400, fontFamily: S.inter, fontWeight: 600, fontSize: 13, border: "1px solid rgba(79,70,229,0.3)", cursor: "pointer" }}>Edit</button>
      </div>

      {sections.map((sec) => (
        <div key={sec.title}>
          <div style={{ fontFamily: S.inter, fontWeight: 600, fontSize: 12, color: C.primary400, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{sec.title}</div>
          <div style={{ borderRadius: 20, overflow: "hidden", border: `1px solid ${C.n700}` }}>
            {sec.items.map((item, i) => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: C.n800, borderBottom: i < sec.items.length - 1 ? `1px solid rgba(37,37,64,0.5)` : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{item.icon}</span>
                  <span style={{ fontFamily: S.inter, fontSize: 15, color: C.white }}>{item.label}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {item.value && <span style={{ fontFamily: S.inter, fontSize: 13, color: C.n100, opacity: 0.5 }}>{item.value}</span>}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.n100} strokeWidth="2" opacity={0.35}><path d="M9 18l6-6-6-6" /></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AppBottomNav({ active, onNav }: { active: AppScreen; onNav: (s: AppScreen) => void }) {
  const tabs = [
    { id: "home" as AppScreen, emoji: "🏠", label: "Home" },
    { id: "transactions" as AppScreen, emoji: "📋", label: "History" },
    { id: "add" as AppScreen, fab: true },
    { id: "reports" as AppScreen, emoji: "📊", label: "Reports" },
    { id: "settings" as AppScreen, emoji: "⚙️", label: "Settings" },
  ];
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-around", padding: "8px 16px 16px", background: C.n800, borderTop: `1px solid ${C.n700}` }}>
      {tabs.map((tab) =>
        tab.fab ? (
          <button key="fab" onClick={() => onNav("add")} style={{ width: 56, height: 56, borderRadius: "50%", background: gradientBg, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginTop: -16, boxShadow: "0 4px 24px rgba(79,70,229,0.48)", transition: "transform 0.15s" }}
            onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.93)"; }}
            onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
          >➕</button>
        ) : (
          <button key={tab.id} onClick={() => onNav(tab.id!)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", color: active === tab.id ? C.primary400 : C.n700, transition: "color 0.2s" }}>
            <span style={{ fontSize: 22 }}>{tab.emoji}</span>
            <span style={{ fontFamily: S.inter, fontSize: 10, fontWeight: 600 }}>{tab.label}</span>
          </button>
        )
      )}
    </div>
  );
}

function AppDemo({ onBack }: { onBack: () => void }) {
  const [screen, setScreen] = useState<AppScreen>("onboarding");
  const [syncState, setSyncState] = useState<string | null>("offline");
  const showNav = !["onboarding", "signin", "add"].includes(screen);

  const renderScreen = () => {
    switch (screen) {
      case "onboarding": return <AppOnboarding onNext={() => setScreen("signin")} />;
      case "signin": return <AppSignIn onNext={() => setScreen("home")} />;
      case "home": return <AppHome onNav={setScreen} />;
      case "add": return <AppAddExpense onBack={() => setScreen("home")} />;
      case "transactions": return <AppTransactions />;
      case "reports": return <AppReports />;
      case "settings": return <AppSettings />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.n900, display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 16px", position: "relative" }}>
      {/* Back btn */}
      <button onClick={onBack} style={{ position: "absolute", top: 24, left: 24, display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 999, border: `1px solid ${C.n700}`, background: C.n800, color: C.n100, fontFamily: S.inter, fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "border-color 0.2s" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.primary500; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.n700; }}
      >← Landing Page</button>

      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h2 style={{ fontFamily: S.jakarta, fontWeight: 800, fontSize: 32, color: C.white, margin: "0 0 8px" }}>PisoTrack App Preview</h2>
        <p style={{ fontFamily: S.inter, fontSize: 15, color: C.n100, opacity: 0.6, margin: 0 }}>Interactive mobile app demonstration</p>
      </div>

      {/* Screen tabs */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 16 }}>
        {[
          { id: "onboarding" as AppScreen, label: "📖 Onboarding" },
          { id: "signin" as AppScreen, label: "🔐 Sign In" },
          { id: "home" as AppScreen, label: "🏠 Dashboard" },
          { id: "add" as AppScreen, label: "➕ Add Expense" },
          { id: "transactions" as AppScreen, label: "📋 Transactions" },
          { id: "reports" as AppScreen, label: "📊 Reports" },
          { id: "settings" as AppScreen, label: "⚙️ Settings" },
        ].map((s) => (
          <button key={s.id} onClick={() => setScreen(s.id)} style={{ padding: "8px 16px", borderRadius: 999, border: `1px solid ${screen === s.id ? C.primary500 : C.n700}`, background: screen === s.id ? C.primary500 : C.n800, color: C.white, fontFamily: S.inter, fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Sync state controls */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 28 }}>
        <span style={{ fontFamily: S.inter, fontSize: 12, color: C.n100, opacity: 0.45 }}>Sync state:</span>
        {[{ id: null, label: "None" }, { id: "offline", label: "📡 Offline" }, { id: "syncing", label: "🔄 Syncing" }, { id: "synced", label: "✅ Synced" }].map((s) => (
          <button key={String(s.id)} onClick={() => setSyncState(s.id)} style={{ padding: "6px 14px", borderRadius: 999, border: `1px solid ${syncState === s.id ? C.primary500 : C.n700}`, background: syncState === s.id ? "rgba(79,70,229,0.3)" : C.n800, color: C.n100, fontFamily: S.inter, fontWeight: 600, fontSize: 12, cursor: "pointer", transition: "all 0.2s" }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Phone */}
      <div style={{ position: "relative" }}>
        <AppFrame syncState={syncState}>
          <div style={{ paddingBottom: showNav ? 80 : 0 }}>{renderScreen()}</div>
        </AppFrame>
        {showNav && (
          <div style={{ position: "absolute", bottom: 0, left: 2, right: 2, borderBottomLeftRadius: 42, borderBottomRightRadius: 42, overflow: "hidden" }}>
            <AppBottomNav active={screen} onNav={setScreen} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────────────────────

export default function PisoTrack() {
  const [view, setView] = useState<"landing" | "app">("landing");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0F0F1A; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hidden { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hidden::-webkit-scrollbar { display: none; }
        .desktop-nav { display: flex; }
        .mobile-only { display: none; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-only { display: flex !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      {view === "landing" ? (
        <LandingPage onShowApp={() => setView("app")} />
      ) : (
        <AppDemo onBack={() => setView("landing")} />
      )}
    </>
  );
}
