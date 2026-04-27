// Mock clinical data — represents what AUREA CORA would read from PsyMatrix/ContextPack
export type Severity = "low" | "medium" | "high";

export const mockPatient = {
  name: "Vitória M.",
  age: 28,
  id: "PT-2041",
  status: "Consulta ativa",
  consultStartedAt: "há 4 min",
  doctor: "Dr. Klaus",
};

export const mockContextPack = {
  loadedAt: "agora",
  lastConsult: {
    date: "12 abr 2026",
    summary:
      "Queixa de insônia inicial e ruminação. Iniciado sertralina 25mg. Recomendado retorno em 4 semanas.",
  },
  signals: [
    { label: "Ansiedade", weight: 0.82, severity: "high" as Severity },
    { label: "Alteração do sono", weight: 0.71, severity: "high" as Severity },
    { label: "Humor deprimido", weight: 0.64, severity: "medium" as Severity },
    { label: "Ruminação cognitiva", weight: 0.58, severity: "medium" as Severity },
  ],
  scales: [
    { name: "GAD-7", score: 9, max: 21, severity: "medium" as Severity, appliedAt: "12 abr" },
  ],
  evidence: [
    { title: "CBT-I para insônia comórbida", source: "Cochrane 2024", strength: "A" },
    { title: "ISRS — resposta em 4–6 semanas", source: "NICE NG222", strength: "A" },
  ],
  risks: [
    { label: "Risco suicida", level: "baixo", note: "Sem ideação ativa relatada na última consulta." },
  ],
  gaps: [
    { label: "PHQ-9 ainda não aplicado", urgency: "alta" },
    { label: "EEM (Exame do Estado Mental) não gerado nesta consulta", urgency: "alta" },
    { label: "Revisão de interações medicamentosas pendente", urgency: "média" },
  ],
};

export type ReasoningStep = {
  id: string;
  tag: string;
  title: string;
  body: string;
  detail?: string;
  status: "pending" | "streaming" | "done";
};

export const reasoningSteps: ReasoningStep[] = [
  {
    id: "s1",
    tag: "MEMORY",
    title: "Lendo memória clínica do paciente",
    body: "Acessando ContextPack de Vitória M. via PsyMatrix.",
    detail: "ContextPack carregado · 1 consulta anterior · 1 escala aplicada · 2 evidências salvas.",
    status: "pending",
  },
  {
    id: "s2",
    tag: "DOCUMENT",
    title: "Recuperando documento da última consulta",
    body: "PsyNote retornou nota clínica de 12/abr/2026.",
    detail: "“Insônia inicial + ruminação. Iniciado sertralina 25mg. Retorno 4 semanas.”",
    status: "pending",
  },
  {
    id: "s3",
    tag: "CLINICAL SIGNALS",
    title: "Sinais detectados pelo PsyMatrix",
    body: "Ansiedade · Alteração do sono · Humor deprimido · Ruminação.",
    detail: "4 sinais com peso clínico explícito ≥ 0,55.",
    status: "pending",
  },
  {
    id: "s4",
    tag: "SCALES",
    title: "Escalas aplicadas",
    body: "GAD-7 = 9 (ansiedade moderada).",
    detail: "Sem PHQ-9 nos últimos 30 dias — lacuna sinalizada.",
    status: "pending",
  },
  {
    id: "s5",
    tag: "EVIDENCE",
    title: "Consultando grounding científico",
    body: "PsyEvidence retornou 2 referências de força A.",
    detail: "CBT-I (Cochrane 2024) · ISRS resposta 4–6 semanas (NICE NG222).",
    status: "pending",
  },
  {
    id: "s6",
    tag: "RISK RADAR",
    title: "Identificando riscos com peso clínico",
    body: "Risco suicida: baixo (sem ideação ativa).",
    detail: "Nenhum risco crítico ativo neste ciclo do PsyMatrix.",
    status: "pending",
  },
  {
    id: "s7",
    tag: "GAPS",
    title: "Lacunas clínicas identificadas",
    body: "PHQ-9 não aplicado · EEM não gerado · Interações não revisadas.",
    detail: "3 lacunas bloqueando fechamento da consulta.",
    status: "pending",
  },
  {
    id: "s8",
    tag: "NEXT ACTIONS",
    title: "Compondo próximas ações sugeridas",
    body: "8 ações geradas com motivo, módulo de destino e payload de salvamento.",
    detail: "Pronto para execução supervisionada.",
    status: "pending",
  },
];

export type ClinicalAction = {
  id: string;
  title: string;
  reason: string;
  module: string;
  saves: string;
  workspaceLink: string;
  priority: "alta" | "média" | "baixa";
  icon: string; // lucide icon name
};

export const clinicalActions: ClinicalAction[] = [
  {
    id: "a1",
    title: "Aplicar PHQ-9",
    reason: "Lacuna: rastreio de depressão ausente nos últimos 30 dias. GAD-7 = 9 sugere comorbidade.",
    module: "PsyScales",
    saves: "Score PHQ-9 + severidade no ContextPack do paciente",
    workspaceLink: "/workspace/scales/phq9",
    priority: "alta",
    icon: "ClipboardList",
  },
  {
    id: "a2",
    title: "Aplicar GAD-7 (reavaliação)",
    reason: "Última aplicação há 15 dias. Comparativo necessário para resposta a sertralina.",
    module: "PsyScales",
    saves: "Score GAD-7 + delta longitudinal",
    workspaceLink: "/workspace/scales/gad7",
    priority: "média",
    icon: "Activity",
  },
  {
    id: "a3",
    title: "Gerar EEM (Exame do Estado Mental)",
    reason: "Nenhum EEM nesta consulta. Obrigatório para fechamento clínico.",
    module: "MSE Builder",
    saves: "EEM estruturado + assinatura no PsyNote",
    workspaceLink: "/workspace/mse/new",
    priority: "alta",
    icon: "Brain",
  },
  {
    id: "a4",
    title: "Gerar encaminhamento",
    reason: "Indicação de TCC-I (CBT-I) para insônia comórbida — evidência A.",
    module: "PsyNote · Document Engine",
    saves: "Documento PDF + entrada no histórico do paciente",
    workspaceLink: "/workspace/documents/new",
    priority: "média",
    icon: "FileText",
  },
  {
    id: "a5",
    title: "Buscar evidência adicional",
    reason: "Confirmar manejo de insônia em uso de ISRS.",
    module: "PsyEvidence",
    saves: "Referências citáveis vinculadas à nota da consulta",
    workspaceLink: "/workspace/evidence",
    priority: "baixa",
    icon: "BookOpen",
  },
  {
    id: "a6",
    title: "Revisar interações medicamentosas",
    reason: "Sertralina 25mg ativa. Lacuna de checagem nesta consulta.",
    module: "PsyInteractions",
    saves: "Relatório de interações + alertas no prontuário",
    workspaceLink: "/workspace/interactions",
    priority: "média",
    icon: "ShieldAlert",
  },
  {
    id: "a7",
    title: "Abrir PsyMeds — sertralina",
    reason: "Medicação ativa exige checagem de dose, adesão e efeitos adversos.",
    module: "PsyMeds",
    saves: "Atualização do plano farmacológico",
    workspaceLink: "/workspace/meds/sertraline",
    priority: "média",
    icon: "Pill",
  },
  {
    id: "a8",
    title: "Abrir PsyFormulations",
    reason: "Sintomas residuais de sono podem indicar associação adjuvante.",
    module: "PsyFormulations",
    saves: "Sugestão de formulação revisada por evidência",
    workspaceLink: "/workspace/formulations",
    priority: "baixa",
    icon: "FlaskConical",
  },
];
