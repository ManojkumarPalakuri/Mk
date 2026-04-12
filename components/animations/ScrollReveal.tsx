"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "scale";
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

/* Cubic-bezier: custom ease-out-expo for that buttery feel */
const EASE = [0.16, 1, 0.3, 1] as const;

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.75,
  className = "",
  once = true,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-8% 0px" });

  /* Only animate GPU-composited properties (transform + opacity) */
  const hidden = {
    opacity: 0,
    y: direction === "up" ? 32 : direction === "down" ? -32 : 0,
    x: direction === "left" ? 32 : direction === "right" ? -32 : 0,
    scale: direction === "scale" ? 0.94 : 1,
  };

  const visible = {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: {
      duration,
      delay,
      ease: EASE,
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={{ hidden, visible }}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
