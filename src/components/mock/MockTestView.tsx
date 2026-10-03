import React, { useState, useEffect } from 'react';
import { SectionType, HighlightItem, AIEvaluationResult } from '../../types/mockTest';
import { MockTestHeader } from './MockTestHeader';
import { MockQuestionNav } from './MockQuestionNav';
import { ListeningSection } from './ListeningSection';
import { ReadingSection } from './ReadingSection';
import { WritingSection } from './WritingSection';
import { SpeakingSection } from './SpeakingSection';
import { ScoreReportModal } from './ScoreReportModal';
import { ArchitectureModal } from './ArchitectureModal';
import { AriaTutorDrawer } from '../AriaTutorDrawer';
import { 
  LISTENING_QUESTIONS, 
  READING_QUESTIONS, 
  WRITING_TASKS, 
  SPEAKING_PARTS 
} from '../../data/ieltsDemoTest';
import { CheckCircle2, Headphones, Play, ArrowRight } from 'lucide-react';

interface MockTestViewProps {
  onExit: () => void;
}

export const MockTestView: React.FC<MockTestViewProps> = ({ onExit }) => {
  // Test Lifecycle States: 'intro' | 'testing' | 'report'
  const [testStage, setTestStage] = useState<'intro' | 'testing' | 'report'>('intro');
  const [selectedExamType, setSelectedExamType] = useState<'academic' | 'general'>('academic');

  // Active section & Part state
  const [currentSection, setCurrentSection] = useState<SectionType>('listening');
  const [currentPart, setCurrentPart] = useState<number>(1);
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(1);

  // Time remaining per section (in seconds)
  // Listening: 30 min (1800s), Reading: 60 min (3600s), Writing: 60 min (3600s), Speaking: 14 min (840s)
  const [timeRemaining, setTimeRemaining] = useState<Record<SectionType, number>>({
    listening: 1800,
    reading: 3600,
    writing: 3600,
    speaking: 840,
  });

  // User input states
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({
    // Preload some default answers so user can immediately see progress if desired
    1: '8492',
    2: 'B',
  });
  const [flaggedForReview, setFlaggedForReview] = useState<Record<number, boolean>>({});
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);

  // Writing state
  const [activeWritingTask, setActiveWritingTask] = useState<1 | 2>(1);
  const [writingAnswers, setWritingAnswers] = useState<{ task1: string; task2: string }>({
    task1: WRITING_TASKS[0].defaultSampleSubmission || '',
    task2: '',
  });
  const [writingEvaluations, setWritingEvaluations] = useState<{
    task1?: AIEvaluationResult;
    task2?: AIEvaluationResult;
  }>({});

  // Speaking state
  const [speakingTranscripts, setSpeakingTranscripts] = useState<{
    part1: string[];
    part2: string;
    part3: string[];
  }>({
    part1: [],
    part2: '',
    part3: [],
  });
  const [speakingEvaluation, setSpeakingEvaluation] = useState<AIEvaluationResult | undefined>();

  // Modals
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isAriaOpen, setIsAriaOpen] = useState(false);

  // Active countdown timer
  useEffect(() => {
    if (testStage !== 'testing') return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const currentSecTime = prev[currentSection];
        if (currentSecTime <= 1) {
          // Auto advance or finish
          handleSectionTimeExpiry();
          return { ...prev, [currentSection]: 0 };
        }
        return { ...prev, [currentSection]: currentSecTime - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStage, currentSection]);

  const handleSectionTimeExpiry = () => {
    if (currentSection === 'listening') {
      setCurrentSection('reading');
      setCurrentPart(1);
      setCurrentQuestionId(1);
    } else if (currentSection === 'reading') {
      setCurrentSection('writing');
      setCurrentPart(1);
    } else if (currentSection === 'writing') {
      setCurrentSection('speaking');
      setCurrentPart(1);
    } else {
      setIsReportOpen(true);
    }
  };

  // Section Switching handler
  const handleSelectSection = (sec: SectionType) => {
    setCurrentSection(sec);
    setCurrentPart(1);
    if (sec === 'listening' || sec === 'reading') {
      setCurrentQuestionId(1);
    }
  };

  // Answer handler
  const handleAnswerChange = (qId: number, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: answer }));
  };

  // Flag for review toggle
  const handleToggleReview = (qId: number) => {
    setFlaggedForReview((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  // Navigation: Next / Prev Question
  const handleSelectQuestion = (id: number) => {
    setCurrentQuestionId(id);
    const ranges = currentSection === 'listening' ? listeningRanges : readingRanges;
    const match = ranges.find((r) => id >= r.start && id <= r.end);
    if (match && match.part !== currentPart) {
      setCurrentPart(match.part);
    }
  };

  const handleSelectPart = (partNum: number) => {
    setCurrentPart(partNum);
    const ranges = currentSection === 'listening' ? listeningRanges : readingRanges;
    const match = ranges.find((r) => r.part === partNum);
    if (match) {
      setCurrentQuestionId(match.start);
    }
  };

  const handleNextQuestion = () => {
    const total = currentSection === 'listening' ? LISTENING_QUESTIONS.length : READING_QUESTIONS.length;
    if (currentQuestionId < total) {
      handleSelectQuestion(currentQuestionId + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionId > 1) {
      handleSelectQuestion(currentQuestionId - 1);
    }
  };

  // Part ranges for navigation
  const listeningRanges = [
    { part: 1, start: 1, end: 10 },
    { part: 2, start: 11, end: 20 },
    { part: 3, start: 21, end: 30 },
    { part: 4, start: 31, end: 40 },
  ];

  const readingRanges = [
    { part: 1, start: 1, end: 13 },
    { part: 2, start: 14, end: 26 },
    { part: 3, start: 27, end: 40 },
  ];

  // INTRO LAUNCH SCREEN (Similar to official Cambridge IDP test initiation)
  if (testStage === 'intro') {
    return (
      <div className="min-h-screen bg-[#0b0f17] text-white flex flex-col justify-between p-4 sm:p-8 font-sans">
        <div className="max-w-4xl mx-auto w-full pt-8 space-y-8">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 font-serif font-black text-slate-950 text-lg shadow-sm">
                V
              </span>
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
                  Official IELTS Simulator
                </span>
                <h1 className="text-2xl font-bold text-white">
                  Computer-Delivered Full Mock Test (CD-IELTS)
                </h1>
              </div>
            </div>

            <button
              onClick={onExit}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-900 transition-colors cursor-pointer"
            >
              Вернуться на главную
            </button>
          </div>

          {/* Test Setup Card */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                1. Выберите формат экзамена:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedExamType('academic')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedExamType === 'academic'
                      ? 'bg-amber-500/10 border-amber-400 text-white shadow-sm ring-1 ring-amber-400/40'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white">IELTS Academic</span>
                    <span className="text-xs font-mono text-amber-400">Вузы и гранты</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Научные статьи в Reading, академический анализ диаграмм/графиков в Writing Task 1.
                  </p>
                </button>

                <button
                  onClick={() => setSelectedExamType('general')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedExamType === 'general'
                      ? 'bg-amber-500/10 border-amber-400 text-white shadow-sm ring-1 ring-amber-400/40'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white">General Training</span>
                    <span className="text-xs font-mono text-amber-400">Иммиграция (Express Entry)</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Практические тексты о трудоустройстве в Reading, написание писем в Writing Task 1.
                  </p>
                </button>
              </div>
            </div>

            {/* Test Structure 4 Blocks Overview */}
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                2. Регламент и хронометраж полного тестирования:
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="font-bold text-white block mb-0.5">1. Listening</span>
                  <span className="text-amber-400 font-mono block">30 минут · 4 части</span>
                  <span className="text-slate-500 text-[11px]">40 вопросов, проигрывается 1 раз</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="font-bold text-white block mb-0.5">2. Reading</span>
                  <span className="text-amber-400 font-mono block">60 минут · 3 текста</span>
                  <span className="text-slate-500 text-[11px]">40 вопросов с маркером заметок</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="font-bold text-white block mb-0.5">3. Writing</span>
                  <span className="text-amber-400 font-mono block">60 минут · 2 задания</span>
                  <span className="text-slate-500 text-[11px]">Task 1 (150 сл) + Task 2 (250 сл)</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="font-bold text-white block mb-0.5">4. Speaking</span>
                  <span className="text-amber-400 font-mono block">11–14 минут · ИИ</span>
                  <span className="text-slate-500 text-[11px]">Запись голоса + Cue Card</span>
                </div>
              </div>
            </div>

            {/* Sound Check & Rules */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Headphones className="h-5 w-5 text-amber-400 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-white block">Проверка звука и оборудования:</span>
                  <span className="text-slate-400">Убедитесь, что наушники подключены и звук настроен на комфортный уровень.</span>
                </div>
              </div>
              <button
                onClick={() => {
                  if ('speechSynthesis' in window) {
                    const u = new SpeechSynthesisUtterance("This is a sound check for the IELTS listening test.");
                    u.lang = 'en-GB';
                    window.speechSynthesis.speak(u);
                  }
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Тест звука
              </button>
            </div>

            {/* Start Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => setIsArchitectureOpen(true)}
                className="text-xs text-emerald-400 hover:underline cursor-pointer"
              >
                Посмотреть схему PostgreSQL и системные промпты LLM
              </button>

              <button
                onClick={() => setTestStage('testing')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 cursor-pointer text-sm"
              >
                <span>Начать официальный симулятор (Start Test)</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Quiet footer */}
        <div className="text-center text-xs text-slate-500 pt-6">
          VERITAS IELTS Academic Engine · Conforms to Cambridge Computer-Delivered Examination Standards
        </div>

        {/* Architecture Modal */}
        <ArchitectureModal
          isOpen={isArchitectureOpen}
          onClose={() => setIsArchitectureOpen(false)}
        />
      </div>
    );
  }

  // ACTIVE EXAM WORKSPACE
  return (
    <div className="min-h-screen bg-[#0b0f17] text-white flex flex-col justify-between font-sans select-none">
      
      {/* 1. Official CD-IELTS Header */}
      <MockTestHeader
        currentSection={currentSection}
        onSelectSection={handleSelectSection}
        timeRemainingSeconds={timeRemaining[currentSection]}
        onFinishTest={() => setIsReportOpen(true)}
        onExitMockTest={onExit}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenAria={() => setIsAriaOpen(true)}
      />

      {/* 2. Main Content Area per Section */}
      <main className="flex-1 overflow-hidden h-[calc(100vh-106px)]">
        {currentSection === 'listening' && (
          <ListeningSection
            currentPart={currentPart}
            currentQuestionId={currentQuestionId}
            userAnswers={userAnswers}
            onAnswerChange={handleAnswerChange}
            onSelectQuestion={handleSelectQuestion}
          />
        )}

        {currentSection === 'reading' && (
          <ReadingSection
            currentPart={currentPart}
            currentQuestionId={currentQuestionId}
            userAnswers={userAnswers}
            onAnswerChange={handleAnswerChange}
            onSelectQuestion={handleSelectQuestion}
            highlights={highlights}
            onAddHighlight={(hl) => setHighlights((prev) => [...prev, hl])}
            onRemoveHighlight={(id) => setHighlights((prev) => prev.filter((h) => h.id !== id))}
          />
        )}

        {currentSection === 'writing' && (
          <WritingSection
            taskNumber={activeWritingTask}
            onSelectTask={(t) => setActiveWritingTask(t)}
            answers={writingAnswers}
            onAnswerChange={(t, text) => setWritingAnswers((prev) => ({ ...prev, [t === 1 ? 'task1' : 'task2']: text }))}
            evaluations={writingEvaluations}
            onEvaluationComplete={(t, res) => setWritingEvaluations((prev) => ({ ...prev, [t === 1 ? 'task1' : 'task2']: res }))}
          />
        )}

        {currentSection === 'speaking' && (
          <SpeakingSection
            currentPart={currentPart}
            onSelectPart={(p) => setCurrentPart(p)}
            transcripts={speakingTranscripts}
            onUpdateTranscript={(p, text) => {
              if (p === 2) setSpeakingTranscripts((prev) => ({ ...prev, part2: text }));
            }}
            speakingEvaluation={speakingEvaluation}
            onEvaluationComplete={(res) => setSpeakingEvaluation(res)}
          />
        )}
      </main>

      {/* 3. Official Bottom Navigation Bar (for Listening & Reading) */}
      {(currentSection === 'listening' || currentSection === 'reading') && (
        <MockQuestionNav
          section={currentSection}
          totalQuestions={currentSection === 'listening' ? LISTENING_QUESTIONS.length : READING_QUESTIONS.length}
          currentQuestionId={currentQuestionId}
          userAnswers={userAnswers}
          flaggedForReview={flaggedForReview}
          onSelectQuestion={handleSelectQuestion}
          onToggleReview={handleToggleReview}
          onPrevQuestion={handlePrevQuestion}
          onNextQuestion={handleNextQuestion}
          currentPart={currentPart}
          onSelectPart={handleSelectPart}
          partRanges={currentSection === 'listening' ? listeningRanges : readingRanges}
        />
      )}

      {/* 4. Score Report & TRF Certificate Modal */}
      <ScoreReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        userAnswers={userAnswers}
        writingEvaluations={writingEvaluations}
        speakingEvaluation={speakingEvaluation}
        onRetake={() => {
          setIsReportOpen(false);
          setUserAnswers({});
          setTestStage('testing');
          setCurrentSection('listening');
          setCurrentPart(1);
          setCurrentQuestionId(1);
        }}
      />

      {/* 5. Database Schema & LLM Prompts Architecture Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* 6. Aria Personal IELTS AI Tutor Drawer */}
      <AriaTutorDrawer
        isOpen={isAriaOpen}
        onClose={() => setIsAriaOpen(false)}
        studentContext={{
          userName: 'Alex',
          currentBand: 6.5,
          targetBand: 7.5,
          weakAreas: ['Task 1 Cohesion', 'Matching Headings in Reading', 'Part 3 Fluency'],
          currentModule: `Official CD-IELTS Simulation: ${currentSection.toUpperCase()}`,
        }}
      />

    </div>
  );
};
