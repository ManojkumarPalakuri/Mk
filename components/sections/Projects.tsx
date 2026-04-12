"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, GitBranch, X } from "lucide-react";
import { projects } from "@/data/portfolio";

type Project = (typeof projects)[0];

/* ─── Row item (expands on hover/click) ─────────────────────── */
function ProjectRow({
  project,
  index,
  onClick,
}: {
  project: Project;
  index: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor-hover
      style={{
        position: "relative",
        borderBottom: "1px solid var(--border-glass)",
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      {/* Hover fill */}
      <motion.div
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg, ${project.gradientFrom}12, ${project.gradientTo}08)`,
          transformOrigin: "left",
          pointerEvents: "none",
        }}
      />

      <div style={{
        display: "grid",
        gridTemplateColumns: "5rem 1fr auto",
        alignItems: "center",
        gap: "2rem",
        padding: "2rem clamp(1.5rem,4vw,3rem)",
      }}>
        {/* Large index number */}
        <motion.span
          animate={{ color: hovered ? project.color : "var(--text-muted)" }}
          transition={{ duration: 0.3 }}
          style={{
            fontFamily: "'Syne',sans-serif",
            fontWeight: 800,
            fontSize: "clamp(1.5rem,3vw,2.5rem)",
            letterSpacing: "-0.05em",
            lineHeight: 1,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>

        {/* Name + desc */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "0.35rem" }}>
            <motion.h3
              animate={{ x: hovered ? 8 : 0, color: hovered ? "var(--text-primary)" : "var(--text-primary)" }}
              transition={{ duration: 0.35 }}
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.1rem,2.5vw,1.8rem)",
                letterSpacing: "-0.03em",
              }}
            >
              {project.title}
            </motion.h3>
            <span style={{
              padding: "3px 10px",
              borderRadius: 100,
              background: `${project.color}15`,
              border: `1px solid ${project.color}30`,
              fontSize: "0.65rem",
              fontWeight: 700,
              color: project.color,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              whiteSpace: "nowrap",
            }}>
              {project.category}
            </span>
          </div>

          {/* Description fades in on hover */}
          <motion.p
            animate={{ opacity: hovered ? 1 : 0, height: hovered ? "auto" : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              fontSize: "0.83rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              overflow: "hidden",
              maxWidth: "60ch",
            }}
          >
            {project.shortDesc}
          </motion.p>
        </div>

        {/* Stack pills + open icon */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", justifyContent: "flex-end" }} className="hidden md:flex">
            {project.stack.slice(0, 3).map((t) => (
              <span key={t} style={{
                padding: "3px 8px",
                borderRadius: 4,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                fontSize: "0.65rem",
                color: "var(--text-muted)",
                fontFamily: "'Space Grotesk',monospace",
                fontWeight: 500,
              }}>{t}</span>
            ))}
          </div>
          <motion.div
            animate={{ rotate: hovered ? 45 : 0, color: hovered ? project.color : "var(--text-muted)" }}
            transition={{ duration: 0.3 }}
          >
            <ExternalLink size={18} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Full-detail modal ──────────────────────────────────────── */
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.9)",
        backdropFilter: "blur(20px)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-glass-hover)",
          borderRadius: "24px 8px 24px 8px",
          padding: "2.5rem",
          maxWidth: 680,
          width: "100%",
          maxHeight: "88vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div style={{
          height: 2,
          background: `linear-gradient(90deg,${project.gradientFrom},${project.gradientTo})`,
          borderRadius: 100,
          marginBottom: "2rem",
        }} />

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.5rem",
            right: "1.5rem",
            width: 36,
            height: 36,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bg-glass)",
            border: "1px solid var(--border-glass)",
            cursor: "pointer",
            color: "var(--text-secondary)",
          }}
        >
          <X size={15} />
        </button>

        <div style={{
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: project.color,
          marginBottom: "0.75rem",
        }}>
          {project.category}
        </div>

        <h2 style={{
          fontFamily: "'Syne',sans-serif",
          fontWeight: 800,
          fontSize: "clamp(1.5rem,4vw,2.5rem)",
          letterSpacing: "-0.04em",
          lineHeight: 1.05,
          color: "var(--text-primary)",
          marginBottom: "1.25rem",
        }}>
          {project.title}
        </h2>

        <p style={{ color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "2rem", fontSize: "0.9rem" }}>
          {project.longDesc}
        </p>

        {/* Key features */}
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "1rem" }}>
            Highlights
          </p>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {project.highlights.map((h) => (
              <li key={h} style={{ display: "flex", gap: 10, fontSize: "0.87rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                <span style={{ color: project.color, flexShrink: 0 }}>▸</span>
                {h}
              </li>
            ))}
          </ul>
        </div>

        {/* Tech */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
          {project.stack.map((t) => (
            <span key={t} style={{
              padding: "5px 12px",
              borderRadius: 6,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              fontFamily: "'Space Grotesk',monospace",
            }}>{t}</span>
          ))}
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {project.liveUrl !== "#" && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 22px",
              borderRadius: "4px 12px 4px 12px",
              background: `linear-gradient(135deg,${project.gradientFrom},${project.gradientTo})`,
              color: "#fff",
              textDecoration: "none",
              fontSize: "0.82rem",
              fontWeight: 700,
            }}>
              <ExternalLink size={13} /> Live Demo
            </a>
          )}
          {project.githubUrl !== "#" && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 22px",
              borderRadius: "12px 4px 12px 4px",
              background: "var(--bg-glass)",
              border: "1px solid var(--border-glass)",
              color: "var(--text-secondary)",
              textDecoration: "none",
              fontSize: "0.82rem",
              fontWeight: 600,
            }}>
              <GitBranch size={13} /> Source
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Section ───────────────────────────────────────────────── */
export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section
      id="projects"
      style={{
        position: "relative",
        padding: "10rem 0",
        background: "var(--bg-secondary)",
        overflow: "hidden",
      }}
    >
      {/* Skew clip top */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "6vw",
        background: "var(--bg-primary)",
        clipPath: "polygon(0 0,100% 0,100% 100%,0 0)",
      }} />

      {/* Section label block */}
      <div style={{ padding: "0 clamp(1.5rem,4vw,3rem)", marginBottom: "4rem" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
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
              02 / Selected Work
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 800,
                fontSize: "clamp(2.5rem,6vw,5.5rem)",
                letterSpacing: "-0.05em",
                lineHeight: 0.95,
                color: "var(--text-primary)",
              }}
            >
              Projects that<br />
              <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontWeight: 400 }}>actually</span> ship.
            </motion.h2>
          </div>

          {/* Large index ghost */}
          <div style={{
            fontFamily: "'Syne',sans-serif",
            fontWeight: 800,
            fontSize: "clamp(6rem,12vw,12rem)",
            lineHeight: 1,
            color: "transparent",
            WebkitTextStroke: "1px rgba(255,255,255,0.04)",
            userSelect: "none",
          }}>
            {String(projects.length).padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* ── List of projects ──────────────────────────────── */}
      <div>
        {projects.map((project, i) => (
          <ProjectRow
            key={project.id}
            project={project}
            index={i}
            onClick={() => setSelected(project)}
          />
        ))}
      </div>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      {/* Skew clip bottom */}
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
