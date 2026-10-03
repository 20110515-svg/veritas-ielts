import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { LISTENING_PARTS, LISTENING_QUESTIONS } from '../../data/ieltsDemoTest';
import { ResizableSplitPane } from './ResizableSplitPane';

interface ListeningSectionProps {
  currentPart: number;
  currentQuestionId: number;
  userAnswers: Record<number, string>;
  onAnswerChange: (questionId: number, answer: string) => void;
  onSelectQuestion: (questionId: number) => void;
}

export const ListeningSection: React.FC<ListeningSectionProps> = ({
  currentPart,
  currentQuestionId,
  userAnswers,
  onAnswerChange,
  onSelectQuestion,
}) => {
  const activePartData = LISTENING_PARTS.find((p) => p.partNumber === currentPart) || LISTENING_PARTS[0];
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Filter questions for this part
  const partQuestions = LISTENING_QUESTIONS.filter((q) => q.part === currentPart);
  const activeQuestionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeQuestionRef.current) {
      activeQuestionRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentQuestionId]);

  // Simulated audio playback with SpeechSynthesis / progress timer
  const togglePlayAudio = () => {
    if (isPlaying) {
      setIsPlaying(false);
      window.speechSynthesis?.cancel();
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    } else {
      setIsPlaying(true);
      setHasPlayedOnce(true);

      // Web Speech synthesis to speak the script
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(activePartData.simulatedAudioScript.replace(/Student:|Officer:|Guide:|Professor:|Clara:|Lecturer:/g, ''));
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.lang = 'en-GB';
        utterance.onend = () => {
          setIsPlaying(false);
          setPlaybackProgress(100);
        };
        window.speechSynthesis.speak(utterance);
      }

      // Track progress
      const startTime = Date.now();
      const durationMs = 35000; // Simulated compact duration
      audioIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, (elapsed / durationMs) * 100);
        setPlaybackProgress(progress);
        if (progress >= 100) {
          setIsPlaying(false);
          if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
        }
      }, 300);
    }
  };

  useEffect(() => {
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Left Pane: Audio Console & Task Description
  const leftPaneContent = (
    <div className="space-y-6">
      
      {/* Official CD-IELTS Audio Player Box */}
      <div className="bg-slate-950 border border-slate-700/80 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              IELTS Listening Audio Track — {activePartData.title}
            </h3>
          </div>
          <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Official Play-Once Rule
          </span>
        </div>

        {/* Audio Waveform & Progress */}
        <div className="space-y-3">
          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-300"
              style={{ width: `${playbackProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{isPlaying ? 'Аудио воспроизводится...' : playbackProgress >= 100 ? 'Запись завершена' : 'Готов к воспроизведению'}</span>
            <span className="font-mono">{Math.round(playbackProgress)}%</span>
          </div>

          {/* Action button */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={togglePlayAudio}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-500/20'
              }`}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-slate-950" />}
              <span>{isPlaying ? 'Приостановить дорожку' : hasPlayedOnce ? 'Слушать повторно (Демо-режим)' : 'Включить аудиозапись'}</span>
            </button>

            {hasPlayedOnce && (
              <button
                onClick={() => {
                  setPlaybackProgress(0);
                  setIsPlaying(false);
                  window.speechSynthesis?.cancel();
                }}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Сбросить дорожку (для тренировки)"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Notice on Real Exam Rules */}
        <div className="flex items-start gap-2 text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-800/80">
          <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span>
            На реальном экзамене IELTS аудиозапись проигрывается <strong>строго один раз</strong>. По окончании дается 2 минуты на проверку ответов.
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
          Инструкция к вопросам {activePartData.questionsRange[0]}–{activePartData.questionsRange[1]}:
        </h4>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Внимательно ознакомьтесь с бланками справа перед прослушиванием. Обращайте внимание на ограничения по количеству слов: <em>NO MORE THAN ONE WORD AND/OR A NUMBER</em>.
        </p>
      </div>

      {/* Transcript with Evidence Highlighting (Unlocked on demand) */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-amber-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Скрипт диалога (Audio Transcript)
            </h4>
          </div>
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="text-xs text-amber-400 hover:underline cursor-pointer"
          >
            {showTranscript ? 'Скрыть текст' : 'Показать скрипт с подсказками'}
          </button>
        </div>

        {showTranscript ? (
          <div className="space-y-2 text-xs font-serif text-slate-300 whitespace-pre-line bg-slate-900 p-4 rounded-lg border border-slate-800 leading-relaxed">
            {activePartData.simulatedAudioScript}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">
            Скрипт скрыт для чистоты симуляции. Вы можете раскрыть его для разбора ошибок после завершения теста.
          </p>
        )}
      </div>

    </div>
  );

  // Right Pane: Interactive Question Forms
  const rightPaneContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Бланк ответов: Вопросы {activePartData.questionsRange[0]}–{activePartData.questionsRange[1]}
        </h3>
        <span className="text-xs font-mono text-slate-400">
          Заполнено: {partQuestions.filter((q) => !!userAnswers[q.id]?.trim()).length} из {partQuestions.length}
        </span>
      </div>

      <div className="space-y-5">
        {partQuestions.map((q) => {
          const isCurrent = currentQuestionId === q.id;
          const currentAnswer = userAnswers[q.id] || '';

          return (
            <div
              key={q.id}
              ref={isCurrent ? activeQuestionRef : null}
              onClick={() => onSelectQuestion(q.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-slate-900 border-amber-400/80 shadow-md ring-1 ring-amber-400/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="inline-flex h-6 w-6 rounded bg-slate-800 font-mono text-xs font-bold text-amber-400 items-center justify-center shrink-0">
                  {q.id}
                </span>
                <span className="text-xs text-slate-400 italic flex-1">{q.instruction}</span>
              </div>

              {/* Prompt */}
              <p className="text-xs sm:text-sm font-medium text-white mb-3 pl-8">
                {q.prompt}
              </p>

              {/* Answer Input based on kind */}
              <div className="pl-8">
                {q.kind === 'multiple_choice' && q.options ? (
                  <div className="space-y-2">
                    {q.options.map((opt, idx) => {
                      const letter = opt.charAt(0);
                      const isSelected = currentAnswer.toUpperCase() === letter;

                      return (
                        <label
                          key={idx}
                          className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs sm:text-sm transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-amber-400/20 border-amber-400 text-white font-medium'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`listening-q-${q.id}`}
                            checked={isSelected}
                            onChange={() => onAnswerChange(q.id, letter)}
                            className="accent-amber-400"
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : (
                  /* Text input for note completion or sentence completion */
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={currentAnswer}
                      onChange={(e) => onAnswerChange(q.id, e.target.value)}
                      placeholder="Введите ответ сюда..."
                      className="w-full max-w-sm px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    />
                    {currentAnswer && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    )}
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <ResizableSplitPane
      leftContent={leftPaneContent}
      rightContent={rightPaneContent}
      initialLeftWidthPercent={45}
    />
  );
};
