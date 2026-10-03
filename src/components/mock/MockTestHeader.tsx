import React, { useState } from 'react';
import { 
  Clock, 
  Eye, 
  EyeOff, 
  Volume2, 
  HelpCircle, 
  CheckCircle, 
  ShieldAlert, 
  ArrowLeft,
  Settings,
  Code,
  Sparkles
} from 'lucide-react';
import { SectionType } from '../../types/mockTest';

interface MockTestHeaderProps {
  currentSection: SectionType;
  onSelectSection: (section: SectionType) => void;
  timeRemainingSeconds: number;
  onFinishTest: () => void;
  onExitMockTest: () => void;
  onOpenArchitecture: () => void;
  onOpenAria?: () => void;
}

export const MockTestHeader: React.FC<MockTestHeaderProps> = ({
  currentSection,
  onSelectSection,
  timeRemainingSeconds,
  onFinishTest,
  onExitMockTest,
  onOpenArchitecture,
  onOpenAria,
}) => {
  const [isTimeHidden, setIsTimeHidden] = useState(false);
  const [volume, setVolume] = useState(80);
  const [showHelp, setShowHelp] = useState(false);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const sections: { id: SectionType; label: string; duration: string }[] = [
    { id: 'listening', label: '1. Listening', duration: '30m' },
    { id: 'reading', label: '2. Reading', duration: '60m' },
    { id: 'writing', label: '3. Writing', duration: '60m' },
    { id: 'speaking', label: '4. Speaking', duration: '14m' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0e1626] border-b border-slate-700/90 text-white shadow-lg select-none">
      
      {/* Top status bar: Official CD-IELTS header style */}
      <div className="mx-auto flex h-14 items-center justify-between px-3 sm:px-6">
        
        {/* Left: Candidate info & Back button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onExitMockTest}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer py-1 px-2 rounded hover:bg-slate-800"
            title="Выйти на главную страницу"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Выйти</span>
          </button>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-amber-400 text-sm">IELTS SIMULATOR</span>
            <span className="text-xs text-slate-400 hidden md:inline">· Candidate: Maya Lin (ID: ST-8492)</span>
          </div>
        </div>

        {/* Center: Official Countdown Timer with Hide button */}
        <div className="flex items-center gap-3 bg-slate-950/80 px-3.5 py-1.5 rounded-lg border border-slate-700">
          <Clock className={`h-4 w-4 ${timeRemainingSeconds < 300 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`} />
          
          <div className="font-mono text-base font-extrabold tracking-wider">
            {!isTimeHidden ? (
              <span className={timeRemainingSeconds < 300 ? 'text-rose-400' : 'text-white'}>
                {formatTime(timeRemainingSeconds)}
              </span>
            ) : (
              <span className="text-xs text-slate-400 italic">Скрыто</span>
            )}
          </div>

          <button
            onClick={() => setIsTimeHidden(!isTimeHidden)}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer text-xs"
            title={isTimeHidden ? 'Показать таймер' : 'Скрыть таймер (Hide Time)'}
          >
            {isTimeHidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Right: Controls, Architecture & Finish */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Aria Personal AI Tutor */}
          {onOpenAria && (
            <button
              onClick={onOpenAria}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded transition-colors cursor-pointer"
              title="Открыть персонального тьютора Aria"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Aria Tutor</span>
            </button>
          )}

          {/* Architecture & DB Schema Trigger */}
          <button
            onClick={onOpenArchitecture}
            className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded transition-colors cursor-pointer"
            title="Открыть схему базы данных и системные промпты LLM"
          >
            <Code className="h-3.5 w-3.5" />
            <span>Архитектура & Промпты</span>
          </button>

          {/* Volume slider */}
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <Volume2 className="h-4 w-4" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-16 h-1 accent-amber-400 bg-slate-700 rounded cursor-pointer"
              title={`Громкость: ${volume}%`}
            />
          </div>

          {/* Help Button */}
          <button
            onClick={() => setShowHelp(true)}
            className="text-slate-300 hover:text-white p-1.5 rounded hover:bg-slate-800 transition-colors cursor-pointer"
            title="Инструкция и горячие клавиши"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          {/* Finish & View Results */}
          <button
            onClick={onFinishTest}
            className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded shadow transition-all cursor-pointer whitespace-nowrap"
          >
            Завершить и оценить
          </button>
        </div>

      </div>

      {/* Sub-header: Official 4-Section Navigation Tabs */}
      <div className="bg-[#0b101b] border-t border-slate-800 px-3 sm:px-6 flex items-center justify-between overflow-x-auto scrollbar-none py-1">
        <div className="flex items-center gap-1 sm:gap-2">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => onSelectSection(sec.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-t border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                currentSection === sec.id
                  ? 'border-amber-400 text-amber-300 bg-slate-800/80'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-850/40'
              }`}
            >
              <span>{sec.label}</span>
              <span className="ml-1.5 text-[10px] text-slate-500 font-mono">({sec.duration})</span>
            </button>
          ))}
        </div>

        <div className="text-[11px] text-slate-400 font-mono hidden md:block">
          Official CD-IELTS Engine v2.4 · Auto-saving answers
        </div>
      </div>

      {/* Keyboard Shortcuts Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-amber-400" />
                <span>Инструкция к тестированию</span>
              </h4>
              <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-white cursor-pointer text-xs">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>
                Тестирование максимально приближено к официальному формату Кембриджа на компьютере (Computer-Delivered IELTS):
              </p>
              <ul className="list-disc pl-4 space-y-1.5 text-slate-400">
                <li><strong className="text-white">Выделение текста</strong>: выделите мышкой любой фрагмент в ридинге для появления маркера (Highlight) и заметок (Note).</li>
                <li><strong className="text-white">Панель вопросов</strong>: кликайте по номерам внизу для быстрого перехода. Вопросы с флажком «Review» помечены желтым.</li>
                <li><strong className="text-white">Сплит-скрин</strong>: перетаскивайте центральную разделительную полосу мышкой для настройки ширины текста и вопросов.</li>
                <li><strong className="text-white">Автосохранение</strong>: все ваши ответы моментально сохраняются в локальном хранилище.</li>
              </ul>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="mt-5 w-full py-2 bg-amber-400 text-slate-950 font-bold rounded text-xs cursor-pointer"
            >
              Понятно, продолжить тест
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
