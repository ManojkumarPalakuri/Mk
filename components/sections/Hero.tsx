"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const roles = [
  "Full-Stack Developer",
  "Security Researcher",
  "Cloud Engineer",
  "Cryptography Enthusiast",
];

/* ─── Typewriter ─────────────────────────────────────────────── */
function TypewriterText({ texts }: { texts: string[] }) {
  const [idx, setIdx]        = useState(0);
  const [displayed, setDisp] = useState("");
  const [deleting, setDel]   = useState(false);
  const t                    = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const cur = texts[idx % texts.length];
    if (!deleting && displayed.length < cur.length)
      t.current = setTimeout(() => setDisp(cur.slice(0, displayed.length + 1)), 65);
    else if (!deleting && displayed.length === cur.length)
      t.current = setTimeout(() => setDel(true), 1800);
    else if (deleting && displayed.length > 0)
      t.current = setTimeout(() => setDisp(displayed.slice(0, -1)), 30);
    else if (deleting && displayed.length === 0) {
      setDel(false);
      setIdx(i => (i + 1) % texts.length);
    }
    return () => { if (t.current) clearTimeout(t.current); };
  }, [displayed, deleting, idx, texts]);

  return (
    <span>
      {displayed}
      <span className="cursor-blink" style={{ color: "var(--accent)", marginLeft: 1 }}>▌</span>
    </span>
  );
}

/* ─── Static counter ─────────────────────────────────────────── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(to / 60);
    const id = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(id); }
      else setVal(start);
    }, 20);
    return () => clearInterval(id);
  }, [to]);
  return <>{val}{suffix}</>;
}

const stats = [
  { value: 5, suffix: "+", label: "Projects"    },
  { value: 3, suffix: "",  label: "Internships"  },
  { value: 9, suffix: ".02", label: "CGPA"       },
  { value: 1, suffix: "",  label: "Published"    },
];

/* ─── Particle ───────────────────────────────────────────────── */
interface Particle { x: number; y: number; size: number; color: string; dur: number; delay: number; dx: number; dy: number }

function generateParticles(count: number): Particle[] {
  const colors = [
    "rgba(108,99,255,0.7)",
    "rgba(59,130,246,0.6)",
    "rgba(0,229,160,0.5)",
    "rgba(255,77,109,0.4)",
    "rgba(139,92,246,0.6)",
  ];
  return Array.from({ length: count }, () => ({
    x:     Math.random() * 100,
    y:     Math.random() * 100,
    size:  Math.random() * 2 + 0.5,
    color: colors[Math.floor(Math.random() * colors.length)],
    dur:   Math.random() * 7 + 5,
    delay: Math.random() * 5,
    dx:    (Math.random() - 0.5) * 36,
    dy:    (Math.random() - 0.5) * 36,
  }));
}

const PARTICLE_COUNT = 28; // keep GPU happy



/* ─── Glowing ring ────────────────────────────────────────────── */
function GlowRing({
  size, x, y, color, dur, delay
}: {
  size: number; x: string; y: string; color: string; dur: number; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: [0, 0.4, 0.1, 0.5, 0], scale: [0.5, 1, 1.4, 0.8, 1.2] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: "50%",
        border: `1px solid ${color}`,
        boxShadow: `0 0 20px ${color}, inset 0 0 20px ${color}30`,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
      }}
    />
  );
}

/* ─── Hero ────────────────────────────────────────────────────── */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const headY = useTransform(scrollYProgress, [0, 1], [0, -130]);
  const subY  = useTransform(scrollYProgress, [0, 1], [0, -65]);
  const bgY   = useTransform(scrollYProgress, [0, 1], [0, 80]);

  /* Mouse spotlight: write directly to a CSS custom prop on the section
     — zero React re-renders, runs entirely off the main thread paint path */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    el.style.setProperty("--spot-x", `${x}%`);
    el.style.setProperty("--spot-y", `${y}%`);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (el) el.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => { if (el) el.removeEventListener("mousemove", handleMouseMove); };
  }, [handleMouseMove]);

  /* Generate particles client-side only (Math.random causes SSR/client mismatch) */
  const [particles, setParticles] = useState<Particle[]>([]);
  useEffect(() => {
    setParticles(generateParticles(PARTICLE_COUNT));
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "stretch",
        overflow: "hidden",
        background: "var(--bg-primary)",
      }}
    >
      {/* ════════════════════════════════════════════════════════
          BACKGROUND LAYER STACK — bottom to top
      ══════════════════════════════════════════════════════════ */}

      {/* Standalone Extreme Top-Right Resume Button */}
      <motion.a
        href="/r1.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="mobile-resume-btn"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed",
          top: "clamp(2rem, 5vh, 3.5rem)",
          right: "clamp(1.5rem, 5vw, 4rem)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 20px",
          borderRadius: "8px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid var(--border-glass-hover)",
          color: "var(--text-secondary)",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 600,
          fontSize: "0.8rem",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          textDecoration: "none",
          zIndex: 1100,
          cursor: "pointer",
          backdropFilter: "blur(12px)",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          minHeight: "44px",
          minWidth: "44px",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.borderColor = "var(--accent)";
          el.style.color = "var(--text-primary)";
          el.style.background = "rgba(108,99,255,0.08)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.borderColor = "var(--border-glass-hover)";
          el.style.color = "var(--text-secondary)";
          el.style.background = "rgba(255,255,255,0.03)";
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 768px) {
            .mobile-resume-btn {
              top: 90px !important;
              right: 1.25rem !important;
            }
          }
        `}} />
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Resume
      </motion.a>

      {/* 1 ── Deep base radial gradient blobs ─────────────────── */}
      <motion.div style={{ y: bgY, willChange: "transform" }} className="pointer-events-none blob">
        {/* Primary purple blob */}
        <motion.div
          animate={{ scale: [1, 1.15, 0.95, 1.1, 1], opacity: [0.55, 0.75, 0.5, 0.7, 0.55] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "5%",
            left: "10%",
            width: "clamp(300px,45vw,700px)",
            height: "clamp(300px,45vw,700px)",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(108,99,255,0.22) 0%, rgba(59,130,246,0.08) 50%, transparent 70%)",
            filter: "blur(80px)",
            pointerEvents: "none",
            willChange: "transform, opacity",
          }}
        />
        {/* Cyan/green blob — bottom right */}
        <motion.div
          animate={{ scale: [1, 0.9, 1.2, 1], opacity: [0.4, 0.6, 0.35, 0.4] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{
            position: "absolute",
            bottom: "0%",
            right: "5%",
            width: "clamp(260px,35vw,550px)",
            height: "clamp(260px,35vw,550px)",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,229,160,0.15) 0%, rgba(0,212,255,0.07) 50%, transparent 70%)",
            filter: "blur(80px)",
            pointerEvents: "none",
            willChange: "transform, opacity",
          }}
        />
        {/* Warm blob — top center */}
        <motion.div
          animate={{ x: [-20, 20, -20], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{
            position: "absolute",
            top: "30%",
            left: "40%",
            width: "clamp(150px,22vw,380px)",
            height: "clamp(150px,22vw,380px)",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,77,109,0.1) 0%, rgba(139,92,246,0.06) 50%, transparent 70%)",
            filter: "blur(60px)",
            pointerEvents: "none",
            willChange: "transform, opacity",
          }}
        />
      </motion.div>

      {/* CSS-variable spotlight — no React re-render, GPU transition */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 55% 45% at var(--spot-x, 50%) var(--spot-y, 40%), rgba(108,99,255,0.13) 0%, rgba(59,130,246,0.05) 40%, transparent 70%)",
          pointerEvents: "none",
          transition: "background 0.12s ease",
          zIndex: 1,
        }}
      />



      {/* 4 ── Glowing rings ───────────────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2 }}>
        <GlowRing size={460} x="72%" y="38%" color="rgba(108,99,255,0.25)" dur={10} delay={0}   />
        <GlowRing size={280} x="68%" y="60%" color="rgba(0,229,160,0.2)"   dur={13} delay={2.5} />
        <GlowRing size={180} x="78%" y="25%" color="rgba(59,130,246,0.3)"  dur={8}  delay={1}   />
        <GlowRing size={120} x="58%" y="70%" color="rgba(139,92,246,0.25)" dur={9}  delay={4}   />

        {/* Static concentric dashed ring (decorative) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            right: "-8vw",
            top: "10%",
            width: "clamp(300px,45vw,650px)",
            height: "clamp(300px,45vw,650px)",
            borderRadius: "50%",
            border: "1px dashed rgba(108,99,255,0.12)",
            pointerEvents: "none",
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            right: "-4vw",
            top: "15%",
            width: "clamp(200px,30vw,450px)",
            height: "clamp(200px,30vw,450px)",
            borderRadius: "50%",
            border: "1px solid rgba(59,130,246,0.08)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* 5 ── Fine dot grid ───────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 2,
          opacity: 0.5,
        }}
      />

      {/* 6 ── Floating particles ──────────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3 }}>
        {particles.map((p, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, p.dx, -p.dx * 0.5, p.dx * 0.7, 0],
              y: [0, p.dy, -p.dy * 0.6, p.dy * 0.4, 0],
              opacity: [0, 0.9, 0.55, 0.8, 0],
              scale:   [0, 1, 0.85, 1.05, 0],
            }}
            transition={{
              duration: p.dur,
              delay:    p.delay,
              repeat:   Infinity,
              ease:     "easeInOut",
            }}
            style={{
              position:     "absolute",
              left:         `${p.x}%`,
              top:          `${p.y}%`,
              width:        p.size,
              height:       p.size,
              borderRadius: "50%",
              background:   p.color,
              boxShadow:    `0 0 ${p.size * 3}px ${p.color}`,
              willChange:   "transform, opacity",
            }}
          />
        ))}
      </div>

      {/* 7 ── SVG geometric circuit lines ─────────────────────── */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2, opacity: 0.15 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="line1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="transparent" />
            <stop offset="50%"  stopColor="#6c63ff" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="line2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="transparent" />
            <stop offset="50%"  stopColor="#00e5a0" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        {/* Horizontal rule lines */}
        <motion.line x1="0" y1="33%" x2="100%" y2="28%"
          stroke="url(#line1)" strokeWidth="0.5"
          initial={{ opacity: 0 }} animate={{ opacity: [0,0.6,0] }}
          transition={{ duration: 6, repeat: Infinity, delay: 0 }} style={{ willChange: "opacity" }} />
        <motion.line x1="0" y1="66%" x2="100%" y2="70%"
          stroke="url(#line2)" strokeWidth="0.5"
          initial={{ opacity: 0 }} animate={{ opacity: [0,0.6,0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }} style={{ willChange: "opacity" }} />
        {/* Diagonal */}
        <motion.line x1="60%" y1="0" x2="100%" y2="60%"
          stroke="url(#line1)" strokeWidth="0.5"
          initial={{ opacity: 0 }} animate={{ opacity: [0,0.6,0] }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }} style={{ willChange: "opacity" }} />
        {/* Corner nodes */}
        {[[65,20],[78,45],[82,70],[55,80]].map(([cx,cy],i) => (
          <motion.circle
            key={i} cx={`${cx}%`} cy={`${cy}%`} r="2"
            fill="rgba(108,99,255,0.5)"
            animate={{ opacity: [0,1,0], scale: [1,1.5,1] }}
            transition={{ duration: 3+i, repeat: Infinity, delay: i*0.8 }}
            style={{ transformOrigin: `${cx}% ${cy}%`, willChange: "opacity, transform" }}
          />
        ))}
      </svg>

      {/* 8 ── Subtle scanline overlay ─────────────────────────── */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.05) 3px,rgba(0,0,0,0.05) 4px)",
        pointerEvents: "none",
        zIndex: 3,
      }} />

      {/* ════════════════════════════════════════════════════════
          CONTENT
      ══════════════════════════════════════════════════════════ */}

      {/* Right stats panel */}
      <div
        className="hidden md:flex"
        style={{
          position: "absolute",
          right: "clamp(1.5rem,4vw,4rem)",
          top: "50%",
          transform: "translateY(-50%)",
          flexDirection: "column",
          gap: "2.5rem",
          zIndex: 10,
        }}
      >
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.2 + i * 0.12, ease: "easeOut" }}
            style={{ textAlign: "right" }}
          >
            <div style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.8rem,3vw,2.8rem)",
              background: "var(--gradient-1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1,
            }}>
              <Counter to={s.value} suffix={s.suffix} />
            </div>
            <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 4 }}>
              {s.label}
            </div>
          </motion.div>
        ))}

        {/* Vertical separator */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            right: "50%",
            top: "-3rem",
            bottom: "-3rem",
            width: 1,
            background: "linear-gradient(to bottom,transparent,var(--border-glass-hover),transparent)",
            transformOrigin: "top",
          }}
        />
      </div>

      {/* Main text content */}
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "clamp(1.5rem,3vh,2.5rem) clamp(1.5rem,8vw,8rem)",
        maxWidth: "72ch",
        flex: 1,
      }}>
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          style={{ alignSelf: "flex-start", marginBottom: "1.2rem" }}
        >
          <motion.div
            animate={{ 
              boxShadow: [
                "0 0 0px rgba(0,229,160,0)",
                "0 0 15px rgba(0,229,160,0.15)",
                "0 0 0px rgba(0,229,160,0)"
              ],
              borderColor: [
                "rgba(0,229,160,0.3)",
                "rgba(0,229,160,0.6)",
                "rgba(0,229,160,0.3)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 14px",
              borderRadius: 100,
              border: "1px solid rgba(0,229,160,0.3)",
              background: "rgba(0,229,160,0.07)",
              fontSize: "0.72rem",
              color: "var(--accent-green)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 600,
              backdropFilter: "blur(8px)",
            }}
          >
            <motion.span
              animate={{ opacity: [1,0.3,1], boxShadow: ["0 0 6px var(--accent-green)","0 0 14px var(--accent-green)","0 0 6px var(--accent-green)"] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-green)", flexShrink: 0, display: "inline-block" }}
            />
            Available for hire
          </motion.div>
        </motion.div>

        {/* Headline */}
        <motion.div style={{ y: headY }}>
          <motion.h1
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 800,
              fontSize: "clamp(3.2rem,9vw,8.5rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.05em",
              color: "var(--text-primary)",
              marginBottom: "0.1em",
            }}
          >
            Hey,
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.95, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 800,
              fontSize: "clamp(3.2rem,9vw,8.5rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.05em",
              marginBottom: "0.1em",
            }}
          >
            I&apos;m{" "}
            <span style={{
              background: "var(--gradient-1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Manoj
            </span>
            .
          </motion.h1>
        </motion.div>

        {/* Subtext */}
        <motion.div
          style={{ y: subY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
        >
          <div style={{
            fontFamily: "'Space Grotesk',sans-serif",
            fontSize: "clamp(1rem,2.5vw,1.5rem)",
            fontWeight: 500,
            color: "var(--text-secondary)",
            marginTop: "1rem",
            marginBottom: "1rem",
            minHeight: "2em",
          }}>
            <TypewriterText texts={roles} />
          </div>

          <p style={{
            fontSize: "clamp(0.85rem,1.6vw,1rem)",
            lineHeight: 1.75,
            color: "var(--text-secondary)",
            maxWidth: "52ch",
            marginBottom: "1.75rem",
            borderLeft: "2px solid rgba(108,99,255,0.4)",
            paddingLeft: "1.25rem",
          }}>
            Building secure, scalable systems at the intersection of
            cryptography and distributed architectures.{" "}
            <span style={{ color: "var(--text-primary)" }}>Final-year BCA @ Yenepoya University.</span>
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.02, boxShadow: "0 0 24px rgba(108,99,255,0.35)" }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                padding: "13px 32px",
                borderRadius: "4px 14px 4px 14px",
                background: "var(--gradient-1)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.88rem",
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.03em",
                textTransform: "uppercase",
                boxShadow: "0 0 20px rgba(108,99,255,0.3)",
              }}
            >
              View Work
            </motion.a>

            <motion.a
              href="https://github.com/ManojkumarPalakuri"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 5 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                textDecoration: "none",
                borderBottom: "1px solid var(--border-glass-hover)",
                paddingBottom: 2,
                transition: "color 0.3s, border-color 0.3s",
                fontWeight: 500,
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-glass-hover)";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub →
            </motion.a>

            <motion.a
              href="#contact"
              whileTap={{ scale: 0.96 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                padding: "13px 28px",
                borderRadius: "14px 4px 14px 4px",
                background: "rgba(255,255,255,0.03)",
                color: "var(--text-secondary)",
                fontWeight: 600,
                fontSize: "0.88rem",
                border: "1px solid var(--border-glass-hover)",
                cursor: "pointer",
                transition: "border-color 0.3s, color 0.3s, background 0.3s",
                backdropFilter: "blur(8px)",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                const target = e.currentTarget as HTMLAnchorElement;
                target.style.borderColor = "var(--accent)";
                target.style.color = "var(--text-primary)";
                target.style.background = "rgba(108,99,255,0.08)";
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                const target = e.currentTarget as HTMLAnchorElement;
                target.style.borderColor = "var(--border-glass-hover)";
                target.style.color = "var(--text-secondary)";
                target.style.background = "rgba(255,255,255,0.03)";
              }}
            >
              Contact
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "clamp(1.5rem,8vw,8rem)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          zIndex: 10,
        }}
      >
        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 40,
            height: 1,
            background: "linear-gradient(90deg, var(--accent), transparent)",
            boxShadow: "0 0 8px rgba(108,99,255,0.5)",
          }}
        />
        <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
          Scroll
        </span>
      </motion.div>

      {/* Ghost "MK" watermark — left-aligned, behind content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 2 }}
        style={{
          position: "absolute",
          bottom: "-0.15em",
          left: "-0.05em",
          fontFamily: "'Syne',sans-serif",
          fontWeight: 800,
          fontSize: "clamp(8rem,24vw,26rem)",
          lineHeight: 0.8,
          color: "transparent",
          WebkitTextStroke: "1px rgba(108,99,255,0.06)",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        MK
      </motion.div>
    </section>
  );
}
