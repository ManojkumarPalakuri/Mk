"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skills, certifications, research } from "@/data/portfolio";

const categoryMeta: Record<string, { color: string; from: string; to: string; num: string }> = {
  "Languages":              { color: "#6c63ff", from: "#6c63ff", to: "#3b82f6", num: "01" },
  "Frameworks & Libraries": { color: "#00e5a0", from: "#00e5a0", to: "#00d4ff", num: "02" },
  "Databases":              { color: "#f59e0b", from: "#f59e0b", to: "#ef4444", num: "03" },
  "Cloud & DevOps":         { color: "#3b82f6", from: "#3b82f6", to: "#8b5cf6", num: "04" },
  "Security":               { color: "#ff4d6d", from: "#ff4d6d", to: "#fbbf24", num: "05" },
  "Tools":                  { color: "#8b5cf6", from: "#8b5cf6", to: "#ec4899", num: "06" },
};

function CertificateCard({ cert, index }: { cert: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.02, 
        borderColor: "rgba(108,99,255,0.4)",
        background: "rgba(108,99,255,0.08)" 
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: "12px 20px",
        borderRadius: index % 2 === 0 ? "4px 16px 4px 16px" : "16px 4px 16px 4px",
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-glass)",
        cursor: "default",
        transition: "all 0.3s ease",
        width: "100%",
        maxWidth: "fit-content",
        overflow: "hidden"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "var(--gradient-1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.6rem",
          fontWeight: 800,
          color: "#fff",
          flexShrink: 0,
        }}>
          ✓
        </span>
        <div>
          <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>{cert.title}</h4>
          <p style={{ fontSize: "0.65rem", color: "var(--accent)", fontWeight: 600, display: "flex", gap: 6 }}>
            <span>{cert.issuer}</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>{cert.date}</span>
          </p>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: isHovered ? "auto" : 0, opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <p style={{ 
          fontSize: "0.75rem", 
          color: "var(--text-secondary)", 
          marginTop: 4, 
          lineHeight: 1.5,
          paddingLeft: 32,
          maxWidth: "50ch"
        }}>
          {cert.details}
        </p>
      </motion.div>
    </motion.div>
  );
}

function ResearchCard({ item }: { item: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, borderColor: "rgba(0,229,160,0.4)", background: "rgba(0,229,160,0.06)" }}
      style={{
        padding: "1.75rem",
        borderRadius: "20px 4px 20px 4px",
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-glass-hover)",
        transition: "all 0.3s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{
          padding: "6px 12px",
          borderRadius: "8px",
          background: "var(--accent-dim)",
          color: "var(--accent-green)",
          fontSize: "0.6rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em"
        }}>
          Featured Publication
        </div>
        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600 }}>{item.date}</span>
      </div>

      <div>
        <h3 style={{
          fontFamily: "'Syne',sans-serif",
          fontWeight: 700,
          fontSize: "1.1rem",
          lineHeight: 1.3,
          color: "var(--text-primary)",
          marginBottom: "0.5rem"
        }}>
          {item.title}
        </h3>
        <p style={{ fontSize: "0.75rem", color: "var(--accent-green)", fontWeight: 600, marginBottom: "1rem" }}>
          {item.venue}
        </p>
        <p style={{
          fontSize: "0.8rem",
          color: "var(--text-secondary)",
          lineHeight: 1.6,
          borderTop: "1px solid var(--border-glass)",
          paddingTop: "1rem"
        }}>
          {item.description}
        </p>
      </div>

      <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 8, color: "var(--text-muted)", fontSize: "0.7rem", fontWeight: 600 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-green)" }} />
        Presented at International Conference
      </div>
    </motion.div>
  );
}

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
                  background: isActive ? "var(--accent-dim)" : "var(--bg-glass)",
                  border: `1px solid ${isActive ? "var(--accent)" : "var(--border-glass)"}`,
                  color: isActive ? "var(--accent)" : "var(--text-secondary)",
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
          <AnimatePresence mode="popLayout">
            {categories
              .filter(cat => activeCategory === null || activeCategory === cat)
              .map((cat, ci) => {
                const m = categoryMeta[cat];
                const catSkills = (skills as Record<string, string[]>)[cat] || [];

                return catSkills.map((skill, si) => {
                  /* Give each tag a subtle random aesthetic rotation ±3° */
                  const seed    = (ci * 17 + si * 7) % 100;
                  const rotate  = ((seed % 7) - 3);
                  const sizeMod = 0.75 + (seed % 4) * 0.1;

                  return (
                    <motion.div
                      key={`${cat}-${skill}`}
                      layout
                      initial={{ opacity: 0, scale: 0.7, rotate: rotate * 2 }}
                      animate={{ opacity: 1, scale: 1, rotate }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.4, 
                        delay: activeCategory === null ? (si * 0.04 + ci * 0.06) : (si * 0.02), 
                        ease: "easeOut" 
                      }}
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
          </AnimatePresence>
        </div>

        {/* ── Certifications & Research ──────────────────── */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
          gap: "3rem", 
          marginTop: "6rem",
          position: "relative",
          zIndex: 2,
          alignItems: "start"
        }}>
          {/* Left Column: Certifications */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" }}>
              <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                Certifications
              </span>
              <div style={{ flex: 1, height: 1, background: "var(--border-glass)" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {certifications.map((cert, i) => (
                <CertificateCard key={i} cert={cert} index={i} />
              ))}
            </div>
          </motion.div>

          {/* Right Column: Featured Research */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" }}>
              <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                Featured Presentation
              </span>
              <div style={{ flex: 1, height: 1, background: "var(--border-glass)" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {research.map((item, i) => (
                <ResearchCard key={i} item={item} />
              ))}
            </div>
          </motion.div>
        </div>


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
