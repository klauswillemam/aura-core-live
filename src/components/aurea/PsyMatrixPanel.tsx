import { useEffect, useMemo, useRef, useState } from "react";
import { Send, Sparkles, Maximize2, MoreHorizontal, ExternalLink, Brain, BookOpen, AlertCircle, ArrowRight, Check, CircleDashed, MessageSquare } from "lucide-react";
import { reasoningSteps, mockOverlay, mockContextPack, detectChatAction, type ReasoningStep, type EvidenceRef } from "@/data/aureaMock";
import { emitCoraAction } from "@/lib/coraBus";

type Msg = {
  role: "user" | "assistant";
  content: React.ReactNode;
  time: string;
  evidence?: { label: string }[];
  sentToCora?: { title: string; module: string };
};

export function PsyMatrixPanel() {
  return (
    <aside className="flex flex-col h-[calc(100vh-3.5rem)] sticky top-14 border-l border-border bg-card-elev">
      {/* Header */}
      <header className="px-4 py-3 border-b border-border flex items-center gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-semibold text-[15px] text-foreground tracking-tight">
              PSYMATRIX
            </h3>
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-success/12 text-success border border-success/25">
              ao vivo
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">Cérebro clínico · raciocina, fundamenta, propõe</p>
        </div>
        <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition">
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
        <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </header>

      {/* Provenance ribbon */}
      <div className="px-4 py-2 border-b border-border/60 bg-surface-soft/60">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
            Overlay {mockOverlay.startedAt}
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="inline-flex items-center gap-1">
            <Brain className="h-2.5 w-2.5" /> ContextPack {mockContextPack.lastConsult.date}
          </span>
          <span className="text-muted-foreground/40">·</span>
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-2.5 w-2.5" /> PsyEvidence
          </span>
        </div>
      </div>

      {/* Scroll body: Reasoning Stream + Chat */}
      <PanelBody />
    </aside>
  );
}

function PanelBody() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState<string[]>([]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");

  // Drive the reasoning stream
  useEffect(() => {
    if (active >= reasoningSteps.length) return;
    const t = setTimeout(() => {
      setRevealed((r) => [...r, reasoningSteps[active].id]);
      setActive((a) => a + 1);
    }, 1100);
    return () => clearTimeout(t);
  }, [active]);

  // Auto-scroll to bottom as new content arrives
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [revealed, messages]);

  const finished = useMemo(
    () => reasoningSteps.filter((s) => revealed.includes(s.id)),
    [revealed]
  );
  const currentStep = active < reasoningSteps.length ? reasoningSteps[active] : null;
  const streamDone = active >= reasoningSteps.length;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const q = input;
    setMessages((m) => [...m, { role: "user", content: q, time: "agora" }]);
    setInput("");

    setTimeout(() => {
      const draft = detectChatAction(q);

      if (draft) {
        const action = {
          id: `chat-${Date.now()}`,
          title: draft.title,
          reason: draft.reason,
          module: draft.module,
          saves: draft.saves,
          workspaceLink: draft.workspaceLink,
          priority: draft.priority,
          icon: draft.icon,
          fromChat: true as const,
          chatQuery: q,
        };
        emitCoraAction(action);

        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            time: "agora",
            content: draft.replySummary,
            evidence: draft.replyEvidence,
            sentToCora: { title: draft.title, module: draft.module },
          },
        ]);
      } else {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            time: "agora",
            content:
              "Posso aprofundar — me diga se você quer evidência (abro PsyEvidence), uma escala (PsyScales), checagem de interação (PsyInteractions) ou exames (PsyClinic) e eu mando direto pra fila da CORA.",
          },
        ]);
      }
    }, 600);
  };

  return (
    <>
      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-soft px-4 py-4 space-y-4">
        {/* === REASONING STREAM === */}
        <section>
          <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/70 font-semibold mb-2">
            Raciocínio clínico ao vivo
          </div>
          <ol className="space-y-2">
            {finished.map((step, idx) => (
              <ReasoningCard key={step.id} step={step} idx={idx} done />
            ))}
            {currentStep && (
              <ReasoningCard step={currentStep} idx={finished.length} done={false} />
            )}
          </ol>

          {streamDone && (
            <div className="mt-3 rounded-lg border border-border bg-surface-soft/60 p-3">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
                raciocínio concluído
              </div>
              <p className="text-[12px] text-foreground/85 leading-relaxed">
                Ações enviadas para a fila da CORA. Pergunte algo abaixo se quiser que eu aprofunde
                qualquer ponto.
              </p>
            </div>
          )}
        </section>

        {/* === CHAT === */}
        {messages.length > 0 && (
          <section className="pt-2 border-t border-border/60">
            <div className="text-[10px] uppercase tracking-[0.2em] text-foreground/70 font-semibold mb-2 mt-2">
              Conversa
            </div>
            <div className="space-y-3">
              {messages.map((m, i) => <Bubble key={i} msg={m} />)}
            </div>
          </section>
        )}
      </div>

      {/* Input */}
      <form onSubmit={submit} className="p-3 border-t border-border bg-surface-soft">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 focus-within:border-primary/50 focus-within:shadow-soft transition">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte ao PsyMatrix…"
            className="flex-1 bg-transparent outline-none text-[13px] placeholder:text-muted-foreground/70"
          />
          <button
            type="submit"
            className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground/70 mt-2 text-center">
          PsyMatrix raciocina e fundamenta. Médico decide. CORA executa.
        </p>
      </form>
    </>
  );
}

/* ─────────────────────────── Pieces ─────────────────────────── */

function ReasoningCard({ step, idx, done }: { step: ReasoningStep; idx: number; done: boolean }) {
  return (
    <li
      className={`relative flex gap-2.5 rounded-lg border bg-card p-2.5 animate-step-in ${
        done ? "border-border" : "border-primary/30 shadow-glow"
      }`}
    >
      <div className="shrink-0 mt-0.5">
        <div
          className={`grid h-6 w-6 place-items-center rounded-full ${
            done ? "bg-success/12 text-success" : "bg-primary/10 text-primary"
          }`}
        >
          {done ? (
            <Check className="h-3 w-3" strokeWidth={2.5} />
          ) : (
            <CircleDashed className="h-3 w-3 animate-spin-slow" />
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[9.5px] uppercase tracking-[0.18em] text-primary font-semibold">
            {step.tag}
          </span>
          <span className="text-[9.5px] text-muted-foreground/50">·</span>
          <span className="text-[9.5px] text-muted-foreground">{step.source}</span>
          <span className="text-[9.5px] text-muted-foreground/50 ml-auto font-mono">
            {`0${idx + 1}`.slice(-2)}
          </span>
        </div>
        <p className="text-[12px] text-foreground leading-relaxed">{step.observation}</p>
        <p className="text-[11.5px] text-muted-foreground leading-relaxed border-l-2 border-border pl-2">
          <span className="text-foreground/80 font-medium">Inferência: </span>
          {step.inference}
        </p>
        <EvidenceChip evidence={step.evidence} />
        {step.suggestedAction && (
          <div className="flex items-start gap-1.5 mt-1 text-[11px] text-foreground/85 bg-surface-soft border border-border rounded-md px-2 py-1">
            <ArrowRight className="h-3 w-3 text-primary mt-0.5 shrink-0" />
            <span>
              <span className="font-medium">→ CORA:</span> {step.suggestedAction.title}
              <span className="text-muted-foreground"> · {step.suggestedAction.module}</span>
            </span>
          </div>
        )}
      </div>
    </li>
  );
}

function EvidenceChip({ evidence }: { evidence: EvidenceRef }) {
  if (!evidence) {
    return (
      <span className="inline-flex items-center gap-1 text-[10.5px] px-1.5 py-0.5 rounded-full border border-dashed border-border text-muted-foreground">
        <AlertCircle className="h-2.5 w-2.5" />
        sem evidência vinculada
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10.5px] px-1.5 py-0.5 rounded-full border border-border bg-surface-soft text-foreground/85">
      {evidence.strength && (
        <span className="font-mono text-[9.5px] px-1 rounded bg-primary/10 text-primary">
          {evidence.strength}
        </span>
      )}
      <span>{evidence.source}</span>
      <span className="text-muted-foreground">· {evidence.origin}</span>
      <ExternalLink className="h-2.5 w-2.5 opacity-60" />
    </span>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  if (msg.role === "user") {
    return (
      <div className="flex flex-col items-end animate-step-in">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-3 py-1.5 text-[12.5px] leading-relaxed shadow-soft">
          {msg.content}
        </div>
        <span className="text-[10px] text-muted-foreground mt-1">Você · {msg.time}</span>
      </div>
    );
  }
  return (
    <div className="animate-step-in">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="h-3 w-3 text-primary" />
        <span className="text-[11.5px] font-semibold text-foreground">PsyMatrix</span>
        <span className="text-[10px] text-muted-foreground">{msg.time}</span>
      </div>
      <div className="text-[12.5px] text-foreground leading-relaxed whitespace-pre-line">
        {msg.content}
      </div>
      {msg.evidence && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {msg.evidence.map((e) => (
            <span
              key={e.label}
              className="inline-flex items-center gap-1 text-[10.5px] px-1.5 py-0.5 rounded-full border border-border bg-surface-soft text-foreground/80"
            >
              {e.label} <ExternalLink className="h-2.5 w-2.5 opacity-60" />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
