import { useState } from "react";
import { Send } from "lucide-react";

const SUGGESTIONS = ["Gerar EEM", "Criar laudo", "Acionar grounding científico", "Aplicar PHQ-9"];

export function CommandBar() {
  const [v, setV] = useState("");

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
        <span className="uppercase tracking-wider text-primary-glow/80 mr-1">ÁUREA CORA</span>
        {SUGGESTIONS.map((s, i) => (
          <button
            key={s}
            onClick={() => setV(s)}
            className="hover:text-foreground transition"
          >
            · {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setV("");
        }}
        className="relative group"
      >
        <div className="absolute -inset-px rounded-xl bg-hero opacity-0 group-focus-within:opacity-60 blur-md transition" />
        <div className="relative flex items-center gap-2 rounded-xl border border-border bg-secondary/40 backdrop-blur px-4 py-3 focus-within:border-primary/60">
          <input
            value={v}
            onChange={(e) => setV(e.target.value)}
            placeholder="Comando clínico…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
          />
          <button
            type="submit"
            className="grid h-8 w-8 place-items-center rounded-full bg-primary/15 hover:bg-primary/30 text-primary-glow transition"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
