import { useEffect, useRef } from "react";

const DURATION = 4000;

export default function LoadingScreen({ onDone }) {
  const fillRef = useRef(null);
  const pctRef  = useRef(null);

  useEffect(() => {
    const starsEl = document.getElementById("ls-stars");
    for (let i = 0; i < 120; i++) {
      const s = document.createElement("span");
      s.className = "ls-star";
      const sz = Math.random() * 2 + 0.5;
      s.style.cssText = `
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        width:${sz}px; height:${sz}px;
        animation-delay:${Math.random() * 4}s;
        animation-duration:${2 + Math.random() * 3}s;
      `;
      starsEl.appendChild(s);
    }

    let p = 0;
    const INTERVAL = 50;
    const STEPS = DURATION / INTERVAL;

    const timer = setInterval(() => {
      p = Math.min(100, p + 100 / STEPS);
      if (fillRef.current) fillRef.current.style.width = p + "%";
      if (pctRef.current)  pctRef.current.textContent  = Math.round(p) + "%";
      if (p >= 100) {
        clearInterval(timer);
        setTimeout(onDone, 300);
      }
    }, INTERVAL);

    return () => clearInterval(timer);
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#000",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden",
    }}>
      {/* Stars */}
      <div id="ls-stars" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

      {/* Center content */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2, textAlign: "center", padding: "0 24px" }}>

        {/* Rocket icon */}
        <div style={{ fontSize: "3rem", marginBottom: "22px", animation: "ls-pulse 2s ease-in-out infinite" }}>
          🚀
        </div>

        {/* Main title */}
        <h1 style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: "clamp(1.6rem, 5vw, 2.8rem)",
          fontWeight: 900,
          letterSpacing: "0.18em",
          color: "#fff",
          textTransform: "uppercase",
          lineHeight: 1.1,
          animation: "ls-fadein 0.8s ease both",
          margin: 0,
        }}>
          WELCOME TO ORBITALX<span style={{ color: "#00d4ff" }}>&nbsp;X</span>
        </h1>

        {/* Divider */}
        <div style={{ width: 48, height: 1, background: "rgba(0,212,255,0.35)", margin: "14px auto" }} />

        {/* Subtitle */}
        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "0.82rem",
          fontWeight: 400,
          color: "rgba(255,255,255,0.45)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          animation: "ls-fadein 1s 0.3s ease both",
          animationFillMode: "both",
          margin: 0,
        }}>
          A Leading Interstellar Success Platform
        </p>

        {/* Progress bar */}
        <div style={{ marginTop: 40, width: 300, animation: "ls-fadein 1s 0.5s ease both", animationFillMode: "both" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Initializing systems
              <span style={{ animation: "ls-dot 1.2s infinite" }}>.</span>
              <span style={{ animation: "ls-dot 1.2s 0.2s infinite" }}>.</span>
              <span style={{ animation: "ls-dot 1.2s 0.4s infinite" }}>.</span>
            </span>
            <span ref={pctRef} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "#00d4ff", letterSpacing: "0.08em" }}>
              0%
            </span>
          </div>
          <div style={{ width: "100%", height: 2, background: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
            <div ref={fillRef} style={{ height: "100%", width: "0%", background: "#00d4ff", borderRadius: 2, transition: "width 0.05s linear" }} />
          </div>
        </div>

      </div>

      {/* Keyframe styles */}
      <style>{`
        .ls-star {
          position: absolute;
          border-radius: 50%;
          background: white;
          animation: ls-twinkle 3s infinite alternate;
        }
        @keyframes ls-twinkle {
          0%   { opacity: 0.05; }
          100% { opacity: 0.9; }
        }
        @keyframes ls-pulse {
          0%, 100% { transform: scale(1);    filter: drop-shadow(0 0 8px rgba(0,212,255,0.4)); }
          50%       { transform: scale(1.1); filter: drop-shadow(0 0 24px rgba(0,212,255,0.9)); }
        }
        @keyframes ls-fadein {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ls-dot {
          0%, 80%, 100% { opacity: 0.2; }
          40%            { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
