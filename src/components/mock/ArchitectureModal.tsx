import React, { useState } from 'react';
import { X, Database, Terminal, Copy, Check, Code, ShieldCheck } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'db' | 'promptsWriting' | 'promptsSpeaking'>('db');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sqlSchema = `-- =========================================================================
-- VERITAS IELTS EDTECH PLATFORM - POSTGRESQL PRODUCTION DATABASE SCHEMA
-- Compatible with PostgreSQL 15+, Supabase, Cloud SQL, Prisma, and Drizzle
-- =========================================================================

-- 1. Users & Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    target_band NUMERIC(2, 1) DEFAULT 7.5,
    exam_type VARCHAR(20) NOT NULL CHECK (exam_type IN ('academic', 'general')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Mock Tests Repository
CREATE TABLE mock_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'CAMBRIDGE_19_TEST_1'
    category VARCHAR(20) NOT NULL CHECK (category IN ('academic', 'general')),
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Test Sections (Listening, Reading, Writing, Speaking)
CREATE TABLE test_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID REFERENCES mock_tests(id) ON DELETE CASCADE,
    section_type VARCHAR(20) NOT NULL CHECK (section_type IN ('listening', 'reading', 'writing', 'speaking')),
    duration_seconds INT NOT NULL, -- 1800 for L, 3600 for R, 3600 for W, 840 for S
    total_questions INT NOT NULL DEFAULT 40,
    instructions TEXT,
    audio_asset_url TEXT,
    passage_payload JSONB -- Contains paragraphs, charts, or cue cards
);

-- 4. Test Questions Bank
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id UUID REFERENCES test_sections(id) ON DELETE CASCADE,
    question_number INT NOT NULL, -- 1 to 40
    part_number INT NOT NULL, -- 1 to 4
    kind VARCHAR(50) NOT NULL, -- 'multiple_choice', 'true_false_not_given', 'matching_headings', 'note_completion'
    prompt_text TEXT NOT NULL,
    instruction_text TEXT,
    options JSONB, -- Array of strings for choices / headings
    correct_answers JSONB NOT NULL, -- ['8492', 'ST-8492', 'ST8492']
    explanation TEXT,
    evidence_quote TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Student Test Attempt Sessions
CREATE TABLE test_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    test_id UUID REFERENCES mock_tests(id) ON DELETE RESTRICT,
    status VARCHAR(30) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'graded', 'abandoned')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    
    -- Calculated Sectional Bands (0.0 to 9.0)
    listening_band NUMERIC(2, 1),
    reading_band NUMERIC(2, 1),
    writing_band NUMERIC(2, 1),
    speaking_band NUMERIC(2, 1),
    overall_band NUMERIC(2, 1),
    
    trf_certificate_number VARCHAR(64) UNIQUE,
    session_metadata JSONB -- Browser, IP, timestamps
);

-- 6. User Answers Log
CREATE TABLE user_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID REFERENCES test_attempts(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    user_input TEXT,
    is_correct BOOLEAN,
    is_flagged_for_review BOOLEAN DEFAULT FALSE,
    answered_at TIMESTAMPTZ DEFAULT NOW(),
    time_spent_seconds INT
);

-- 7. Writing & Speaking AI Rubric Evaluations
CREATE TABLE ai_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID REFERENCES test_attempts(id) ON DELETE CASCADE,
    section_type VARCHAR(20) NOT NULL CHECK (section_type IN ('writing', 'speaking')),
    task_identifier VARCHAR(20) NOT NULL, -- 'task_1', 'task_2', 'part_1', 'part_2', 'part_3'
    
    -- Candidate Input
    submission_text TEXT,
    audio_recording_url TEXT,
    whisper_transcript TEXT,
    
    -- 4 Rubric Scores (0.0 - 9.0)
    criterion_1_band NUMERIC(2, 1) NOT NULL, -- Task Achievement OR Fluency
    criterion_1_feedback TEXT,
    criterion_2_band NUMERIC(2, 1) NOT NULL, -- Coherence OR Lexical
    criterion_2_feedback TEXT,
    criterion_3_band NUMERIC(2, 1) NOT NULL, -- Lexical OR Grammar
    criterion_3_feedback TEXT,
    criterion_4_band NUMERIC(2, 1) NOT NULL, -- Grammar OR Pronunciation
    criterion_4_feedback TEXT,
    
    calculated_overall_band NUMERIC(2, 1) NOT NULL,
    detected_strengths JSONB,
    detected_weaknesses JSONB,
    model_version VARCHAR(64), -- e.g. 'gemini-1.5-pro' or 'gpt-4o'
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for ultra-fast query performance
CREATE INDEX idx_user_attempts ON test_attempts(user_id, status);
CREATE INDEX idx_attempt_answers ON user_answers(attempt_id, question_id);
CREATE INDEX idx_section_questions ON questions(section_id, question_number);`;

  const promptWriting = `// =========================================================================
// SYSTEM PROMPT: IELTS WRITING EVALUATOR (SENIOR EXAMINER & EDTECH ARCHITECT)
// Standard: British Council / IDP / Cambridge Assessment Official Rubrics
// =========================================================================

You are an official Senior IELTS Writing Examiner and Lead EdTech Assessment Architect. 
Your primary task is to evaluate IELTS Writing responses (Task 1 and Task 2) strictly in accordance with the official British Council / IDP Assessment Criteria:
1. Task Achievement (Task 1) / Task Response (Task 2)
2. Coherence and Cohesion
3. Lexical Resource
4. Grammatical Range and Accuracy

EVALUATION & LEXICAL RULES (CRITICAL):
- LEXICAL RESOURCE ACCURACY: Do NOT rely solely on explicit discourse markers (e.g., 'furthermore', 'moreover') to measure vocabulary. You MUST identify, extract, and reward C1-C2 Academic Collocations, domain-specific terminology, nominalizations, and precise topic-specific vocabulary (e.g., 'hyper-personalized learning pathways', 'foundational misconceptions', 'democratize high-quality instruction').
- NO INFORMAL IDIOMS IN WRITING: NEVER penalize an essay for lacking informal or conversational idioms (e.g., 'bite the bullet', 'at the end of the day'). Informal idioms are prohibited in Academic Writing. High Lexical Resource (Band 8.0-9.0) in Task 2 requires natural, precise ACADEMIC collocations and formal register.
- ADVANCED COHESION ANALYSIS: Evaluate paragraph structure, topic progression, referencing (pronouns, demonstratives), and lexical cohesion (synonyms, collocations) rather than counting initial connective words. Over-reliance on basic linkers caps Coherence & Cohesion at Band 6.0-7.0, whereas implicit contextual cohesion is required for Band 8.0-9.0.
- BAND CALCULATION: Grade each criterion from 0.0 to 9.0 in half-band increments. Calculate the Overall Writing Band Score as the unweighted average rounded to the nearest half-band (e.g., average of 7.25 -> 7.5; average of 6.75 -> 7.0; average of 7.125 -> 7.0).

INPUT FORMAT:
- Task Type: [TASK_1 | TASK_2]
- Task Prompt: [PROMPT_TEXT]
- Candidate Response: [ESSAY_TEXT]

OUTPUT SCHEMA (STRICT JSON ONLY):
{
  "overallBand": 9.0,
  "criteriaScores": {
    "taskResponse": 9.0,
    "coherenceCohesion": 9.0,
    "lexicalResource": 9.0,
    "grammaticalAccuracy": 9.0
  },
  "lexicalAnalysis": {
    "detectedCEFRLevel": "C2",
    "academicCollocationsFound": [
      "hyper-personalized learning pathways",
      "foundational misconceptions",
      "democratize high-quality instruction",
      "obsolescence of traditional instructors",
      "synergistic model"
    ],
    "registerCheck": "Formal Academic (Zero informal idioms detected)"
  },
  "detailedFeedback": {
    "taskResponse": "Clear, fully developed argument addressing both sides of the prompt with an explicitly sustained personal stance.",
    "coherenceCohesion": "Flawless paragraphing and logical idea progression utilizing sophisticated referencing and lexical cohesion.",
    "lexicalResource": "Outstanding range of precise academic collocations used naturally with complete flexibility and control.",
    "grammaticalAccuracy": "Full flexibility in complex structures with consistently error-free syntax and punctuation."
  },
  "corrections": [
    {
      "original": "Text snippet if error exists",
      "corrected": "Corrected version",
      "explanation": "Grammatical/lexical reason"
    }
  ],
  "wordCount": 332,
  "actionableAdvice": [
    "Advice item 1 focused on maintaining peak performance or refining specific nuances."
  ]
}`;

  const promptSpeaking = `// =========================================================================
// SYSTEM PROMPT: IELTS SPEAKING EVALUATOR (WHISPER TRANSCRIPT + ACOUSTIC)
// Standard: Cambridge ESOL Official Speaking Rubrics
// =========================================================================

You are an expert Cambridge-certified IELTS Speaking Examiner. You evaluate transcriptions of candidate responses across Part 1, Part 2 (Cue Card), and Part 3, supplemented by acoustic metrics (Words Per Minute, pause distribution, and phonetic transcription).

### EVALUATION CRITERIA:
1. FLUENCY AND COHERENCE (FC):
   - Speech rate (optimal: 110–140 words per minute).
   - Ability to speak at length without noticeable effort or loss of coherence.
   - Frequency of hesitation (content search vs language search).
   - Use of discourse markers and connectives.

2. LEXICAL RESOURCE (LR):
   - Variety and precision of vocabulary to discuss unfamiliar and abstract topics.
   - Use of idiomatic expressions and colloquial collocations.
   - Ability to paraphrase effectively when facing vocabulary gaps.

3. GRAMMATICAL RANGE AND ACCURACY (GRA):
   - Range of complex structures (modals, hypothetical conditionals, passive voice, subordinate clauses).
   - Proportion of error-free utterances.

4. PRONUNCIATION (PR):
   - Intonation contours, sentence stress on key content words, individual phoneme clarity.

### STRICT OUTPUT FORMAT:
Respond with valid JSON:
{
  "estimatedOverallBand": 7.5,
  "metrics": {
    "wordsPerMinute": 124,
    "hesitationPauseRatio": "Normal (1.8%)"
  },
  "criteria": {
    "fluencyAndCoherence": { "band": 8.0, "notes": "..." },
    "lexicalResource": { "band": 7.5, "notes": "..." },
    "grammaticalRange": { "band": 7.5, "notes": "..." },
    "pronunciation": { "band": 7.0, "notes": "..." }
  },
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "cueCardCompletion": {
    "coveredAllBullets": true,
    "timingEvaluation": "Completed within 1m 55s optimal range"
  }
}`;

  const currentContent = activeTab === 'db' ? sqlSchema : activeTab === 'promptsWriting' ? promptWriting : promptSpeaking;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-[#0d131f]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Code className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block">
                EdTech Architecture Specification
              </span>
              <h3 className="text-lg font-bold text-white">
                Схема базы данных и Системные промпты AI-оценки
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(currentContent)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Скопировано!' : 'Копировать код'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 pb-2 border-b border-slate-800 bg-slate-950/60 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('db')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              activeTab === 'db' ? 'bg-emerald-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            1. PostgreSQL Database Schema (DDL)
          </button>
          <button
            onClick={() => setActiveTab('promptsWriting')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              activeTab === 'promptsWriting' ? 'bg-emerald-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            2. System Prompt: IELTS Writing Evaluator
          </button>
          <button
            onClick={() => setActiveTab('promptsSpeaking')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              activeTab === 'promptsSpeaking' ? 'bg-emerald-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            3. System Prompt: IELTS Speaking Evaluator
          </button>
        </div>

        {/* Code Content */}
        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto bg-slate-950">
          <pre className="font-mono text-xs sm:text-sm text-slate-200 leading-relaxed overflow-x-auto select-all whitespace-pre">
            {currentContent}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Готово к интеграции с Supabase, Cloud SQL, OpenAI / Anthropic / Gemini</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-lg text-xs cursor-pointer"
          >
            Закрыть спецификацию
          </button>
        </div>

      </div>
    </div>
  );
};
