"use client";
import { motion, type Variants } from "framer-motion";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  centered = false,
  light = false,
}: SectionHeadingProps) {
  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring", bounce: 0.2 } },
  };

  return (
    <motion.div
      className={`mb-16 ${centered ? "text-center" : ""}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {eyebrow && (
        <motion.p
          variants={itemVariants}
          className="text-sm font-semibold tracking-[0.2em] uppercase mb-4"
          style={{ color: "var(--accent)" }}
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        variants={itemVariants}
        className="font-bold leading-tight"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "clamp(2rem, 4vw, 3.5rem)",
          color: light ? "var(--text-primary)" : "var(--text-primary)",
        }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={itemVariants}
          className="mt-4 max-w-xl text-base leading-relaxed"
          style={{
            color: "var(--text-secondary)",
            marginLeft: centered ? "auto" : undefined,
            marginRight: centered ? "auto" : undefined,
          }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
