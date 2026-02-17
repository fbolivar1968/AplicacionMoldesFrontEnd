import { useEffect, useRef, useState } from "react";
import NavBar from "../Components/NavBar.jsx";
import * as React from "react";

// ─── Spark particle type ───────────────────────────────────────────────────
interface Spark {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    hue: number;
}

// ─── Animated spark canvas ─────────────────────────────────────────────────
function SparkCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sparksRef = useRef<Spark[]>([]);
    const frameRef = useRef<number>(0);
    const idRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const emit = () => {
            // Sparks burst from the hammer strike area (~60% x, ~52% y of screen)
            const ox = canvas.width * 0.6;
            const oy = canvas.height * 0.52;
            for (let i = 0; i < 3; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 1.5 + Math.random() * 3.5;
                sparksRef.current.push({
                    id: idRef.current++,
                    x: ox + (Math.random() - 0.5) * 20,
                    y: oy + (Math.random() - 0.5) * 20,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 1.5,
                    life: 1,
                    maxLife: 0.6 + Math.random() * 0.8,
                    size: 1.5 + Math.random() * 2.5,
                    hue: 20 + Math.random() * 40,
                });
            }
        };

        let lastEmit = 0;
        const loop = (ts: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (ts - lastEmit > 50) {
                emit();
                lastEmit = ts;
            }
            sparksRef.current = sparksRef.current.filter((s) => s.life > 0);
            for (const s of sparksRef.current) {
                s.x += s.vx;
                s.y += s.vy;
                s.vy += 0.09;
                s.vx *= 0.98;
                s.life -= 0.02;
                const alpha = Math.max(0, s.life / s.maxLife);
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size * alpha, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${s.hue}, 100%, 65%, ${alpha})`;
                ctx.fill();
                // Tail glow
                const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 3);
                grad.addColorStop(0, `hsla(${s.hue}, 100%, 80%, ${alpha * 0.4})`);
                grad.addColorStop(1, "transparent");
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
            }
            frameRef.current = requestAnimationFrame(loop);
        };
        frameRef.current = requestAnimationFrame(loop);
        return () => {
            cancelAnimationFrame(frameRef.current);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                inset: 0,
                pointerEvents: "none",
                zIndex: 10,
            }}
        />
    );
}

// ─── Forging Operator SVG Illustration ────────────────────────────────────
function ForgerIllustration() {
    return (
        <svg
            viewBox="0 0 340 480"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Forging operator at work"
            style={{ width: "100%", maxWidth: 340, filter: "drop-shadow(0 0 40px rgba(255,120,0,0.25))" }}
        >
            {/* Glow behind figure */}
            <defs>
                <radialGradient id="anvilGlow" cx="50%" cy="80%" r="50%">
                    <stop offset="0%" stopColor="#ff6a00" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#ff6a00" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="metalGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ff9900" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#cc3300" stopOpacity="0" />
                </radialGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2a2a2a" />
                    <stop offset="100%" stopColor="#1a1a1a" />
                </linearGradient>
                <linearGradient id="helmetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#444" />
                    <stop offset="100%" stopColor="#222" />
                </linearGradient>
                <linearGradient id="hammerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#888" />
                    <stop offset="100%" stopColor="#444" />
                </linearGradient>
                <linearGradient id="anvilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#555" />
                    <stop offset="100%" stopColor="#333" />
                </linearGradient>
            </defs>

            {/* Background glow pool */}
            <ellipse cx="170" cy="390" rx="130" ry="40" fill="url(#anvilGlow)" />

            {/* === ANVIL === */}
            {/* Base */}
            <rect x="90" y="370" width="160" height="20" rx="4" fill="url(#anvilGrad)" />
            <rect x="100" y="355" width="140" height="18" rx="3" fill="#444" />
            {/* Top face */}
            <rect x="85" y="340" width="170" height="20" rx="4" fill="#555" />
            {/* Horn */}
            <polygon points="85,340 60,356 85,360" fill="#4a4a4a" />
            {/* Clip / step */}
            <rect x="220" y="340" width="35" height="10" rx="2" fill="#4a4a4a" />

            {/* === HOT METAL WORKPIECE on anvil === */}
            <rect x="130" y="330" width="80" height="14" rx="3" fill="url(#metalGlow)" filter="url(#glow)" />
            {/* Heat gradient on workpiece */}
            <rect x="130" y="330" width="40" height="14" rx="3" fill="#ff4500" opacity="0.6" />

            {/* === OPERATOR BODY === */}
            {/* Legs */}
            <rect x="145" y="290" width="22" height="55" rx="6" fill="#1e1e1e" />
            <rect x="173" y="290" width="22" height="55" rx="6" fill="#1a1a1a" />
            {/* Boots */}
            <rect x="140" y="337" width="30" height="14" rx="4" fill="#111" />
            <rect x="170" y="337" width="30" height="14" rx="4" fill="#111" />

            {/* Apron */}
            <path d="M138 210 Q170 225 202 210 L208 295 Q170 305 132 295 Z" fill="#3a2a1a" opacity="0.9" />
            <path d="M150 210 Q170 218 190 210 L194 290 Q170 298 146 290 Z" fill="#4a3525" opacity="0.7" />

            {/* Torso */}
            <rect x="138" y="195" width="64" height="100" rx="12" fill="url(#bodyGrad)" />

            {/* === ARMS === */}
            {/* Left arm (lowered) */}
            <path d="M138 210 Q115 230 105 270" stroke="#2a2a2a" strokeWidth="22" strokeLinecap="round" fill="none" />
            <path d="M138 210 Q115 230 105 270" stroke="#333" strokeWidth="18" strokeLinecap="round" fill="none" />

            {/* Right arm (raised, holding hammer) */}
            <path d="M202 205 Q230 175 245 155" stroke="#2a2a2a" strokeWidth="22" strokeLinecap="round" fill="none" />
            <path d="M202 205 Q230 175 245 155" stroke="#333" strokeWidth="18" strokeLinecap="round" fill="none" />

            {/* Left hand / glove */}
            <circle cx="105" cy="272" r="12" fill="#1a1a1a" />
            <circle cx="105" cy="272" r="10" fill="#222" />

            {/* === HAMMER === */}
            {/* Handle */}
            <line x1="245" y1="155" x2="195" y2="250" stroke="#5a3a1a" strokeWidth="8" strokeLinecap="round" />
            <line x1="245" y1="155" x2="195" y2="250" stroke="#7a5a2a" strokeWidth="5" strokeLinecap="round" />
            {/* Head */}
            <rect x="228" y="135" width="36" height="26" rx="4" fill="url(#hammerGrad)" transform="rotate(-35 246 148)" />
            <rect x="228" y="135" width="36" height="8" rx="2" fill="#999" opacity="0.4" transform="rotate(-35 246 148)" />

            {/* === NECK === */}
            <rect x="158" y="175" width="24" height="25" rx="8" fill="#c4a882" />

            {/* === HEAD === */}
            {/* Head shape */}
            <ellipse cx="170" cy="160" rx="28" ry="30" fill="#c4a882" />

            {/* === HARD HAT === */}
            <ellipse cx="170" cy="143" rx="34" ry="14" fill="url(#helmetGrad)" />
            <path d="M136 148 Q170 128 204 148 Q204 140 170 135 Q136 140 136 148Z" fill="#555" />
            {/* Brim */}
            <ellipse cx="170" cy="148" rx="36" ry="6" fill="#444" />

            {/* === VISOR / FACE SHIELD === */}
            <path d="M145 152 Q170 175 195 152 L192 168 Q170 185 148 168Z" fill="#ff8800" opacity="0.35" />
            <path d="M145 152 Q170 175 195 152 L192 168 Q170 185 148 168Z" fill="none" stroke="#ff6600" strokeWidth="1.5" opacity="0.6" />

            {/* === FACE (partially visible) === */}
            <ellipse cx="162" cy="165" rx="4" ry="3" fill="#a07850" /> {/* left eye shadow */}

            {/* Safety goggle strap */}
            <path d="M142 157 Q170 162 198 157" stroke="#333" strokeWidth="3" fill="none" strokeLinecap="round" />

            {/* Ear protection sides */}
            <circle cx="142" cy="162" r="7" fill="#333" />
            <circle cx="198" cy="162" r="7" fill="#333" />
            <circle cx="142" cy="162" r="4" fill="#444" />
            <circle cx="198" cy="162" r="4" fill="#444" />

            {/* === SPARKS near hammer strike === */}
            <circle cx="175" cy="328" r="3" fill="#ff9900" filter="url(#glow)" opacity="0.9" />
            <circle cx="188" cy="322" r="2" fill="#ffcc00" filter="url(#glow)" opacity="0.8" />
            <circle cx="165" cy="320" r="2.5" fill="#ff6600" filter="url(#glow)" opacity="0.7" />
            <line x1="175" y1="328" x2="185" y2="315" stroke="#ff9900" strokeWidth="1.5" opacity="0.7" strokeLinecap="round" />
            <line x1="175" y1="328" x2="160" y2="316" stroke="#ffcc00" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
            <line x1="175" y1="328" x2="192" y2="320" stroke="#ff6600" strokeWidth="1.5" opacity="0.65" strokeLinecap="round" />

            {/* Floor shadow */}
            <ellipse cx="170" cy="392" rx="110" ry="12" fill="rgba(0,0,0,0.4)" />
        </svg>
    );
}

// ─── Animated counter ─────────────────────────────────────────────────────
function ProgressBar() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Slowly animate to a fake "37%" complete
        const target = 37;
        let current = 0;
        const step = () => {
            current += 0.4;
            setProgress(Math.min(current, target));
            if (current < target) requestAnimationFrame(step);
        };
        const raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, []);

    return (
        <div style={{ width: "100%", maxWidth: 480 }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                    fontFamily: "'Courier New', monospace",
                    fontSize: 12,
                    color: "#888",
                    letterSpacing: "0.1em",
                }}
            >
                <span>FORGE PROGRESS</span>
                <span style={{ color: "#ff8800" }}>{Math.floor(progress)}%</span>
            </div>
            <div
                style={{
                    height: 6,
                    background: "#1a1a1a",
                    borderRadius: 3,
                    border: "1px solid #333",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        height: "100%",
                        width: `${progress}%`,
                        background: "linear-gradient(90deg, #cc3300, #ff8800, #ffcc00)",
                        borderRadius: 3,
                        boxShadow: "0 0 12px rgba(255,140,0,0.6)",
                        transition: "width 0.05s linear",
                    }}
                />
            </div>
        </div>
    );
}

// ─── Blinking cursor ──────────────────────────────────────────────────────
function BlinkingCursor() {
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        const t = setInterval(() => setVisible((v) => !v), 530);
        return () => clearInterval(t);
    }, []);
    return (
        <span
            style={{
                display: "inline-block",
                width: 3,
                height: "1em",
                background: visible ? "#ff8800" : "transparent",
                verticalAlign: "middle",
                marginLeft: 4,
                borderRadius: 1,
            }}
        />
    );
}

// ─── Main page ────────────────────────────────────────────────────────────
export default function UnderConstruction() {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <>
            {/* Inject Google Fonts + keyframes via a style tag */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0a0a0a;
          overflow-x: hidden;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulseGlow {
          0%, 100% { text-shadow: 0 0 20px rgba(255,136,0,0.4), 0 0 60px rgba(255,60,0,0.15); }
          50%       { text-shadow: 0 0 40px rgba(255,136,0,0.7), 0 0 100px rgba(255,60,0,0.35); }
        }

        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }

        @keyframes flicker {
          0%, 97%, 100% { opacity: 1; }
          98%            { opacity: 0.85; }
          99%            { opacity: 0.95; }
        }

        @keyframes heatShimmer {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(255,100,0,0.3)); }
          50%       { filter: drop-shadow(0 0 40px rgba(255,140,0,0.5)); }
        }

        .page-wrapper {
          opacity: ${loaded ? 1 : 0};
          transition: opacity 0.6s ease;
        }

        .main-title {
          animation: pulseGlow 3s ease-in-out infinite, fadeUp 0.8s ease 0.2s both;
        }

        .sub-copy {
          animation: fadeUp 0.8s ease 0.5s both;
        }

        .progress-section {
          animation: fadeUp 0.8s ease 0.7s both;
        }

        .social-row {
          animation: fadeUp 0.8s ease 0.9s both;
        }

        .figure-wrap {
          animation: fadeUp 0.9s ease 0.1s both, heatShimmer 4s ease-in-out infinite;
        }

        .scanline {
          animation: scanline 6s linear infinite;
        }

        .flicker-layer {
          animation: flicker 8s step-end infinite;
        }

        .metal-badge {
          background: linear-gradient(135deg, #222 0%, #111 100%);
          border: 1px solid #333;
          padding: 6px 14px;
          border-radius: 2px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: #666;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .metal-badge.hot {
          border-color: #ff6600;
          color: #ff8800;
          box-shadow: 0 0 10px rgba(255,102,0,0.25);
        }

        .notify-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid #444;
          color: #ccc;
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          padding: 8px 4px;
          outline: none;
          width: 260px;
          transition: border-color 0.2s;
        }

        .notify-input::placeholder { color: #444; }
        .notify-input:focus { border-color: #ff8800; }

        .notify-btn {
          background: #ff6600;
          color: #000;
          border: none;
          padding: 9px 20px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px;
          letter-spacing: 0.1em;
          cursor: pointer;
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
          transition: background 0.15s, box-shadow 0.15s;
        }

        .notify-btn:hover {
          background: #ff8800;
          box-shadow: 0 0 20px rgba(255,136,0,0.5);
        }

        .divider-line {
          width: 100%;
          max-width: 480px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #333, transparent);
        }
      `}</style>

            <NavBar/>
            <SparkCanvas />

            {/* Scanline overlay */}
            <div
                className="flicker-layer"
                style={{
                    position: "fixed",
                    inset: 0,
                    pointerEvents: "none",
                    zIndex: 5,
                    background:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
                }}
            />
            <div
                className="scanline"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "4px",
                    background: "linear-gradient(transparent, rgba(255,136,0,0.04), transparent)",
                    pointerEvents: "none",
                    zIndex: 6,
                }}
            />

            {/* Main layout */}
            <div
                className="page-wrapper"
                style={{
                    minHeight: "100vh",
                    background: "radial-gradient(ellipse at 60% 50%, #140a00 0%, #0a0a0a 60%)",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    alignItems: "center",
                    padding: "40px 60px",
                    gap: 40,
                    fontFamily: "'Space Mono', monospace",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {/* ── LEFT COLUMN ── */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 28,
                        maxWidth: 520,
                    }}
                >
                    {/* Top badge row */}
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <span className="metal-badge hot">⚡ Under Construction</span>
                        <span className="metal-badge">EST. 04/2026</span>
                    </div>

                    {/* Main heading */}
                    <div className="main-title">
                        <div
                            style={{
                                fontFamily: "'Bebas Neue', sans-serif",
                                fontSize: "clamp(52px, 7vw, 100px)",
                                lineHeight: 0.9,
                                color: "#e8e8e8",
                                letterSpacing: "0.02em",
                            }}
                        >
                            SE ESTÁ
                        </div>
                        <div
                            style={{
                                fontFamily: "'Bebas Neue', sans-serif",
                                fontSize: "clamp(52px, 7vw, 100px)",
                                lineHeight: 0.9,
                                background: "linear-gradient(90deg, #ff6600, #ffcc00)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                                letterSpacing: "0.02em",
                            }}
                        >
                            FORJANDO
                            <BlinkingCursor />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="divider-line" />

                    {/* Body copy */}
                    <div className="sub-copy" style={{ color: "#888", fontSize: 13, lineHeight: 1.9 }}>
                        Something exceptional is taking shape in the furnace.
                        Our craftsmen are hammering every detail into place — welding
                        performance with precision, tempering design with purpose.
                        <br />
                        <br />
                        <span style={{ color: "#aaa" }}>
              The forge doesn't rush. Neither do we.
            </span>
                    </div>

                    {/* Progress */}
                    <div className="progress-section" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <ProgressBar />

                        {/* Status chips */}
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                            {[
                                { label: "Design", done: true },
                                { label: "Backend", done: true },
                                { label: "Frontend", done: false },
                                { label: "QA", done: false },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                        fontSize: 11,
                                        color: item.done ? "#ff8800" : "#444",
                                        fontFamily: "'Space Mono', monospace",
                                        letterSpacing: "0.08em",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: "50%",
                                            background: item.done ? "#ff8800" : "#333",
                                            boxShadow: item.done ? "0 0 8px #ff8800" : "none",
                                        }}
                                    />
                                    {item.label.toUpperCase()}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="divider-line" />



                    {/* Footer line */}
                    <div style={{ fontSize: 10, color: "#333", letterSpacing: "0.12em", marginTop: 8 }}>
                        © {new Date().getFullYear()} FORJAS BOLÍVAR SAS.
                    </div>
                </div>

                {/* ── RIGHT COLUMN — Illustration ── */}
                <div
                    className="figure-wrap"
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                    }}
                >
                    {/* Radial glow behind figure */}
                    <div
                        style={{
                            position: "absolute",
                            width: "50%",
                            height: "50%",
                            borderRadius: "50%",
                            background: "radial-gradient(circle, rgba(255,100,0,0.12) 0%, transparent 70%)",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -40%)",
                            pointerEvents: "none",
                        }}
                    />
                    <ForgerIllustration />
                </div>
            </div>

            {/* Mobile responsive overrides */}
            <style>{`
        @media (max-width: 768px) {
          .page-wrapper {
            grid-template-columns: 1fr !important;
            padding: 32px 24px !important;
          }
          .figure-wrap {
            order: -1;
          }
          .figure-wrap svg {
            max-width: 220px !important;
          }
        }
      `}</style>
        </>
    );
}