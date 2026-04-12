"use client";
import { useEffect, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useSpring(cursorX, { stiffness: 150, damping: 18 });
  const ringY = useSpring(cursorY, { stiffness: 150, damping: 18 });
  const dotX = useSpring(cursorX, { stiffness: 500, damping: 30 });
  const dotY = useSpring(cursorY, { stiffness: 500, damping: 30 });

  const scaleRef = useRef(1);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHoverable =
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor-hover]");
      if (isHoverable) {
        scaleRef.current = 2.2;
        ringRef.current?.style.setProperty("--ring-scale", "2.2");
        ringRef.current?.classList.add("cursor-hover");
      } else {
        scaleRef.current = 1;
        ringRef.current?.style.setProperty("--ring-scale", "1");
        ringRef.current?.classList.remove("cursor-hover");
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", handleHover);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", handleHover);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <style>{`
        body { cursor: none; }
        @media (hover: none) { body { cursor: auto; } }
        .cursor-ring.cursor-hover { opacity: 0.6; }
      `}</style>
      {/* Outer ring */}
      <motion.div
        ref={ringRef}
        className="custom-cursor cursor-ring"
        style={{
          position: "fixed",
          left: ringX,
          top: ringY,
          x: "-50%",
          y: "-50%",
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1px solid rgba(108,99,255,0.7)",
          pointerEvents: "none",
          zIndex: 99999,
          mixBlendMode: "difference",
          transition: "transform 0.2s ease, opacity 0.2s ease",
        }}
        animate={{ scale: scaleRef.current }}
      />
      {/* Inner dot */}
      <motion.div
        className="custom-cursor"
        style={{
          position: "fixed",
          left: dotX,
          top: dotY,
          x: "-50%",
          y: "-50%",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#6c63ff",
          pointerEvents: "none",
          zIndex: 99999,
        }}
      />
    </>
  );
}
