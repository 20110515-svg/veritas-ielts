import React from 'react';
import { ChevronLeft, ChevronRight, Flag, Check } from 'lucide-react';
import { SectionType } from '../../types/mockTest';

interface MockQuestionNavProps {
  section: SectionType;
  totalQuestions: number;
  currentQuestionId: number;
  userAnswers: Record<number, string>;
  flaggedForReview: Record<number, boolean>;
  onSelectQuestion: (id: number) => void;
  onToggleReview: (id: number) => void;
  onPrevQuestion: () => void;
  onNextQuestion: () => void;
  currentPart: number;
  onSelectPart: (part: number) => void;
  partRanges: { part: number; start: number; end: number }[];
}

export const MockQuestionNav: React.FC<MockQuestionNavProps> = ({
  section,
  totalQuestions,
  currentQuestionId,
  userAnswers,
  flaggedForReview,
  onSelectQuestion,
  onToggleReview,
  onPrevQuestion,
  onNextQuestion,
  currentPart,
  onSelectPart,
  partRanges,
}) => {
  const isCurrentFlagged = !!flaggedForReview[currentQuestionId];

  return (
    <footer className="sticky bottom-0 z-40 bg-[#0e1626] border-t border-slate-700/90 text-slate-200 select-none shadow-2xl py-2 px-3 sm:px-6">
      <div className="mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Part tabs (Part 1, Part 2, etc.) */}
        <div className="flex items-center gap-1">
          {partRanges.map((pr) => (
            <button
              key={pr.part}
              onClick={() => onSelectPart(pr.part)}
              className={`px-3 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                currentPart === pr.part
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>{section === 'reading' ? `Passage ${pr.part}` : `Part ${pr.part}`}</span>
            </button>
          ))}
        </div>

        {/* Center: Scrollable / responsive Question Number Grid */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1 px-1 scrollbar-none">
          {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((qId) => {
            const isAnswered = !!userAnswers[qId]?.trim();
            const isCurrent = currentQuestionId === qId;
            const isFlagged = !!flaggedForReview[qId];

            let buttonClass = 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500';

            if (isAnswered) {
              buttonClass = 'bg-slate-700 border-slate-500 text-white font-bold';
            }
            if (isCurrent) {
              buttonClass = 'bg-amber-400 border-amber-300 text-slate-950 font-extrabold ring-2 ring-amber-400/50';
            }

            return (
              <button
                key={qId}
                onClick={() => onSelectQuestion(qId)}
                className={`relative h-7 w-7 rounded border text-xs font-mono flex items-center justify-center transition-all cursor-pointer shrink-0 ${buttonClass}`}
                title={`Вопрос ${qId}${isAnswered ? ' (Отвечен)' : ' (Не отвечен)'}${isFlagged ? ' [Помечен для проверки]' : ''}`}
              >
                <span>{qId}</span>
                {isFlagged && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-500 ring-1 ring-slate-900" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Review flag & Prev/Next navigation */}
        <div className="flex items-center gap-3">
          
          {/* Review checkbox */}
          <button
            onClick={() => onToggleReview(currentQuestionId)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border transition-colors cursor-pointer ${
              isCurrentFlagged
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-slate-850 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Отметить вопрос для последующей проверки"
          >
            <Flag className={`h-3.5 w-3.5 ${isCurrentFlagged ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>Review</span>
          </button>

          {/* Prev / Next controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onPrevQuestion}
              disabled={currentQuestionId <= 1}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Предыдущий вопрос"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              onClick={onNextQuestion}
              disabled={currentQuestionId >= totalQuestions}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Следующий вопрос"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
};
