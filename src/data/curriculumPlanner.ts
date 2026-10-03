export interface CurriculumModule {
  moduleId: string;
  title: string;
  estimatedTimeMinutes: number;
  exerciseType: 'INTERACTIVE_LESSON' | 'PRACTICE_DRILL' | 'AI_VOICE_DRILL';
}

export interface CurriculumWeek {
  weekNumber: number;
  focusArea: string;
  targetGoal: string;
  modulesToComplete: CurriculumModule[];
}

export interface CurriculumPlan {
  diagnosticSummary: {
    currentOverallBand: number;
    targetOverallBand: number;
    bottleneckSection: 'LISTENING' | 'READING' | 'WRITING' | 'SPEAKING';
    estimatedHoursRequired: number;
    keyWeaknesses: {
      section: 'LISTENING' | 'READING' | 'WRITING' | 'SPEAKING';
      issue: string;
      recommendation: string;
    }[];
  };
  weeklyPlan: CurriculumWeek[];
  recommendedMicroDrills: {
    drillType: string;
    focus: string;
    dailyTarget: string;
  }[];
}

export function generateAdaptiveCurriculum(params: {
  currentScores: {
    listening: number;
    reading: number;
    writing: number;
    speaking: number;
    overall: number;
  };
  errorSummary?: {
    readingHeadingsWrong?: number;
    readingTFNGWrong?: number;
    listeningPart3Wrong?: number;
    writingIssue?: string;
    speakingIssue?: string;
  };
  targetBand?: number;
  weeksCount?: number;
}): CurriculumPlan {
  const targetBand = params.targetBand || 7.5;
  const currentOverall = params.currentScores.overall || 6.5;
  const weeks = params.weeksCount || 6;

  // Identify lowest section as bottleneck
  const scores = [
    { section: 'WRITING' as const, band: params.currentScores.writing },
    { section: 'READING' as const, band: params.currentScores.reading },
    { section: 'LISTENING' as const, band: params.currentScores.listening },
    { section: 'SPEAKING' as const, band: params.currentScores.speaking },
  ];
  scores.sort((a, b) => a.band - b.band);
  const bottleneck = scores[0].section;

  // Gap calculation: roughly 40-50 hours per 0.5 band improvement
  const bandGap = Math.max(0, targetBand - currentOverall);
  const estimatedHours = Math.round(Math.max(25, bandGap * 80));

  const keyWeaknesses: { section: 'LISTENING' | 'READING' | 'WRITING' | 'SPEAKING'; issue: string; recommendation: string }[] = [];

  if (params.currentScores.reading < targetBand) {
    keyWeaknesses.push({
      section: 'READING',
      issue: params.errorSummary?.readingHeadingsWrong 
        ? `Matching Headings accuracy deficient (${params.errorSummary.readingHeadingsWrong}/7 incorrect in Passage 2).`
        : 'Matching Headings accuracy is below 40% and excessive time spent on Passage 2 distractors.',
      recommendation: 'Focus on paragraph main-idea skimming and topic progression rather than word-for-word translation.'
    });
  }

  if (params.currentScores.writing < targetBand) {
    keyWeaknesses.push({
      section: 'WRITING',
      issue: params.errorSummary?.writingIssue || 'Task 1 Coherence & Cohesion penalized due to repetitive transition words and Task 2 Lexical Resource restricted by generic phrasing.',
      recommendation: 'Study advanced implicit cohesive devices, topic-specific nominalizations, and banish informal conversational idioms.'
    });
  }

  if (params.currentScores.listening < targetBand) {
    keyWeaknesses.push({
      section: 'LISTENING',
      issue: params.errorSummary?.listeningPart3Wrong
        ? `Academic multiple-choice in Part 3 missed key qualifications (${params.errorSummary.listeningPart3Wrong}/10 incorrect).`
        : 'Rapid turn-taking in Part 3 educational tutorials leads to missed qualification cues and paraphrasing traps.',
      recommendation: 'Train micro-listening for contrastive discourse markers (e.g., "contrary to popular belief", "nonetheless") and anticipatory question scanning.'
    });
  }

  if (params.currentScores.speaking < targetBand) {
    keyWeaknesses.push({
      section: 'SPEAKING',
      issue: params.errorSummary?.speakingIssue || 'Fluency dropped during Part 3 abstract questions due to repetitive filler words ("well", "you know") under cognitive pressure.',
      recommendation: 'Deploy high-level signposting devices and the PEEL paragraph response framework (Point, Explanation, Example, Link).'
    });
  }

  // Ensure at least 2 key weaknesses
  if (keyWeaknesses.length < 2) {
    keyWeaknesses.push({
      section: 'WRITING',
      issue: 'Coherence & Cohesion relies excessively on mechanical sentence linkers.',
      recommendation: 'Implement demonstrative referencing and lexical chains for Band 8.0+ implicit flow.'
    });
  }

  const weeklyPlan: CurriculumWeek[] = [
    {
      weekNumber: 1,
      focusArea: 'Reading Headings Mastery & Writing Task 1 Comparative Dynamics',
      targetGoal: 'Increase Reading Passage 2 speed by 15% and master data trend nomenclature',
      modulesToComplete: [
        {
          moduleId: 'mod-read-headings-01',
          title: 'Mastering Matching Headings via Keywords Mapping & Theme Extraction',
          estimatedTimeMinutes: 45,
          exerciseType: 'INTERACTIVE_LESSON'
        },
        {
          moduleId: 'mod-writ-task1-trends',
          title: 'Advanced Vocabulary for Complex Data Trends, Fluctuations & Projections',
          estimatedTimeMinutes: 60,
          exerciseType: 'PRACTICE_DRILL'
        },
        {
          moduleId: 'mod-lis-note-accuracy',
          title: 'Section 1 Note-Completion: Numerical Formats, Spelling & Word Limits',
          estimatedTimeMinutes: 30,
          exerciseType: 'PRACTICE_DRILL'
        }
      ]
    },
    {
      weekNumber: 2,
      focusArea: 'Reading True/False/Not Given Traps & Writing Task 2 Idea Progression',
      targetGoal: 'Eliminate False vs Not Given confusion and construct cohesive 4-paragraph essay frameworks',
      modulesToComplete: [
        {
          moduleId: 'mod-read-tfng-logic',
          title: 'Dissecting Fact vs Claim: Absolute Quantifiers in True/False/Not Given',
          estimatedTimeMinutes: 50,
          exerciseType: 'INTERACTIVE_LESSON'
        },
        {
          moduleId: 'mod-writ-task2-structure',
          title: 'Discursive Essay Architecture: Balanced Perspectives & Sustained Stance',
          estimatedTimeMinutes: 70,
          exerciseType: 'PRACTICE_DRILL'
        },
        {
          moduleId: 'mod-spk-part2-cue-card',
          title: 'Part 2 Cue Card Strategy: 1-Minute Note-Taking Matrix & 120s Continuous Flow',
          estimatedTimeMinutes: 40,
          exerciseType: 'AI_VOICE_DRILL'
        }
      ]
    },
    {
      weekNumber: 3,
      focusArea: 'Academic Collocations, Register Control & Listening Part 3 Tutorials',
      targetGoal: 'Acquire 40 C1-C2 nominalizations and anticipate academic tutorial turn-taking',
      modulesToComplete: [
        {
          moduleId: 'mod-writ-c1-collocations',
          title: 'Deploying C1/C2 Academic Collocations and Banning Informal Idioms',
          estimatedTimeMinutes: 60,
          exerciseType: 'INTERACTIVE_LESSON'
        },
        {
          moduleId: 'mod-lis-part3-dialogues',
          title: 'Academic Tutorials & Multi-Speaker Debate: Identifying Distractors & Agreement Cues',
          estimatedTimeMinutes: 45,
          exerciseType: 'PRACTICE_DRILL'
        },
        {
          moduleId: 'mod-spk-part3-peel',
          title: 'The PEEL Framework for Part 3 Abstract Inquiries: Philosophical & Socioeconomic Depth',
          estimatedTimeMinutes: 45,
          exerciseType: 'AI_VOICE_DRILL'
        }
      ]
    },
    {
      weekNumber: 4,
      focusArea: 'Complex Sentence Syntax, Inversion & Reading Summary Completion',
      targetGoal: 'Deploy complex syntactic structures with zero punctuation errors in Writing',
      modulesToComplete: [
        {
          moduleId: 'mod-gra-complex-clauses',
          title: 'Conditional Inversion, Participial Clauses & Passive Voice for Band 8.0+',
          estimatedTimeMinutes: 55,
          exerciseType: 'INTERACTIVE_LESSON'
        },
        {
          moduleId: 'mod-read-summary-matching',
          title: 'Reading Summary Completion with Synonymous Clue Boxes & Grammatical Filtering',
          estimatedTimeMinutes: 45,
          exerciseType: 'PRACTICE_DRILL'
        },
        {
          moduleId: 'mod-spk-fluency-fillers',
          title: 'Eradicating Filler Words: Replacing Hesitation with Academic Signposts',
          estimatedTimeMinutes: 40,
          exerciseType: 'AI_VOICE_DRILL'
        }
      ]
    },
    {
      weekNumber: 5,
      focusArea: 'Speed-Reading Endurance & Full Writing Simulation Under Strict 60-min Clock',
      targetGoal: 'Complete both Writing Task 1 (20m) and Task 2 (40m) with 5 minutes reserve for self-audit',
      modulesToComplete: [
        {
          moduleId: 'mod-writ-timed-exam',
          title: 'Full 60-Minute Writing Simulation with AI Criterion-by-Criterion Scoring',
          estimatedTimeMinutes: 75,
          exerciseType: 'PRACTICE_DRILL'
        },
        {
          moduleId: 'mod-lis-part4-lectures',
          title: 'Part 4 Academic Lectures: Monologue Signposting & Rapid Note Synthesis',
          estimatedTimeMinutes: 40,
          exerciseType: 'PRACTICE_DRILL'
        },
        {
          moduleId: 'mod-spk-full-interview',
          title: 'Full 14-Minute Speaking Mock with AI Acoustic & Lexical Examiner',
          estimatedTimeMinutes: 30,
          exerciseType: 'AI_VOICE_DRILL'
        }
      ]
    },
    {
      weekNumber: 6,
      focusArea: 'Full Exam Dress Rehearsal & High-Stakes Score Consolidation',
      targetGoal: 'Achieve stable Target Band in a full 2-hour-44-minute simulated test conditions',
      modulesToComplete: [
        {
          moduleId: 'mod-mock-full-rehearsal',
          title: 'Full Computer-Delivered IELTS Simulation with Official Band Verification',
          estimatedTimeMinutes: 164,
          exerciseType: 'PRACTICE_DRILL'
        },
        {
          moduleId: 'mod-audit-final-polish',
          title: 'Post-Exam Forensic Audit: Error Log Retrospective & Confidence Calibration',
          estimatedTimeMinutes: 45,
          exerciseType: 'INTERACTIVE_LESSON'
        }
      ]
    }
  ];

  const recommendedMicroDrills = [
    {
      drillType: 'GRAMMAR_CORRECTION',
      focus: 'Punctuation in Non-Restrictive Relative Clauses & Inversion Syntax',
      dailyTarget: '10 questions per day (approx. 8 minutes)'
    },
    {
      drillType: 'VOCABULARY_FLASHCARDS',
      focus: 'C1/C2 Academic Collocations & Precision Nominalizations',
      dailyTarget: '15 collocations active recall daily'
    },
    {
      drillType: 'SHADOWING_DRILL',
      focus: 'British RP / Australian Pronunciation & Natural Intonation Curves',
      dailyTarget: '5 minutes speech repetition daily'
    }
  ];

  return {
    diagnosticSummary: {
      currentOverallBand: currentOverall,
      targetOverallBand: targetBand,
      bottleneckSection: bottleneck,
      estimatedHoursRequired: estimatedHours,
      keyWeaknesses
    },
    weeklyPlan: weeklyPlan.slice(0, weeks),
    recommendedMicroDrills
  };
}
