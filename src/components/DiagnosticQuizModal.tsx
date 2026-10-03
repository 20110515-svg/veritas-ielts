import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Award, ArrowRight, RotateCcw } from 'lucide-react';
import { DIAGNOSTIC_QUIZ_QUESTIONS } from '../data/ieltsContent';

interface DiagnosticQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchMockTest: () => void;
}

export const DiagnosticQuizModal: React.FC<DiagnosticQuizModalProps> = ({
  isOpen,
  onClose,
  onLaunchMockTest,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const currentQ = DIAGNOSTIC_QUIZ_QUESTIONS[currentStep];

  const handleSelectOption = (idx: number) => {
    if (showAnswerFeedback) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentStep] = idx;
    setSelectedAnswers(newAnswers);
    setShowAnswerFeedback(true);
  };

  const handleNext = () => {
    setShowAnswerFeedback(false);
    if (currentStep < DIAGNOSTIC_QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedAnswers([]);
    setShowAnswerFeedback(false);
    setIsCompleted(false);
  };

  // Calculate score
  const correctCount = selectedAnswers.reduce((acc, ansIdx, qIdx) => {
    return acc + (DIAGNOSTIC_QUIZ_QUESTIONS[qIdx]?.options[ansIdx]?.isCorrect ? 1 : 0);
  }, 0);

  const getEstimatedBand = () => {
    if (correctCount === 4) return { band: '7.5 – 8.5', label: 'Отличная база (B2+/C1)', desc: 'Вы хорошо чувствуете академический регистр и логику кембриджских ловушек. Для достижения 8.0+ достаточно отшлифовать формат и беглость.' };
    if (correctCount === 3) return { band: '6.5 – 7.0', label: 'Уверенный Upper-Intermediate (B2)', desc: 'Хорошее понимание контекста, но есть локальные потери на академических коллокациях и категоричности суждений. За 6–8 недель можно выйти на 7.5.' };
    if (correctCount === 2) return { band: '5.5 – 6.0', label: 'Переходный уровень (B1+/B2)', desc: 'Есть склонность к разговорному синтаксису и ловушкам Not Given. Рекомендуется базовый курс на 10–12 недель с фокусом на структуру.' };
    return { band: '5.0 – 5.5', label: 'Базовый уровень (B1)', desc: 'Требуется системная работа над академическим вокабуляром и грамматическим каркасом до выхода на интенсивное решение тестов.' };
  };

  const result = getEstimatedBand();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {!isCompleted ? (
          <div>
            {/* Quiz Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold text-amber-400 uppercase tracking-wider">
                  Экспресс-диагностика уровня IELTS
                </span>
                <span className="font-mono">
                  Вопрос {currentStep + 1} из {DIAGNOSTIC_QUIZ_QUESTIONS.length}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / DIAGNOSTIC_QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Section Header */}
            <div className="mb-5">
              <span className="text-xs font-mono text-amber-400 block mb-1">
                {currentQ.skill}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                {currentQ.taskTitle}
              </h3>
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs sm:text-sm font-serif italic text-amber-200/90 leading-relaxed mb-3 whitespace-pre-line">
                {currentQ.questionText}
              </div>
            </div>

            {/* Options List */}
            <div className="space-y-2.5 mb-6">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentStep] === idx;
                let borderStyle = 'border-slate-800 bg-slate-950/40 text-slate-200 hover:border-slate-700';

                if (showAnswerFeedback) {
                  if (opt.isCorrect) {
                    borderStyle = 'border-emerald-500/80 bg-emerald-500/10 text-emerald-200';
                  } else if (isSelected && !opt.isCorrect) {
                    borderStyle = 'border-rose-500/80 bg-rose-500/10 text-rose-200';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={showAnswerFeedback}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all cursor-pointer ${borderStyle}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span>{opt.text}</span>
                      {showAnswerFeedback && opt.isCorrect && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {showAnswerFeedback && isSelected && !opt.isCorrect && (
                        <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation Box */}
            {showAnswerFeedback && (
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 mb-6">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Разбор критерия экзаменатором:
                </span>
                <p className="text-xs sm:text-sm text-slate-300">
                  {currentQ.options[selectedAnswers[currentStep]]?.explanation}
                </p>
                <div className="mt-2 text-xs font-mono text-amber-400">
                  {currentQ.options[selectedAnswers[currentStep]]?.isCorrect ? 'Соответствие официальному критерию: Band 8.0–9.0' : 'Требует доработки (ниже Band 7.0)'}
                </div>
              </div>
            )}

            {/* Next Button */}
            <div className="flex justify-end">
              {showAnswerFeedback && (
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
                >
                  <span>{currentStep < DIAGNOSTIC_QUIZ_QUESTIONS.length - 1 ? 'Следующий вопрос' : 'Узнать результат'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>

          </div>
        ) : (
          /* Results View */
          <div className="text-center py-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4">
              <Award className="h-7 w-7" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block mb-1">
              Результат экспресс-скрининга
            </span>
            <h3 className="text-2xl font-extrabold text-white mb-2">
              Ориентировочный уровень: <span className="font-mono text-amber-400">Band {result.band}</span>
            </h3>
            <p className="text-sm font-medium text-slate-200 mb-4">
              {result.label} · Правильно отвечено: {correctCount} из 4
            </p>

            <div className="max-w-lg mx-auto bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-300 text-left mb-6">
              {result.desc}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onLaunchMockTest();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
              >
                <span>Начать Full Mock Test (40 вопросов)</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Пройти еще раз</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
