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
    }, 850);
    return () => clearTimeout(t);
  }, [active, onComplete]);

  const counts = {
    sinais: mockContextPack.signals.length,
    riscos: mockContextPack.risks.length,
    evidencias: mockContextPack.evidence.length,
    lacunas: mockContextPack.gaps.length,
  };

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
          Clinical Reasoning Stream
        </div>
        <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
          Raciocínio clínico em tempo real
        </h2>
        <p className="text-[13px] text-muted-foreground max-w-2xl">
          Cada passo é rastreável: sinais, riscos, evidências, lacunas e ações ficam visíveis sem se esconder atrás de módulos secundários.
        </p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {[
            ["sinais", counts.sinais],
            ["lacunas", counts.lacunas],
            ["evidências", counts.evidencias],
            ["riscos", counts.riscos],
          ].map(([k, v]) => (
            <span
              key={k as string}
              className="text-[11px] px-2.5 py-0.5 rounded-full bg-surface-soft border border-border text-muted-foreground"
            >
              <span className="text-foreground font-semibold mr-1">{v as number}</span>
              {k as string}
            </span>
          ))}
        </div>
      </header>

      <ol className="space-y-2">
        {reasoningSteps.map((step, idx) => {
          const isDone = done.has(step.id);
          const isActive = idx === active;
          const isPending = idx > active;
          if (isPending) return null;

          return (
            <li
              key={step.id}
              className="group relative flex gap-3.5 rounded-lg border border-border bg-card-elev shadow-soft p-3.5 animate-step-in"
            >
              <div className="shrink-0">
                <div
                  className={`relative grid h-7 w-7 place-items-center rounded-full ${
                    isDone
                      ? "bg-success/12 text-success"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {isDone ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  ) : (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-primary font-semibold">
                    {step.tag}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60">·</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{`0${idx + 1}`.slice(-2)}</span>
                </div>
                <div className="text-[14px] font-medium text-foreground mt-0.5">
                  {step.title}
                </div>
                <p className="text-[13px] text-muted-foreground mt-0.5">{step.body}</p>
                {step.detail && isDone && (
                  <p className="text-[12px] text-muted-foreground/80 mt-1.5 leading-relaxed border-l-2 border-border pl-2.5">
                    {step.detail}
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
