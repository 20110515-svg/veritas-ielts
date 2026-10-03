import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Palette, 
  Layout, 
  Magnet, 
  Cpu, 
  Code, 
  Play, 
  Copy, 
  Check, 
  Layers, 
  ShieldCheck, 
  AlertTriangle,
  FileText
} from 'lucide-react';
import { 
  requestWritingEvaluation, 
  requestSpeakingEvaluation, 
  requestDiagnosticPlanner 
} from '../services/aiEngineClient';

interface DesignConceptDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesignConceptDrawer: React.FC<DesignConceptDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'aiEngine' | 'designPassport'>('aiEngine');
  
  // AI Engine Console state
  const [engineMode, setEngineMode] = useState<'writing' | 'speaking' | 'diagnostic'>('writing');
  const [selectedModel, setSelectedModel] = useState<'gemini-2.5-flash' | 'gemini-2.5-pro'>('gemini-2.5-flash');
  
  // Writing mode inputs
  const [writingTaskType, setWritingTaskType] = useState<'Task 1' | 'Task 2'>('Task 2');
  const [writingPrompt, setWritingPrompt] = useState(
    'Some people believe that unpaid community service should be a compulsory part of high school programmes. To what extent do you agree or disagree?'
  );
  const [writingEssay, setWritingEssay] = useState(
    'It is increasingly argued that mandatory community service should be integrated into secondary school curricula. I firmly endorse this proposition, as philanthropic involvement not only cultivates civic responsibility among adolescents but also equips them with transferable competencies that foster holistic personal development.\n\nPrimarily, mandating social initiatives instills a robust sense of altruism. When adolescents engage in assisting vulnerable demographics or participating in environmental remediation, they develop empathy and socio-economic awareness that conventional academic instruction seldom provides. Furthermore, far from being a burdensome diversion, structured community engagement acts as a practical incubator for essential soft skills, including crisis management and team collaboration, both of which are pivotal for tertiary education.'
  );

  // Speaking mode inputs
  const [speakingPart, setSpeakingPart] = useState<'Part 1' | 'Part 2' | 'Part 3'>('Part 2');
  const [speakingQuestion, setSpeakingQuestion] = useState('Describe a difficult challenge you met and overcame.');
  const [speakingTranscript, setSpeakingTranscript] = useState(
    'I would like to describe an ambitious academic endeavor I completed last year, which was designing a centralized solar-powered water filtration prototype for an engineering competition. The foremost obstacle was managing supply shortages and balancing rigorous algorithmic modeling with hardware fabrication. By establishing a rigid agile workflow and consulting university mentors, we succeeded in testing the system, and receiving the first prize was an extraordinarily fulfilling milestone.'
  );

  // Diagnostic mode inputs
  const [diagnosticTargetBand, setDiagnosticTargetBand] = useState<number>(7.5);
  const [diagnosticScores, setDiagnosticScores] = useState({
    listening: 7.0,
    reading: 6.5,
    writing: 6.0,
    speaking: 6.5,
    overall: 6.5,
  });

  // Output state
  const [isRunning, setIsRunning] = useState(false);
  const [jsonOutput, setJsonOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleRunWritingTest = async () => {
    setIsRunning(true);
    setJsonOutput(null);
    try {
      const res = await requestWritingEvaluation({
        taskType: writingTaskType,
        taskPrompt: writingPrompt,
        candidateEssay: writingEssay,
        model: selectedModel,
      });
      setJsonOutput(JSON.stringify(res, null, 2));
    } catch (err: any) {
      setJsonOutput(JSON.stringify({ error: 'EXECUTION_FAILED', details: err.message }, null, 2));
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunSpeakingTest = async () => {
    setIsRunning(true);
    setJsonOutput(null);
    try {
      const res = await requestSpeakingEvaluation({
        part: speakingPart,
        targetQuestion: speakingQuestion,
        candidateTranscript: speakingTranscript,
        model: selectedModel,
      });
      setJsonOutput(JSON.stringify(res, null, 2));
    } catch (err: any) {
      setJsonOutput(JSON.stringify({ error: 'EXECUTION_FAILED', details: err.message }, null, 2));
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunDiagnosticTest = async () => {
    setIsRunning(true);
    setJsonOutput(null);
    try {
      const res = await requestDiagnosticPlanner({
        targetOverallBand: diagnosticTargetBand,
        currentScores: diagnosticScores,
        errorBreakdown: {
          readingHeadingsWrong: 5,
          readingTFNGWrong: 2,
          listeningPart3Wrong: 4,
          writingIssue: 'Task 1 Coherence & Cohesion penalized due to repetitive transitional linkers',
          speakingIssue: 'Fluency dropped during Part 3 abstract questions due to filler words',
        },
        weeksCount: 6,
        model: selectedModel,
      });
      setJsonOutput(JSON.stringify(res, null, 2));
    } catch (err: any) {
      setJsonOutput(JSON.stringify({ error: 'EXECUTION_FAILED', details: err.message }, null, 2));
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    if (jsonOutput) {
      navigator.clipboard.writeText(jsonOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const setUnder50WordsSample = () => {
    setWritingEssay('I think school community service is good for all young people because they can help people and learn things.');
  };

  const setBand9Sample = () => {
    setWritingEssay(
      'It is increasingly argued that mandatory community service should be integrated into secondary school curricula. I firmly endorse this proposition, as philanthropic involvement not only cultivates civic responsibility among adolescents but also equips them with transferable competencies that foster holistic personal development.\n\nPrimarily, mandating social initiatives instills a robust sense of altruism. When adolescents engage in assisting vulnerable demographics or participating in environmental remediation, they develop empathy and socio-economic awareness that conventional academic instruction seldom provides. Furthermore, far from being a burdensome diversion, structured community engagement acts as a practical incubator for essential soft skills, including crisis management and team collaboration, both of which are pivotal for tertiary education.'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-slate-900 border-l border-slate-700 h-full overflow-y-auto p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
        
        <div className="space-y-6">
          {/* Top Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
                <Cpu className="h-4 w-4" />
                <span>IELTS Core AI Engine & Architecture Console</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                VERITAS IELTS Autonomous System
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Main Top Navigation Tabs */}
          <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('aiEngine')}
              className={`flex-1 py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'aiEngine'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="h-4 w-4" />
              <span>IELTS Core AI Engine (Live Console)</span>
            </button>
            <button
              onClick={() => setActiveTab('designPassport')}
              className={`flex-1 py-2 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'designPassport'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="h-4 w-4" />
              <span>UX/UI Паспорт и Методология</span>
            </button>
          </div>

          {/* TAB 1: AI ENGINE LIVE CONSOLE */}
          {activeTab === 'aiEngine' && (
            <div className="space-y-6">
              
              {/* Engine Identity & Specification Card */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                    <span className="font-bold text-white">System Identity: "IELTS Core AI Engine"</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-amber-300">
                    <span>Powered by Google Gemini API</span>
                    <span>(Temp: 0.1 · Deterministic)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[11px] text-slate-400">
                  <div>• <strong>100% Autonomous</strong>: Zero human tutors, zero phone booking calls.</div>
                  <div>• <strong>Academic Register</strong>: Informal idioms strictly forbidden. C1-C2 collocations rewarded.</div>
                  <div>• <strong>Official Rubrics</strong>: Band 0.0 - 9.0 in half-band increments. Error &lt; 50w fallback.</div>
                </div>
              </div>

              {/* Mode & Model Selector Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                
                {/* 3 Modes */}
                <div className="inline-flex p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                  <button
                    onClick={() => { setEngineMode('writing'); setJsonOutput(null); }}
                    className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                      engineMode === 'writing' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    WRITING_EVALUATOR
                  </button>
                  <button
                    onClick={() => { setEngineMode('speaking'); setJsonOutput(null); }}
                    className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                      engineMode === 'speaking' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    SPEAKING_EVALUATOR
                  </button>
                  <button
                    onClick={() => { setEngineMode('diagnostic'); setJsonOutput(null); }}
                    className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                      engineMode === 'diagnostic' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    DIAGNOSTIC_PLANNER
                  </button>
                </div>

                {/* Model Selector */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-mono">Model:</span>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value as any)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 font-mono text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="gemini-2.5-flash">gemini-2.5-flash (Fast & Accurate)</option>
                    <option value="gemini-2.5-pro">gemini-2.5-pro (Deep Reasoning)</option>
                  </select>
                </div>
              </div>

              {/* MODE 1: WRITING EVALUATOR CONTROLS */}
              {engineMode === 'writing' && (
                <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      [MODE: WRITING_EVALUATOR] Input Parameters
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={setBand9Sample}
                        className="text-[11px] text-amber-300 hover:underline cursor-pointer"
                      >
                        Тест Band 8.5
                      </button>
                      <span className="text-slate-600">·</span>
                      <button
                        onClick={setUnder50WordsSample}
                        className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                        title="Тест ошибки INSUFFICIENT_INPUT_LENGTH (< 50 слов)"
                      >
                        Тест &lt; 50 слов (Error)
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Task Type</label>
                      <select
                        value={writingTaskType}
                        onChange={(e) => setWritingTaskType(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                      >
                        <option value="Task 1">Task 1 (Report · 150w)</option>
                        <option value="Task 2">Task 2 (Essay · 250w)</option>
                      </select>
                    </div>
                    <div className="sm:col-span-3">
                      <label className="text-[11px] text-slate-400 block mb-1">Task Prompt</label>
                      <input
                        type="text"
                        value={writingPrompt}
                        onChange={(e) => setWritingPrompt(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] text-slate-400">Candidate Essay Text</label>
                      <span className="text-[11px] font-mono text-slate-400">
                        Слов: {writingEssay.trim().split(/\s+/).filter(Boolean).length}
                      </span>
                    </div>
                    <textarea
                      rows={5}
                      value={writingEssay}
                      onChange={(e) => setWritingEssay(e.target.value)}
                      className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-xs font-serif text-slate-200 leading-relaxed focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    onClick={handleRunWritingTest}
                    disabled={isRunning}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>{isRunning ? 'Оценка эссе ИИ-движком...' : 'Запустить оценку [MODE: WRITING_EVALUATOR]'}</span>
                  </button>
                </div>
              )}

              {/* MODE 2: SPEAKING EVALUATOR CONTROLS */}
              {engineMode === 'speaking' && (
                <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      [MODE: SPEAKING_EVALUATOR] Input Parameters
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Part</label>
                      <select
                        value={speakingPart}
                        onChange={(e) => setSpeakingPart(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                      >
                        <option value="Part 1">Part 1 (Intro)</option>
                        <option value="Part 2">Part 2 (Cue Card)</option>
                        <option value="Part 3">Part 3 (Discussion)</option>
                      </select>
                    </div>
                    <div className="sm:col-span-3">
                      <label className="text-[11px] text-slate-400 block mb-1">Target Question</label>
                      <input
                        type="text"
                        value={speakingQuestion}
                        onChange={(e) => setSpeakingQuestion(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Candidate Speech Transcript</label>
                    <textarea
                      rows={4}
                      value={speakingTranscript}
                      onChange={(e) => setSpeakingTranscript(e.target.value)}
                      className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 text-xs font-serif text-slate-200 leading-relaxed focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    onClick={handleRunSpeakingTest}
                    disabled={isRunning}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>{isRunning ? 'Акустический аудит речи...' : 'Запустить оценку [MODE: SPEAKING_EVALUATOR]'}</span>
                  </button>
                </div>
              )}

              {/* MODE 3: DIAGNOSTIC LEARNING PLANNER */}
              {engineMode === 'diagnostic' && (
                <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                    [MODE: DIAGNOSTIC_LEARNING_PLANNER] Test Results
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block">Listening</label>
                      <input
                        type="number"
                        step="0.5"
                        value={diagnosticScores.listening}
                        onChange={(e) => setDiagnosticScores({ ...diagnosticScores, listening: parseFloat(e.target.value) || 0 })}
                        className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block">Reading</label>
                      <input
                        type="number"
                        step="0.5"
                        value={diagnosticScores.reading}
                        onChange={(e) => setDiagnosticScores({ ...diagnosticScores, reading: parseFloat(e.target.value) || 0 })}
                        className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block">Writing</label>
                      <input
                        type="number"
                        step="0.5"
                        value={diagnosticScores.writing}
                        onChange={(e) => setDiagnosticScores({ ...diagnosticScores, writing: parseFloat(e.target.value) || 0 })}
                        className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block">Speaking</label>
                      <input
                        type="number"
                        step="0.5"
                        value={diagnosticScores.speaking}
                        onChange={(e) => setDiagnosticScores({ ...diagnosticScores, speaking: parseFloat(e.target.value) || 0 })}
                        className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-amber-400 font-bold block">Target Band</label>
                      <input
                        type="number"
                        step="0.5"
                        value={diagnosticTargetBand}
                        onChange={(e) => setDiagnosticTargetBand(parseFloat(e.target.value) || 7.5)}
                        className="w-full p-2 rounded bg-slate-900 border border-amber-500/50 text-amber-300 font-mono font-bold"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleRunDiagnosticTest}
                    disabled={isRunning}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>{isRunning ? 'Построение адаптивного роадмапа...' : 'Сформировать учебный план [MODE: DIAGNOSTIC_LEARNING_PLANNER]'}</span>
                  </button>
                </div>
              )}

              {/* JSON Output Display */}
              {jsonOutput && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Code className="h-3.5 w-3.5" />
                      Raw JSON Response (Matching Schema):
                    </span>
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copied ? 'Скопировано!' : 'Копировать JSON'}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 leading-relaxed overflow-x-auto max-h-[380px] shadow-inner selection:bg-emerald-500/30">
                    {jsonOutput}
                  </pre>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: UX/UI ДИЗАЙН И МЕТОДОЛОГИЯ */}
          {activeTab === 'designPassport' && (
            <div className="space-y-6">
              
              {/* 1. Visual/UX Recommendations & Trust Factors */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-base font-bold text-white">
                  <Palette className="h-5 w-5 text-amber-400" />
                  <span>1. Рекомендации по Visual/UX дизайну и триггерам доверия</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                    <strong className="text-white block mb-1.5 font-semibold">
                      Цветовая система (60-30-10):
                    </strong>
                    <ul className="space-y-1 text-slate-300 text-xs">
                      <li><span className="text-amber-400 font-mono">60% Фоновый холст</span>: Глубокий благородный темно-синий (#0b0f17 / #0d131f). Вызывает ассоциации с британскими академическими библиотеками.</li>
                      <li><span className="text-amber-400 font-mono">30% Структурные поверхности</span>: Карточки из темно-графитового сланца (#131b2a) с тонкими волосяными границами (1px hairline slate-800).</li>
                      <li><span className="text-amber-400 font-mono">10% Акцентный бюджет</span>: Оксфордский академический янтарь (#f59e0b / #fbbf24) для фокусных CTA + изумруд (#10b981) для TRF.</li>
                    </ul>
                  </div>

                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                    <strong className="text-white block mb-1.5 font-semibold">
                      Типографика и Анти-AI Slop:
                    </strong>
                    <ul className="space-y-1 text-slate-300 text-xs">
                      <li><strong className="text-white">Шрифтовая пара</strong>: Plus Jakarta Sans (высокая читаемость на экранах) + Source Serif 4 для эссе и бланков.</li>
                      <li><strong className="text-white">Zero-Pill дисциплина</strong>: Метаданные оформляются «голым» текстом с типографическими разделителями (·).</li>
                      <li><strong className="text-white">Моноширинные цифры</strong>: Все баллы (6.5, 7.5, 8.5) и таймеры сверстаны с `font-mono tabular-nums`.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2. 3 Lead Magnets Breakdown */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2 text-base font-bold text-white">
                  <Magnet className="h-5 w-5 text-amber-400" />
                  <span>2. Три идеи лид-магнитов для максимальной конверсии</span>
                </div>

                <div className="space-y-3">
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-amber-400">Лид-магнит №1: «Writing Band 7.5+ Master-Cheat-Sheet»</span>
                      <span className="text-[11px] font-mono text-slate-400">Формат: PDF (28 стр)</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      40 академических связок, формулы Overview для графиков и 5 готовых архитектур эссе. 1-клик скачивание прямо в браузере.
                    </p>
                  </div>

                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-amber-400">Лид-магнит №2: «Speaking Part 2 & 3: 15 универсальных конструкций»</span>
                      <span className="text-[11px] font-mono text-slate-400">Формат: Интерактивные карточки</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Универсальный скелет рассказа ровно на 120 секунд без затяжных пауз и слов-паразитов.
                    </p>
                  </div>

                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-amber-400">Лид-магнит №3: «IELTS 2026 Roadmap: Пошаговый план на 8 недель»</span>
                      <span className="text-[11px] font-mono text-slate-400">Формат: Интерактивный дашборд</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Матрица закрытия узких мест и понедельный трекинг баллов в интерактивном симуляторе.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Conversion Architecture & Copywriting Structure */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2 text-base font-bold text-white">
                  <Layout className="h-5 w-5 text-amber-400" />
                  <span>3. Логика конверсионной структуры лендинга</span>
                </div>

                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs sm:text-sm space-y-2 text-slate-300">
                  <p>
                    Лендинг построен по формуле <strong>Proposition → Mechanism → Proof → Conversion</strong>:
                  </p>
                  <ol className="list-decimal pl-4 space-y-1.5 text-xs">
                    <li><strong>Hero</strong>: Мгновенный ИИ-аудит за 3 секунды, 100% самостоятельная подготовка без репетиторов и звонков.</li>
                    <li><strong>Сегментация</strong>: Выбор между Academic и General и определение текущего уровня (B1, B2, C1).</li>
                    <li><strong>Калькулятор & Тест</strong>: Интерактивный расчет требуемых часов и экспресс-скрининг уровня.</li>
                    <li><strong>4 Модуля & Интерактивное эссе</strong>: Разбор официальных критериев и сравнительный анализ эссе 6.0 vs 8.0.</li>
                    <li><strong>Тарифы</strong>: Прямой SaaS-доступ в браузере (Free Diagnostic, Pro Platform Pass, Unlimited AI Pass) без звонков и скрытых доплат.</li>
                    <li><strong>ИИ-Стек & Кейсы</strong>: 4 автономных модуля (Cambridge NLP Engine, Acoustic Speech Analyzer, CD-IELTS Core, Adaptive Error-Pattern Engine) + верифицированные номера TRF.</li>
                    <li><strong>FAQ & Финальный захват</strong>: Закрытие всех сомнений по поводу точности ИИ и мгновенный запуск практики прямо в браузере.</li>
                  </ol>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Return Button */}
        <div className="pt-6 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
          >
            Вернуться к платформе
          </button>
        </div>

      </div>
    </div>
  );
};
