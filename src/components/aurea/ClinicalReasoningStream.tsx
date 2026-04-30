import { useEffect, useState } from "react";
import { reasoningSteps, mockContextPack, type EvidenceRef } from "@/data/aureaMock";
import { Check, Loader2, ExternalLink, AlertCircle, ArrowRight } from "lucide-react";

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
    lacunas: mockContextPack.gaps.length,
  };

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
          Clinical Reasoning Stream
        </div>
        <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
          Raciocínio clínico auditável
        </h2>
        <p className="text-[13px] text-muted-foreground max-w-2xl">
          Cada passo mostra observação, inferência clínica e a evidência que a sustenta — ou declara
          honestamente quando não há fonte vinculada.
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

      <ol className="space-y-2.5">
        {reasoningSteps.map((step, idx) => {
          const isDone = done.has(step.id);
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
                    isDone ? "bg-success/12 text-success" : "bg-primary/10 text-primary"
                  }`}
                >
                  {isDone ? (
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  ) : (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-primary font-semibold">
                    {step.tag}
                  </span>
                  <span className="text-[10px] text-muted-foreground/60">·</span>
                  <span className="text-[10px] text-muted-foreground">fonte: {step.source}</span>
                  <span className="text-[10px] text-muted-foreground/60">·</span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {`0${idx + 1}`.slice(-2)}
                  </span>
                </div>

                <p className="text-[13px] text-foreground leading-relaxed">{step.observation}</p>

                <p className="text-[12.5px] text-muted-foreground leading-relaxed border-l-2 border-border pl-2.5">
                  <span className="text-foreground/80 font-medium">Inferência: </span>
                  {step.inference}
                </p>

                {isDone && <EvidenceChip evidence={step.evidence} />}

                {isDone && step.suggestedAction && (
                  <div className="flex items-start gap-2 mt-1.5 text-[11.5px] text-foreground/90 bg-surface-soft border border-border rounded-md px-2.5 py-1.5">
                    <ArrowRight className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                    <span>
                      <span className="font-medium">Ação → CORA:</span> {step.suggestedAction.title}
                      <span className="text-muted-foreground"> · {step.suggestedAction.module}</span>
                      <span className="block text-muted-foreground/80 mt-0.5">
                        {step.suggestedAction.reason}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function EvidenceChip({ evidence }: { evidence: EvidenceRef }) {
  if (!evidence) {
    return (
      <div className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full border border-dashed border-border bg-transparent text-muted-foreground">
        <AlertCircle className="h-3 w-3" />
        sem evidência vinculada — sugerir busca no PsyEvidence
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full border border-border bg-surface-soft text-foreground/80">
      {evidence.strength && (
        <span className="font-mono text-[10px] px-1 rounded bg-primary/10 text-primary">
          {evidence.strength}
        </span>
      )}
      <span>{evidence.source}</span>
      <span className="text-muted-foreground">· {evidence.origin}</span>
      <ExternalLink className="h-2.5 w-2.5 opacity-60" />
    </div>
  );
}
