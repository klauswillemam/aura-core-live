import { useState } from "react";
import { clinicalActions, type ClinicalAction } from "@/data/aureaMock";
import { Button } from "@/components/ui/button";
import {
  ClipboardList, Activity, Brain, FileText, BookOpen, ShieldAlert,
  Pill, FlaskConical, ArrowUpRight, Check, Loader2, ChevronRight,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  ClipboardList, Activity, Brain, FileText, BookOpen, ShieldAlert, Pill, FlaskConical,
};

const PRIORITY_STYLES: Record<ClinicalAction["priority"], string> = {
  alta: "bg-terracotta/12 text-terracotta border-terracotta/25",
  média: "bg-highlight/12 text-highlight border-highlight/25",
  baixa: "bg-accent/12 text-accent border-accent/25",
};

type Status = "idle" | "running" | "saved";

export function ActionDeck() {
  const [status, setStatus] = useState<Record<string, Status>>({});

  const run = (a: ClinicalAction) => {
    setStatus((s) => ({ ...s, [a.id]: "running" }));
    setTimeout(() => {
      setStatus((s) => ({ ...s, [a.id]: "saved" }));
      toast({
        title: `${a.title} — executado`,
        description: `Salvo em ${a.module}. Disponível no Workspace.`,
      });
    }, 1100);
  };

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">
          Next Actions
        </div>
        <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
          Ações executáveis sugeridas
        </h2>
        <p className="text-[13px] text-muted-foreground max-w-2xl">
          Cada ação mostra motivo clínico, módulo de destino, o que será salvo e o status após execução.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {clinicalActions.map((a) => {
          const Icon = ICONS[a.icon] ?? ClipboardList;
          const st = status[a.id] ?? "idle";

          return (
            <article
              key={a.id}
              className="group relative rounded-xl border border-border bg-card-elev shadow-soft p-4 hover:shadow-card hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-soft border border-border text-primary group-hover:bg-primary/8 transition">
                  <Icon className="h-4.5 w-4.5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-[14px] text-foreground leading-snug">
                      {a.title}
                    </h3>
                    <span
                      className={`shrink-0 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${PRIORITY_STYLES[a.priority]}`}
                    >
                      {a.priority}
                    </span>
                  </div>

                  <p className="text-[12.5px] text-muted-foreground mt-1.5 leading-relaxed">
                    <span className="text-foreground/80 font-medium">Motivo: </span>
                    {a.reason}
                  </p>

                  <dl className="mt-3 grid grid-cols-1 gap-1 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <dt className="text-muted-foreground/80 uppercase tracking-wider">Módulo</dt>
                      <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
                      <dd className="font-medium text-primary">{a.module}</dd>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <dt className="text-muted-foreground/80 uppercase tracking-wider shrink-0">Salva</dt>
                      <ChevronRight className="h-3 w-3 text-muted-foreground/50 mt-0.5 shrink-0" />
                      <dd className="text-muted-foreground">{a.saves}</dd>
                    </div>
                  </dl>

                  <div className="flex items-center gap-2 mt-3.5">
                    <Button
                      size="sm"
                      onClick={() => run(a)}
                      disabled={st === "running"}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 h-8 px-3 text-xs"
                    >
                      {st === "running" && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
                      {st === "saved" && <Check className="h-3.5 w-3.5 mr-1.5" />}
                      {st === "idle" && "Executar"}
                      {st === "running" && "Executando"}
                      {st === "saved" && "Concluído"}
                    </Button>

                    <a
                      href={a.workspaceLink}
                      className="text-[11px] inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition"
                    >
                      Abrir no Workspace <ArrowUpRight className="h-3 w-3" />
                    </a>

                    {st === "saved" && (
                      <span className="ml-auto text-[10px] uppercase tracking-wider text-success flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
                        rastreável
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
