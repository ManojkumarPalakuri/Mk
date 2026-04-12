"use client";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer style={{ padding: "3rem clamp(1.5rem,4vw,3rem)", borderTop: "1px solid var(--border-glass)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        {/* Left: monogram + year */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          style={{ display: "flex", alignItems: "center", gap: "1rem" }}
        >
          <span style={{
            fontFamily: "'Syne',sans-serif",
            fontWeight: 800,
            fontSize: "1.2rem",
            background: "var(--gradient-1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            MK
          </span>
          <span style={{ width: 1, height: 16, background: "var(--border-glass-hover)", display: "inline-block" }} />
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.1em" }}>
            © {new Date().getFullYear()}
          </span>
        </motion.div>

        {/* Right: built with */}
        <motion.p
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          style={{ fontSize: "0.68rem", color: "var(--text-muted)", letterSpacing: "0.08em" }}
        >
          Built with Next.js · Framer Motion · Lenis · ❤️
        </motion.p>
      </div>
    </footer>
  );
}
