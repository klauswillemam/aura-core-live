import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import {
  Mic, Sparkles, Zap, BarChart3, FileText, FlaskConical, Pill, ShieldAlert,
  BookOpen, Globe, Library, Settings, LayoutDashboard, Brain,
} from "lucide-react";

const groups = [
  {
    label: "Paciente",
    items: [{ title: "Workspace", icon: LayoutDashboard, url: "#workspace" }],
  },
  {
    label: "Core Workflow",
    items: [
      { title: "PsyNote", icon: Mic, url: "#psynote" },
      { title: "MSE Builder", icon: Brain, url: "#mse" },
      { title: "MSE Flash", icon: Zap, url: "#mseflash" },
    ],
  },
  {
    label: "Clínica",
    items: [
      { title: "PsyScales", icon: BarChart3, url: "#scales" },
      { title: "PsyClinic", icon: FileText, url: "#clinic" },
      { title: "PsyFormulations", icon: FlaskConical, url: "#formulations" },
      { title: "PsyMeds", icon: Pill, url: "#meds" },
      { title: "PsyInteractions", icon: ShieldAlert, url: "#interactions" },
    ],
  },
  {
    label: "Conhecimento",
    items: [
      { title: "PsyEvidence", icon: BookOpen, url: "#evidence" },
      { title: "PsyNetwork", icon: Globe, url: "#network" },
      { title: "PsyBooks", icon: Library, url: "#books" },
    ],
  },
  {
    label: "Admin",
    items: [{ title: "Configurações", icon: Settings, url: "#settings" }],
  },
];

export function PsyThinkSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 shrink-0 rounded-xl bg-hero shadow-glow grid place-items-center">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
            <div className="absolute inset-0 rounded-xl animate-glow-pulse" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-display font-bold text-base tracking-tight text-foreground">
                PsyThink
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Clinical OS
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="scroll-soft">
        {groups.map((g) => (
          <SidebarGroup key={g.label}>
            {!collapsed && (
              <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
                {g.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((it) => (
                  <SidebarMenuItem key={it.title}>
                    <SidebarMenuButton asChild className="hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent">
                      <a href={it.url} className="group flex items-center gap-3">
                        <it.icon className="h-4 w-4 text-primary-glow group-hover:text-primary transition-colors" />
                        {!collapsed && <span className="text-sm">{it.title}</span>}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
