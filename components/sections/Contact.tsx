"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mail, MapPin, Loader2, CheckCircle } from "lucide-react";

interface FormData { name: string; email: string; subject: string; message: string; }
interface FormErrors { name?: string; email?: string; subject?: string; message?: string; }

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

export default function Contact() {
  const [form, setForm]           = useState<FormData>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors]       = useState<FormErrors>({});
  const [status, setStatus]       = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const [focusedField, setFocused] = useState<string | null>(null);

  const validate = () => {
    const e: FormErrors = {};
    if (!form.name.trim())                        e.name    = "Required";
    if (!form.email.trim())                       e.email   = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email))   e.email   = "Invalid email";
    if (!form.subject.trim())                     e.subject = "Required";
    if (!form.message.trim())                     e.message = "Required";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    
    setStatus("sending");
    setSubmitError("");
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      
      const data = await res.json();
      
      if (data.success) {
        setStatus("sent");
        setForm({ name: "", email: "", subject: "", message: "" });
        
        // Reset back to idle after 5 seconds
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setSubmitError(data.error || "Failed to send message. Please try again later.");
      }
    } catch (err) {
      setStatus("error");
      setSubmitError("A network error occurred. Please check your connection.");
    }
  };

  const fields: { key: keyof FormData; label: string; type?: string; multiline?: boolean }[] = [
    { key: "name",    label: "Name" },
    { key: "email",   label: "Email",   type: "email" },
    { key: "subject", label: "Subject" },
    { key: "message", label: "Message", multiline: true },
  ];

  return (
    <section
      id="contact"
      style={{
        position: "relative",
        padding: "10rem 0 8rem",
        overflow: "hidden",
        background: "var(--bg-primary)",
      }}
    >
      {/* ── Big radial glow ──────────────────────────────── */}
      <div style={{
        position: "absolute",
        top: "40%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        width: "80vw",
        height: "80vw",
        maxWidth: 900,
        maxHeight: 900,
        borderRadius: "50%",
        background: "radial-gradient(circle,rgba(108,99,255,0.08) 0%,transparent 70%)",
        filter: "blur(60px)",
        pointerEvents: "none",
      }} />

      <div style={{ padding: "0 clamp(1.5rem,4vw,3rem)", position: "relative", zIndex: 2 }}>
        {/* ── Giant CTA headline ─────────────────────────── */}
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
            marginBottom: "1rem",
          }}
        >
          05 / Get In Touch
        </motion.p>

        <div style={{ marginBottom: "6rem" }}>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 800,
              fontSize: "clamp(3rem,10vw,10rem)",
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
              color: "var(--text-primary)",
            }}
          >
            Let&apos;s
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 800,
              fontSize: "clamp(3rem,10vw,10rem)",
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
              background: "var(--gradient-1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            build
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Syne',sans-serif",
              fontWeight: 800,
              fontSize: "clamp(3rem,10vw,10rem)",
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
              color: "var(--text-muted)",
              fontStyle: "italic",
            }}
          >
            together.
          </motion.h2>
        </div>

        {/* ── Two-panel: quick links + form ─────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.6fr",
          gap: "clamp(2rem,6vw,6rem)",
          alignItems: "flex-start",
        }}
          className="contact-layout"
        >
          {/* Left: quick contacts */}
          <div>
            {/* Availability */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "1rem 1.5rem",
                borderRadius: "4px 16px 16px 16px",
                background: "rgba(0,229,160,0.05)",
                border: "1px solid rgba(0,229,160,0.2)",
                marginBottom: "2rem",
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-green)", boxShadow: "0 0 10px var(--accent-green)", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)" }}>Open to opportunities</div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2 }}>Internships · Projects · Research</div>
              </div>
            </motion.div>

            {/* Contact info links */}
            {[
              { icon: <Mail size={15} />, label: "Email", value: "manojkumarpalakuri@gmail.com", href: "mailto:manojkumarpalakuri@gmail.com", color: "#00e5a0" },
              { icon: <MapPin size={15} />, label: "Location", value: "Bengaluru, India", href: "#", color: "#6c63ff" },
            ].map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.2 }}
                whileHover={{ x: 6 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem 0",
                  borderBottom: "1px solid var(--border-glass)",
                  textDecoration: "none",
                  cursor: item.href === "#" ? "default" : "pointer",
                  marginBottom: "0.25rem",
                }}
              >
                <span style={{ color: item.color }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>{item.label}</div>
                  <div style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: 2 }}>{item.value}</div>
                </div>
              </motion.a>
            ))}

            {/* Social links */}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "2rem", flexWrap: "wrap" }}>
              {[
                { label: "GitHub", icon: <GithubIcon />, href: "https://github.com/ManojkumarPalakuri", color: "#6c63ff" },
                { label: "Email", icon: <Mail size={16} />, href: "mailto:manojkumarpalakuri@gmail.com", color: "#00e5a0" },
              ].map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.06, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "9px 18px",
                    borderRadius: "8px 2px 8px 2px",
                    background: `${s.color}10`,
                    border: `1px solid ${s.color}30`,
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    transition: "color 0.3s",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = s.color)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)")}
                >
                  {s.icon}
                  {s.label}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.div
                  key="sent"
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{ textAlign: "center", padding: "4rem 2rem" }}
                >
                  <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                    <CheckCircle size={56} color="var(--accent-green)" style={{ margin: "0 auto 1.5rem" }} />
                  </motion.div>
                  <h3 style={{ fontFamily: "'Syne',sans-serif", fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-primary)", marginBottom: "0.75rem" }}>
                    Message sent!
                  </h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                    Thanks for reaching out — I&apos;ll get back to you soon.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }} className="form-two-col">
                    {fields.map((field) => (
                      <div
                        key={field.key}
                        style={{ gridColumn: field.multiline || field.key === "subject" ? "span 2" : "span 1" }}
                        className={field.key === "name" || field.key === "email" ? "form-half" : ""}
                      >
                        <label style={{
                          display: "block",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          color: focusedField === field.key ? "var(--accent)" : "var(--text-muted)",
                          marginBottom: "0.5rem",
                          transition: "color 0.3s",
                        }}>
                          {field.label}
                        </label>

                        {field.multiline ? (
                          <textarea
                            value={form[field.key]}
                            onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                            onFocus={() => setFocused(field.key)}
                            onBlur={() => setFocused(null)}
                            rows={5}
                            style={{
                              width: "100%",
                              padding: "14px 18px",
                              borderRadius: "4px 16px 16px 16px",
                              background: "var(--bg-secondary)",
                              border: `1px solid ${errors[field.key] ? "#ff4d6d" : focusedField === field.key ? "var(--accent)" : "var(--border-glass)"}`,
                              color: "var(--text-primary)",
                              fontSize: "0.88rem",
                              resize: "vertical",
                              minHeight: 130,
                              fontFamily: "inherit",
                              transition: "border-color 0.3s",
                              outline: "none",
                            }}
                          />
                        ) : (
                          <input
                            type={field.type || "text"}
                            value={form[field.key]}
                            onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                            onFocus={() => setFocused(field.key)}
                            onBlur={() => setFocused(null)}
                            style={{
                              width: "100%",
                              padding: "14px 18px",
                              borderRadius: "4px 16px 4px 16px",
                              background: "var(--bg-secondary)",
                              border: `1px solid ${errors[field.key] ? "#ff4d6d" : focusedField === field.key ? "var(--accent)" : "var(--border-glass)"}`,
                              color: "var(--text-primary)",
                              fontSize: "0.88rem",
                              fontFamily: "inherit",
                              transition: "border-color 0.3s",
                              outline: "none",
                            }}
                          />
                        )}

                        {errors[field.key] && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ fontSize: "0.7rem", color: "#ff4d6d", marginTop: 5, letterSpacing: "0.05em" }}
                          >
                            {errors[field.key]}
                          </motion.p>
                        )}
                      </div>
                    ))}
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(108,99,255,0.4)" }}
                    whileTap={{ scale: 0.97 }}
                    disabled={status === "sending"}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      padding: "15px 28px",
                      borderRadius: "4px 16px 4px 16px",
                      background: "var(--gradient-1)",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "0.9rem",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      border: "none",
                      cursor: status === "sending" ? "not-allowed" : "pointer",
                      opacity: status === "sending" ? 0.75 : 1,
                      fontFamily: "'Syne',sans-serif",
                      marginTop: "1rem"
                    }}
                  >
                    {status === "sending" ? (
                      <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Sending…</>
                    ) : (
                      <><Send size={16} /> Send Message</>
                    )}
                  </motion.button>
                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        padding: "1rem",
                        background: "rgba(255, 77, 109, 0.1)",
                        border: "1px solid rgba(255, 77, 109, 0.3)",
                        borderRadius: "8px",
                        color: "#ff4d6d",
                        fontSize: "0.85rem",
                        fontFamily: "'Inter', sans-serif",
                        textAlign: "center"
                      }}
                    >
                      {submitError}
                    </motion.div>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .contact-layout { grid-template-columns: 1fr !important; }
          .form-two-col { grid-template-columns: 1fr !important; }
          .form-two-col > * { grid-column: span 1 !important; }
        }
      `}</style>
    </section>
  );
}
