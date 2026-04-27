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
  alta: "bg-destructive/15 text-destructive border-destructive/30",
  média: "bg-warning/15 text-warning border-warning/30",
  baixa: "bg-info/15 text-info border-info/30",
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
    }, 1200);
  };

  return (
    <section className="space-y-5">
      <header className="space-y-1.5">
        <div className="text-[10px] uppercase tracking-[0.25em] text-accent font-semibold">
          Next Actions
        </div>
        <h2 className="font-display text-2xl font-bold tracking-tight">
          Ações executáveis sugeridas pela ÁUREA CORA
        </h2>
        <p className="text-sm text-muted-foreground max-w-3xl">
          Cada ação mostra o motivo clínico, o módulo de destino, o que será salvo e o status após a execução.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {clinicalActions.map((a) => {
          const Icon = ICONS[a.icon] ?? ClipboardList;
          const st = status[a.id] ?? "idle";

          return (
            <article
              key={a.id}
              className="group relative rounded-xl border border-border/60 bg-card-elev p-4 hover:border-primary/40 transition-all duration-300 hover:shadow-glow"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 border border-primary/20 text-primary-glow group-hover:bg-primary/20 transition">
                  <Icon className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground leading-snug">{a.title}</h3>
                    <span className={`shrink-0 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${PRIORITY_STYLES[a.priority]}`}>
                      {a.priority}
                    </span>
                  </div>

                  <p className="text-[13px] text-muted-foreground mt-1.5 leading-relaxed">
                    <span className="text-foreground/80 font-medium">Motivo: </span>
                    {a.reason}
                  </p>

                  <dl className="mt-3 grid grid-cols-1 gap-1 text-[11px]">
                    <div className="flex items-center gap-2">
                      <dt className="text-muted-foreground/70 uppercase tracking-wider">Módulo</dt>
                      <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
                      <dd className="font-mono text-primary-glow">{a.module}</dd>
                    </div>
                    <div className="flex items-start gap-2">
                      <dt className="text-muted-foreground/70 uppercase tracking-wider shrink-0">Salva</dt>
                      <ChevronRight className="h-3 w-3 text-muted-foreground/50 mt-0.5 shrink-0" />
                      <dd className="text-muted-foreground">{a.saves}</dd>
                    </div>
                  </dl>

                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      size="sm"
                      onClick={() => run(a)}
                      disabled={st === "running"}
                      className="bg-hero hover:opacity-90 text-primary-foreground border-0 shadow-glow"
                    >
                      {st === "running" && <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
                      {st === "saved" && <Check className="h-3.5 w-3.5 mr-1.5" />}
                      {st === "idle" && "Executar"}
                      {st === "running" && "Executando"}
                      {st === "saved" && "Concluído"}
                    </Button>

                    <a
                      href={a.workspaceLink}
                      className="text-[11px] inline-flex items-center gap-1 text-muted-foreground hover:text-primary-glow transition"
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
