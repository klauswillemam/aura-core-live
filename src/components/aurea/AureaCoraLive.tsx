import { useEffect, useMemo, useRef, useState } from "react";
import {
  Brain, FileText, Activity, BarChart3, BookOpen,
  ShieldAlert, AlertTriangle, Sparkles, Send, Check, CircleDashed,
} from "lucide-react";
import { mockContextPack } from "@/data/aureaMock";

type StepKind =
  | "context" | "memory" | "document" | "signals" | "risk"
  | "scales" | "evidence" | "compose";

type Step = {
  id: string;
  kind: StepKind;
  tag: string;
  typing: string;
  icon: React.ComponentType<{ className?: string }>;
};

const STEPS: Step[] = [
  { id: "s0", kind: "context",  tag: "CONTEXTO",      icon: Sparkles,      typing: "Analisando contexto clínico…" },
  { id: "s1", kind: "memory",   tag: "MEMÓRIA",       icon: Brain,         typing: "Lendo memória do paciente…" },
  { id: "s2", kind: "document", tag: "DOCUMENTO",     icon: FileText,      typing: "Recuperando documento da última consulta…" },
  { id: "s3", kind: "signals",  tag: "SINAIS",        icon: Activity,      typing: "Sinais detectados pelo PsyMatrix…" },
  { id: "s4", kind: "risk",     tag: "RADAR DE RISCO",icon: ShieldAlert,   typing: "Identificando radar de risco…" },
  { id: "s5", kind: "scales",   tag: "ESCALAS",       icon: BarChart3,     typing: "Verificando escalas aplicadas…" },
  { id: "s6", kind: "evidence", tag: "EVIDÊNCIAS",    icon: BookOpen,      typing: "Consultando evidências científicas…" },
  { id: "s7", kind: "compose",  tag: "PRÓXIMAS AÇÕES",icon: AlertTriangle, typing: "Compondo próximas ações sugeridas…" },
];

const SUGGESTIONS = ["Gerar EEM", "Aplicar PHQ-9", "Criar encaminhamento", "Buscar evidência", "Revisar interações"];
const SUMMARY = "Análise concluída · 4 sinais · 3 lacunas · 2 evidências · 8 ações sugeridas";

function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function AureaCoraLive() {
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"typing" | "payload" | "fading">("typing");
  const [doneTags, setDoneTags] = useState<string[]>([]); // last 2-3 ghosted lines
  const [cmd, setCmd] = useState("");

  const isFinished = active >= STEPS.length;
  const current = STEPS[active];

  // typing engine
  useEffect(() => {
    if (isFinished) return;
    if (phase !== "typing") return;
    const target = current.typing;
    if (typed.length < target.length) {
      const t = setTimeout(() => setTyped(target.slice(0, typed.length + 1)), 24);
      return () => clearTimeout(t);
    }
    // finished typing → reveal payload
    const t = setTimeout(() => setPhase("payload"), 280);
    return () => clearTimeout(t);
  }, [typed, phase, current, isFinished]);

  // payload visible window → fade → next
  useEffect(() => {
    if (isFinished) return;
    if (phase !== "payload") return;
    const t = setTimeout(() => setPhase("fading"), 1500);
    return () => clearTimeout(t);
  }, [phase, isFinished]);

  useEffect(() => {
    if (isFinished) return;
    if (phase !== "fading") return;
    const t = setTimeout(() => {
      setDoneTags((d) => [...d.slice(-2), STEPS[active].tag]);
      setTyped("");
      setPhase("typing");
      setActive((a) => a + 1);
    }, 600);
    return () => clearTimeout(t);
  }, [phase, active, isFinished]);

  const ghostTrail = useMemo(() => doneTags.slice(-3), [doneTags]);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-card-elev shadow-card">
      <div className="absolute inset-0 bg-aurora pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Header */}
      <header className="relative flex items-center justify-between px-5 pt-4 pb-3 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-success animate-pulse-dot" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="text-[10px] uppercase tracking-[0.24em] text-foreground font-semibold">
            ÁUREA CORA · Live
          </span>
          <span className="text-[10px] text-muted-foreground/70">
            {isFinished ? "análise concluída" : "runtime ativo"}
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
          Clinical Reasoning Stream
        </span>
      </header>

      {/* Runtime surface — fluid, ephemeral */}
      <div className="relative px-6 py-7 min-h-[340px] flex flex-col">
        {!isFinished ? (
          <>
            {/* ghost trail of last completed steps */}
            <div className="space-y-1 mb-5 min-h-[54px]">
              {ghostTrail.map((tag, i) => {
                const opacity = 0.18 + i * 0.12;
                return (
                  <div
                    key={`${tag}-${i}`}
                    className="flex items-center gap-2 text-[11px] text-muted-foreground transition-all"
                    style={{ opacity }}
                  >
                    <Check className="h-3 w-3 text-success/60" strokeWidth={2.5} />
                    <span className="uppercase tracking-[0.18em] text-[10px]">{tag}</span>
                    <span className="flex-1 h-px bg-gradient-to-r from-border/60 to-transparent" />
                  </div>
                );
              })}
            </div>

            {/* Active runtime line */}
            <ActiveLine
              step={current}
              typed={typed}
              phase={phase}
            />

            {/* Subtle live sweep at the bottom */}
            <div className="relative mt-auto h-px overflow-hidden stream-sweep bg-border/40" />
          </>
        ) : (
          <FinishedSummary />
        )}
      </div>

      {/* Command bar */}
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

      {isFinished && (
        <div className="absolute top-3 right-5 text-[10px] uppercase tracking-wider text-muted-foreground/60">
          {nowTime()}
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────── */

function ActiveLine({
  step, typed, phase,
}: {
  step: Step; typed: string; phase: "typing" | "payload" | "fading";
}) {
  const Icon = step.icon;
  return (
    <div
      key={step.id}
      className={`relative flex gap-4 items-start ${phase === "fading" ? "animate-payload-fade" : "animate-step-in"}`}
    >
      <div className="shrink-0 mt-0.5">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/8 text-primary ring-1 ring-primary/15">
          {phase === "payload" || phase === "fading" ? (
            <Icon className="h-4 w-4" />
          ) : (
            <CircleDashed className="h-4 w-4 animate-spin-slow" />
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.22em] text-primary font-semibold">
            {step.tag}
          </span>
          <span className="text-[10px] text-muted-foreground/50">·</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
            {phase === "typing" ? "processando" : "concluído"}
          </span>
        </div>

        <div className="mt-1 text-[15px] font-medium text-foreground leading-snug">
          {phase === "typing" ? (
            <>
              {typed}
              <span className="inline-block w-[2px] h-3.5 align-[-2px] bg-primary ml-0.5 animate-blink-caret" />
            </>
          ) : (
            step.typing.replace(/…$/, "")
          )}
        </div>

        {/* Ephemeral payload glimpse */}
        {(phase === "payload" || phase === "fading") && (
          <div className={`mt-3 ${phase === "fading" ? "" : "animate-payload-rise"}`}>
            <StepPayload kind={step.kind} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── ephemeral payloads ──────────────────────── */

function StepPayload({ kind }: { kind: StepKind }) {
  if (kind === "context") {
    return (
      <p className="text-[12.5px] text-muted-foreground leading-relaxed">
        Paciente ativo · consulta em andamento · ContextPack pronto para leitura.
      </p>
    );
  }

  if (kind === "memory") {
    return (
      <p className="text-[12.5px] text-muted-foreground leading-relaxed">
        ContextPack carregado · 1 consulta anterior · 1 escala aplicada · 2 evidências salvas.
      </p>
    );
  }

  if (kind === "document") {
    return (
      <p className="text-[12.5px] text-muted-foreground leading-relaxed italic border-l-2 border-border pl-3">
        “Insônia inicial + ruminação. Iniciado sertralina 25mg. Retorno 4 semanas.” — PsyNote · 12 abr
      </p>
    );
  }

  if (kind === "signals") {
    return (
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {mockContextPack.signals.map((s) => (
          <span key={s.label} className="inline-flex items-center gap-1.5 text-[12px] text-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
            {s.label}
            <span className="font-mono text-[10.5px] text-muted-foreground">
              {(s.weight * 100).toFixed(0)}%
            </span>
          </span>
        ))}
      </div>
    );
  }

  if (kind === "risk") {
    return (
      <div className="flex flex-wrap gap-2">
        {mockContextPack.risks.map((r) => (
          <span
            key={r.label}
            className="inline-flex items-center gap-1.5 text-[11.5px] text-foreground"
          >
            <ShieldAlert className="h-3 w-3 text-accent" />
            {r.label}
            <span className="uppercase tracking-wider text-[10px] text-accent">{r.level}</span>
          </span>
        ))}
        <span className="text-[11.5px] text-muted-foreground">
          · sem alerta crítico ativo
        </span>
      </div>
    );
  }

  if (kind === "scales") {
    return (
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px]">
        {mockContextPack.scales.map((s) => (
          <span key={s.name} className="inline-flex items-center gap-1.5 text-foreground">
            <BarChart3 className="h-3 w-3 text-primary/70" />
            {s.name} <span className="font-mono">{s.score}/{s.max}</span>
            <span className="text-muted-foreground">({s.severity})</span>
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5 text-highlight">
          <AlertTriangle className="h-3 w-3" /> PHQ-9 pendente
        </span>
      </div>
    );
  }

  if (kind === "evidence") {
    return (
      <ul className="space-y-1">
        {mockContextPack.evidence.map((e) => (
          <li key={e.title} className="flex items-start gap-2 text-[12.5px]">
            <span className="mt-0.5 text-[10px] font-mono px-1.5 rounded bg-primary/10 text-primary">
              {e.strength}
            </span>
            <span className="text-foreground">{e.title}</span>
            <span className="text-muted-foreground">· {e.source}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (kind === "compose") {
    return (
      <p className="text-[12.5px] text-muted-foreground leading-relaxed">
        8 ações geradas com motivo, módulo de destino e payload de salvamento — abaixo em
        <span className="text-foreground font-medium"> Next Actions</span>.
      </p>
    );
  }

  return null;
}

function FinishedSummary() {
  return (
    <div className="flex-1 flex flex-col items-start justify-center gap-3 animate-fade-in">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
        Runtime em standby · pronto para próximo comando
      </div>
      <div className="text-[18px] font-medium text-foreground leading-snug">
        {SUMMARY}
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-muted-foreground">
        <span>· Ansiedade · Sono · Humor · Ruminação</span>
        <span>· PHQ-9, EEM, Interações pendentes</span>
        <span>· CBT-I (A) · ISRS (A)</span>
      </div>
    </div>
  );
}
