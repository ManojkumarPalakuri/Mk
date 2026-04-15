"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const facts = [
  { icon: "🎓", label: "University", value: "Yenepoya" },
  { icon: "📍", label: "Based in",  value: "Bengaluru, India" },
  { icon: "🔬", label: "Research",  value: "INCON-SDG 2026" },
  { icon: "🏢", label: "Currently", value: "IBM Internship" },
];

const paragraphs = [
  {
    prefix: "Started with",
    body: "curiosity about the systems behind large-scale digital platforms — that curiosity evolved into a deep obsession with making things fundamentally",
    highlight: "secure and unbreakable.",
    color: "var(--accent)",
  },
  {
    prefix: "From",
    body: "developing encryption workflows at IBM to publishing hybrid blockchain research at INCON-SDG 2026, I live at the intersection of",
    highlight: "cryptography, distributed systems, and full-stack engineering.",
    color: "var(--accent-green)",
  },
  {
    prefix: "Co-founded",
    body: "YenShield — Yenepoya's cybersecurity club — because technical knowledge compounds fastest when it's",
    highlight: "shared openly.",
    color: "var(--accent-warm)",
  },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const mkX        = useTransform(scrollYProgress, [0, 1], ["10%", "-15%"]);
  const factY      = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      id="about"
      ref={ref}
      style={{
        position: "relative",
        padding: "10rem 0 8rem",
        overflow: "hidden",
      }}
    >
      {/* ── Giant ghost monogram ────────────────────────────── */}
      <motion.div
        style={{
          position: "absolute",
          top: "-5%",
          right: 0,
          x: mkX,
          fontFamily: "'Syne',sans-serif",
          fontWeight: 800,
          fontSize: "clamp(18rem,40vw,50rem)",
          lineHeight: 0.8,
          color: "transparent",
          WebkitTextStroke: "1px rgba(108,99,255,0.07)",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        MK
      </motion.div>

      {/* ── Section label ─────────────────────────────────── */}
      <div style={{ paddingLeft: "clamp(1.5rem,8vw,8rem)", paddingRight: "clamp(1.5rem,8vw,8rem)", position: "relative", zIndex: 2 }}>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            height: 1,
            background: "linear-gradient(90deg,var(--accent),transparent)",
            transformOrigin: "left",
            maxWidth: "20rem",
            marginBottom: "3rem",
          }}
        />

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "4rem",
        }}>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--accent)",
            }}
          >
            01 / About Me
          </motion.p>
        </div>

        {/* ── Main text — bleeds, no max-width fence ──────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(2rem,6vw,8rem)",
          alignItems: "start",
        }}
          className="about-main-grid"
        >
          {/* Left: Heading + paragraphs */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2rem,5vw,4.5rem)",
                lineHeight: 1.0,
                letterSpacing: "-0.04em",
                color: "var(--text-primary)",
                marginBottom: "3rem",
              }}
            >
              Building at the{" "}
              <br />
              <span style={{
                background: "var(--gradient-1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                frontier
              </span>{" "}
              of security{" "}
              <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontWeight: 400 }}>
                &amp;
              </span>{" "}
              scale
            </motion.h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: i * 0.12, ease: "easeOut" }}
                  style={{
                    fontSize: "clamp(0.85rem,1.5vw,0.95rem)",
                    lineHeight: 1.9,
                    color: "var(--text-secondary)",
                  }}
                >
                  <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{p.prefix} </span>
                  {p.body}{" "}
                  <span style={{ color: p.color, fontWeight: 600 }}>{p.highlight}</span>
                </motion.p>
              ))}
            </div>
          </div>

          {/* Right: Floating facts + design artifact */}
          <motion.div
            style={{ y: factY, position: "relative" }}
          >
            {/* Large number watermark inside column — visible gradient */}
            <div style={{
              position: "absolute",
              top: "-2rem",
              right: 0,
              fontFamily: "'Syne',sans-serif",
              fontWeight: 800,
              fontSize: "clamp(6rem,12vw,14rem)",
              lineHeight: 1,
              background: "linear-gradient(135deg, rgba(108,99,255,0.35) 0%, rgba(59,130,246,0.18) 50%, rgba(0,229,160,0.12) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              userSelect: "none",
              pointerEvents: "none",
            }}>9.02</div>

            {/* Facts — staggered, slightly rotated */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "4rem" }}>
              {facts.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ x: 6 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem 1.5rem",
                    borderRadius: i % 2 === 0 ? "4px 16px 4px 16px" : "16px 4px 16px 4px",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-glass)",
                    cursor: "default",
                    transition: "border-color 0.3s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-glass-hover)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-glass)")}
                >
                  <span style={{ fontSize: "1.2rem" }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>
                      {f.label}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: 600, marginTop: 2 }}>
                      {f.value}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mini orbiting dot decoration */}
            <div style={{ position: "relative", width: 120, height: 120, margin: "3rem auto 0" }}>
              <div style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "1px solid var(--border-glass)",
              }} />
              <motion.div
                className="spin-slow"
                style={{
                  position: "absolute",
                  inset: 10,
                  borderRadius: "50%",
                  border: "1px dashed rgba(108,99,255,0.25)",
                }}
              />
              {/* MK center — use exact pixel inset so FM scale doesn't break centring */}
              <div style={{
                position: "absolute",
                top: 42,
                left: 42,
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "var(--gradient-1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Syne',sans-serif",
                    fontWeight: 800,
                    fontSize: "0.75rem",
                    color: "#fff",
                    boxShadow: "0 0 16px rgba(108,99,255,0.5)",
                  }}
                >
                  MK
                </motion.div>
              </div>
              {/* Orbit dot */}
              <motion.div
                className="spin-slow"
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transformOrigin: "0 60px",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--accent-green)",
                  boxShadow: "0 0 8px var(--accent-green)",
                  marginLeft: -4,
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* ── Full-width marquee tech strip ──────────────────── */}
        <div className="marquee-wrap" style={{ marginTop: "6rem", opacity: 0.45 }}>
          <div className="marquee-track">
            {[
              "React", "Node.js", "TypeScript", "AWS", "MongoDB", "Python",
              "Next.js", "PostgreSQL", "Redis",
              "React", "Node.js", "TypeScript", "AWS", "MongoDB", "Python",
              "Next.js", "PostgreSQL", "Redis",
            ].map((t, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  padding: "0.5rem 2.5rem",
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: i % 3 === 0 ? "var(--accent)" : "var(--text-muted)",
                  borderRight: "1px solid var(--border-glass)",
                  whiteSpace: "nowrap",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-main-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
      `}</style>
    </section>
  );
}
