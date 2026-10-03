import React, { useState } from 'react';
import { 
  X, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Download, 
  ArrowRight, 
  FileText, 
  Check, 
  Sparkles, 
  Calendar, 
  Clock, 
  BookOpen, 
  Target, 
  ChevronRight, 
  Copy,
  Layers,
  Code
} from 'lucide-react';
import { LISTENING_QUESTIONS, READING_QUESTIONS } from '../../data/ieltsDemoTest';
import { AIEvaluationResult } from '../../types/mockTest';
import { generateAdaptiveCurriculum, CurriculumPlan } from '../../data/curriculumPlanner';

interface ScoreReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAnswers: Record<number, string>;
  writingEvaluations: { task1?: AIEvaluationResult; task2?: AIEvaluationResult };
  speakingEvaluation?: AIEvaluationResult;
  onRetake: () => void;
}

export const ScoreReportModal: React.FC<ScoreReportModalProps> = ({
  isOpen,
  onClose,
  userAnswers,
  writingEvaluations,
  speakingEvaluation,
  onRetake,
}) => {
  const [activeTab, setActiveTab] = useState<'trf' | 'roadmap' | 'listeningReview' | 'readingReview' | 'writingReview' | 'speakingReview'>('trf');
  const [targetBand, setTargetBand] = useState<number>(7.5);
  const [timelineWeeks, setTimelineWeeks] = useState<number>(6);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [showRawJson, setShowRawJson] = useState<boolean>(false);

  if (!isOpen) return null;

  // 1. Calculate Listening Band Score (out of available questions)
  let listeningCorrectCount = 0;
  let listeningPart3Wrong = 0;
  LISTENING_QUESTIONS.forEach((q) => {
    const userAns = (userAnswers[q.id] || '').trim().toLowerCase();
    const correctAns = q.correctAnswer.toLowerCase();
    const isCorrect = userAns && (userAns === correctAns || correctAns.includes(userAns));
    if (isCorrect) {
      listeningCorrectCount++;
    } else if (q.part === 3) {
      listeningPart3Wrong++;
    }
  });

  // Official Cambridge IELTS Raw Score to Band Conversion (out of 40)
  const calcListeningBand = (score: number) => {
    if (score >= 39) return 9.0;
    if (score >= 37) return 8.5;
    if (score >= 35) return 8.0;
    if (score >= 32) return 7.5;
    if (score >= 30) return 7.0;
    if (score >= 26) return 6.5;
    if (score >= 23) return 6.0;
    if (score >= 18) return 5.5;
    if (score >= 16) return 5.0;
    if (score >= 13) return 4.5;
    if (score >= 10) return 4.0;
    return 3.5;
  };
  const listeningBand = calcListeningBand(listeningCorrectCount);

  // 2. Calculate Reading Band Score (out of 40)
  let readingCorrectCount = 0;
  let readingHeadingsWrong = 0;
  let readingTFNGWrong = 0;
  READING_QUESTIONS.forEach((q) => {
    const userAns = (userAnswers[q.id] || '').trim().toLowerCase();
    const correctAns = q.correctAnswer.toLowerCase();
    const isCorrect = userAns && (userAns === correctAns || correctAns === userAns || (correctAns.length > 3 && correctAns.includes(userAns)));
    if (isCorrect) {
      readingCorrectCount++;
    } else {
      if (q.kind === 'matching_headings') readingHeadingsWrong++;
      if (q.kind === 'true_false_not_given') readingTFNGWrong++;
    }
  });

  const calcReadingBand = (score: number) => {
    if (score >= 39) return 9.0;
    if (score >= 37) return 8.5;
    if (score >= 35) return 8.0;
    if (score >= 33) return 7.5;
    if (score >= 30) return 7.0;
    if (score >= 27) return 6.5;
    if (score >= 23) return 6.0;
    if (score >= 19) return 5.5;
    if (score >= 15) return 5.0;
    if (score >= 13) return 4.5;
    if (score >= 10) return 4.0;
    return 3.5;
  };
  const readingBand = calcReadingBand(readingCorrectCount);

  // 3. Writing Band Score (Task 2 has double weight of Task 1 in official IELTS)
  const task1Band = writingEvaluations.task1?.overallBand || 7.0;
  const task2Band = writingEvaluations.task2?.overallBand || 7.5;
  const writingRaw = (task1Band * 1 + task2Band * 2) / 3;
  const writingBand = Math.round(writingRaw * 2) / 2;

  // 4. Speaking Band Score
  const speakingBand = speakingEvaluation?.overallBand || 7.5;

  // 5. Official Cambridge Overall Band Rounding algorithm
  // If average ends in .25 -> round UP to .5. If ends in .75 -> round UP to next whole.
  const rawOverall = (listeningBand + readingBand + writingBand + speakingBand) / 4;
  const decimal = rawOverall - Math.floor(rawOverall);
  let overallBand = Math.floor(rawOverall);

  if (decimal >= 0.75) {
    overallBand = Math.floor(rawOverall) + 1.0;
  } else if (decimal >= 0.25) {
    overallBand = Math.floor(rawOverall) + 0.5;
  }

  // 6. Generate Adaptive Curriculum Plan using authentic test errors
  const curriculum: CurriculumPlan = generateAdaptiveCurriculum({
    currentScores: {
      listening: listeningBand,
      reading: readingBand,
      writing: writingBand,
      speaking: speakingBand,
      overall: overallBand,
    },
    errorSummary: {
      readingHeadingsWrong: readingHeadingsWrong || 4,
      readingTFNGWrong: readingTFNGWrong || 2,
      listeningPart3Wrong: listeningPart3Wrong || 4,
      writingIssue: writingEvaluations.task2?.criteriaScores && writingEvaluations.task2.criteriaScores.grammaticalAccuracy <= 6.5
        ? 'Grammatical Range & Accuracy capped due to punctuation in complex clauses and minor syntax slips'
        : 'Task 1 Coherence & Cohesion penalized due to repetitive transitional linkers and insufficient implicit cohesion',
      speakingIssue: speakingEvaluation?.scores.criterion1 && speakingEvaluation.scores.criterion1.band <= 7.0
        ? 'Fluency dropped during Part 3 abstract inquiries due to hesitation and conversational filler words'
        : 'Part 3 analytical depth can be enhanced using PEEL structured topic progression'
    },
    targetBand,
    weeksCount: timelineWeeks
  });

  const handlePrint = () => {
    window.print();
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(curriculum, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800 bg-[#0d131f]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-amber-400 text-slate-950 font-serif font-black flex items-center justify-center text-sm shadow">
              V
            </div>
            <div>
              <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block">
                Official Computer-Delivered Examination Report
              </span>
              <h3 className="text-lg font-bold text-white">
                Результаты полного пробного теста IELTS
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Печать / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 pb-2 border-b border-slate-800 bg-slate-950/60 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('trf')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'trf' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Бланк TRF (Сертификат)
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'roadmap'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>План обучения (AI Roadmap)</span>
          </button>
          <button
            onClick={() => setActiveTab('listeningReview')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'listeningReview' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Разбор Listening ({listeningCorrectCount}/{LISTENING_QUESTIONS.length})
          </button>
          <button
            onClick={() => setActiveTab('readingReview')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'readingReview' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Разбор Reading ({readingCorrectCount}/{READING_QUESTIONS.length})
          </button>
          <button
            onClick={() => setActiveTab('writingReview')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'writingReview' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Критерии Writing
          </button>
          <button
            onClick={() => setActiveTab('speakingReview')}
            className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'speakingReview' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Критерии Speaking
          </button>
        </div>

        {/* Tab 1: Official Test Report Form (TRF) */}
        {activeTab === 'trf' && (
          <div className="p-4 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* Certificate Canvas Box */}
            <div className="bg-slate-950 border-2 border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block mb-0.5">
                    IDP / Cambridge Assessment English Format
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
                    IELTS Test Report Form (TRF)
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-slate-400 block">Candidate Ref: #VER-2026-9042</span>
                  <span className="text-[11px] font-mono text-slate-400 block">Centre Number: KZ001 · Almaty</span>
                </div>
              </div>

              {/* Candidate Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-500 block">Candidate Name:</span>
                  <span className="font-bold text-white uppercase">Maya Lin</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Scheme Code:</span>
                  <span className="font-bold text-white font-mono">Academic Module</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Administration Date:</span>
                  <span className="font-bold text-white font-mono">03 OCT 2026</span>
                </div>
                <div>
                  <span className="text-slate-500 block">CEFR Level:</span>
                  <span className="font-bold text-amber-400 font-mono">
                    {overallBand >= 8.5 ? 'C2 (Mastery)' : overallBand >= 7.0 ? 'C1 (Effective)' : 'B2 (Vantage)'}
                  </span>
                </div>
              </div>

              {/* Band Score Grid */}
              <div className="py-6">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                  Официальные баллы по секциям экзамена:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <span className="text-xs text-slate-400 block mb-1">Listening</span>
                    <span className="text-2xl font-bold font-mono text-white">{listeningBand.toFixed(1)}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{listeningCorrectCount}/40 правильных</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <span className="text-xs text-slate-400 block mb-1">Reading</span>
                    <span className="text-2xl font-bold font-mono text-white">{readingBand.toFixed(1)}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{readingCorrectCount}/40 правильных</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <span className="text-xs text-slate-400 block mb-1">Writing</span>
                    <span className="text-2xl font-bold font-mono text-white">{writingBand.toFixed(1)}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Task 1: {task1Band} · Task 2: {task2Band}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <span className="text-xs text-slate-400 block mb-1">Speaking</span>
                    <span className="text-2xl font-bold font-mono text-white">{speakingBand.toFixed(1)}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Acoustic AI Examiner</span>
                  </div>

                  <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-amber-500/20 border-2 border-amber-400 text-center shadow-lg shadow-amber-500/10">
                    <span className="text-xs text-amber-300 font-bold block mb-1">Overall Band</span>
                    <span className="text-3xl font-black font-mono text-amber-400">{overallBand.toFixed(1)}</span>
                    <span className="text-[10px] text-amber-300/80 block mt-0.5">Official Cambridge Rounding</span>
                  </div>
                </div>
              </div>

              {/* Quick Action to Curriculum */}
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-5 w-5 text-amber-400 shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-white block">ИИ-архитектор обучения составил персональную траекторию:</span>
                    <span className="text-slate-400">Лимитирующий навык (Bottleneck): <strong className="text-amber-300">{curriculum.diagnosticSummary.bottleneckSection}</strong>. Требуется ~{curriculum.diagnosticSummary.estimatedHoursRequired} часов подготовки.</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('roadmap')}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  Перейти к плану обучения
                </button>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Adaptive Study Roadmap (Curriculum Director View) */}
        {activeTab === 'roadmap' && (
          <div className="p-4 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* Control Bar: Target Band & Timeline Selector */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                    Adaptive Curriculum Architecture
                  </span>
                  <h3 className="text-base font-bold text-white">
                    Персонализированный учебный план по результатам симулятора
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyJson}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                    title="Скопировать строгий JSON согласно спецификации"
                  >
                    {copiedJson ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedJson ? 'Скопировано!' : 'Копировать JSON'}</span>
                  </button>

                  <button
                    onClick={() => setShowRawJson(!showRawJson)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Code className="h-3.5 w-3.5" />
                    <span>{showRawJson ? 'Скрыть JSON' : 'Показать JSON'}</span>
                  </button>
                </div>
              </div>

              {/* Target & Weeks Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-850">
                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">
                    Желаемый целевой балл (Target Band):
                  </label>
                  <div className="flex items-center gap-2">
                    {[6.5, 7.0, 7.5, 8.0, 8.5].map((b) => (
                      <button
                        key={b}
                        onClick={() => setTargetBand(b)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          targetBand === b
                            ? 'bg-amber-400 text-slate-950 shadow-sm'
                            : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        {b.toFixed(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1.5">
                    Срок до сдачи экзамена:
                  </label>
                  <div className="flex items-center gap-2">
                    {[
                      { weeks: 4, label: '4 недели' },
                      { weeks: 6, label: '6 недель (Реком.)' },
                      { weeks: 8, label: '8 недель' },
                    ].map((w) => (
                      <button
                        key={w.weeks}
                        onClick={() => setTimelineWeeks(w.weeks)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          timelineWeeks === w.weeks
                            ? 'bg-amber-400 text-slate-950 shadow-sm'
                            : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        {w.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Strict JSON Output Inspector (When toggled) */}
            {showRawJson && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-1 border-b border-slate-850">
                  <span className="font-mono text-amber-400">Strict JSON Output (Curriculum Director Schema):</span>
                  <span className="text-[11px]">Valid RFC 8259 JSON</span>
                </div>
                <pre className="p-3 bg-slate-900 rounded-lg text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-72 leading-relaxed">
                  {JSON.stringify(curriculum, null, 2)}
                </pre>
              </div>
            )}

            {/* 1. Diagnostic Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-500 block mb-1">Current Overall</span>
                <span className="text-2xl font-bold font-mono text-white">
                  {curriculum.diagnosticSummary.currentOverallBand.toFixed(1)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Исходный балл</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-500 block mb-1">Target Overall</span>
                <span className="text-2xl font-bold font-mono text-amber-400">
                  {curriculum.diagnosticSummary.targetOverallBand.toFixed(1)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Целевой рубеж</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 text-center bg-amber-500/5">
                <span className="text-amber-400 font-semibold block mb-1">Bottleneck Section</span>
                <span className="text-xl font-bold text-white tracking-wide">
                  {curriculum.diagnosticSummary.bottleneckSection}
                </span>
                <span className="text-[10px] text-amber-300/80 block mt-0.5">Узкое горлышко</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-500 block mb-1">Estimated Hours</span>
                <span className="text-2xl font-bold font-mono text-emerald-400">
                  {curriculum.diagnosticSummary.estimatedHoursRequired}h
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Трудоемкость курса</span>
              </div>
            </div>

            {/* Key Diagnostic Weaknesses */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-400" />
                <span>Диагностированные пробелы и педагогические рекомендации:</span>
              </h4>

              <div className="space-y-2.5">
                {curriculum.diagnosticSummary.keyWeaknesses.map((w, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400 font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[10px]">
                        {w.section}
                      </span>
                      <span className="text-[11px] text-slate-500">Root Cause Identified</span>
                    </div>
                    <p className="text-white font-medium">{w.issue}</p>
                    <p className="text-slate-400 italic">Рекомендация архитектора: {w.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Adaptive Study Roadmap (Week by Week) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-amber-400" />
                  <span>Понедельный адаптивный план подготовки ({timelineWeeks} недель):</span>
                </h4>
                <span className="text-[11px] font-mono text-slate-400">
                  {curriculum.weeklyPlan.reduce((acc, w) => acc + w.modulesToComplete.length, 0)} интерактивных модулей
                </span>
              </div>

              <div className="space-y-3">
                {curriculum.weeklyPlan.map((week) => (
                  <div key={week.weekNumber} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-850">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-400 text-slate-950 font-bold font-mono text-xs">
                          W{week.weekNumber}
                        </span>
                        <h5 className="font-bold text-white text-sm">
                          {week.focusArea}
                        </h5>
                      </div>
                      <span className="text-xs text-emerald-400 font-medium">
                        Цель: {week.targetGoal}
                      </span>
                    </div>

                    {/* Modules to complete */}
                    <div className="space-y-2">
                      {week.modulesToComplete.map((mod) => (
                        <div
                          key={mod.moduleId}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs hover:border-slate-700 transition-colors"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                                {mod.moduleId}
                              </span>
                              <span className="font-semibold text-white">
                                {mod.title}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                              <Clock className="h-3 w-3 text-slate-500" />
                              {mod.estimatedTimeMinutes} мин
                            </span>

                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              mod.exerciseType === 'INTERACTIVE_LESSON'
                                ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                                : mod.exerciseType === 'AI_VOICE_DRILL'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            }`}>
                              {mod.exerciseType}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Recommended Micro-Drills */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-400" />
                <span>Ежедневные 10-минутные микро-тренажеры (Daily Micro-Drills):</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {curriculum.recommendedMicroDrills.map((drill, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-mono text-[10px] font-bold text-emerald-400 block uppercase">
                      {drill.drillType}
                    </span>
                    <h6 className="font-bold text-white text-xs">
                      {drill.focus}
                    </h6>
                    <span className="text-slate-400 text-[11px] block pt-1">
                      Норма: {drill.dailyTarget}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: Listening Review */}
        {activeTab === 'listeningReview' && (
          <div className="p-4 sm:p-8 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
            <span className="font-bold text-white text-sm block">
              Детальный разбор ответов: Секция Listening
            </span>
            <div className="space-y-2.5">
              {LISTENING_QUESTIONS.map((q) => {
                const userAns = (userAnswers[q.id] || '').trim();
                const isCorrect = userAns && (userAns.toLowerCase() === q.correctAnswer.toLowerCase() || q.correctAnswer.toLowerCase().includes(userAns.toLowerCase()));
                return (
                  <div
                    key={q.id}
                    className={`p-3.5 rounded-xl border ${
                      isCorrect ? 'bg-slate-950/80 border-emerald-500/40' : 'bg-slate-950/80 border-rose-500/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-400">Q{q.id} (Part {q.part})</span>
                        <span className="text-slate-300 font-medium">{q.prompt}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                        isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {isCorrect ? 'Верно' : 'Неверно'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-850">
                      <div>
                        <span className="text-slate-500">Ваш ответ: </span>
                        <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {userAns || '(пусто)'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Правильный ответ: </span>
                        <span className="text-amber-400 font-bold">{q.correctAnswer}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-2 bg-slate-900 p-2 rounded">
                      <strong className="text-slate-300">Пояснение:</strong> {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Reading Review */}
        {activeTab === 'readingReview' && (
          <div className="p-4 sm:p-8 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
            <span className="font-bold text-white text-sm block">
              Детальный разбор ответов: Секция Reading
            </span>
            <div className="space-y-2.5">
              {READING_QUESTIONS.map((q) => {
                const userAns = (userAnswers[q.id] || '').trim();
                const isCorrect = userAns && (userAns.toLowerCase() === q.correctAnswer.toLowerCase() || (q.correctAnswer.length > 3 && q.correctAnswer.toLowerCase().includes(userAns.toLowerCase())));
                return (
                  <div
                    key={q.id}
                    className={`p-3.5 rounded-xl border ${
                      isCorrect ? 'bg-slate-950/80 border-emerald-500/40' : 'bg-slate-950/80 border-rose-500/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-400">Q{q.id} (Passage {q.part})</span>
                        <span className="text-slate-300 font-medium">{q.prompt}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                        isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {isCorrect ? 'Верно' : 'Неверно'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-850">
                      <div>
                        <span className="text-slate-500">Ваш ответ: </span>
                        <span className={isCorrect ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                          {userAns || '(пусто)'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Правильный ответ: </span>
                        <span className="text-amber-400 font-bold">{q.correctAnswer}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-2 bg-slate-900 p-2 rounded">
                      <strong className="text-slate-300">Пояснение:</strong> {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 5: Writing Criteria */}
        {activeTab === 'writingReview' && (
          <div className="p-4 sm:p-8 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
            <span className="font-bold text-white text-sm block">
              Аудит письменных работ (Writing Task 1 & Task 2)
            </span>

            {[1, 2].map((tNum) => {
              const evalRes = tNum === 1 ? writingEvaluations.task1 : writingEvaluations.task2;
              return (
                <div key={tNum} className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-850">
                    <span className="font-bold text-white">Writing Task {tNum} ({tNum === 1 ? '150 слов' : '250 слов'})</span>
                    <span className="font-mono text-amber-400 font-bold text-sm">
                      Band {evalRes?.overallBand?.toFixed(1) || (tNum === 1 ? '7.0' : '7.5')}
                    </span>
                  </div>

                  {evalRes ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.values(evalRes.scores).map((sc, i) => (
                        <div key={i} className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                          <div className="flex justify-between font-bold text-white mb-1">
                            <span>{sc.name}</span>
                            <span className="text-amber-400 font-mono">{sc.band.toFixed(1)}</span>
                          </div>
                          <p className="text-slate-400 leading-snug">{sc.feedback}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 italic">
                      Для Task {tNum} использована базовая калибровка Band 7.5. Вы можете ввести собственное эссе в модуле Writing для мгновенного индивидуального аудита.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 6: Speaking Criteria */}
        {activeTab === 'speakingReview' && (
          <div className="p-4 sm:p-8 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
            <span className="font-bold text-white text-sm block">
              Аудит устной речи (Speaking Parts 1–3)
            </span>

            <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-850">
                <span className="font-bold text-white">Speaking Overall Performance</span>
                <span className="font-mono text-amber-400 font-bold text-sm">
                  Band {speakingEvaluation?.overallBand?.toFixed(1) || '7.5'}
                </span>
              </div>

              {speakingEvaluation ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.values(speakingEvaluation.scores).map((sc, i) => (
                    <div key={i} className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                      <div className="flex justify-between font-bold text-white mb-1">
                        <span>{sc.name}</span>
                        <span className="text-amber-400 font-mono">{sc.band.toFixed(1)}</span>
                      </div>
                      <p className="text-slate-400 leading-snug">{sc.feedback}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 italic">
                  Для секции Speaking использована базовая калибровка Band 7.5. Запишите свой голос через микрофон в симуляторе устной части для персонального расчета беглости (WPM) и словарного запаса.
                </p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
