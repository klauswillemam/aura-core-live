import { mockContextPack } from "@/data/aureaMock";
import { Activity, ShieldAlert, BookOpen, AlertTriangle } from "lucide-react";

const sevColor: Record<string, string> = {
  high: "text-destructive",
  medium: "text-warning",
  low: "text-info",
};

export function ContextPackPanel() {
  return (
    <aside className="space-y-3 lg:sticky lg:top-20 self-start">
      <div className="rounded-xl border border-border/60 bg-card-elev p-4">
        <div className="text-[10px] uppercase tracking-[0.22em] text-primary-glow font-semibold flex items-center gap-2">
          <Activity className="h-3 w-3" /> Sinais clínicos
        </div>
        <ul className="mt-3 space-y-2.5">
          {mockContextPack.signals.map((s) => (
            <li key={s.label} className="space-y-1">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-foreground">{s.label}</span>
                <span className={`font-mono text-xs ${sevColor[s.severity]}`}>
                  {(s.weight * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-1 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-hero"
                  style={{ width: `${s.weight * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-border/60 bg-card-elev p-4">
        <div className="text-[10px] uppercase tracking-[0.22em] text-warning font-semibold flex items-center gap-2">
          <AlertTriangle className="h-3 w-3" /> Lacunas clínicas
        </div>
        <ul className="mt-3 space-y-2 text-[13px]">
          {mockContextPack.gaps.map((g) => (
            <li key={g.label} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-warning shrink-0" />
              <div className="flex-1">
                <div className="text-foreground">{g.label}</div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider">
                  urgência {g.urgency}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-border/60 bg-card-elev p-4">
        <div className="text-[10px] uppercase tracking-[0.22em] text-destructive font-semibold flex items-center gap-2">
          <ShieldAlert className="h-3 w-3" /> Risk radar
        </div>
        <ul className="mt-3 space-y-2 text-[13px]">
          {mockContextPack.risks.map((r) => (
            <li key={r.label}>
              <div className="flex items-center justify-between">
                <span className="text-foreground">{r.label}</span>
                <span className="text-[11px] uppercase tracking-wider text-info">{r.level}</span>
              </div>
              <div className="text-[12px] text-muted-foreground mt-0.5">{r.note}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-border/60 bg-card-elev p-4">
        <div className="text-[10px] uppercase tracking-[0.22em] text-info font-semibold flex items-center gap-2">
          <BookOpen className="h-3 w-3" /> Evidências salvas
        </div>
        <ul className="mt-3 space-y-2 text-[13px]">
          {mockContextPack.evidence.map((e) => (
            <li key={e.title} className="flex items-start gap-2">
              <span className="mt-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-info/15 text-info border border-info/30">
                {e.strength}
              </span>
              <div>
                <div className="text-foreground leading-snug">{e.title}</div>
                <div className="text-[11px] text-muted-foreground">{e.source}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
