import { useEffect, useState } from "react";
import { reasoningSteps, mockContextPack } from "@/data/aureaMock";
import { Check, Loader2 } from "lucide-react";

export function ClinicalReasoningStream({ onComplete }: { onComplete?: () => void }) {
  const [active, setActive] = useState(0);
  const [done, setDone] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (active >= reasoningSteps.length) {
      onComplete?.();
      return;
    }
    const t = setTimeout(() => {
      setDone((d) => new Set(d).add(reasoningSteps[active].id));
      setActive((a) => a + 1);
    }, 950);
    return () => clearTimeout(t);
  }, [active, onComplete]);

  const counts = {
    sinais: mockContextPack.signals.length,
    riscos: mockContextPack.risks.length,
    evidencias: mockContextPack.evidence.length,
    interacoes: 0,
  };

  return (
    <section className="space-y-5">
      <header className="space-y-1.5">
        <div className="text-[10px] uppercase tracking-[0.25em] text-primary-glow font-semibold">
          Clinical Reasoning Stream
        </div>
        <h2 className="font-display text-2xl font-bold tracking-tight">
          Fluxo progressivo do raciocínio clínico do PsyMatrix
        </h2>
        <p className="text-sm text-muted-foreground max-w-3xl">
          ÁUREA CORA mostra o raciocínio por etapas, sem esconder risco, evidência, interações ou a próxima ação atrás de módulos secundários.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            ["sinais", counts.sinais],
            ["riscos", counts.riscos],
            ["evidências", counts.evidencias],
            ["interações", counts.interacoes],
          ].map(([k, v]) => (
            <span
              key={k as string}
              className="text-[11px] px-2.5 py-1 rounded-full bg-secondary/60 border border-border text-muted-foreground"
            >
              <span className="text-foreground font-semibold mr-1">{v as number}</span>
              {k as string}
            </span>
          ))}
        </div>
      </header>

      <ol className="space-y-3">
        {reasoningSteps.map((step, idx) => {
          const isDone = done.has(step.id);
          const isActive = idx === active;
          const isPending = idx > active;
          if (isPending) return null;

          return (
            <li
              key={step.id}
              className="group relative flex gap-4 rounded-xl border border-border/60 bg-card-elev p-4 animate-step-in overflow-hidden"
            >
              {isActive && (
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-glow to-transparent animate-shimmer" />
              )}

              <div className="shrink-0">
                <div
                  className={`relative grid h-9 w-9 place-items-center rounded-full border ${
                    isDone
                      ? "border-success/50 bg-success/10 text-success"
                      : "border-primary/40 bg-primary/10 text-primary-glow"
                  }`}
                >
                  {isDone ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  <span className="absolute -bottom-1 -right-1 text-[9px] font-mono text-muted-foreground bg-background border border-border rounded px-1">
                    {idx + 1}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-[0.22em] text-primary-glow/90 font-semibold">
                  {step.tag}
                </div>
                <div className="text-base font-semibold text-foreground mt-0.5">
                  {step.title}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{step.body}</p>
                {step.detail && (
                  <p className="text-[12px] text-muted-foreground/80 mt-2 font-mono leading-relaxed">
                    › {step.detail}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
