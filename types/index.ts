export type ScenarioKey = "h1b_extension" | "h1b_transfer" | "h4_ead" | "i485_aos";

export interface IntakeAnswers {
  visaStatus: string;
  goal: string;
  additionalInfo?: string;
  hasI140?: boolean;
  priorityDateCurrent?: boolean;
}

export interface RoadmapStep {
  order: number;
  title: string;
  formNumber: string;
  formName: string;
  fee: number;
  processingTime: string;
  processingWeeks?: number;
  description: string;
  documents: string[];
  bullets: string[];
  uscisLink: string;
  whoFiles: "employer" | "applicant" | "both";
}

export interface DocumentGroup {
  category: string;
  items: string[];
}

export interface Roadmap {
  scenario: string;
  scenarioKey: ScenarioKey;
  summary: string;
  steps: RoadmapStep[];
  documentGroups: DocumentGroup[];
  importantDeadlines: string[];
  disclaimer: string;
}
