import {
  WritingEvaluatorOutput,
  SpeakingEvaluatorOutput,
  DiagnosticPlannerOutput,
  evaluateWritingResponse,
  evaluateSpeakingResponse,
  generateDiagnosticLearningPlan,
} from './ieltsCoreAIEngine';

export async function requestWritingEvaluation(params: {
  taskType: 'Task 1' | 'Task 2';
  taskPrompt: string;
  candidateEssay: string;
  model?: 'gemini-2.5-flash' | 'gemini-2.5-pro';
}): Promise<WritingEvaluatorOutput> {
  // If essay is under 50 words, handle immediately with error code
  const words = (params.candidateEssay || '').trim().split(/\s+/).filter(Boolean);
  if (words.length < 50) {
    return evaluateWritingResponse(params);
  }

  try {
    const res = await fetch('/api/ielts-ai/evaluate-writing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.info('Client proxy unavailable, falling back to direct AI engine:', err);
  }

  return evaluateWritingResponse(params);
}

export async function requestSpeakingEvaluation(params: {
  part: 'Part 1' | 'Part 2' | 'Part 3';
  targetQuestion: string;
  candidateTranscript: string;
  model?: 'gemini-2.5-flash' | 'gemini-2.5-pro';
}): Promise<SpeakingEvaluatorOutput> {
  try {
    const res = await fetch('/api/ielts-ai/evaluate-speaking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.info('Client proxy unavailable, falling back to direct AI engine:', err);
  }

  return evaluateSpeakingResponse(params);
}

export async function requestDiagnosticPlanner(params: {
  targetOverallBand: number;
  currentScores: {
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
    overall: number;
  };
  errorBreakdown?: {
    readingHeadingsWrong?: number;
    readingTFNGWrong?: number;
    listeningPart3Wrong?: number;
    writingIssue?: string;
    speakingIssue?: string;
  };
  weeksCount?: number;
  model?: 'gemini-2.5-flash' | 'gemini-2.5-pro';
}): Promise<DiagnosticPlannerOutput> {
  try {
    const res = await fetch('/api/ielts-ai/diagnostic-planner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.info('Client proxy unavailable, falling back to direct AI engine:', err);
  }

  return generateDiagnosticLearningPlan(params);
}

export async function requestAriaChat(params: {
  message: string;
  history?: { role: 'user' | 'model'; text: string }[];
  context: {
    userName: string;
    currentBand: number;
    targetBand: number;
    weakAreas: string[];
    currentModule: string;
  };
  model?: 'gemini-2.5-flash' | 'gemini-2.5-pro';
}): Promise<{ reply: string }> {
  try {
    const res = await fetch('/api/aria/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.info('Client proxy unavailable, falling back to direct Aria engine:', err);
  }

  const { askAriaTutor } = await import('./ariaAITutor');
  const reply = await askAriaTutor(params);
  return { reply };
}
