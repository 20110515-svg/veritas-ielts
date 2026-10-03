import React, { useEffect, useRef } from 'react';
import { BookOpen, CheckCircle2, HelpCircle } from 'lucide-react';
import { READING_PASSAGES, READING_QUESTIONS } from '../../data/ieltsDemoTest';
import { ResizableSplitPane } from './ResizableSplitPane';
import { TextHighlighter } from './TextHighlighter';
import { HighlightItem } from '../../types/mockTest';

interface ReadingSectionProps {
  currentPart: number; // Passage 1, 2, or 3
  currentQuestionId: number;
  userAnswers: Record<number, string>;
  onAnswerChange: (questionId: number, answer: string) => void;
  onSelectQuestion: (questionId: number) => void;
  highlights: HighlightItem[];
  onAddHighlight: (highlight: HighlightItem) => void;
  onRemoveHighlight: (id: string) => void;
}

export const ReadingSection: React.FC<ReadingSectionProps> = ({
  currentPart,
  currentQuestionId,
  userAnswers,
  onAnswerChange,
  onSelectQuestion,
  highlights,
  onAddHighlight,
  onRemoveHighlight,
}) => {
  const currentPassage = READING_PASSAGES.find((p) => p.id === currentPart) || READING_PASSAGES[0];
  const questions = READING_QUESTIONS.filter((q) => q.part === currentPart);
  const activeQuestionRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll active question into view inside right pane
  useEffect(() => {
    if (activeQuestionRef.current) {
      activeQuestionRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentQuestionId]);

  // Left Pane: Authentic Academic Reading Passage with Text Highlighter
  const leftPaneContent = (
    <TextHighlighter
      highlights={highlights}
      onAddHighlight={onAddHighlight}
      onRemoveHighlight={onRemoveHighlight}
    >
      <div className="space-y-6">
        
        {/* Passage Header */}
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              Reading Passage {currentPassage.id}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Questions {currentPassage.questionsRange[0]}–{currentPassage.questionsRange[1]}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight leading-snug">
            {currentPassage.title}
          </h2>
          {currentPassage.subheading && (
            <p className="text-xs sm:text-sm text-slate-400 mt-2 font-serif italic leading-relaxed">
              {currentPassage.subheading}
            </p>
          )}
        </div>

        {/* Tip for test-takers */}
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
          <span className="text-amber-400 font-bold">Подсказка:</span>
          <span>Выделите любой фрагмент текста мышью, чтобы подсветить его маркером или добавить комментарий.</span>
        </div>

        {/* Paragraphs with labels */}
        <div className="space-y-5 text-sm font-serif leading-relaxed text-slate-200">
          {currentPassage.paragraphs.map((p, idx) => (
            <div key={idx} className="relative pl-7 group">
              {p.label && (
                <span className="absolute left-0 top-0.5 font-sans font-extrabold text-xs text-amber-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">
                  {p.label}
                </span>
              )}
              <p className="text-justify leading-7 text-slate-300">
                {p.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </TextHighlighter>
  );

  // Right Pane: Official Questions (True/False/Not Given, Matching Headings, Completion)
  const rightPaneContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Questions {currentPassage.questionsRange[0]}–{currentPassage.questionsRange[1]} · Academic Reading
        </h3>
        <span className="text-xs font-mono text-slate-400">
          Заполнено: {questions.filter((q) => !!userAnswers[q.id]?.trim()).length} из {questions.length}
        </span>
      </div>

      <div className="space-y-6">
        {questions.map((q) => {
          const isCurrent = currentQuestionId === q.id;
          const currentAnswer = userAnswers[q.id] || '';

          // Determine True/False or Yes/No based on instruction
          const isYesNo = /YES|NO/i.test(q.instruction);
          const tfValues = isYesNo ? ['YES', 'NO', 'NOT GIVEN'] : ['TRUE', 'FALSE', 'NOT GIVEN'];

          return (
            <div
              key={q.id}
              ref={isCurrent ? activeQuestionRef : null}
              onClick={() => onSelectQuestion(q.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-slate-900 border-amber-400 shadow-md ring-1 ring-amber-400/30'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className={`inline-flex h-6 w-6 rounded font-mono text-xs font-bold items-center justify-center shrink-0 ${
                  isCurrent 
                    ? 'bg-amber-400 text-slate-950' 
                    : !!currentAnswer.trim()
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-800 text-amber-400'
                }`}>
                  {q.id}
                </span>
                <span className="text-xs text-slate-400 italic flex-1">{q.instruction}</span>
              </div>

              {/* Prompt */}
              <p className="text-xs sm:text-sm font-medium text-white mb-3 pl-8">
                {q.prompt}
              </p>

              <div className="pl-8">
                {/* 1. True / False / Not Given & Yes / No / Not Given Toggle Buttons */}
                {q.kind === 'true_false_not_given' && (
                  <div className="flex flex-wrap gap-2">
                    {tfValues.map((val) => {
                      const isSelected = currentAnswer.toUpperCase() === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAnswerChange(q.id, val);
                          }}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-400 border-amber-400 text-slate-950 shadow-sm'
                              : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 2. Matching Headings */}
                {q.kind === 'matching_headings' && q.options && (
                  <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={currentAnswer}
                      onChange={(e) => onAnswerChange(q.id, e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    >
                      <option value="">-- Выберите заголовок из списка (i–viii) --</option>
                      {q.options.map((opt, idx) => {
                        const romanMatch = opt.match(/^([ivx]+)\./i);
                        const val = romanMatch ? romanMatch[1].toLowerCase() : opt;
                        return (
                          <option key={idx} value={val}>
                            {opt}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}

                {/* 3. Matching (e.g. Mechanism A, B, or C) */}
                {q.kind === 'matching' && q.options && (
                  <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-wrap gap-2">
                      {q.options.map((opt, idx) => {
                        const letter = opt.charAt(0);
                        const isSelected = currentAnswer.toUpperCase() === letter.toUpperCase();
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => onAnswerChange(q.id, letter)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-400 border-amber-400 text-slate-950 shadow-sm'
                                : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. Multiple Choice */}
                {q.kind === 'multiple_choice' && q.options && (
                  <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                    {q.options.map((opt, idx) => {
                      const letter = opt.charAt(0);
                      const isSelected = currentAnswer.toUpperCase() === letter.toUpperCase();

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
                            name={`reading-q-${q.id}`}
                            checked={isSelected}
                            onChange={() => onAnswerChange(q.id, letter)}
                            className="accent-amber-400"
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {/* 5. Sentence Completion & Note Completion */}
                {(q.kind === 'sentence_completion' || q.kind === 'note_completion') && (
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={currentAnswer}
                      onChange={(e) => onAnswerChange(q.id, e.target.value)}
                      placeholder="Введите точный ответ из текста..."
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
      initialLeftWidthPercent={52}
    />
  );
};
