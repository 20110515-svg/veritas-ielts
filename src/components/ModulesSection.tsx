import React, { useState } from 'react';
import { Headphones, BookOpen, PenTool, Mic, CheckCircle2, ChevronRight, FileCheck, Layers } from 'lucide-react';
import { MODULES_BREAKDOWN, ESSAY_COMPARISON_DATA } from '../data/ieltsContent';

interface ModulesSectionProps {
  onLaunchMockTest: () => void;
  onOpenLeadMagnet: (id?: string) => void;
}

export const ModulesSection: React.FC<ModulesSectionProps> = ({
  onLaunchMockTest,
  onOpenLeadMagnet,
}) => {
  const [activeTab, setActiveTab] = useState<'modules' | 'essayComparison'>('modules');
  const [selectedModule, setSelectedModule] = useState<string>('writing');
  const [essayViewMode, setEssayViewMode] = useState<'band8' | 'band6'>('band8');

  const currentMod = MODULES_BREAKDOWN.find((m) => m.id === selectedModule) || MODULES_BREAKDOWN[2];

  const getModuleIcon = (id: string) => {
    switch (id) {
      case 'listening': return <Headphones className="h-5 w-5" />;
      case 'reading': return <BookOpen className="h-5 w-5" />;
      case 'writing': return <PenTool className="h-5 w-5" />;
      case 'speaking': return <Mic className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  return (
    <section id="modules" className="py-16 lg:py-24 border-b border-slate-800/80 bg-[#0d131f]/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Sub-tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
              03. Методология и разбор 4 секций
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-3" style={{ textWrap: 'balance' }}>
              Анатомия подготовки: от ликвидации ловушек до уровня Band 8.5
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Мы не учим «разговаривать на английском». Мы учим точно попадать в формальные требования Кембриджа.
            </p>
          </div>

          {/* Toggle between Section Modules & Essay Live Teardown */}
          <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-xl shrink-0">
            <button
              onClick={() => setActiveTab('modules')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'modules'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              4 Секции IELTS
            </button>
            <button
              onClick={() => setActiveTab('essayComparison')}
              className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'essayComparison'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Разбор эссе: 6.0 vs 8.0
            </button>
          </div>
        </div>

        {activeTab === 'modules' ? (
          /* View 1: 4 Modules Deep-Dive */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left selector menu (4 cols) */}
            <div className="lg:col-span-4 space-y-2.5">
              {MODULES_BREAKDOWN.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => setSelectedModule(mod.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedModule === mod.id
                      ? 'bg-slate-900 border-amber-400 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${selectedModule === mod.id ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                        {getModuleIcon(mod.id)}
                      </div>
                      <span className="text-base font-bold text-white">{mod.name}</span>
                    </div>
                    <span className="text-xs font-mono font-semibold text-amber-400">
                      до {mod.bandPotential}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {mod.badge}
                  </div>
                </button>
              ))}

              <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl mt-4">
                <span className="text-xs font-semibold text-white block mb-1">
                  Нужен банк актуальных эссе 2026?
                </span>
                <p className="text-xs text-slate-400 mb-3">
                  Скачайте 40 проверенных связок для Writing Band 7.5+ бесплатно.
                </p>
                <button
                  onClick={() => onOpenLeadMagnet('writing-bible')}
                  className="w-full py-2 px-3 text-xs font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors cursor-pointer"
                >
                  Скачать PDF-шпаргалку
                </button>
              </div>
            </div>

            {/* Right details card (8 cols) */}
            <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <span>Секция {currentMod.name}</span>
                    <span aria-hidden="true">·</span>
                    <span>{currentMod.badge}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Целевой результат: {currentMod.bandPotential}
                  </h3>
                </div>

                <div className="px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs font-mono text-amber-400 self-start sm:self-auto">
                  {currentMod.toolPreview}
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed my-6">
                {currentMod.summary}
              </p>

              {/* 3 Core Techniques */}
              <div className="space-y-4 mb-8">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Авторские методики и шаблоны Veritas:
                </span>
                {currentMod.techniques.map((tech, idx) => (
                  <div key={idx} className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-white mb-1">{tech.title}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{tech.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
                <span className="text-xs text-slate-400">
                  Хотите протестировать свои навыки по модулю {currentMod.name}?
                </span>
                <button
                  onClick={onLaunchMockTest}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
                >
                  <span>Запустить модуль в симуляторе CD-IELTS</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>

          </div>
        ) : (
          /* View 2: Live Side-by-Side Essay Teardown 6.0 vs 8.0 */
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8">
            
            {/* Context Box */}
            <div className="mb-6 p-4 bg-slate-950/90 border border-slate-800 rounded-xl">
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block mb-1">
                Официальная тема IELTS Writing Task 2:
              </span>
              <p className="text-sm font-serif italic text-slate-200">
                «{ESSAY_COMPARISON_DATA.prompt}»
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-slate-400">
                Нажмите для переключения между типичной работой 6.0 и эталоном 8.0:
              </span>
              <div className="inline-flex p-1 bg-slate-950 border border-slate-800 rounded-xl">
                <button
                  onClick={() => setEssayViewMode('band6')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    essayViewMode === 'band6'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Типичное эссе на Band 6.0
                </button>
                <button
                  onClick={() => setEssayViewMode('band8')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    essayViewMode === 'band8'
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Эталонное эссе на Band 8.0
                </button>
              </div>
            </div>

            {/* Display Comparison Content */}
            {essayViewMode === 'band6' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                <div className="lg:col-span-7 bg-slate-950 border border-rose-500/30 rounded-xl p-5 font-serif text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 font-sans">
                    <span className="text-xs font-bold text-rose-400">Работа студента до курса</span>
                    <span className="text-xs font-mono font-bold text-rose-400">Overall: 6.0</span>
                  </div>
                  {ESSAY_COMPARISON_DATA.band6.text}
                </div>

                <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3">
                  <span className="text-xs font-bold text-rose-400 block mb-2">
                    Почему Кембридж ставит только 6.0:
                  </span>
                  {ESSAY_COMPARISON_DATA.band6.weaknesses.map((w, idx) => (
                    <div key={idx} className="text-xs text-slate-300 leading-relaxed pl-2 border-l-2 border-rose-500/50">
                      {w}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                <div className="lg:col-span-7 bg-slate-950 border border-amber-500/40 rounded-xl p-5 font-serif text-xs sm:text-sm text-amber-100/90 leading-relaxed whitespace-pre-line">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 font-sans">
                    <span className="text-xs font-bold text-amber-400">После внедрения архитектуры Veritas</span>
                    <span className="text-xs font-mono font-bold text-amber-400">Overall: 8.0+</span>
                  </div>
                  {ESSAY_COMPARISON_DATA.band8.text}
                </div>

                <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3">
                  <span className="text-xs font-bold text-amber-400 block mb-2">
                    За что экзаменатор повышает балл до 8.0:
                  </span>
                  {ESSAY_COMPARISON_DATA.band8.strengths.map((s, idx) => (
                    <div key={idx} className="text-xs text-slate-300 leading-relaxed pl-2 border-l-2 border-amber-400">
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400">
                Проверьте свое эссе в симуляторе прямо сейчас: мгновенный ИИ-аудит за 3 секунды с разметкой C1-C2 связок.
              </span>
              <button
                onClick={onLaunchMockTest}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
              >
                <span>Проверить эссе в симуляторе Writing</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
