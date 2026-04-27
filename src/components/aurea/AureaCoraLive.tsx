import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check, Brain, FileText, Activity, BarChart3, BookOpen,
  ShieldAlert, AlertTriangle, Sparkles, Send, CircleDashed,
} from "lucide-react";
import { mockContextPack } from "@/data/aureaMock";

type StepKind =
  | "memory" | "document" | "signals" | "risk"
  | "scales" | "evidence" | "gaps" | "compose";

type Step = {
  id: string;
  kind: StepKind;
  tag: string;
  typing: string;       // text that gets "typed"
  icon: React.ComponentType<{ className?: string }>;
};

const STEPS: Step[] = [
  { id: "s1", kind: "memory",   tag: "MEMÓRIA",       icon: Brain,         typing: "Lendo memória clínica do paciente…" },
  { id: "s2", kind: "document", tag: "DOCUMENTO",     icon: FileText,      typing: "Recuperando documento da última consulta…" },
  { id: "s3", kind: "signals",  tag: "SINAIS",        icon: Activity,      typing: "Sinais detectados pelo PsyMatrix…" },
  { id: "s4", kind: "risk",     tag: "RADAR DE RISCO",icon: ShieldAlert,   typing: "Identificando radar de risco clínico…" },
  { id: "s5", kind: "scales",   tag: "ESCALAS",       icon: BarChart3,     typing: "Verificando escalas aplicadas…" },
  { id: "s6", kind: "evidence", tag: "EVIDÊNCIAS",    icon: BookOpen,      typing: "Consultando evidências científicas…" },
  { id: "s7", kind: "gaps",     tag: "LACUNAS",       icon: AlertTriangle, typing: "Identificando lacunas clínicas…" },
  { id: "s8", kind: "compose",  tag: "PRÓXIMAS AÇÕES",icon: Sparkles,      typing: "Compondo próximas ações sugeridas…" },
];

const SUGGESTIONS = ["Gerar EEM", "Aplicar PHQ-9", "Criar encaminhamento", "Buscar evidência", "Revisar interações"];

function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function AureaCoraLive() {
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState("");
  const [doneIds, setDoneIds] = useState<string[]>([]);
  const [cmd, setCmd] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // typing engine
  useEffect(() => {
    if (active >= STEPS.length) return;
    const target = STEPS[active].typing;
    if (typed.length < target.length) {
      const t = setTimeout(() => setTyped(target.slice(0, typed.length + 1)), 22);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setDoneIds((d) => [...d, STEPS[active].id]);
      setTyped("");
      setActive((a) => a + 1);
    }, 700);
    return () => clearTimeout(t);
  }, [typed, active]);

  // autoscroll inside the live area
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [doneIds, typed]);

  const visible = useMemo(() => STEPS.slice(0, active + 1), [active]);
  const isFinished = active >= STEPS.length;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-card-elev shadow-card">
      {/* Subtle premium wash — no decorative shapes */}
      <div className="absolute inset-0 bg-aurora pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Header */}
      <header className="relative flex items-center justify-between px-5 pt-4 pb-3 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-success animate-pulse-dot" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-foreground font-semibold">
            ÁUREA CORA · Live
          </span>
          <span className="text-[10px] text-muted-foreground/70">
            {isFinished ? "análise concluída" : "raciocinando em tempo real"}
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
          Clinical Reasoning Stream
        </span>
      </header>

      {/* Live stream area */}
      <div
        ref={scrollRef}
        className="relative px-5 py-4 max-h-[640px] overflow-y-auto scroll-soft space-y-2.5"
      >
        {visible.map((step, idx) => {
          const isDone = doneIds.includes(step.id);
          const isActive = idx === active && !isDone;
          return (
            <StreamCard
              key={step.id}
              step={step}
              index={idx}
              isDone={isDone}
              isActive={isActive}
              typed={typed}
            />
          );
        })}

        {isFinished && (
          <div className="pt-2 mt-1 flex items-center justify-between text-[12px] text-muted-foreground animate-fade-in">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
              Análise concluída · 4 sinais · 3 lacunas · 2 evidências · 8 ações
            </span>
            <span className="text-[10px] uppercase tracking-wider">{nowTime()}</span>
          </div>
        )}
      </div>

      {/* Command bar — part of the living IA */}
      <div className="relative border-t border-border/60 bg-surface-soft/60 px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground mb-2">
          <span className="uppercase tracking-[0.18em] text-foreground/70 font-semibold">
            Comando para ÁUREA CORA
          </span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setCmd(s)}
              className="hover:text-primary transition"
            >
              · {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); setCmd(""); }}
          className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 focus-within:border-primary/50 focus-within:shadow-soft transition"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
          <input
            value={cmd}
            onChange={(e) => setCmd(e.target.value)}
            placeholder="Comando clínico…"
            className="flex-1 bg-transparent outline-none text-[13px] placeholder:text-muted-foreground/60"
          />
          <button
            type="submit"
            className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
            aria-label="Enviar"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */

function StreamCard({
  step, index, isDone, isActive, typed,
}: {
  step: Step; index: number; isDone: boolean; isActive: boolean; typed: string;
}) {
  const Icon = step.icon;
  return (
    <article className="group relative flex gap-3 rounded-xl border border-border bg-card p-3.5 shadow-soft animate-step-in">
      {/* status dot */}
      <div className="shrink-0">
        <div
          className={`grid h-7 w-7 place-items-center rounded-full transition ${
            isDone
              ? "bg-success/12 text-success"
              : "bg-primary/10 text-primary"
          }`}
        >
          {isDone ? (
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
          ) : (
            <CircleDashed className="h-3.5 w-3.5 animate-spin-slow" />
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Icon className="h-3 w-3 text-muted-foreground/70" />
          <span className="text-[10px] uppercase tracking-[0.18em] text-primary font-semibold">
            {step.tag}
          </span>
          <span className="text-[10px] text-muted-foreground/50">·</span>
          <span className="text-[10px] font-mono text-muted-foreground">
            {`0${index + 1}`.slice(-2)}
          </span>
          <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground/70">
            {isDone ? "concluído" : isActive ? "ao vivo" : ""}
          </span>
        </div>

        {/* typing line */}
        <div className="mt-1 text-[13.5px] font-medium text-foreground">
          {isActive ? (
            <>
              {typed}
              <span className="inline-block w-[2px] h-3.5 align-[-2px] bg-primary ml-0.5 animate-blink-caret" />
            </>
          ) : (
            step.typing.replace(/…$/, "")
          )}
        </div>

        {/* payload — only after typing done */}
        {isDone && <StepPayload kind={step.kind} />}
      </div>
    </article>
  );
}

/* ─────────────────────────── payloads per step ────────────────────────── */

function StepPayload({ kind }: { kind: StepKind }) {
  if (kind === "memory") {
    return (
      <p className="mt-1.5 text-[12.5px] text-muted-foreground leading-relaxed border-l-2 border-border pl-2.5">
        ContextPack carregado via PsyMatrix · 1 consulta anterior · 1 escala aplicada · 2 evidências salvas.
      </p>
    );
  }

  if (kind === "document") {
    return (
      <div className="mt-1.5 rounded-md bg-surface-soft border border-border/70 px-3 py-2 text-[12.5px] text-muted-foreground leading-relaxed">
        <span className="text-foreground/80 font-medium">PsyNote · 12 abr 2026 — </span>
        “Insônia inicial + ruminação. Iniciado sertralina 25mg. Retorno 4 semanas.”
      </div>
    );
  }

  if (kind === "signals") {
    return (
      <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {mockContextPack.signals.map((s) => (
          <li key={s.label} className="flex items-center gap-2.5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-foreground truncate">{s.label}</span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {(s.weight * 100).toFixed(0)}%
                </span>
              </div>
              <div className="mt-1 h-1 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${s.weight * 100}%` }} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (kind === "risk") {
    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {mockContextPack.risks.map((r) => (
          <span
            key={r.label}
            className="inline-flex items-center gap-1.5 text-[11.5px] px-2.5 py-1 rounded-full bg-accent/10 border border-accent/25 text-foreground"
          >
            <ShieldAlert className="h-3 w-3 text-accent" />
            {r.label}
            <span className="uppercase tracking-wider text-[10px] text-accent">{r.level}</span>
          </span>
        ))}
        <span className="text-[11.5px] text-muted-foreground self-center">
          Sem alerta crítico ativo neste ciclo.
        </span>
      </div>
    );
  }

  if (kind === "scales") {
    return (
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {mockContextPack.scales.map((s) => (
          <span
            key={s.name}
            className="inline-flex items-center gap-1.5 text-[11.5px] px-2.5 py-1 rounded-full bg-primary/8 border border-primary/20 text-foreground"
          >
            <BarChart3 className="h-3 w-3 text-primary" />
            {s.name} · <span className="font-mono">{s.score}/{s.max}</span>
            <span className="text-muted-foreground">({s.severity})</span>
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5 text-[11.5px] px-2.5 py-1 rounded-full bg-highlight/10 border border-highlight/25 text-foreground">
          <AlertTriangle className="h-3 w-3 text-highlight" />
          PHQ-9 pendente
        </span>
      </div>
    );
  }

  if (kind === "evidence") {
    return (
      <ul className="mt-2 space-y-1.5">
        {mockContextPack.evidence.map((e) => (
          <li key={e.title} className="flex items-start gap-2 text-[12.5px]">
            <span className="mt-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
              {e.strength}
            </span>
            <div className="leading-snug">
              <span className="text-foreground">{e.title}</span>
              <span className="text-muted-foreground"> · {e.source}</span>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (kind === "gaps") {
    return (
      <ul className="mt-2 space-y-1.5">
        {mockContextPack.gaps.map((g) => (
          <li key={g.label} className="flex items-start gap-2 text-[12.5px]">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-highlight shrink-0" />
            <div className="flex-1">
              <span className="text-foreground">{g.label}</span>
              <span className="ml-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                urgência {g.urgency}
              </span>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  if (kind === "compose") {
    return (
      <p className="mt-1.5 text-[12.5px] text-muted-foreground leading-relaxed border-l-2 border-primary/40 pl-2.5">
        8 ações geradas com motivo, módulo de destino e payload de salvamento — disponíveis abaixo em
        <span className="text-foreground font-medium"> Next Actions</span>.
      </p>
    );
  }

  return null;
}
