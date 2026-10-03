import React, { useState } from 'react';
import { GraduationCap, Briefcase, Target, AlertCircle, Sparkles, Check, ArrowRight } from 'lucide-react';
import { LEVEL_PROFILES } from '../data/ieltsContent';
import { LevelTier, ExamType } from '../types/ielts';

interface AudienceSectionProps {
  onOpenDiagnostic: () => void;
}

export const AudienceSection: React.FC<AudienceSectionProps> = ({
  onOpenDiagnostic,
}) => {
  const [selectedExam, setSelectedExam] = useState<ExamType>('academic');
  const [selectedLevel, setSelectedLevel] = useState<LevelTier>('b2');

  const currentLevelData = LEVEL_PROFILES.find((p) => p.id === selectedLevel) || LEVEL_PROFILES[1];

  return (
    <section id="audience" className="py-16 lg:py-24 border-b border-slate-800/80 bg-[#0d131f]/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            01. Сегментация и диагностика
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-4" style={{ textWrap: 'balance' }}>
            Кому идеально подойдет курс и как мы адаптируем траекторию
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Подготовка к IELTS — это не абстрактное «улучшение английского». Это точная ликвидация дефицитов под конкретную цель: иммиграцию, бакалавриат или магистратуру.
          </p>
        </div>

        {/* 1. Academic vs General Training Interactive Switch */}
        <div className="mb-10 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider block mb-1">Шаг 1: Формат экзамена</span>
              <h3 className="text-lg font-bold text-white">Выберите ваш тип теста IELTS</h3>
            </div>

            {/* Segmented button control */}
            <div className="inline-flex p-1 bg-slate-800/90 border border-slate-700 rounded-xl">
              <button
                onClick={() => setSelectedExam('academic')}
                className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  selectedExam === 'academic'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                <span>IELTS Academic</span>
              </button>
              <button
                onClick={() => setSelectedExam('general')}
                className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  selectedExam === 'general'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Briefcase className="h-4 w-4" />
                <span>General Training</span>
              </button>
            </div>
          </div>

          {/* Details for chosen exam format */}
          {selectedExam === 'academic' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800/80">
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">Для кого</span>
                <p className="text-sm text-slate-200">
                  Поступление на бакалавриат, магистратуру, MBA и PhD в вузы Великобритании, Европы, США, Канады, Австралии и Азии.
                </p>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">Специфика модулей</span>
                <p className="text-sm text-slate-200">
                  Сложные научные тексты в Reading, анализ академических графиков/диаграмм в Task 1, аргументативное эссе Task 2.
                </p>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">Критический порог</span>
                <p className="text-sm font-mono text-amber-400 font-bold">
                  Band 6.5 – 7.5 (no sub-score below 6.5)
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800/80">
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">Для кого</span>
                <p className="text-sm text-slate-200">
                  Иммиграционные программы Express Entry (Канада, FSWP/CEC), Skilled Migration (Австралия), рабочие визы в UK и трудоустройство.
                </p>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">Специфика модулей</span>
                <p className="text-sm text-slate-200">
                  Жизненные и профессиональные тексты в Reading, написание формальных и неформальных писем в Task 1, высокий порог для CLB 9.
                </p>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">Критический порог (CLB 9 / 10)</span>
                <p className="text-sm font-mono text-amber-400 font-bold">
                  Listening 8.0 · Reading 7.0 · Writing 7.0 · Speaking 7.0
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 2. Interactive Level Breakdown (B1, B2, C1) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider block mb-1">Шаг 2: Текущий уровень владения</span>
              <h3 className="text-lg sm:text-xl font-bold text-white">Выберите ваш текущий уровень языка</h3>
            </div>

            {/* Level tabs */}
            <div className="flex flex-wrap gap-2">
              {LEVEL_PROFILES.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => setSelectedLevel(profile.id)}
                  className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-xl border transition-all cursor-pointer ${
                    selectedLevel === profile.id
                      ? 'bg-slate-800 border-amber-400 text-white shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {profile.label.split(' ')[1]} ({profile.label.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>

          {/* Deep-dive content card for selected level */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <span>{currentLevelData.label}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-400 font-semibold">{currentLevelData.sublabel}</span>
                </div>
                <h4 className="text-xl font-bold text-white">
                  Целевая траектория: {currentLevelData.targetScore}
                </h4>
              </div>

              <div className="flex items-center gap-6 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 block text-[11px]">Рекомендуемый срок</span>
                  <span className="font-semibold text-white font-mono">{currentLevelData.timeframe}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Текущая точка старта</span>
                  <span className="font-semibold text-amber-400 font-mono">{currentLevelData.currentScore}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
              
              {/* Pain Point */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-white mb-1">Главный барьер (Bottleneck)</h5>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {currentLevelData.mainStumblingBlock}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-bold text-white mb-1">Методическое решение Veritas</h5>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {currentLevelData.solutionStrategy}
                    </p>
                  </div>
                </div>
              </div>

              {/* Module Priority Breakdown */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                  Приоритеты внимания по модулям
                </span>
                <div className="space-y-3">
                  {currentLevelData.modulesPriority.map((mod, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="h-5 w-5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">{mod.name}</span>
                        <span className="text-xs text-slate-300">{mod.focus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom action trigger */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400">
                Не уверены в точном балле? Пройдите 15-минутный экспресс-скрининг с разбором ошибок.
              </span>
              <button
                onClick={onOpenDiagnostic}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
              >
                <span>Определить мой уровень бесплатно</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
