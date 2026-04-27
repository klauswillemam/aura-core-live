import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import {
  Mic, Zap, BarChart3, FileText, FlaskConical, Pill, ShieldAlert,
  BookOpen, Globe, Library, Settings, UserCheck, Stethoscope,
} from "lucide-react";
import { PsyThinkLogo } from "./PsyThinkLogo";

const groups = [
  {
    label: "Paciente",
    items: [{ title: "Workspace", icon: UserCheck, url: "#workspace" }],
  },
  {
    label: "Core Workflow",
    items: [
      { title: "PsyNote", icon: Mic, url: "#psynote" },
      { title: "MSE Builder", icon: Stethoscope, url: "#mse" },
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
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center gap-3">
          <PsyThinkLogo className="h-9 w-9 shrink-0" />
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-display font-bold text-lg tracking-tight text-foreground">
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
              <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 px-3">
                {g.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((it) => (
                  <SidebarMenuItem key={it.title}>
                    <SidebarMenuButton
                      asChild
                      className="hover:bg-sidebar-accent data-[active=true]:bg-sidebar-accent"
                    >
                      <a href={it.url} className="group flex items-center gap-3">
                        <it.icon className="h-4 w-4 text-primary group-hover:text-accent transition-colors" />
                        {!collapsed && (
                          <span className="text-sm text-sidebar-foreground">{it.title}</span>
                        )}
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
