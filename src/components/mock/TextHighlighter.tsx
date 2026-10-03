import React, { useState, useEffect, useRef } from 'react';
import { Highlighter, MessageSquare, Trash2, X } from 'lucide-react';
import { HighlightItem } from '../../types/mockTest';

interface TextHighlighterProps {
  highlights: HighlightItem[];
  onAddHighlight: (highlight: HighlightItem) => void;
  onRemoveHighlight: (id: string) => void;
  children: React.ReactNode;
}

export const TextHighlighter: React.FC<TextHighlighterProps> = ({
  highlights,
  onAddHighlight,
  onRemoveHighlight,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedText, setSelectedText] = useState('');
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [isNoteInputOpen, setIsNoteInputOpen] = useState(false);
  const [noteText, setNoteText] = useState('');

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      if (!isNoteInputOpen) {
        setMenuPos(null);
      }
      return;
    }

    const text = selection.toString().trim();
    if (text.length > 2) {
      setSelectedText(text);
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setMenuPos({
        x: rect.left + rect.width / 2,
        y: rect.top - 45,
      });
    }
  };

  const applyHighlight = (color: 'yellow' | 'green' | 'blue') => {
    if (!selectedText) return;
    const newHighlight: HighlightItem = {
      id: `hl-${Date.now()}`,
      text: selectedText,
      color,
      note: noteText.trim() || undefined,
    };
    onAddHighlight(newHighlight);
    setMenuPos(null);
    setIsNoteInputOpen(false);
    setNoteText('');
    window.getSelection()?.removeAllRanges();
  };

  return (
    <div ref={containerRef} onMouseUp={handleMouseUp} className="relative select-text">
      {children}

      {/* Floating Action Menu for Selected Text */}
      {menuPos && (
        <div
          style={{ top: `${menuPos.y}px`, left: `${menuPos.x}px` }}
          className="fixed z-50 -translate-x-1/2 flex items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl text-xs backdrop-blur-md"
        >
          {/* Yellow Highlight Button */}
          <button
            onClick={() => applyHighlight('yellow')}
            className="flex items-center gap-1 px-2 py-1 rounded bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 font-semibold transition-colors cursor-pointer"
            title="Выделить желтым (Highlight)"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 inline-block" />
            <span>Желтый</span>
          </button>

          {/* Green Highlight Button */}
          <button
            onClick={() => applyHighlight('green')}
            className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-400 text-emerald-300 hover:text-slate-950 font-semibold transition-colors cursor-pointer"
            title="Выделить зеленым (Highlight)"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 inline-block" />
            <span>Зеленый</span>
          </button>

          {/* Note Button */}
          <button
            onClick={() => setIsNoteInputOpen(!isNoteInputOpen)}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
            title="Добавить заметку к фрагменту"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Заметка</span>
          </button>

          <button
            onClick={() => {
              setMenuPos(null);
              setIsNoteInputOpen(false);
            }}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Note Input Popover */}
      {isNoteInputOpen && menuPos && (
        <div
          style={{ top: `${menuPos.y + 40}px`, left: `${menuPos.x}px` }}
          className="fixed z-50 -translate-x-1/2 p-3 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-64 text-xs"
        >
          <span className="text-[11px] text-slate-400 block mb-1 font-semibold">
            Заметка к выделенному тексту:
          </span>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Ваша заметка (например: Ключевой аргумент о zeolite)"
            className="w-full p-2 rounded bg-slate-950 border border-slate-750 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 mb-2 resize-none"
            rows={2}
          />
          <div className="flex justify-end gap-1.5">
            <button
              onClick={() => applyHighlight('yellow')}
              className="px-2.5 py-1 bg-amber-400 text-slate-950 font-bold rounded cursor-pointer"
            >
              Сохранить
            </button>
          </div>
        </div>
      )}

      {/* Display Active Annotations & Highlights Sidebar */}
      {highlights.length > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Ваши маркеры и заметки ({highlights.length})
            </span>
          </div>
          <div className="space-y-2">
            {highlights.map((hl) => (
              <div
                key={hl.id}
                className="flex items-start justify-between gap-2 p-2 rounded bg-slate-900 border border-slate-800 text-xs"
              >
                <div>
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-mono mr-2 ${
                      hl.color === 'yellow'
                        ? 'bg-amber-400/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    «{hl.text.slice(0, 45)}...»
                  </span>
                  {hl.note && (
                    <span className="block text-slate-300 italic mt-1 pl-2 border-l border-amber-400/40">
                      Заметка: {hl.note}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onRemoveHighlight(hl.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                  title="Удалить выделение"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
