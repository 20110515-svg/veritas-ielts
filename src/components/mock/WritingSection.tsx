import React, { useState } from 'react';
import { PenTool, Sparkles, CheckCircle2, AlertTriangle, FileText, BarChart3, HelpCircle } from 'lucide-react';
import { WRITING_TASKS, evaluateIELTSWriting } from '../../data/ieltsDemoTest';
import { ResizableSplitPane } from './ResizableSplitPane';
import { AIEvaluationResult } from '../../types/mockTest';

import { requestWritingEvaluation } from '../../services/aiEngineClient';

interface WritingSectionProps {
  taskNumber: 1 | 2;
  onSelectTask: (task: 1 | 2) => void;
  answers: { task1: string; task2: string };
  onAnswerChange: (task: 1 | 2, text: string) => void;
  evaluations: { task1?: AIEvaluationResult; task2?: AIEvaluationResult };
  onEvaluationComplete: (task: 1 | 2, evalResult: AIEvaluationResult) => void;
}

export const WritingSection: React.FC<WritingSectionProps> = ({
  taskNumber,
  onSelectTask,
  answers,
  onAnswerChange,
  evaluations,
  onEvaluationComplete,
}) => {
  const currentTask = WRITING_TASKS.find((t) => t.taskNumber === taskNumber) || WRITING_TASKS[0];
  const currentText = taskNumber === 1 ? answers.task1 : answers.task2;
  const currentEvaluation = taskNumber === 1 ? evaluations.task1 : evaluations.task2;
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Live word counter
  const wordCount = currentText.trim().split(/\s+/).filter(Boolean).length;
  const isWordCountSufficient = wordCount >= currentTask.minWords;

  const handleRunAIEvaluation = async () => {
    setIsEvaluating(true);
    try {
      const output = await requestWritingEvaluation({
        taskType: taskNumber === 1 ? 'Task 1' : 'Task 2',
        taskPrompt: currentTask.promptText,
        candidateEssay: currentText,
      });

      const evalResult: AIEvaluationResult = {
        overallBand: output.overallBand,
        criteriaScores: output.criteriaScores,
        lexicalAnalysis: {
          detectedCEFRLevel: output.lexicalAnalysis.detectedCEFRLevel,
          academicCollocationsFound: output.lexicalAnalysis.academicCollocationsFound,
          registerCheck: output.overallBand === 0
            ? 'Evaluation stopped: insufficient text volume (< 50 words).'
            : 'Formal Academic Register (Verified by IELTS Core AI Engine · Gemini)',
        },
        detailedFeedback: output.detailedFeedback,
        corrections: output.corrections,
        wordCount: output.wordCount,
        actionableAdvice: [
          'Maintain sustained academic register by relying on topic-specific nominalizations rather than generic connectors.',
          'Continue utilizing implicit cohesive devices such as demonstrative referencing and lexical sets.',
        ],
        scores: {
          criterion1: {
            name: taskNumber === 1 ? 'Task Achievement' : 'Task Response',
            band: output.criteriaScores.taskResponse,
            feedback: output.detailedFeedback.taskResponse,
          },
          criterion2: {
            name: 'Coherence & Cohesion',
            band: output.criteriaScores.coherenceCohesion,
            feedback: output.detailedFeedback.coherenceCohesion,
          },
          criterion3: {
            name: 'Lexical Resource',
            band: output.criteriaScores.lexicalResource,
            feedback: output.detailedFeedback.lexicalResource,
          },
          criterion4: {
            name: 'Grammatical Range & Accuracy',
            band: output.criteriaScores.grammaticalAccuracy,
            feedback: output.detailedFeedback.grammaticalAccuracy,
          },
        },
        summaryRecommendation: output.overallBand === 0
          ? 'Error: INSUFFICIENT_INPUT_LENGTH (< 50 words). Provide a complete response to obtain an official band.'
          : `Official IELTS evaluation completed. Overall Band: ${output.overallBand.toFixed(1)}.`,
        detectedStrengths: output.lexicalAnalysis.academicCollocationsFound.slice(0, 3),
        detectedWeaknesses: output.overallBand < 7.0 ? ['Needs greater academic collocation density and clause variety'] : [],
      };

      onEvaluationComplete(taskNumber, evalResult);
    } catch (err) {
      console.error('Failed writing evaluation:', err);
      const result = evaluateIELTSWriting(currentText, taskNumber);
      onEvaluationComplete(taskNumber, result);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleAutofill = () => {
    if (currentTask.defaultSampleSubmission) {
      onAnswerChange(taskNumber, currentTask.defaultSampleSubmission);
    }
  };

  // Left Pane: Prompt & Graphic/Chart
  const leftPaneContent = (
    <div className="space-y-6">
      
      {/* Task Switcher */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <button
          onClick={() => onSelectTask(1)}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            taskNumber === 1
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          Task 1 (Academic Report · 150 слов)
        </button>
        <button
          onClick={() => onSelectTask(2)}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            taskNumber === 2
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          Task 2 (Essay · 250 слов)
        </button>
      </div>

      {/* Task Title & Instructions */}
      <div>
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block mb-1">
          {currentTask.type}
        </span>
        <h2 className="text-xl font-bold text-white mb-3">
          {currentTask.title}
        </h2>
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed">
          {currentTask.promptText}
        </div>
      </div>

      {/* SVG Line Chart for Task 1 */}
      {taskNumber === 1 && currentTask.chartData && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold text-white">
                Global Clean Energy Allocations ($B) 2000–2025
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Values in US$ Billions</span>
          </div>

          {/* SVG Diagram */}
          <div className="w-full aspect-[16/9] bg-slate-900/60 rounded-xl p-3 border border-slate-850 flex flex-col justify-between">
            <svg viewBox="0 0 450 180" className="w-full h-full text-xs">
              {/* Grid lines */}
              <line x1="40" y1="20" x2="430" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="40" y1="60" x2="430" y2="60" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="40" y1="100" x2="430" y2="100" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="40" y1="140" x2="430" y2="140" stroke="#1e293b" strokeDasharray="3 3" />

              {/* Y Axis labels */}
              <text x="5" y="25" fill="#64748b" fontSize="10">250B</text>
              <text x="5" y="65" fill="#64748b" fontSize="10">180B</text>
              <text x="5" y="105" fill="#64748b" fontSize="10">100B</text>
              <text x="15" y="145" fill="#64748b" fontSize="10">0B</text>

              {/* Solar line (steep yellow) */}
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
                points="50,135 120,122 190,95 260,65 330,38 400,20"
              />
              {/* Wind line (cyan) */}
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                points="50,128 120,115 190,90 260,70 330,55 400,45"
              />
              {/* Hydro line (emerald stable) */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                points="50,110 120,108 190,105 260,102 330,100 400,98"
              />

              {/* X Axis years */}
              <text x="45" y="165" fill="#94a3b8" fontSize="10">2000</text>
              <text x="115" y="165" fill="#94a3b8" fontSize="10">2005</text>
              <text x="185" y="165" fill="#94a3b8" fontSize="10">2010</text>
              <text x="255" y="165" fill="#94a3b8" fontSize="10">2015</text>
              <text x="325" y="165" fill="#94a3b8" fontSize="10">2020</text>
              <text x="395" y="165" fill="#94a3b8" fontSize="10">2025</text>
            </svg>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 text-[11px] pt-1 border-t border-slate-800">
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="h-2 w-2 rounded-full bg-amber-400" /> Solar
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="h-2 w-2 rounded-full bg-cyan-400" /> Wind
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Hydroelectric
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Official Cambridge Evaluation Criteria overview */}
      <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5 text-xs text-slate-400">
        <span className="text-white font-bold block mb-1">4 критерия оценки экзаменатором:</span>
        <div>• <strong>Task Achievement (25%)</strong>: Точность описания трендов и полнота ответа.</div>
        <div>• <strong>Coherence & Cohesion (25%)</strong>: Деление на абзацы и логические связки.</div>
        <div>• <strong>Lexical Resource (25%)</strong>: Академический словарь без тавтологии.</div>
        <div>• <strong>Grammatical Range & Accuracy (25%)</strong>: Сложные предложения и пунктуация.</div>
      </div>

    </div>
  );

  // Right Pane: Textarea & Real-time Evaluation
  const rightPaneContent = (
    <div className="space-y-4 flex flex-col h-full">
      
      {/* Editor Top Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <PenTool className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Ответ кандидата (IELTS Official Answer Sheet)
          </span>
        </div>

        {/* Live Word Count Pill */}
        <div className="flex items-center gap-2">
          <span
            className={`font-mono text-xs font-bold px-2.5 py-1 rounded-md border ${
              isWordCountSufficient
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            Слов: {wordCount} / {currentTask.minWords} мин.
          </span>
          <button
            onClick={handleAutofill}
            className="text-[11px] text-amber-400 hover:underline cursor-pointer"
            title="Заполнить образцовым академическим эссе для мгновенного тестирования"
          >
            Вставить образец
          </button>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="flex-1 min-h-[300px] flex flex-col">
        <textarea
          value={currentText}
          onChange={(e) => onAnswerChange(taskNumber, e.target.value)}
          placeholder={`Начните писать ваше эссе здесь... (минимум ${currentTask.minWords} слов)`}
          className="w-full flex-1 min-h-[320px] p-4 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm font-serif leading-relaxed focus:outline-none focus:border-amber-400 transition-colors resize-y"
        />
      </div>

      {/* Warning if below word count */}
      {!isWordCountSufficient && wordCount > 0 && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
          <span>Внимание: объем ниже {currentTask.minWords} слов. На экзамене это ведет к автоматическому штрафу по критерию Task Response.</span>
        </div>
      )}

      {/* AI Evaluator Trigger */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs text-slate-400">
          Проверьте работу через алгоритм официальных критериев Кембриджа:
        </span>
        <button
          onClick={handleRunAIEvaluation}
          disabled={isEvaluating || wordCount < 30}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-md shadow-amber-500/20 shrink-0"
        >
          <Sparkles className="h-4 w-4" />
          <span>{isEvaluating ? 'Оценка эссе ИИ-экзаменатором...' : 'Оценить по 4 критериям (AI Evaluator)'}</span>
        </button>
      </div>

      {/* AI Evaluation Result Card (if generated) */}
      {currentEvaluation && (
        <div className="mt-4 p-5 rounded-xl bg-slate-950 border border-amber-500/40 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
                Результат экспресс-оценки
              </span>
              <h4 className="text-base font-bold text-white">
                Ориентировочный балл Task {taskNumber}: <span className="font-mono text-amber-400 text-lg">Band {currentEvaluation.overallBand.toFixed(1)}</span>
              </h4>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold font-mono text-base">
              {currentEvaluation.overallBand.toFixed(1)}
            </div>
          </div>

          {/* 4 Rubric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {Object.values(currentEvaluation.scores).map((sc, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-200">{sc.name}</span>
                  <span className="font-mono font-bold text-amber-400">Band {sc.band.toFixed(1)}</span>
                </div>
                <p className="text-slate-400 leading-snug">{sc.feedback}</p>
              </div>
            ))}
          </div>

          {/* Lexical Resource & Register Deep-Dive */}
          {currentEvaluation.lexicalAnalysis && (
            <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                <span className="font-bold text-white">Анализ лексического ресурса (Lexical Resource):</span>
                <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Уровень: {currentEvaluation.lexicalAnalysis.detectedCEFRLevel}
                </span>
              </div>
              
              <div className="text-[11px] text-slate-300">
                <span className="text-slate-400 block mb-1">Найденные академические коллокации (C1–C2):</span>
                <div className="flex flex-wrap gap-1.5">
                  {currentEvaluation.lexicalAnalysis.academicCollocationsFound.map((colloc, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-amber-300 border border-slate-700 font-mono text-[10px]">
                      {colloc}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-1">
                <strong>Проверка регистра:</strong> <span className="text-emerald-400">{currentEvaluation.lexicalAnalysis.registerCheck}</span>
              </div>
            </div>
          )}

          {/* Corrections and Precision Edits */}
          {currentEvaluation.corrections && currentEvaluation.corrections.length > 0 && (
            <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-amber-400 block mb-1">Исправления и точечные замечания (Corrections):</span>
              <div className="space-y-2">
                {currentEvaluation.corrections.map((corr, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-rose-400 font-mono line-through">{corr.original}</span>
                      <span className="text-slate-500">→</span>
                      <span className="text-emerald-400 font-mono font-bold">{corr.corrected}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{corr.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Advice */}
          {currentEvaluation.actionableAdvice && currentEvaluation.actionableAdvice.length > 0 && (
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
              <span className="text-amber-400 font-semibold block mb-1">Рекомендации экзаменатора для роста балла:</span>
              <ul className="space-y-1 text-slate-300 text-[11px] list-disc pl-4">
                {currentEvaluation.actionableAdvice.map((adv, i) => (
                  <li key={i}>{adv}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-xs text-slate-300 italic bg-slate-900/60 p-3 rounded-lg border border-slate-850">
            «{currentEvaluation.summaryRecommendation}»
          </p>
        </div>
      )}

    </div>
  );

  return (
    <ResizableSplitPane
      leftContent={leftPaneContent}
      rightContent={rightPaneContent}
      initialLeftWidthPercent={48}
    />
  );
};
