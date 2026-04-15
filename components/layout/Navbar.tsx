"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "About",      href: "#about",      num: "01" },
  { label: "Projects",   href: "#projects",   num: "02" },
  { label: "Experience", href: "#experience", num: "03" },
  { label: "Skills",     href: "#skills",     num: "04" },
  { label: "Contact",    href: "#contact",    num: "05" },
];

export default function Navbar() {
  const [scrolled, setScrolled]         = useState(false);
  const [menuOpen, setMenuOpen]         = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = ["hero", "about", "projects", "experience", "skills", "contact"];
    const obs: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActiveSection(id); },
        { threshold: 0.35 }
      );
      o.observe(el);
      obs.push(o);
    });
    return () => obs.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (href: string) => {
    document.getElementById(href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      {/* ── VERTICAL RAIL (desktop) ─────────────────────────────── */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:flex"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "var(--nav-width)",
          height: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "2rem 0",
          zIndex: 1000,
          borderRight: scrolled
            ? "1px solid var(--border-glass)"
            : "1px solid transparent",
          background: scrolled ? "var(--nav-bg)" : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          transition: "background 0.5s, border-color 0.5s",
        }}
      >
        {/* Logo monogram */}
        <motion.button
          onClick={() => scrollTo("#hero")}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.93 }}
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "1.1rem",
            background: "var(--gradient-1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            border: "none",
            cursor: "pointer",
            letterSpacing: "-0.04em",
          }}
        >
          MK
        </motion.button>

        {/* Nav dots + labels */}
        <nav style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = activeSection === id;
            return (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                title={link.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <motion.span
                  animate={{
                    height: isActive ? 28 : 8,
                    backgroundColor: isActive ? "#6c63ff" : "rgba(255,255,255,0.15)",
                  }}
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{ display: "block", borderRadius: 2, width: 2 }}
                />
                <motion.span
                  animate={{ opacity: isActive ? 0.9 : 0 }}
                  style={{
                    fontSize: "0.55rem",
                    color: "var(--accent)",
                    letterSpacing: "0.1em",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    lineHeight: 1,
                  }}
                >
                  {link.num}
                </motion.span>
              </button>
            );
          })}
        </nav>

        {/* Bottom: rotated email */}
        <a
          href="mailto:manojkumarpalakuri@gmail.com"
          style={{
            writingMode: "vertical-lr",
            transform: "rotate(180deg)",
            fontSize: "0.6rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            textDecoration: "none",
            transition: "color 0.3s",
          }}
          onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "var(--accent)")}
          onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "var(--text-muted)")}
        >
          manojkumarpalakuri@gmail.com
        </a>
      </motion.aside>

      {/* ── MOBILE TOP BAR ──────────────────────────────────────── */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="flex md:hidden"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 56,
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1.25rem",
          background: "rgba(8, 8, 16, 0.22)",
          backdropFilter: "blur(40px)",
          borderBottom: "1px solid var(--border-glass)",
        }}
      >
        <button
          onClick={() => scrollTo("#hero")}
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: "1rem",
            background: "var(--gradient-1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            border: "none",
            cursor: "pointer",
          }}
        >
          MK
        </button>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", flexDirection: "column", gap: 5 }}
          aria-label="Menu"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              style={{ display: "block", height: 1.5, width: i === 1 ? 20 : 28, background: "var(--text-primary)", borderRadius: 2 }}
              animate={
                menuOpen
                  ? i === 0 ? { rotate: 45, y: 6.5 }
                  : i === 2 ? { rotate: -45, y: -6.5 }
                  : { opacity: 0 }
                  : { rotate: 0, y: 0, opacity: 1 }
              }
              transition={{ duration: 0.22 }}
            />
          ))}
        </button>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 95% 5%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 95% 5%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 95% 5%)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(8,8,16,0.98)",
              backdropFilter: "blur(24px)",
              zIndex: 999,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              padding: "0 2rem",
              gap: "0.25rem",
            }}
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.07 }}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "1rem",
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(2rem, 10vw, 3.5rem)",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  letterSpacing: "-0.04em",
                  lineHeight: 1.15,
                }}
              >
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 500, letterSpacing: "0.1em" }}>
                  {link.num}
                </span>
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MOBILE BOTTOM DOCK ──────────────────────────────────── */}
      <nav
        className="flex md:hidden"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 56,
          background: "rgba(8,8,16,0.9)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid var(--border-glass)",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "0 0.5rem",
        }}
      >
        {navLinks.map((link) => {
          const id     = link.href.replace("#", "");
          const active = activeSection === id;
          return (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "6px 4px",
                flex: 1,
              }}
            >
              <motion.span
                animate={{ width: active ? 20 : 6, background: active ? "#6c63ff" : "rgba(255,255,255,0.2)" }}
                style={{ display:"block", height: 2, borderRadius: 2 }}
                transition={{ duration: 0.3 }}
              />
              <span style={{ fontSize: "0.58rem", color: active ? "var(--accent)" : "var(--text-muted)", fontWeight: 600, textTransform:"uppercase", letterSpacing:"0.08em" }}>
                {link.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
