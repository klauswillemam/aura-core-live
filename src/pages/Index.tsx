import { SidebarProvider } from "@/components/ui/sidebar";
import { PsyThinkSidebar } from "@/components/aurea/PsyThinkSidebar";
import { TopBar } from "@/components/aurea/TopBar";
import { AureaOrb } from "@/components/aurea/AureaOrb";
import { ClinicalReasoningStream } from "@/components/aurea/ClinicalReasoningStream";
import { ActionDeck } from "@/components/aurea/ActionDeck";
import { ContextPackPanel } from "@/components/aurea/ContextPackPanel";
import { CommandBar } from "@/components/aurea/CommandBar";
import { mockPatient } from "@/data/aureaMock";

const Index = () => {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-background">
        <PsyThinkSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <TopBar />

          <main className="flex-1 px-4 md:px-8 py-6 max-w-[1400px] w-full mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
              {/* Main column */}
              <div className="space-y-6 min-w-0">
                {/* Hero greeting */}
                <section className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-glow animate-pulse-dot" />
                    ÁUREA CORA · Clinical Orchestration Runtime Architecture
                  </div>
                  <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-glow">
                    Olá, {mockPatient.doctor}.
                  </h1>
                  <p className="text-muted-foreground">
                    Como posso te ajudar com {mockPatient.name} agora?
                  </p>
                </section>

                {/* Live orb */}
                <AureaOrb />

                {/* Command bar */}
                <CommandBar />

                {/* Reasoning stream */}
                <ClinicalReasoningStream />

                {/* Actions */}
                <ActionDeck />

                <footer className="py-8 text-center text-[11px] text-muted-foreground/60 uppercase tracking-[0.22em]">
                  PsyThink · raciocínio rastreável · 5 minutos por avaliação, não 30
                </footer>
              </div>

              {/* Right rail */}
              <ContextPackPanel />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
