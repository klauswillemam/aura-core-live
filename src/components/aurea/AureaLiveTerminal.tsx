import { useEffect, useState } from "react";
import { Check, Activity, ChevronRight, Stethoscope } from "lucide-react";

const STEPS = [
  "Analisando contexto clínico…",
  "Lendo memória do paciente…",
  "Recuperando documento da última consulta…",
  "Sinais detectados pelo PsyMatrix…",
  "Identificando radar de risco clínico…",
  "Verificando escalas aplicadas…",
  "Consultando evidências científicas…",
  "Compondo próximas ações sugeridas…",
];

const SUMMARY = "Análise concluída · 4 sinais · 3 lacunas · 8 ações sugeridas";

export function AureaLiveTerminal() {
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Type out the active step
  useEffect(() => {
    if (active >= STEPS.length) return;
    const target = STEPS[active];
    if (typed.length < target.length) {
      const t = setTimeout(() => setTyped(target.slice(0, typed.length + 1)), 18);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setDone((d) => [...d, target]);
      setTyped("");
      setActive((a) => a + 1);
    }, 520);
    return () => clearTimeout(t);
  }, [typed, active]);

  // Auto-collapse when finished
  useEffect(() => {
    if (active >= STEPS.length && !expanded) {
      const t = setTimeout(() => setCollapsed(true), 900);
      return () => clearTimeout(t);
    }
  }, [active, expanded]);

  const isFinished = active >= STEPS.length;

  if (collapsed && !expanded) {
    return (
      <section className="rounded-xl border border-border bg-card-elev shadow-card p-4 animate-fade-in">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Stethoscope className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
                ÁUREA CORA · Live
              </div>
              <div className="text-sm font-medium text-foreground truncate">{SUMMARY}</div>
            </div>
          </div>
          <button
            onClick={() => {
              setExpanded(true);
              setCollapsed(false);
            }}
            className="shrink-0 inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-md border border-border bg-surface-soft text-foreground hover:bg-secondary transition"
          >
            Ver raciocínio completo <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-xl border border-border bg-card-elev shadow-card">
      {/* Subtle aurora wash */}
      <div className="absolute inset-0 bg-aurora pointer-events-none" />

      <header className="relative flex items-center justify-between px-5 pt-4 pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-success animate-pulse-dot" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
            ÁUREA CORA · Live
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
          Clinical Reasoning Stream
        </span>
      </header>

      <ol className="relative px-5 py-4 space-y-2.5 min-h-[260px]">
        {done.map((line, i) => (
          <li
            key={i}
            className="flex items-center gap-3 text-[13px] text-muted-foreground animate-step-in"
          >
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-success/12 text-success">
              <Check className="h-3 w-3" strokeWidth={2.5} />
            </span>
            <span className="truncate">{line}</span>
          </li>
        ))}

        {!isFinished && (
          <li className="flex items-center gap-3 text-[13px] animate-step-in">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-primary/30 text-primary">
              <Activity className="h-3 w-3 animate-spin-slow" />
            </span>
            <span className="text-foreground font-medium">
              {typed}
              <span className="inline-block w-[2px] h-3 align-[-2px] bg-primary ml-0.5 animate-blink-caret" />
            </span>
          </li>
        )}

        {isFinished && (
          <li className="pt-3 mt-2 border-t border-border/60 flex items-center justify-between animate-fade-in">
            <div className="text-sm font-medium text-foreground">{SUMMARY}</div>
            <button
              onClick={() => {
                setExpanded(false);
                setCollapsed(true);
              }}
              className="text-[11px] text-muted-foreground hover:text-foreground transition uppercase tracking-wider"
            >
              recolher
            </button>
          </li>
        )}
      </ol>
    </section>
  );
}
