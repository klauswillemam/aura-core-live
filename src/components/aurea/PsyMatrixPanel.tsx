import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, Maximize2, MoreHorizontal, ExternalLink } from "lucide-react";

type Msg = {
  role: "user" | "assistant";
  content: React.ReactNode;
  time: string;
  evidence?: { label: string }[];
};

const INITIAL: Msg[] = [
  {
    role: "user",
    time: "19:09",
    content: "O que priorizar neste caso de insônia + ansiedade em uso de sertralina?",
  },
];

const ASSISTANT_REPLY = `Com base no quadro clínico e nas evidências mais recentes, sugiro priorizar os seguintes pontos:

1. Avaliar gravidade atual dos sintomas
   Aplicar PHQ-9, GAD-7 e ISI para quantificar depressão, ansiedade e insônia.

2. Otimizar o sono
   Higiene do sono + TCC-I são primeira linha na insônia associada à ansiedade.

3. Revisar tratamento farmacológico
   Verificar dose/tempo de sertralina, adesão e efeitos adversos. Considerar ajuste se resposta parcial após 6–8 semanas.

4. Monitorar e acompanhar
   Reavaliar sintomas em 2–4 semanas e ajustar plano conforme evolução.`;

export function PsyMatrixPanel() {
  const [messages, setMessages] = useState<Msg[]>(INITIAL);
  const [streaming, setStreaming] = useState(true);
  const [streamed, setStreamed] = useState("");
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Stream the initial assistant reply
  useEffect(() => {
    if (!streaming) return;
    if (streamed.length < ASSISTANT_REPLY.length) {
      const t = setTimeout(
        () => setStreamed(ASSISTANT_REPLY.slice(0, streamed.length + 3)),
        14
      );
      return () => clearTimeout(t);
    }
    setStreaming(false);
    setMessages((m) => [
      ...m,
      {
        role: "assistant",
        time: "19:10",
        content: ASSISTANT_REPLY,
        evidence: [{ label: "BAP Guidelines 2024" }, { label: "NICE CG113 (2024)" }],
      },
    ]);
    setStreamed("");
  }, [streamed, streaming]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streamed]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((m) => [...m, { role: "user", content: input, time: "agora" }]);
    setInput("");
    // simulate quick streaming reply
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          time: "agora",
          content:
            "Sugiro reavaliar GAD-7 e PHQ-9 antes de qualquer ajuste de dose. Posso preparar o protocolo no PsyScales se desejar.",
        },
      ]);
    }, 700);
  };

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
          <p className="text-[11px] text-muted-foreground">Seu copiloto clínico</p>
        </div>
        <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition">
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
        <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-soft px-4 py-4 space-y-4">
        {messages.map((m, i) => (
          <Bubble key={i} msg={m} />
        ))}

        {streaming && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-[12px] font-semibold text-foreground">PsyMatrix</span>
              <span className="text-[10px] text-muted-foreground">19:10</span>
            </div>
            <div className="text-[13px] text-foreground leading-relaxed whitespace-pre-line">
              {streamed}
              <span className="inline-block w-[2px] h-3 align-[-2px] bg-primary ml-0.5 animate-blink-caret" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-[11px] text-muted-foreground">
              Digitando
              <span className="flex gap-0.5 ml-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1 w-1 rounded-full bg-muted-foreground animate-typing-dots"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </span>
            </div>
          </div>
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
          PsyMatrix pode cometer erros. Sempre valide informações críticas.
        </p>
      </form>
    </aside>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  if (msg.role === "user") {
    return (
      <div className="flex flex-col items-end animate-step-in">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-3.5 py-2 text-[13px] leading-relaxed shadow-soft">
          {msg.content}
        </div>
        <span className="text-[10px] text-muted-foreground mt-1">Você · {msg.time}</span>
      </div>
    );
  }
  return (
    <div className="animate-step-in">
      <div className="flex items-center gap-2 mb-1.5">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <span className="text-[12px] font-semibold text-foreground">PsyMatrix</span>
        <span className="text-[10px] text-muted-foreground">{msg.time}</span>
      </div>
      <div className="text-[13px] text-foreground leading-relaxed whitespace-pre-line">
        {msg.content}
      </div>
      {msg.evidence && (
        <div className="mt-2.5">
          <div className="text-[11px] font-semibold text-foreground mb-1.5">Evidências-chave</div>
          <div className="flex flex-wrap gap-1.5">
            {msg.evidence.map((e) => (
              <span
                key={e.label}
                className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border border-border bg-surface-soft text-foreground/80"
              >
                {e.label} <ExternalLink className="h-2.5 w-2.5 opacity-60" />
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
