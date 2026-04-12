"use client";
import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafId    = useRef<number>(0);

  useEffect(() => {
    const lenis = new Lenis({
      /* Silky butter settings:
         - Lower lerp (0.1) = more glide / less snap
         - syncTouch: carry the lerp feeling into mobile inertia
         - overscroll: false so there's no bounce jitter on macOS */
      duration:        1.4,
      easing:          (t: number) => 1 - Math.pow(1 - t, 4), // ease-out-quart
      smoothWheel:     true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
      syncTouch:       true,
      infinite:        false,
      overscroll:      false,
    });

    lenisRef.current = lenis;

    /* Drive lenis off rAF — cancel cleanly on destroy */
    function raf(time: number) {
      lenis.raf(time);
      rafId.current = requestAnimationFrame(raf);
    }
    rafId.current = requestAnimationFrame(raf);

    /* Keep Framer Motion useScroll in sync with Lenis virtual scroll */
    lenis.on("scroll", () => {
      // Dispatch a synthetic scroll event so Framer Motion's useScroll
      // picks up the Lenis scroll position correctly.
      window.dispatchEvent(new Event("scroll", { bubbles: false }));
    });

    return () => {
      cancelAnimationFrame(rafId.current);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
