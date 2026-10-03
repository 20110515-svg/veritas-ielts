export type SectionType = 'listening' | 'reading' | 'writing' | 'speaking';

export type ExamCategory = 'academic' | 'general';

export type QuestionKind = 
  | 'multiple_choice' 
  | 'true_false_not_given' 
  | 'matching_headings' 
  | 'note_completion' 
  | 'sentence_completion'
  | 'matching';

export interface BaseQuestion {
  id: number;
  section: SectionType;
  part: number; // 1 to 4 for L, 1 to 3 for R, 1 or 2 for W, 1 to 3 for S
  kind: QuestionKind;
  instruction: string;
  prompt: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  evidenceQuote?: string; // Text fragment where answer is found
}

export interface HighlightItem {
  id: string;
  text: string;
  color: 'yellow' | 'green' | 'blue';
  note?: string;
  paragraphIndex?: number;
}

export interface ReadingPassage {
  id: number;
  title: string;
  subheading?: string;
  paragraphs: { label?: string; text: string }[];
  questionsRange: [number, number];
}

export interface ListeningPart {
  partNumber: number;
  title: string;
  audioDurationSeconds: number;
  simulatedAudioScript: string;
  transcriptKeyPoints: { time: string; text: string; relatedQuestionId?: number }[];
  questionsRange: [number, number];
}

export interface WritingTaskData {
  taskNumber: 1 | 2;
  title: string;
  type: string;
  minWords: number;
  promptText: string;
  chartDescription?: string;
  chartData?: { label: string; values: { year: string; value: number }[] }[];
  defaultSampleSubmission?: string;
}

export interface SpeakingPartData {
  partNumber: 1 | 2 | 3;
  title: string;
  instructions: string;
  prepTimeSeconds?: number;
  speakingTimeSeconds: number;
  cueCard?: {
    topic: string;
    bulletPoints: string[];
  };
  questions?: string[];
}

export interface AIEvaluationResult {
  overallBand: number;
  criteriaScores?: {
    taskResponse: number;
    coherenceCohesion: number;
    lexicalResource: number;
    grammaticalAccuracy: number;
  };
  lexicalAnalysis?: {
    detectedCEFRLevel: string;
    academicCollocationsFound: string[];
    registerCheck: string;
  };
  detailedFeedback?: {
    taskResponse: string;
    coherenceCohesion: string;
    lexicalResource: string;
    grammaticalAccuracy: string;
  };
  corrections?: {
    original: string;
    corrected: string;
    explanation: string;
  }[];
  wordCount?: number;
  actionableAdvice?: string[];
  // Backwards-compatible legacy properties
  scores: {
    criterion1: { name: string; band: number; feedback: string };
    criterion2: { name: string; band: number; feedback: string };
    criterion3: { name: string; band: number; feedback: string };
    criterion4: { name: string; band: number; feedback: string };
  };
  summaryRecommendation: string;
  detectedWeaknesses: string[];
  detectedStrengths: string[];
}

export interface MockTestState {
  currentSection: SectionType;
  currentQuestionId: number;
  userAnswers: Record<number, string>;
  flaggedForReview: Record<number, boolean>;
  highlights: HighlightItem[];
  writingAnswers: {
    task1: string;
    task2: string;
  };
  writingEvaluations: {
    task1?: AIEvaluationResult;
    task2?: AIEvaluationResult;
  };
  speakingTranscripts: {
    part1: string[];
    part2: string;
    part3: string[];
  };
  speakingAudioBlobs: {
    part1?: string;
    part2?: string;
    part3?: string;
  };
  speakingEvaluation?: AIEvaluationResult;
  isTestSubmitted: boolean;
  timeRemainingSeconds: Record<SectionType, number>;
}
