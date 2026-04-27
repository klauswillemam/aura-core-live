import { useEffect, useRef, useState } from "react";

const lines = [
  "psymatrix › sync ContextPack(PT-2041) … ok",
  "psynote › fetch lastNote(2026-04-12) … ok",
  "signals › weighted ≥ 0.55 → 4 detected",
  "scales › GAD-7=9 · PHQ-9=missing",
  "evidence › grade A × 2 returned",
  "risk-radar › suicide=low · no active alerts",
  "gaps › PHQ-9, EEM, drug-interactions",
  "compose › 8 next-actions ready",
];

export function AureaOrb() {
  const [tick, setTick] = useState(0);
  const [logIdx, setLogIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 80);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const target = lines[logIdx % lines.length];
    if (typed.length < target.length) {
      const t = setTimeout(() => setTyped(target.slice(0, typed.length + 1)), 22);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setTyped("");
      setLogIdx((i) => i + 1);
    }, 1400);
    return () => clearTimeout(t);
  }, [typed, logIdx]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-border/60 bg-card-elev"
      style={{ minHeight: 280 }}
    >
      {/* Aurora background */}
      <div className="absolute inset-0 bg-aurora opacity-90" />
      <div className="absolute inset-0 scanline" />

      {/* Wave lines */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 280">
        {[0, 1, 2].map((i) => {
          const phase = tick * 0.05 + i * 1.4;
          const amp = 18 + i * 6;
          const yBase = 140 + (i - 1) * 18;
          const path = Array.from({ length: 60 })
            .map((_, x) => {
              const px = (x / 59) * 800;
              const py = yBase + Math.sin(px * 0.012 + phase) * amp;
              return `${x === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`;
            })
            .join(" ");
          return (
            <path
              key={i}
              d={path}
              fill="none"
              stroke={`hsl(${200 + i * 25} 100% 65% / ${0.4 - i * 0.1})`}
              strokeWidth={1.2}
            />
          );
        })}
      </svg>

      {/* Orbit rings */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative h-44 w-44">
          <div className="absolute inset-0 rounded-full border border-primary/20 animate-orbit" />
          <div className="absolute inset-4 rounded-full border border-accent/20 animate-orbit" style={{ animationDirection: "reverse", animationDuration: "24s" }} />
          <div className="absolute inset-10 rounded-full border border-primary-glow/30" />
          {/* Core hexagon */}
          <div className="absolute inset-0 grid place-items-center">
            <div
              className="h-14 w-14 rotate-45 bg-hero shadow-glow animate-glow-pulse"
              style={{ borderRadius: 12 }}
            />
          </div>
          {/* particles */}
          {[0, 1, 2, 3, 4].map((i) => {
            const angle = (tick * 2 + i * 72) * (Math.PI / 180);
            const r = 70 + (i % 2) * 14;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            return (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-primary-glow shadow-[0_0_10px_hsl(var(--primary-glow))]"
                style={{ transform: `translate(${x}px, ${y}px)` }}
              />
            );
          })}
        </div>
      </div>

      {/* Live log */}
      <div className="absolute bottom-3 left-4 right-4 font-mono text-[11px] text-primary-glow/80">
        <span className="opacity-60">$ aurea-cora </span>
        <span>{typed}</span>
        <span className="inline-block w-1.5 h-3 align-[-2px] bg-primary-glow ml-0.5 animate-blink-caret" />
      </div>

      {/* Caption */}
      <div className="absolute top-3 left-4 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
        <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          ÁUREA CORA · live
        </span>
      </div>
    </div>
  );
}
