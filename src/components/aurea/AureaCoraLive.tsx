import { useEffect, useMemo, useState } from "react";
import {
  Brain, Activity, ShieldAlert, BookOpen, AlertTriangle, Sparkles, Send, Check,
  CircleDashed, ExternalLink, AlertCircle, ArrowRight, Layers, FlaskConical, Pill,
} from "lucide-react";
import {
  reasoningSteps, mockOverlay, mockContextPack, type ReasoningStep, type EvidenceRef,
} from "@/data/aureaMock";

const TAG_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  OVERLAY: Sparkles,
  CONTEXTPACK: Brain,
  SINAIS: Activity,
  LACUNAS: AlertTriangle,
  RISCO: ShieldAlert,
  EVIDÊNCIA: BookOpen,
  INTERAÇÕES: Pill,
  AÇÕES: Layers,
};

const SUGGESTIONS = [
  "Aplicar PHQ-9 + ISI",
  "Solicitar workup laboratorial",
  "Aplicar C-SSRS",
  "Revisar interações",
  "Gerar EEM",
];

function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function AureaCoraLive() {
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"typing" | "reveal">("typing");
  const [revealed, setRevealed] = useState<string[]>([]); // step ids fully revealed (kept in feed)
  const [cmd, setCmd] = useState("");

  const isFinished = active >= reasoningSteps.length;
  const current = reasoningSteps[active];

  // typing engine — type the OBSERVATION line, then reveal full payload
  useEffect(() => {
    if (isFinished) return;
    if (phase !== "typing") return;
    const target = current.observation;
    if (typed.length < target.length) {
      const t = setTimeout(() => setTyped(target.slice(0, typed.length + 2)), 14);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPhase("reveal"), 220);
    return () => clearTimeout(t);
  }, [typed, phase, current, isFinished]);

  // reveal window → push to feed → next step
  useEffect(() => {
    if (isFinished) return;
    if (phase !== "reveal") return;
    const t = setTimeout(() => {
      setRevealed((r) => [...r, current.id]);
      setTyped("");
      setPhase("typing");
      setActive((a) => a + 1);
    }, 1100);
    return () => clearTimeout(t);
  }, [phase, current, isFinished]);

  const finishedSteps = useMemo(
    () => reasoningSteps.filter((s) => revealed.includes(s.id)),
    [revealed]
  );

  const summary = useMemo(() => {
    const evidenceLinked = finishedSteps.filter((s) => s.evidence).length;
    const evidenceMissing = finishedSteps.filter((s) => !s.evidence).length;
    const actions = finishedSteps.filter((s) => s.suggestedAction).length;
    return { evidenceLinked, evidenceMissing, actions };
  }, [finishedSteps]);

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
            PsyMatrix · raciocínio ao vivo
          </span>
          <span className="text-[10px] text-muted-foreground/70">
            {isFinished ? "análise concluída" : "lendo Overlay + ContextPack"}
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
          fonte viva: Overlay · canônica: ContextPack
        </span>
      </header>

      {/* Provenance ribbon — makes the architecture visible */}
      <div className="relative px-5 py-2.5 border-b border-border/40 bg-surface-soft/50">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
            <span className="text-foreground/80">Overlay ativo</span>
            <span className="text-muted-foreground/70">· {mockOverlay.startedAt}</span>
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="inline-flex items-center gap-1.5">
            <Brain className="h-3 w-3" />
            ContextPack canônico (última: {mockContextPack.lastConsult.date})
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="h-3 w-3" /> PsyEvidence pronto
          </span>
        </div>
      </div>

      {/* Reasoning feed — auditable, persistent */}
      <div className="relative px-5 py-5 min-h-[420px] flex flex-col gap-3">
        {/* Already-revealed steps stay in the feed */}
        {finishedSteps.map((step, idx) => (
          <ReasoningEntry key={step.id} step={step} index={idx} state="done" />
        ))}

        {/* Active step — typing observation, then revealing inference + evidence + action */}
        {!isFinished && (
          <ReasoningEntry
            step={current}
            index={finishedSteps.length}
            state={phase}
            typed={typed}
          />
        )}

        {isFinished && <FinishedSummary summary={summary} />}
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
            placeholder="Pedir à CORA para autorizar uma ação…"
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

/* ─────────────────────────── ReasoningEntry ─────────────────────────── */

function ReasoningEntry({
  step, index, state, typed,
}: {
  step: ReasoningStep;
  index: number;
  state: "typing" | "reveal" | "done";
  typed?: string;
}) {
  const Icon = TAG_ICON[step.tag] ?? Sparkles;
  const isTyping = state === "typing";
  const showFull = state === "reveal" || state === "done";

  return (
    <article
      className={`relative flex gap-3.5 rounded-xl border bg-card p-3.5 ${
        state === "done"
          ? "border-border shadow-soft animate-step-in"
          : "border-primary/30 shadow-glow animate-step-in"
      }`}
    >
      <div className="shrink-0 mt-0.5">
        <div
          className={`grid h-8 w-8 place-items-center rounded-full ${
            state === "done"
              ? "bg-success/12 text-success ring-1 ring-success/20"
              : "bg-primary/10 text-primary ring-1 ring-primary/20"
          }`}
        >
          {state === "done" ? (
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
          ) : isTyping ? (
            <CircleDashed className="h-3.5 w-3.5 animate-spin-slow" />
          ) : (
            <Icon className="h-3.5 w-3.5" />
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">
            {step.tag}
          </span>
          <span className="text-[10px] text-muted-foreground/50">·</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            fonte: {step.source}
          </span>
          <span className="text-[10px] text-muted-foreground/50">·</span>
          <span className="text-[10px] font-mono text-muted-foreground/70">
            {`0${index + 1}`.slice(-2)}
          </span>
          {state !== "done" && (
            <span className="ml-auto text-[10px] uppercase tracking-wider text-primary/80">
              {isTyping ? "observando" : "raciocinando"}
            </span>
          )}
        </div>

        <p className="text-[13.5px] text-foreground leading-relaxed">
          {isTyping ? (
            <>
              {typed}
              <span className="inline-block w-[2px] h-3.5 align-[-2px] bg-primary ml-0.5 animate-blink-caret" />
            </>
          ) : (
            step.observation
          )}
        </p>

        {showFull && (
          <>
            <p className="text-[12.5px] text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-2.5">
              <span className="text-foreground/85 font-medium">Inferência clínica · </span>
              {step.inference}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <EvidenceChip evidence={step.evidence} />
            </div>

            {step.suggestedAction && (
              <div className="flex items-start gap-2 mt-1 text-[11.5px] text-foreground/90 bg-surface-soft border border-border rounded-md px-2.5 py-1.5">
                <ArrowRight className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <div>
                    <span className="font-medium">Ação enviada para CORA:</span>{" "}
                    {step.suggestedAction.title}
                    <span className="text-muted-foreground"> · {step.suggestedAction.module}</span>
                  </div>
                  <div className="text-muted-foreground/85 mt-0.5">
                    Motivo: {step.suggestedAction.reason}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mt-1">
                    aguardando autorização do médico
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </article>
  );
}

function EvidenceChip({ evidence }: { evidence: EvidenceRef }) {
  if (!evidence) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full border border-dashed border-border bg-transparent text-muted-foreground">
        <AlertCircle className="h-3 w-3" />
        sem evidência vinculada — sugerir busca no PsyEvidence
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full border border-border bg-surface-soft text-foreground/85">
      {evidence.strength && (
        <span className="font-mono text-[10px] px-1 rounded bg-primary/10 text-primary">
          {evidence.strength}
        </span>
      )}
      <span>{evidence.source}</span>
      <span className="text-muted-foreground">· {evidence.origin}</span>
      <ExternalLink className="h-2.5 w-2.5 opacity-60" />
    </span>
  );
}

function FinishedSummary({
  summary,
}: {
  summary: { evidenceLinked: number; evidenceMissing: number; actions: number };
}) {
  return (
    <div className="rounded-xl border border-border bg-surface-soft/70 p-4 animate-fade-in">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">
        <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
        Raciocínio concluído · pronto para autorização
      </div>
      <div className="text-[15px] font-medium text-foreground leading-snug mb-2">
        {summary.actions} ações sugeridas · {summary.evidenceLinked} com evidência vinculada · {summary.evidenceMissing} sem evidência (declaradas honestamente)
      </div>
      <div className="text-[12px] text-muted-foreground leading-relaxed">
        Nada será executado sem o seu aval. Cada ação carrega motivo, módulo de destino e o que será
        salvo. Quando não há fonte para uma recomendação, o PsyMatrix declara explicitamente — não
        inventa guideline.
      </div>
    </div>
  );
}
