import { SidebarProvider } from "@/components/ui/sidebar";
import { PsyThinkSidebar } from "@/components/aurea/PsyThinkSidebar";
import { TopBar } from "@/components/aurea/TopBar";
import { AureaLiveTerminal } from "@/components/aurea/AureaLiveTerminal";
import { ClinicalReasoningStream } from "@/components/aurea/ClinicalReasoningStream";
import { ActionDeck } from "@/components/aurea/ActionDeck";
import { ContextPackPanel } from "@/components/aurea/ContextPackPanel";
import { PsyMatrixPanel } from "@/components/aurea/PsyMatrixPanel";
import { mockPatient } from "@/data/aureaMock";

const Index = () => {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-background">
        <PsyThinkSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />

          {/* 3-column layout: center (2/3) + PsyMatrix (1/3) */}
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px]">
            <main className="px-4 md:px-8 py-6 min-w-0">
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-6 max-w-[1100px]">
                <div className="space-y-6 min-w-0">
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

                  {/* Live terminal — clinical thinking stream */}
                  <AureaLiveTerminal />

                  {/* Reasoning steps */}
                  <ClinicalReasoningStream />

                  {/* Actions */}
                  <ActionDeck />

                  <footer className="py-6 text-center text-[10px] text-muted-foreground/60 uppercase tracking-[0.22em]">
                    PsyThink · raciocínio clínico rastreável
                  </footer>
                </div>

                {/* Context pack rail */}
                <div className="hidden lg:block">
                  <div className="sticky top-20">
                    <ContextPackPanel />
                  </div>
                </div>
              </div>
            </main>

            {/* PsyMatrix — right rail */}
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
