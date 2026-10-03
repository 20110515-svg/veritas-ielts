import React from 'react';
import { Sparkles, Cpu } from 'lucide-react';

interface HeaderProps {
  onOpenDiagnostic: () => void;
  onToggleConceptGuide: () => void;
  onLaunchMockTest: () => void;
  onOpenAria: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDiagnostic,
  onToggleConceptGuide,
  onLaunchMockTest,
  onOpenAria,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b0f17]/90 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-6">
          <a href="#" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 font-serif font-extrabold text-slate-950 text-base shadow-sm">
              V
            </span>
            <span className="font-serif tracking-wider text-xl font-semibold">VERITAS <span className="font-sans font-light text-slate-400 text-sm tracking-normal">IELTS AI</span></span>
          </a>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a href="#audience" className="hover:text-amber-400 transition-colors">Кому подойдет</a>
          <a href="#calculator" className="hover:text-amber-400 transition-colors">Калькулятор</a>
          <a href="#modules" className="hover:text-amber-400 transition-colors">4 модуля</a>
          <a href="#pricing" className="hover:text-amber-400 transition-colors">SaaS Тарифы</a>
          <a href="#technology" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-amber-400" />
            <span>ИИ-Стек</span>
          </a>
          <a href="#cases" className="hover:text-amber-400 transition-colors">Кейсы</a>
          <a href="#faq" className="hover:text-amber-400 transition-colors">FAQ</a>
        </nav>

        {/* Zone 3: Primary actions + Mock Test Launcher + Aria */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAria}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors cursor-pointer"
            title="Открыть персонального 1-на-1 ИИ-тьютора Aria"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Aria AI Tutor</span>
          </button>

          <button
            onClick={onLaunchMockTest}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-sm hover:shadow-amber-500/20 whitespace-nowrap cursor-pointer"
            title="Запустить официальный симулятор IELTS Computer-Delivered"
          >
            <span className="h-2 w-2 rounded-full bg-slate-950 animate-ping inline-block" />
            <span>Full Mock Test</span>
          </button>

          <button
            onClick={onOpenDiagnostic}
            className="hidden sm:inline-flex px-3 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            Экспресс-тест (4 мин)
          </button>

          <button
            onClick={onToggleConceptGuide}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            title="Открыть аналитическую архитектуру автономного приложения"
          >
            <Cpu className="h-3.5 w-3.5 text-slate-400" />
            <span>Архитектура</span>
          </button>
        </div>
      </div>
    </header>
  );
};
