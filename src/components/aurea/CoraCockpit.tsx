import { useEffect, useMemo, useState } from "react";
import {
  Check, X, Pencil, Pause, Loader2, ArrowUpRight, Undo2, Sparkles,
  ClipboardList, Activity, Brain, ShieldAlert, FlaskConical, Pill, BookOpen,
  MessageSquare,
} from "lucide-react";
import { reasoningSteps, clinicalActions, type ClinicalAction } from "@/data/aureaMock";
import { onCoraAction } from "@/lib/coraBus";
import { toast } from "@/hooks/use-toast";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  ClipboardList, Activity, Brain, ShieldAlert, FlaskConical, Pill, BookOpen,
};

type QueueItem = ClinicalAction & { state: "pending" | "approved" | "dismissed" };
type RunningItem = { action: ClinicalAction; progress: number; startedAt: string };
type HistoryItem = { action: ClinicalAction; finishedAt: string; result: string };

function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function CoraCockpit() {
  // Queue starts empty and fills as the PsyMatrix Reasoning Stream emits actions.
  // For this mock, we stagger the queue so the doctor sees CORA "receiving" actions live.
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [running, setRunning] = useState<RunningItem | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      action: clinicalActions.find((a) => a.id === "a2")!,
      finishedAt: "19:04",
      result: "GAD-7 aplicada · score 14 (moderado)",
    },
  ]);

  // Simulate PsyMatrix sending actions over to CORA's queue, one every ~1.4s
  useEffect(() => {
    const ids = ["a1", "a3", "a4", "a5", "a6", "a7", "a8"];
    ids.forEach((id, i) => {
      setTimeout(() => {
        const action = clinicalActions.find((a) => a.id === id);
        if (!action) return;
        setQueue((q) => (q.find((x) => x.id === id) ? q : [...q, { ...action, state: "pending" }]));
      }, 600 + i * 1400);
    });
  }, []);

  // Drive the running progress bar
  useEffect(() => {
    if (!running) return;
    if (running.progress >= 100) {
      const finished = running.action;
      setHistory((h) => [
        {
          action: finished,
          finishedAt: nowTime(),
          result: `${finished.title} — salvo em ${finished.module}`,
        },
        ...h,
      ]);
      setRunning(null);
      return;
    }
    const t = setTimeout(() => {
      setRunning((r) => (r ? { ...r, progress: Math.min(100, r.progress + 6) } : r));
    }, 140);
    return () => clearTimeout(t);
  }, [running]);

  const approve = (item: QueueItem) => {
    setQueue((q) => q.filter((x) => x.id !== item.id));
    if (running) {
      // queue behind current running by appending back as approved-pending? Simplest: just run directly when free.
      toast({ title: "CORA ocupada", description: "Aguarde a ação atual concluir." });
      setQueue((q) => [{ ...item, state: "approved" }, ...q]);
      return;
    }
    setRunning({ action: item, progress: 0, startedAt: nowTime() });
    toast({ title: `Autorizada: ${item.title}`, description: `Executando em ${item.module}.` });
  };

  const dismiss = (item: QueueItem) => {
    setQueue((q) => q.filter((x) => x.id !== item.id));
    toast({ title: "Sugestão descartada", description: item.title });
  };

  const undo = (h: HistoryItem) => {
    setHistory((hs) => hs.filter((x) => x !== h));
    toast({ title: "Ação desfeita", description: h.action.title });
  };

  const queueCount = queue.length;
  const reasoningCount = useMemo(() => reasoningSteps.filter((s) => s.suggestedAction).length, []);

  return (
    <section className="space-y-4">
      {/* Cockpit header */}
      <header className="space-y-1">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />
          ÁUREA CORA · cockpit de execução
        </div>
        <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
          O que está acontecendo, o que aguarda você, o que já foi feito
        </h2>
        <p className="text-[13px] text-muted-foreground max-w-2xl">
          PsyMatrix pensa e propõe. Você decide. CORA executa, registra e mantém tudo desfazível.
        </p>
      </header>

      {/* ZONE 1 — AGORA */}
      <ZoneShell
        accent="primary"
        label="Agora"
        sublabel={running ? "executando neste segundo" : "sem ação em curso"}
        pulse={!!running}
      >
        {running ? (
          <RunningRow item={running} onCancel={() => setRunning(null)} />
        ) : (
          <EmptyAgora reasoningCount={reasoningCount} />
        )}
      </ZoneShell>

      {/* ZONE 2 — FILA */}
      <ZoneShell
        accent="neutral"
        label="Fila de decisão"
        sublabel={
          queueCount === 0
            ? "PsyMatrix ainda está raciocinando…"
            : `${queueCount} sugest${queueCount === 1 ? "ão" : "ões"} aguardando seu OK`
        }
      >
        {queue.length === 0 ? (
          <EmptyQueue />
        ) : (
          <ul className="space-y-2">
            {queue.map((item) => (
              <QueueRow key={item.id} item={item} onApprove={approve} onDismiss={dismiss} />
            ))}
          </ul>
        )}
      </ZoneShell>

      {/* ZONE 3 — HISTÓRICO DA SESSÃO */}
      <ZoneShell
        accent="muted"
        label="Histórico desta consulta"
        sublabel={`${history.length} ${history.length === 1 ? "ação concluída" : "ações concluídas"}`}
      >
        {history.length === 0 ? (
          <p className="text-[12px] text-muted-foreground/70 px-1 py-2">
            Nada executado ainda nesta sessão.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {history.map((h, i) => (
              <HistoryRow key={i} item={h} onUndo={() => undo(h)} />
            ))}
          </ul>
        )}
      </ZoneShell>
    </section>
  );
}

/* ─────────────────────────── Zone shell ─────────────────────────── */

function ZoneShell({
  label, sublabel, accent, pulse, children,
}: {
  label: string;
  sublabel?: string;
  accent: "primary" | "neutral" | "muted";
  pulse?: boolean;
  children: React.ReactNode;
}) {
  const accentMap = {
    primary: "border-primary/40 bg-card-elev shadow-glow",
    neutral: "border-border bg-card-elev shadow-soft",
    muted: "border-border/60 bg-surface-soft/60",
  } as const;
  const dotMap = {
    primary: "bg-primary",
    neutral: "bg-muted-foreground/50",
    muted: "bg-muted-foreground/30",
  } as const;

  return (
    <article className={`relative rounded-2xl border ${accentMap[accent]} overflow-hidden`}>
      <header className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-border/40">
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${dotMap[accent]} ${pulse ? "animate-pulse-dot" : ""}`} />
          <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-foreground">
            {label}
          </span>
        </div>
        {sublabel && (
          <span className="text-[10px] text-muted-foreground tracking-wide">{sublabel}</span>
        )}
      </header>
      <div className="px-4 py-3">{children}</div>
    </article>
  );
}

/* ─────────────────────────── Rows ─────────────────────────── */

function RunningRow({ item, onCancel }: { item: RunningItem; onCancel: () => void }) {
  const Icon = ICONS[item.action.icon] ?? ClipboardList;
  return (
    <div className="animate-step-in">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/20">
          <Loader2 className="h-4.5 w-4.5 animate-spin" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[14px] font-semibold text-foreground">{item.action.title}</h3>
            <span className="text-[10px] uppercase tracking-wider text-primary font-semibold">
              {item.action.module}
            </span>
            <span className="text-[10px] text-muted-foreground/70">· iniciado {item.startedAt}</span>
          </div>
          <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">
            <Icon className="inline h-3 w-3 mr-1 text-primary/70" />
            {item.action.saves}
          </p>

          {/* progress */}
          <div className="mt-3 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${item.progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {item.progress}% — rastreável no Workspace
            </span>
            <div className="flex items-center gap-1.5">
              <button
                className="text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition"
                onClick={() => {/* pause stub */}}
              >
                <Pause className="h-3 w-3" /> pausar
              </button>
              <button
                className="text-[11px] inline-flex items-center gap-1 px-2 py-1 rounded-md text-terracotta hover:bg-terracotta/10 transition"
                onClick={onCancel}
              >
                <X className="h-3 w-3" /> cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyAgora({ reasoningCount }: { reasoningCount: number }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-surface-soft border border-border text-muted-foreground">
        <Sparkles className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[13px] text-foreground">
          CORA está livre. Aprove uma sugestão da fila para começar.
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          PsyMatrix preparou {reasoningCount} ações com base no Overlay e ContextPack.
        </p>
      </div>
    </div>
  );
}

function QueueRow({
  item, onApprove, onDismiss,
}: {
  item: QueueItem;
  onApprove: (i: QueueItem) => void;
  onDismiss: (i: QueueItem) => void;
}) {
  const Icon = ICONS[item.icon] ?? ClipboardList;
  const priorityStyles = {
    alta: "bg-terracotta/12 text-terracotta border-terracotta/25",
    média: "bg-highlight/12 text-highlight border-highlight/25",
    baixa: "bg-accent/12 text-accent border-accent/25",
  } as const;

  return (
    <li className="group flex items-start gap-3 rounded-lg border border-border bg-card p-3 hover:border-primary/30 hover:shadow-soft transition animate-step-in">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-soft border border-border text-primary">
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[13.5px] font-semibold text-foreground leading-snug">
                {item.title}
              </h3>
              <span
                className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${priorityStyles[item.priority]}`}
              >
                {item.priority}
              </span>
            </div>
            <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">
              <span className="text-foreground/80 font-medium">Motivo: </span>
              {item.reason}
            </p>
            <p className="text-[11px] text-muted-foreground/80 mt-1.5">
              → <span className="text-primary font-medium">{item.module}</span>
              <span className="text-muted-foreground/60"> · salva: {item.saves}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-2.5">
          <button
            onClick={() => onApprove(item)}
            className="inline-flex items-center gap-1 text-[11.5px] px-2.5 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition font-medium"
          >
            <Check className="h-3.5 w-3.5" /> Autorizar
          </button>
          <button
            onClick={() => onDismiss(item)}
            className="inline-flex items-center gap-1 text-[11.5px] px-2.5 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition"
          >
            <X className="h-3.5 w-3.5" /> Descartar
          </button>
          <button
            className="inline-flex items-center gap-1 text-[11.5px] px-2.5 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition"
          >
            <Pencil className="h-3.5 w-3.5" /> Editar
          </button>
        </div>
      </div>
    </li>
  );
}

function EmptyQueue() {
  return (
    <div className="flex items-center gap-2 py-1.5 text-[12px] text-muted-foreground">
      <Loader2 className="h-3.5 w-3.5 animate-spin text-primary/70" />
      Aguardando próximas sugestões do PsyMatrix…
    </div>
  );
}

function HistoryRow({ item, onUndo }: { item: HistoryItem; onUndo: () => void }) {
  const Icon = ICONS[item.action.icon] ?? ClipboardList;
  return (
    <li className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-card transition group">
      <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-success/10 text-success">
        <Check className="h-3 w-3" strokeWidth={2.5} />
      </div>
      <Icon className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] text-foreground/85 truncate">{item.result}</p>
      </div>
      <span className="text-[10px] text-muted-foreground tracking-wide">{item.finishedAt}</span>
      <button
        onClick={onUndo}
        className="opacity-0 group-hover:opacity-100 transition text-[10px] uppercase tracking-wider text-muted-foreground hover:text-terracotta inline-flex items-center gap-1"
      >
        <Undo2 className="h-3 w-3" /> desfazer
      </button>
      <a
        href={item.action.workspaceLink}
        className="opacity-0 group-hover:opacity-100 transition text-[10px] text-muted-foreground hover:text-primary inline-flex items-center gap-0.5"
      >
        abrir <ArrowUpRight className="h-3 w-3" />
      </a>
    </li>
  );
}
