"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";
import { experience } from "@/data/portfolio";

type Exp = (typeof experience)[0];

function Card({ item, index }: { item: Exp; index: number }) {
  const [isPersistent, setIsPersistent] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isOpen = isPersistent || isHovered;

  /* Alternating indent — odd cards shift right */
  const offsetX = index % 2 === 0
    ? "clamp(1.5rem,4vw,3rem)"
    : "clamp(3rem,10vw,10rem)";

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ paddingLeft: offsetX, paddingRight: "clamp(1.5rem,4vw,3rem)", position: "relative" }}
    >
      <motion.div
        onClick={() => setIsPersistent(!isPersistent)}
        onMouseEnter={(e) => {
          setIsHovered(true);
          (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 40px ${item.color}15`;
          (e.currentTarget as HTMLDivElement).style.background = "var(--bg-tertiary)";
        }}
        onMouseLeave={(e) => {
          setIsHovered(false);
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
          (e.currentTarget as HTMLDivElement).style.background = "var(--bg-secondary)";
        }}
        whileHover={{ 
          borderColor: `${item.color}80`,
          scale: 1.02,
          y: -5,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        style={{
          position: "relative",
          borderRadius: index % 2 === 0 ? "4px 20px 20px 20px" : "20px 4px 20px 20px",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-glass)",
          padding: "1.75rem 2rem",
          cursor: "pointer",
          transition: "border-color 0.3s, box-shadow 0.3s, background 0.3s",
          maxWidth: "55ch",
          zIndex: 2,
        }}
      >
        {/* Color tab */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 3,
          height: "100%",
          background: `linear-gradient(180deg,${item.color},${item.color}40)`,
          borderRadius: "4px 0 0 20px",
        }} />

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
          <div>
            <div style={{
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: item.color,
              marginBottom: "0.4rem",
            }}>
              {item.duration}
            </div>
            <h3 style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 700,
              fontSize: "clamp(1rem,2vw,1.25rem)",
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              marginBottom: "0.2rem",
            }}>
              {item.role}
            </h3>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: item.color }}>
              {item.company}
            </p>
          </div>

          <div style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: `${item.color}18`,
            border: `1.5px solid ${item.color}50`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: item.color,
            flexShrink: 0,
          }}>
            {item.type === "education" ? <GraduationCap size={16} /> : <Briefcase size={16} />}
          </div>
        </div>

        {/* Expand / collapse bullets */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ overflow: "hidden" }}
        >
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.45rem", paddingTop: "0.5rem" }}>
            {item.bullets.map((b) => (
              <li key={b} style={{ display: "flex", gap: 10, fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                <span style={{ color: item.color, flexShrink: 0 }}>▸</span>
                {b}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Toggle hint */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0, color: isOpen ? item.color : "var(--text-muted)" }}
          transition={{ duration: 0.3 }}
          style={{ marginTop: "0.75rem", fontSize: "0.7rem", display: "flex", alignItems: "center", gap: 4 }}
        >
          ▼
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {isPersistent ? "Locked" : isOpen ? "Collapse" : "Expand"}
          </span>
        </motion.div>
      </motion.div>

      {/* Year watermark beside the card */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.08 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.08 + 0.2 }}
        style={{
          position: "absolute",
          right: "clamp(1.5rem,4vw,3rem)",
          fontFamily: "'Syne',sans-serif",
          fontWeight: 800,
          fontSize: "clamp(4rem,10vw,9rem)",
          lineHeight: 1,
          color: "var(--text-primary)",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {item.duration.slice(0, 4)}
      </motion.div>
    </motion.div>
  );
}

export default function Experience() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const ghostX = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section id="experience" ref={ref} style={{ position: "relative", padding: "10rem 0", overflow: "hidden" }}>
      {/* Ghost label */}
      <motion.div
        style={{
          position: "absolute",
          top: "5%",
          right: 0,
          x: ghostX,
          fontFamily: "'Syne',sans-serif",
          fontWeight: 800,
          fontSize: "clamp(8rem,22vw,24rem)",
          lineHeight: 0.85,
          color: "transparent",
          WebkitTextStroke: "1px rgba(255,255,255,0.03)",
          pointerEvents: "none",
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
      >
        EXP
      </motion.div>

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
            03 / Journey
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
            Experience
            <br />
            <span style={{ color: "var(--text-muted)", fontStyle: "italic", fontWeight: 400 }}>&amp;</span>{" "}
            Education
          </motion.h2>
        </div>

        {/* ── Zigzag cards ─────────────────────────────────── */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "3.5rem" }}>
          {/* Vertical connector */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              left: "clamp(1.5rem,4vw,3rem)",
              top: 0,
              bottom: 0,
              width: 1,
              background: "linear-gradient(to bottom,var(--accent),rgba(108,99,255,0.05))",
              transformOrigin: "top",
            }}
          />

          {experience.map((item, i) => (
            <Card key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
