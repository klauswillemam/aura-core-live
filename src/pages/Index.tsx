import { SidebarProvider } from "@/components/ui/sidebar";
import { PsyThinkSidebar } from "@/components/aurea/PsyThinkSidebar";
import { TopBar } from "@/components/aurea/TopBar";
import { AureaCoraLive } from "@/components/aurea/AureaCoraLive";
import { ActionDeck } from "@/components/aurea/ActionDeck";
import { PsyMatrixPanel } from "@/components/aurea/PsyMatrixPanel";
import { mockPatient } from "@/data/aureaMock";

const Index = () => {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-background">
        <PsyThinkSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />

          {/* 2-column: ÁUREA CORA workspace (2/3) + PsyMatrix copilot (1/3) */}
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_400px]">
            <main className="px-4 md:px-8 py-6 min-w-0">
              <div className="space-y-6 max-w-[920px] mx-auto">
                {/* Greeting */}
                <section className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-dot" />
                    ÁUREA CORA · Clinical Orchestration Runtime
                  </div>
                  <h1 className="font-display text-3xl md:text-[34px] font-semibold tracking-tight text-foreground">
                    Olá, {mockPatient.doctor}.
                  </h1>
                  <p className="text-[15px] text-muted-foreground">
                    Como posso te ajudar com {mockPatient.name} agora?
                  </p>
                </section>

                {/* The living IA — reasoning + signals + risk + scales + evidence + gaps + command */}
                <AureaCoraLive />

                {/* Executable actions */}
                <ActionDeck />

                <footer className="py-6 text-center text-[10px] text-muted-foreground/60 uppercase tracking-[0.22em]">
                  PsyThink · raciocínio clínico rastreável
                </footer>
              </div>
            </main>

            {/* PsyMatrix — right rail copilot */}
            <div className="hidden xl:block">
              <PsyMatrixPanel />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
