export type ExamType = 'academic' | 'general';
export type LevelTier = 'b1' | 'b2' | 'c1';

export interface LevelProfile {
  id: LevelTier;
  label: string;
  sublabel: string;
  currentScore: string;
  targetScore: string;
  timeframe: string;
  mainStumblingBlock: string;
  solutionStrategy: string;
  modulesPriority: {
    name: string;
    focus: string;
  }[];
}

export interface AIEngineModule {
  id: string;
  name: string;
  techTitle: string;
  accuracyRate: string;
  keyCapabilities: string[];
  latencyMs: number;
  evaluationsPerformed: number;
  rubricStandards: string;
  architectureQuote: string;
  specialization: string;
  badge: string;
}

export interface CaseStudy {
  id: string;
  studentName: string;
  examType: ExamType;
  beforeScore: number;
  afterScore: number;
  durationWeeks: number;
  targetUniversityOrCountry: string;
  storySnippet: string;
  breakdown: {
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
  };
  trfNumber: string;
  image?: string;
}

export interface PricingPlan {
  id: string;
  title: string;
  kicker: string;
  monthlyPriceRub: number;
  monthlyPriceKzt: number;
  monthlyPriceUsd: number;
  isPopular?: boolean;
  idealFor: string;
  includedFeatures: string[];
  excludedFeatures?: string[];
  ctaText: string;
  accessMode: string;
}

export interface LeadMagnetItem {
  id: string;
  title: string;
  description: string;
  format: string;
  pageCount: string;
  targetBand: string;
  highlights: string[];
  previewUrl?: string;
  contentPreview: string;
}

export interface DiagnosticQuestion {
  id: number;
  skill: string;
  taskTitle: string;
  questionText: string;
  options: {
    label: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}
