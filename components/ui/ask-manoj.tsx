"use client";

import { useChat } from "ai/react";
import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X, MessageSquare, ChevronRight, Trash2, Volume2, VolumeX } from "lucide-react";

// ─────────────────────────────────────────────────────────────────
// Typing indicator — matches site accent color
// ─────────────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "2px 0" }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.17, ease: "easeInOut" }}
          style={{
            display: "block",
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "var(--accent)",
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Safe link renderer
// ─────────────────────────────────────────────────────────────────
function MsgContent({ content }: { content: string }) {
  const html = content.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:var(--accent);text-decoration:underline;text-underline-offset:3px;">$1</a>'
  );
  return (
    <span
      style={{ lineHeight: 1.8, fontSize: "0.88rem", whiteSpace: "pre-wrap", fontFamily: "'Times New Roman', Times, serif" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────
// Parsing AI messages for dynamic follow-up suggestions
// ─────────────────────────────────────────────────────────────────
function parseAIMessage(content: string) {
  const parts = content.split("---SUGGESTIONS---");
  const text = parts[0].trim();
  let suggestions: string[] = [];
  if (parts.length > 1) {
    suggestions = parts[1]
      .split(/[\n|]/) // Split by newline or pipe character
      .map(s => s.replace(/^-\s*/, '').replace(/\["/g, '').replace(/"\]/g, '').replace(/","/g, '').trim())
      .filter(s => s.length > 5);
  }
  return { text, suggestions };
}

// ─────────────────────────────────────────────────────────────────
// Main widget
// ─────────────────────────────────────────────────────────────────
export default function AskManoj() {
  const [isOpen, setIsOpen]           = useState(false);
  const [showGreet, setShowGreet]     = useState(false);
  const [greetDone, setGreetDone]     = useState(false);
  const [showClearConfirm, setShowClearConfirm]   = useState(false);
  const messagesEndRef                = useRef<HTMLDivElement>(null);
  const inputRef                      = useRef<HTMLInputElement>(null);
  const [isMuted, setIsMuted]         = useState(true);
  const [isSpeaking, setIsSpeaking]   = useState(false);

  const { messages, setMessages, input, handleInputChange, handleSubmit, append, isLoading } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "init",
        role: "assistant",
        content:
          "Hi there 👋 I'm Manoj's AI assistant. Ask me anything about his projects, cloud skills, experience, or how to reach him.",
      },
    ],
  });

  const handleClearChat = () => {
    if (messages.length <= 1) return;
    setShowClearConfirm(true);
  };

  const confirmClearChat = () => {
    setMessages([
      {
        id: "init",
        role: "assistant",
        content: "Chat cleared! How else can I help?"
      }
    ]);
    setShowClearConfirm(false);
  };

  // Auto-scroll on new messages
  useEffect(() => {
    // Add a tiny delay to allow DOM to batch update properly for Framer Motion
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 50);
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 200);
  }, [isOpen]);

  // Greeting bubble: show after 1.4 s, dismiss after 5 s
  useEffect(() => {
    if (greetDone) return;
    const show = setTimeout(() => {
      setShowGreet(true);
      setGreetDone(true);
      const hide = setTimeout(() => setShowGreet(false), 5000);
      return () => clearTimeout(hide);
    }, 1400);
    return () => clearTimeout(show);
  }, [greetDone]);

  const quickActions = [
    { label: "Projects", query: "Tell me about Manoj's main projects." },
    { label: "Skills",   query: "What are Manoj's cloud engineering skills?" },
    { label: "Contact",  query: "How can I contact Manoj?" },
  ];

  const handleQuick = useCallback(
    (q: string) => append({ role: "user", content: q }),
    [append]
  );

  const handleResume = useCallback(() => {
    append({
      role: "assistant",
      content:
        "You can download Manoj's resume here: [Download Resume →](/r1.pdf)\n\nFeel free to reach out at **manojkumarpalakuri@gmail.com** after reviewing!",
    });
  }, [append]);

  // ─────────────────────────────────────────────────────────────────
  // Voice Synthesis Logic
  // ─────────────────────────────────────────────────────────────────
  const speak = useCallback((text: string) => {
    if (isMuted || !('speechSynthesis' in window)) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find a good voice (optional, system default is usually fine)
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google')) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [isMuted]);

  useEffect(() => {
    if (messages.length > 0 && !isMuted) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant" && !isLoading) {
        // Parse out any suggestions text for cleaner speech
        const speechText = lastMessage.content.split("---SUGGESTIONS---")[0].trim();
        speak(speechText);
      }
    }
  }, [messages, isMuted, isLoading, speak]);

  const toggleMute = () => {
    if (!isMuted) window.speechSynthesis.cancel();
    setIsMuted(!isMuted);
  };

  // ── Styles matching design system exactly ──────────────────────
  const panelStyle: React.CSSProperties = {
    position: "fixed",
    bottom: "5.5rem",
    right: "clamp(1rem, 3vw, 1.5rem)",
    zIndex: 9999,
    width: "clamp(300px, 90vw, 340px)",          // wider: comfortable but not overwhelming
    maxHeight: "calc(100vh - 120px)",            // Ensures the panel never outgrows the viewport
    display: "flex",
    flexDirection: "column",
    background: "var(--bg-secondary)",           // #0f0f1a — same as fact cards
    border: "1px solid var(--border-glass)",     // rgba(255,255,255,0.06)
    borderRadius: "4px 18px 4px 18px",           // site's alternating BR pattern
    overflow: "hidden",
    boxShadow: "0 0 48px rgba(108,99,255,0.14), 0 28px 56px rgba(0,0,0,0.55)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 1.2rem",                      // more vertical room
    borderBottom: "1px solid var(--border-glass)",
    background: "linear-gradient(135deg, rgba(108,99,255,0.07) 0%, rgba(59,130,246,0.04) 100%)",
  };

  const userBubble: React.CSSProperties = {
    alignSelf: "flex-end",
    maxWidth: "80%",
    padding: "0.7rem 1rem",                      // more readable padding
    borderRadius: "12px 12px 3px 12px",
    background: "var(--gradient-1)",
    color: "#fff",
    boxShadow: "0 0 18px rgba(108,99,255,0.28)",
  };

  const aiBubble: React.CSSProperties = {
    alignSelf: "flex-start",
    maxWidth: "86%",
    padding: "0.7rem 1rem",                      // matches userBubble padding
    borderRadius: "12px 12px 12px 3px",
    background: "var(--bg-tertiary)",
    border: "1px solid var(--border-glass)",
    color: "var(--text-secondary)",
  };

  return (
    <>
      {/* ── Greeting Bubble ────────────────────────────────────── */}
      <AnimatePresence>
        {showGreet && !isOpen && (
          <motion.button
            key="greet"
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96, transition: { duration: 0.18 } }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            onClick={() => { setShowGreet(false); setIsOpen(true); }}
            style={{
              position: "fixed",
              bottom: "5.5rem",
              right: "clamp(1rem,3vw,1.5rem)",
              zIndex: 9998,
              maxWidth: 220,
              textAlign: "left",
              background: "var(--bg-secondary)",
              border: "1px solid rgba(108,99,255,0.22)",
              borderRadius: "14px 14px 3px 14px",
              padding: "0.75rem 1rem",
              boxShadow: "0 0 28px rgba(108,99,255,0.15), 0 12px 28px rgba(0,0,0,0.4)",
              cursor: "pointer",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
            className="mobile-greet-bubble"
          >
            <style dangerouslySetInnerHTML={{ __html: `
              @media (max-width: 768px) {
                .mobile-greet-bubble {
                  bottom: calc(148px + env(safe-area-inset-bottom)) !important;
                  right: 1.25rem !important;
                }
              }
            `}} />
            {/* Accent line – same as About section */}
            <div style={{
              height: 1,
              width: 32,
              background: "linear-gradient(90deg, var(--accent), transparent)",
              marginBottom: "0.5rem",
            }} />
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.78rem", color: "var(--text-primary)", marginBottom: 3 }}>
              Hey, I&apos;m Manoj&apos;s AI 👋
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Ask about my skills, projects, or contact info.
            </p>
            {/* Arrow cue */}
            <div style={{
              position: "absolute",
              bottom: -6,
              right: 18,
              width: 10,
              height: 10,
              background: "var(--bg-secondary)",
              border: "1px solid rgba(108,99,255,0.22)",
              borderTop: "none",
              borderLeft: "none",
              transform: "rotate(45deg)",
            }} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat Panel ──────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
            style={{ ...panelStyle, position: "fixed" as const }} // cast for typescript strictness just in case
          >
            {/* Custom Clear Confirmation Overlay */}
            <AnimatePresence>
              {showClearConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 99999,
                    background: "rgba(8, 8, 14, 0.7)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem",
                  }}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 5 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 5 }}
                    style={{
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-glass)",
                      padding: "1.4rem",
                      borderRadius: "14px",
                      textAlign: "center",
                      boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
                      maxWidth: "260px",
                      width: "100%",
                    }}
                  >
                    <Trash2 size={24} color="rgba(255,100,100,0.8)" style={{ margin: "0 auto 0.8rem" }} />
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-primary)", marginBottom: "0.3rem" }}>
                      Clear Chat History?
                    </p>
                    <p style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "1.2rem", lineHeight: 1.4 }}>
                      This action cannot be undone.
                    </p>
                    <div style={{ display: "flex", gap: "0.6rem" }}>
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        style={{
                          flex: 1,
                          padding: "0.5rem",
                          borderRadius: "8px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid var(--border-glass)",
                          color: "var(--text-secondary)",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmClearChat}
                        style={{
                          flex: 1,
                          padding: "0.5rem",
                          borderRadius: "8px",
                          background: "rgba(255,80,80,0.15)",
                          border: "1px solid rgba(255,80,80,0.3)",
                          color: "rgba(255,100,100,1)",
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          cursor: "pointer",
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div style={headerStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                {/* Status dot — same pattern as Hero status badge */}
                <motion.span
                  animate={{
                    opacity: [1, 0.3, 1],
                    boxShadow: [
                      "0 0 6px var(--accent-green)",
                      "0 0 14px var(--accent-green)",
                      "0 0 6px var(--accent-green)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    display: "inline-block",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--accent-green)",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    color: "var(--text-primary)",
                    letterSpacing: "-0.01em",
                  }}>
                    Ask Manoj
                  </div>
                  <div style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "0.58rem",
                    color: "var(--accent-green)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}>
                    Active
                  </div>
                </div>
              </div>
              {/* Header Actions */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {/* Clear Chat Button */}
                {messages.length > 1 && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleClearChat}
                    title="Clear Chat"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "4px 10px 4px 10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(255,80,80,0.06)",
                      border: "1px solid rgba(255,80,80,0.15)",
                      color: "rgba(255,100,100,0.8)",
                      cursor: "pointer",
                      transition: "border-color 0.25s, color 0.25s, background 0.25s",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,80,80,0.5)";
                      (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,80,80,1)";
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,80,80,0.15)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,80,80,0.15)";
                      (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,100,100,0.8)";
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,80,80,0.06)";
                    }}
                  >
                    <Trash2 size={12} />
                  </motion.button>
                )}
                {/* Voice Toggle */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMute}
                  title={isMuted ? "Unmute AI Voice" : "Mute AI Voice"}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "4px 10px 4px 10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isMuted ? "rgba(255,255,255,0.03)" : "rgba(108,99,255,0.12)",
                    border: isMuted ? "1px solid var(--border-glass-hover)" : "1px solid var(--accent-dim)",
                    color: isMuted ? "var(--text-secondary)" : "var(--accent)",
                    cursor: "pointer",
                    transition: "all 0.25s",
                  }}
                >
                  {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} className={isSpeaking ? "animate-pulse" : ""} />}
                </motion.button>
                {/* Close — matches site ghost button style */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "4px 10px 4px 10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border-glass-hover)",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    transition: "border-color 0.25s, color 0.25s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-glass-hover)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                  }}
                >
                  <X size={13} />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div 
              data-lenis-prevent="true"
              style={{
              flex: 1,
              overflowY: "auto",
              padding: "1.1rem 1rem",              // more horizontal + vertical breathing room
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem",                      // more space between bubbles
              maxHeight: "55vh",                   // Bulletproof absolute scrolling constraint inside flex panel
              overscrollBehavior: "contain",       // Prevents native scroll chaining to main body
              scrollbarWidth: "none",              // Cleaner look, native scrolling works
            }}>
              {messages.map((m) => {
                const { text } = m.role === "assistant" ? parseAIMessage(m.content) : { text: m.content };
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    style={m.role === "user" ? userBubble : aiBubble}
                  >
                    <MsgContent content={text} />
                  </motion.div>
                );
              })}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ ...aiBubble, padding: "0.6rem 0.9rem" }}
                >
                  <TypingIndicator />
                </motion.div>
              )}

              {/* Smart Follow-up Suggestions */}
              {(() => {
                const lastMessage = messages[messages.length - 1];
                if (!isLoading && lastMessage?.role === "assistant") {
                  const { suggestions } = parseAIMessage(lastMessage.content);
                  if (suggestions.length > 0) {
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.2rem" }}
                      >
                        {suggestions.map((q, i) => (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => handleQuick(q)}
                            style={{
                              padding: "5px 12px",
                              borderRadius: "14px 4px 14px 4px",
                              background: "rgba(255,255,255,0.03)",
                              border: "1px solid var(--border-glass-hover)",
                              color: "var(--text-secondary)",
                              fontFamily: "'Space Grotesk', sans-serif",
                              fontWeight: 600,
                              fontSize: "0.68rem",
                              letterSpacing: "0.02em",
                              cursor: "pointer",
                              transition: "all 0.22s",
                              textAlign: "left"
                            }}
                            onMouseEnter={e => {
                              const b = e.currentTarget as HTMLButtonElement;
                              b.style.borderColor = "var(--accent)";
                              b.style.color       = "var(--text-primary)";
                              b.style.background  = "rgba(108,99,255,0.08)";
                            }}
                            onMouseLeave={e => {
                              const b = e.currentTarget as HTMLButtonElement;
                              b.style.borderColor = "var(--border-glass-hover)";
                              b.style.color       = "var(--text-secondary)";
                              b.style.background  = "rgba(255,255,255,0.03)";
                            }}
                          >
                            {q}
                          </motion.button>
                        ))}
                      </motion.div>
                    );
                  }
                }
                return null;
              })()}

              <div ref={messagesEndRef} style={{ float:"left", clear: "both" }} />
            </div>

            {/* Quick actions — pill style matching site's ghost button */}
            {messages.length === 1 && (
              <div style={{
                padding: "0.8rem 1rem 0.9rem",   // uniform comfortable padding
                borderTop: "1px solid var(--border-glass)",
              }}>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "0.58rem",
                  color: "var(--text-muted)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                }}>
                  Quick ask
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {quickActions.map(({ label, query }) => (
                    <motion.button
                      key={label}
                      whileHover={{ scale: 1.03, boxShadow: "0 0 12px rgba(108,99,255,0.2)" }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleQuick(query)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "4px 11px",
                        borderRadius: "4px 10px 4px 10px",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid var(--border-glass-hover)",
                        color: "var(--text-secondary)",
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.7rem",
                        letterSpacing: "0.02em",
                        cursor: "pointer",
                        transition: "all 0.22s",
                      }}
                      onMouseEnter={e => {
                        const b = e.currentTarget as HTMLButtonElement;
                        b.style.borderColor = "var(--accent)";
                        b.style.color       = "var(--text-primary)";
                        b.style.background  = "rgba(108,99,255,0.08)";
                      }}
                      onMouseLeave={e => {
                        const b = e.currentTarget as HTMLButtonElement;
                        b.style.borderColor = "var(--border-glass-hover)";
                        b.style.color       = "var(--text-secondary)";
                        b.style.background  = "rgba(255,255,255,0.03)";
                      }}
                    >
                      {label}
                      <ChevronRight size={10} style={{ opacity: 0.5 }} />
                    </motion.button>
                  ))}
                  {/* Resume pill — accent-tinted, same logic as site's blue-tint ghost */}
                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: "0 0 14px rgba(108,99,255,0.25)" }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleResume}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "4px 11px",
                      borderRadius: "10px 4px 10px 4px",
                      background: "rgba(108,99,255,0.08)",
                      border: "1px solid rgba(108,99,255,0.22)",
                      color: "var(--accent)",
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.7rem",
                      cursor: "pointer",
                      transition: "all 0.22s",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(108,99,255,0.16)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(108,99,255,0.08)";
                    }}
                  >
                    Resume ↗
                  </motion.button>
                </div>
              </div>
            )}

            {/* Input — matches site's glass input look */}
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.85rem 1rem",          // more breathing room
                borderTop: "1px solid var(--border-glass)",
                background: "rgba(0,0,0,0.15)",
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="Ask me anything…"
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--border-glass-hover)",
                  borderRadius: "4px 10px 4px 10px",
                  padding: "0.65rem 0.95rem",     // taller input — easier to type in
                  fontFamily: "'Times New Roman', Times, serif",
                  fontSize: "0.9rem",
                  color: "var(--text-primary)",
                  outline: "none",
                  transition: "border-color 0.25s, box-shadow 0.25s",
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(108,99,255,0.14)";
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = "var(--border-glass-hover)";
                  e.currentTarget.style.boxShadow   = "none";
                }}
              />
              {/* Send — mini version of site's primary gradient button */}
              <motion.button
                type="submit"
                disabled={isLoading || !input.trim()}
                whileHover={!isLoading && input.trim() ? { scale: 1.06, boxShadow: "0 0 20px rgba(108,99,255,0.45)" } : {}}
                whileTap={!isLoading && input.trim() ? { scale: 0.93 } : {}}
                style={{
                  width: 36,                      // slightly larger hit target
                  height: 36,
                  borderRadius: "4px 10px 4px 10px",
                  background: "var(--gradient-1)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
                  opacity: isLoading || !input.trim() ? 0.4 : 1,
                  boxShadow: "0 0 16px rgba(108,99,255,0.30)",
                  transition: "opacity 0.2s",
                  flexShrink: 0,
                }}
              >
                <Send size={14} color="#fff" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Action Button ───────────────────────────────── */}
      <motion.button
        onClick={() => { setShowGreet(false); setIsOpen(v => !v); }}
        whileHover={{ scale: 1.06, boxShadow: "0 0 28px rgba(108,99,255,0.45)" }}
        whileTap={{ scale: 0.93 }}
        className="mobile-fab"
        style={{
          position: "fixed",
          bottom: "calc(max(1.2rem, 80px) + env(safe-area-inset-bottom))",
          right: "clamp(1.2rem,3vw,1.6rem)",
          zIndex: 2000,
          width: 48,
          height: 48,
          borderRadius: "4px 14px 4px 14px",
          background: "var(--gradient-1)",
          border: "none",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 0 22px rgba(108,99,255,0.32)",
          touchAction: "manipulation",
        }}
        aria-label="Ask Manoj AI"
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 768px) {
            .mobile-fab {
              bottom: calc(88px + env(safe-area-inset-bottom)) !important;
              right: 1.25rem !important;
            }
          }
        `}} />
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="x"
              initial={{ rotate: -80, opacity: 0 }}
              animate={{ rotate: 0,  opacity: 1 }}
              exit={{ rotate: 80,   opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              <X size={16} />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 80,  opacity: 0 }}
              animate={{ rotate: 0,   opacity: 1 }}
              exit={{ rotate: -80,    opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              <MessageSquare size={16} />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Subtle outer pulse ring — only when closed */}
        {!isOpen && (
          <motion.span
            animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "4px 14px 4px 14px",
              background: "rgba(108,99,255,0.3)",
              pointerEvents: "none",
            }}
          />
        )}
      </motion.button>
    </>
  );
}
