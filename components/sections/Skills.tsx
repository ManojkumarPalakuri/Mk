"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { skills, certifications } from "@/data/portfolio";

const categoryMeta: Record<string, { color: string; from: string; to: string; num: string }> = {
  "Languages":              { color: "#6c63ff", from: "#6c63ff", to: "#3b82f6", num: "01" },
  "Frameworks & Libraries": { color: "#00e5a0", from: "#00e5a0", to: "#00d4ff", num: "02" },
  "Databases":              { color: "#f59e0b", from: "#f59e0b", to: "#ef4444", num: "03" },
  "Cloud & DevOps":         { color: "#3b82f6", from: "#3b82f6", to: "#8b5cf6", num: "04" },
  "Security":               { color: "#ff4d6d", from: "#ff4d6d", to: "#fbbf24", num: "05" },
  "Tools":                  { color: "#8b5cf6", from: "#8b5cf6", to: "#ec4899", num: "06" },
};

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categories = Object.keys(skills);

  return (
    <section
      id="skills"
      style={{
        position: "relative",
        padding: "10rem 0",
        background: "var(--bg-secondary)",
        overflow: "hidden",
      }}
    >
      {/* Skew top */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "6vw",
        background: "var(--bg-primary)",
        clipPath: "polygon(0 0,100% 0,100% 100%,0 0)",
      }} />

      <div style={{ padding: "0 clamp(1.5rem,4vw,3rem)" }}>
        {/* Section header */}
        <div style={{ marginBottom: "5rem" }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "0.75rem",
            }}
          >
            04 / Toolkit
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2.5rem,6vw,5.5rem)",
              letterSpacing: "-0.05em",
              lineHeight: 0.95,
              color: "var(--text-primary)",
            }}
          >
            Skills &amp;{" "}
            <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontWeight: 400 }}>
              Technologies
            </span>
          </motion.h2>
        </div>

        {/* ── Category selector ─────────────────────────── */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "4rem" }}>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveCategory(null)}
            style={{
              padding: "8px 18px",
              borderRadius: "4px 12px 4px 12px",
              background: activeCategory === null ? "var(--gradient-1)" : "var(--bg-glass)",
              border: `1px solid ${activeCategory === null ? "transparent" : "var(--border-glass)"}`,
              color: activeCategory === null ? "#fff" : "var(--text-secondary)",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.05em",
              fontFamily: "'Space Grotesk',sans-serif",
            }}
          >
            All
          </motion.button>
          {categories.map((cat) => {
            const m = categoryMeta[cat];
            const isActive = activeCategory === cat;
            return (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveCategory(isActive ? null : cat)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "12px 4px 12px 4px",
                  background: isActive ? `${m.color}18` : "var(--bg-glass)",
                  border: `1px solid ${isActive ? m.color + "50" : "var(--border-glass)"}`,
                  color: isActive ? m.color : "var(--text-secondary)",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Space Grotesk',sans-serif",
                  transition: "all 0.25s",
                }}
              >
                {cat}
              </motion.button>
            );
          })}
        </div>

        {/* ── Skill tags — scattered/cloud layout ──────────── */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.85rem",
          alignItems: "flex-start",
          position: "relative",
          minHeight: "20rem",
        }}>
          {categories.map((cat, ci) => {
            const m = categoryMeta[cat];
            const isHidden = activeCategory !== null && activeCategory !== cat;
            const catSkills = (skills as Record<string, string[]>)[cat] || [];

            return catSkills.map((skill, si) => {
              /* Give each tag a subtle random aesthetic rotation ±3° */
              const seed    = (ci * 17 + si * 7) % 100;
              const rotate  = ((seed % 7) - 3);
              const sizeMod = 0.75 + (seed % 4) * 0.1;

              return (
                <motion.div
                  key={`${cat}-${skill}`}
                  initial={{ opacity: 0, scale: 0.7, rotate: rotate * 2 }}
                  whileInView={{ opacity: 1, scale: 1, rotate }}
                  animate={{ opacity: isHidden ? 0.1 : 1, scale: isHidden ? 0.85 : 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: si * 0.04 + ci * 0.06, ease: "easeOut" }}
                  whileHover={{ scale: 1.12, rotate: 0, zIndex: 10 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: `${5 * sizeMod}px ${12 * sizeMod}px`,
                    borderRadius: si % 3 === 0 ? "4px 12px 4px 12px" : si % 3 === 1 ? "12px 4px 12px 4px" : "8px",
                    background: `${m.color}10`,
                    border: `1px solid ${m.color}30`,
                    fontSize: `${sizeMod * 0.78}rem`,
                    color: "var(--text-secondary)",
                    fontWeight: 600,
                    fontFamily: "'Space Grotesk',sans-serif",
                    cursor: "default",
                    position: "relative",
                    transition: "background 0.25s, color 0.25s",
                    transformOrigin: "center",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = `${m.color}25`;
                    (e.currentTarget as HTMLDivElement).style.color = "var(--text-primary)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = `${m.color}10`;
                    (e.currentTarget as HTMLDivElement).style.color = "var(--text-secondary)";
                  }}
                >
                  {/* Category color dot */}
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: m.color, flexShrink: 0 }} />
                  {skill}
                </motion.div>
              );
            });
          })}
        </div>

        {/* ── Certifications ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          style={{ marginTop: "5rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border-glass)" }} />
            <span style={{
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}>
              Certifications
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--border-glass)" }} />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            {certifications.map((cert, i) => (
              <motion.div
                key={cert}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ x: 4 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 18px",
                  borderRadius: i % 2 === 0 ? "4px 16px 4px 16px" : "16px 4px 16px 4px",
                  background: "rgba(108,99,255,0.06)",
                  border: "1px solid rgba(108,99,255,0.2)",
                  fontSize: "0.82rem",
                  color: "var(--text-secondary)",
                  cursor: "default",
                }}
              >
                <span style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "var(--gradient-1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.55rem",
                  fontWeight: 800,
                  color: "#fff",
                  flexShrink: 0,
                }}>
                  ✓
                </span>
                {cert}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Skew bottom */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "6vw",
        background: "var(--bg-primary)",
        clipPath: "polygon(0 100%,100% 0,100% 100%)",
      }} />
    </section>
  );
}
