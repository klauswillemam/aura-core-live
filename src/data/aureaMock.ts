// Mock clinical data — Layer 3 (CORA Runtime)
// Architecture note:
//  - `overlay` is the LIVE source of truth during the active consultation
//  - `contextPack` is the CANONICAL longitudinal memory from prior consultations
//  - PsyMatrix reads overlay first, cross-references contextPack, queries PsyEvidence,
//    and emits AUDITABLE reasoning (not raw chain-of-thought) before sending actions to CORA.

export type Severity = "low" | "medium" | "high";

export const mockPatient = {
  name: "Ricardo A.",
  age: 45,
  id: "PT-3187",
  status: "Consulta ativa",
  consultStartedAt: "há 6 min",
  doctor: "Dr. Klaus",
};

/* ─────────────────────────── OVERLAY (live) ─────────────────────────── */
// What the doctor is hearing/typing RIGHT NOW. PsyMatrix reads this first.
export const mockOverlay = {
  startedAt: "agora",
  liveTranscriptSummary:
    "Paciente refere piora de humor há 6 semanas, anedonia, insônia terminal (acorda 04h), fadiga matinal, queixa cognitiva (esquecimento, lentificação). Nega ideação ativa. Refere palpitações esporádicas e sensação de aperto torácico sem dor. Em uso crônico de fluoxetina 40mg, bupropiona XL 300mg, clonazepam 1mg à noite há > 2 anos.",
  liveSignals: [
    "humor deprimido (verbal + prosódia plana)",
    "anedonia",
    "insônia terminal",
    "fadiga matinal",
    "queixa cognitiva subjetiva recente",
    "somatização autonômica (palpitação, aperto torácico)",
  ],
  liveMeds: ["fluoxetina 40mg", "bupropiona XL 300mg", "clonazepam 1mg/noite (uso > 2 anos)"],
  liveLabsKnown: "nenhum exame laboratorial documentado nos últimos 12 meses",
};

/* ───────────────────── CONTEXTPACK (canonical past) ──────────────────── */
export const mockContextPack = {
  loadedAt: "agora",
  lastConsult: {
    date: "08 fev 2026",
    summary:
      "Episódio depressivo recorrente, em manutenção. Resposta parcial a fluoxetina 40mg + bupropiona XL 300mg. Clonazepam mantido para insônia. Sem reavaliação de exames laboratoriais desde 2024. PHQ-9 prévio = 14 (moderado).",
  },
  signals: [
    { label: "Humor deprimido", weight: 0.84, severity: "high" as Severity },
    { label: "Insônia terminal", weight: 0.78, severity: "high" as Severity },
    { label: "Fadiga", weight: 0.72, severity: "high" as Severity },
    { label: "Queixa cognitiva", weight: 0.66, severity: "medium" as Severity },
    { label: "Somatização autonômica", weight: 0.58, severity: "medium" as Severity },
    { label: "Anedonia", weight: 0.69, severity: "medium" as Severity },
  ],
  scales: [
    { name: "PHQ-9", score: 14, max: 27, severity: "medium" as Severity, appliedAt: "08 fev" },
  ],
  // Evidence found (or honestly absent) — every item carries a real-looking source label.
  evidence: [
    {
      title: "Depressão com resposta parcial — augmentation strategies",
      source: "NICE NG222 · 2022",
      strength: "A",
    },
    {
      title: "Workup laboratorial em fadiga + queixa cognitiva no adulto",
      source: "BMJ Best Practice · Fatigue assessment (rev. 2025)",
      strength: "B",
    },
    {
      title: "Uso crônico de benzodiazepínico e impacto cognitivo",
      source: "Cochrane Review 2024 · BZD long-term use",
      strength: "A",
    },
  ],
  risks: [
    {
      label: "Risco suicida",
      level: "baixo",
      note: "Sem ideação ativa relatada nesta consulta. Reavaliar com C-SSRS ainda neste ciclo.",
    },
    {
      label: "Carga sedativa cumulativa",
      level: "moderado",
      note: "BZD crônico + queixa cognitiva exige reavaliação de risco/benefício.",
    },
  ],
  gaps: [
    { label: "Workup laboratorial básico (>12m sem exames)", urgency: "alta" },
    { label: "PHQ-9 desatualizado (última = 08 fev)", urgency: "alta" },
    { label: "Sem ISI aplicado para insônia terminal", urgency: "alta" },
    { label: "EEM estruturado não gerado nesta consulta", urgency: "alta" },
    { label: "Revisão de interações fluoxetina + bupropiona + clonazepam", urgency: "média" },
    { label: "C-SSRS não aplicada apesar de quadro depressivo recorrente", urgency: "média" },
  ],
};

/* ──────────────────── REASONING STREAM (auditável) ───────────────────── */
// Each step shows: what PsyMatrix observed, what it inferred, and what backs it up.
// Evidence is REAL (mock label of a real-looking source) OR explicitly null = "honest gap".

export type EvidenceRef = {
  source: string;          // e.g. "NICE NG222 · 2022" | "Cochrane 2024"
  origin: "PsyEvidence" | "Guideline" | "Biblioteca pessoal" | "ContextPack";
  strength?: "A" | "B" | "C";
} | null;

export type ReasoningStep = {
  id: string;
  tag: string;             // short uppercase label
  source: "Overlay" | "ContextPack" | "PsyEvidence" | "PsyMatrix" | "Risco" | "PsyClinic" | "Módulos";
  observation: string;     // what PsyMatrix observed in plain clinical language
  inference: string;       // clinical inference (signal / gap / risk / next step)
  evidence: EvidenceRef;   // real source OR null = honest "no evidence linked"
  suggestedAction?: {      // optional action sent to CORA queue
    title: string;
    module: string;        // e.g. "PsyScales", "PsyClinic", "PsyNote"
    reason: string;
  };
};

export const reasoningSteps: ReasoningStep[] = [
  {
    id: "r1",
    tag: "OVERLAY",
    source: "Overlay",
    observation:
      "Lendo Overlay da consulta ativa: piora de humor há 6 semanas, anedonia, insônia terminal (04h), fadiga matinal, queixa cognitiva subjetiva recente, somatização autonômica.",
    inference:
      "Quadro compatível com episódio depressivo em curso, com componente de sono terminal e queixa cognitiva — três eixos que precisam ser quantificados antes de qualquer ajuste.",
    evidence: null,
  },
  {
    id: "r2",
    tag: "CONTEXTPACK",
    source: "ContextPack",
    observation:
      "Cruzando com ContextPack canônico: depressão recorrente em manutenção, resposta parcial a fluoxetina 40mg + bupropiona XL 300mg, clonazepam 1mg/noite há >2 anos. PHQ-9 prévio = 14.",
    inference:
      "Resposta parcial mantida há meses + queixa cognitiva nova + BZD crônico = combinação que exige reavaliação estruturada antes de escalonar farmacologia.",
    evidence: {
      source: "NICE NG222 · 2022",
      origin: "Guideline",
      strength: "A",
    },
  },
  {
    id: "r3",
    tag: "SINAIS",
    source: "PsyMatrix",
    observation:
      "Sinais detectados com peso clínico ≥ 0,55: humor deprimido, insônia terminal, fadiga, anedonia, queixa cognitiva, somatização autonômica.",
    inference:
      "Fenótipo dominante: depressão com sono terminal + cognitivo + somatização. Não é apenas um humor isolado — exige escalas direcionadas ao perfil.",
    evidence: null,
  },
  {
    id: "r4",
    tag: "LACUNAS",
    source: "PsyMatrix",
    observation:
      "Nenhum exame laboratorial documentado em > 12 meses. PHQ-9 desatualizado. Sem ISI para insônia terminal. EEM ainda não gerado nesta consulta. C-SSRS não aplicada.",
    inference:
      "5 lacunas clínicas bloqueiam fechamento responsável da consulta. As três de maior prioridade são workup laboratorial, ISI e EEM.",
    evidence: null,
    suggestedAction: {
      title: "Aplicar ISI",
      module: "PsyScales",
      reason: "Insônia terminal sustentada sem mensuração objetiva.",
    },
  },
  {
    id: "r5",
    tag: "RISCO",
    source: "Risco",
    observation:
      "Sem ideação ativa relatada. Porém: depressão recorrente + resposta parcial + BZD crônico + queixa cognitiva = perfil que merece reavaliação formal de risco.",
    inference:
      "Risco suicida atual: baixo. Carga sedativa cumulativa: moderada. Indicar C-SSRS nesta consulta para registro auditável e revisão do BZD.",
    evidence: {
      source: "Cochrane Review 2024 · BZD long-term use",
      origin: "PsyEvidence",
      strength: "A",
    },
    suggestedAction: {
      title: "Aplicar C-SSRS",
      module: "PsyScales",
      reason: "Depressão recorrente sem rastreio formal de ideação registrado nesta consulta.",
    },
  },
  {
    id: "r6",
    tag: "EVIDÊNCIA",
    source: "PsyEvidence",
    observation:
      "Consulta ao PsyEvidence sobre fadiga + queixa cognitiva + insônia terminal em adulto sob psicofármacos múltiplos.",
    inference:
      "Antes de atribuir queixa cognitiva à depressão ou ao BZD, é mandatório descartar causas orgânicas reversíveis — workup laboratorial é primeira linha.",
    evidence: {
      source: "BMJ Best Practice · Fatigue assessment (rev. 2025)",
      origin: "PsyEvidence",
      strength: "B",
    },
    suggestedAction: {
      title: "Solicitar workup laboratorial básico",
      module: "PsyClinic",
      reason:
        "Fadiga + queixa cognitiva + insônia terminal sem exames em > 12m. Hemograma, ferritina, ferro/TIBC/ST, B12, folato, 25-OH vit D, TSH/T4L, glicemia/HbA1c, função renal/hepática, Na/K/Ca/Mg.",
    },
  },
  {
    id: "r7",
    tag: "INTERAÇÕES",
    source: "Módulos",
    observation:
      "Combinação ativa: fluoxetina (inibidor potente CYP2D6) + bupropiona (substrato CYP2B6, baixa convulsiva) + clonazepam (sedativo, CYP3A4).",
    inference:
      "Carga serotoninérgica + risco de elevação plasmática de bupropiona via CYP2D6 + sedação cumulativa do clonazepam justificam revisão formal antes de qualquer ajuste.",
    evidence: null,
    suggestedAction: {
      title: "Revisar interações no PsyInteractions",
      module: "PsyInteractions",
      reason: "Fluoxetina + bupropiona + clonazepam ativos sem checagem registrada nesta consulta.",
    },
  },
  {
    id: "r8",
    tag: "AÇÕES",
    source: "PsyMatrix",
    observation:
      "Compondo ações priorizadas com módulo de destino, motivo clínico e payload de salvamento.",
    inference:
      "Enviando 7 ações para a fila da ÁUREA CORA — médico decide quais autorizar. Nenhuma é executada sem confirmação.",
    evidence: null,
  },
];

/* ─────────────────────────── ACTION QUEUE ────────────────────────────── */
// Kept rich and multi-module so the deck reflects the new clinical case.

export type ClinicalAction = {
  id: string;
  title: string;
  reason: string;
  module: string;
  saves: string;
  workspaceLink: string;
  priority: "alta" | "média" | "baixa";
  icon: string;
};

export const clinicalActions: ClinicalAction[] = [
  {
    id: "a1",
    title: "Solicitar workup laboratorial básico",
    reason:
      "Fadiga + queixa cognitiva + insônia terminal sem exames em >12m. Descartar causas reversíveis antes de escalonar psicofármaco.",
    module: "PsyClinic",
    saves: "Solicitação estruturada + entrada no histórico clínico",
    workspaceLink: "/workspace/clinic/workup",
    priority: "alta",
    icon: "FlaskConical",
  },
  {
    id: "a2",
    title: "Aplicar PHQ-9 (reavaliação)",
    reason: "Última aplicação em 08/fev = 14. Necessário comparativo para resposta atual.",
    module: "PsyScales",
    saves: "Score PHQ-9 + delta longitudinal no ContextPack",
    workspaceLink: "/workspace/scales/phq9",
    priority: "alta",
    icon: "ClipboardList",
  },
  {
    id: "a3",
    title: "Aplicar ISI",
    reason: "Insônia terminal persistente sem mensuração objetiva.",
    module: "PsyScales",
    saves: "Score ISI + severidade no ContextPack",
    workspaceLink: "/workspace/scales/isi",
    priority: "alta",
    icon: "Activity",
  },
  {
    id: "a4",
    title: "Aplicar C-SSRS",
    reason: "Depressão recorrente sem rastreio formal de ideação registrado nesta consulta.",
    module: "PsyScales",
    saves: "Score C-SSRS + nível de risco",
    workspaceLink: "/workspace/scales/cssrs",
    priority: "alta",
    icon: "ShieldAlert",
  },
  {
    id: "a5",
    title: "Gerar EEM (Exame do Estado Mental)",
    reason: "EEM obrigatório para fechamento clínico. Nenhum gerado nesta consulta.",
    module: "PsyNote · Document Engine",
    saves: "EEM estruturado + assinatura no PsyNote",
    workspaceLink: "/workspace/mse/new",
    priority: "alta",
    icon: "Brain",
  },
  {
    id: "a6",
    title: "Revisar interações no PsyInteractions",
    reason: "Fluoxetina + bupropiona + clonazepam ativos sem checagem nesta consulta (CYP2D6, sedação, limiar convulsivo).",
    module: "PsyInteractions",
    saves: "Relatório de interações + alertas no prontuário",
    workspaceLink: "/workspace/interactions",
    priority: "alta",
    icon: "ShieldAlert",
  },
  {
    id: "a7",
    title: "Revisar BZD crônico no PsyMeds",
    reason: "Clonazepam 1mg/noite há >2 anos + queixa cognitiva nova. Avaliar risco/benefício e plano de desmame.",
    module: "PsyMeds",
    saves: "Atualização do plano farmacológico + rascunho revisável",
    workspaceLink: "/workspace/meds/clonazepam",
    priority: "média",
    icon: "Pill",
  },
  {
    id: "a8",
    title: "Buscar evidência para depressão com resposta parcial",
    reason: "Sustentar próxima decisão farmacológica com guideline atualizada (NICE NG222 / CANMAT).",
    module: "PsyEvidence",
    saves: "Referências citáveis vinculadas à nota da consulta",
    workspaceLink: "/workspace/evidence",
    priority: "média",
    icon: "BookOpen",
  },
];
