import { mockPatient } from "@/data/aureaMock";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Moon, LogOut, Languages, Bell, Search } from "lucide-react";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 glass border-b border-border">
      <div className="flex items-center gap-3 px-4 h-14">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Paciente:</span>
          <span className="font-medium text-foreground">{mockPatient.name}</span>
          <span className="hidden md:inline text-muted-foreground">
            · {mockPatient.age} anos · {mockPatient.id}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full bg-success/10 border border-success/25">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-success animate-pulse-dot" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="text-[11px] uppercase tracking-wider text-success font-medium">
            {mockPatient.status}
          </span>
        </div>

        <div className="flex-1" />

        <Button
          variant="outline"
          size="sm"
          className="hidden md:inline-flex border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          Encerrar consulta
        </Button>

        <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition">
          <Search className="h-4 w-4" />
        </button>
        <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition">
          <Bell className="h-4 w-4" />
        </button>
        <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition">
          <Moon className="h-4 w-4" />
        </button>
        <button className="hidden sm:flex items-center gap-1 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition text-xs">
          <Languages className="h-4 w-4" /> PT
        </button>
        <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
