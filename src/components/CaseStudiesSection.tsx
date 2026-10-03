import React, { useState } from 'react';
import { Award, ArrowRight, CheckCircle2, TrendingUp, FileText, ExternalLink } from 'lucide-react';
import { CASE_STUDIES } from '../data/ieltsContent';
import { CaseStudy } from '../types/ielts';

interface CaseStudiesSectionProps {
  onLaunchMockTest: () => void;
}

export const CaseStudiesSection: React.FC<CaseStudiesSectionProps> = ({ onLaunchMockTest }) => {
  const [selectedCase, setSelectedCase] = useState<string>(CASE_STUDIES[0].id);

  const activeCase = CASE_STUDIES.find((c) => c.id === selectedCase) || CASE_STUDIES[0];

  return (
    <section id="cases" className="py-16 lg:py-24 border-b border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            06. Подтвержденные результаты выпускников
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-3" style={{ textWrap: 'balance' }}>
            Реальные кейсы в формате «Было → Стало» с номерами сертификатов TRF
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Мы не публикуем анонимные отзывы. Каждый результат подтвержден официальным сертификатом British Council / IDP IELTS.
          </p>
        </div>

        {/* Case Switcher Tabs */}
        <div className="flex flex-wrap gap-2.5 mb-8">
          {CASE_STUDIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCase(c.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCase === c.id
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {c.studentName} ({c.beforeScore} → {c.afterScore})
            </button>
          ))}
        </div>

        {/* Featured Case Spotlight Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-lg sm:text-xl font-bold text-white">{activeCase.studentName}</span>
                <span className="text-xs font-mono px-2.5 py-1 bg-slate-800 text-slate-300 rounded border border-slate-700">
                  {activeCase.examType === 'academic' ? 'IELTS Academic' : 'General Training'}
                </span>
                <span className="text-xs font-mono text-slate-400">{activeCase.trfNumber}</span>
              </div>

              {/* Score Progression Graphic */}
              <div className="flex items-center gap-4 bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                <div className="text-center">
                  <span className="text-[11px] text-slate-400 block">Было на старте</span>
                  <span className="text-2xl font-bold font-mono text-slate-400">
                    Band {activeCase.beforeScore.toFixed(1)}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center px-2">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    +{ (activeCase.afterScore - activeCase.beforeScore).toFixed(1) } за {activeCase.durationWeeks} нед.
                  </span>
                  <div className="flex items-center text-amber-400 mt-1">
                    <div className="w-12 sm:w-16 h-0.5 bg-amber-400" />
                    <TrendingUp className="h-4 w-4 ml-1" />
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-[11px] text-amber-400 font-semibold block">Итоговый балл</span>
                  <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400">
                    Band {activeCase.afterScore.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Sub-score breakdown */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                  Официальная разбивка по секциям:
                </span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Listening</span>
                    <span className="text-sm font-bold text-white font-mono">{activeCase.breakdown.listening.toFixed(1)}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Reading</span>
                    <span className="text-sm font-bold text-white font-mono">{activeCase.breakdown.reading.toFixed(1)}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Writing</span>
                    <span className="text-sm font-bold text-amber-400 font-mono">{activeCase.breakdown.writing.toFixed(1)}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Speaking</span>
                    <span className="text-sm font-bold text-amber-400 font-mono">{activeCase.breakdown.speaking.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {/* University or Country outcome */}
              <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Результат:</strong> Зачисление в {activeCase.targetUniversityOrCountry}
                </span>
              </div>

              {/* Quote Snippet */}
              <p className="text-xs sm:text-sm font-serif italic text-slate-300 leading-relaxed pl-3 border-l-2 border-amber-400">
                {activeCase.storySnippet}
              </p>

            </div>

            {/* Right: TRF Certificate Mockup Showcase (5 cols) */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-700/80 rounded-xl p-5 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Test Report Form (TRF)</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400">VERIFIED</span>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Candidate Name:</span>
                  <span className="font-semibold text-white uppercase">{activeCase.studentName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Scheme Code:</span>
                  <span className="font-mono text-slate-300">Private Candidate</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Test Module:</span>
                  <span className="font-mono text-amber-400 uppercase">{activeCase.examType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500">Center Number:</span>
                  <span className="font-mono text-slate-300">KZ004 / IDP Education</span>
                </div>
              </div>

              {/* Big Overall Band on Certificate */}
              <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-300 uppercase tracking-wider block">Overall Band Score</span>
                  <span className="text-2xl font-black text-amber-400 font-mono">
                    {activeCase.afterScore.toFixed(1)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">CEFR Level</span>
                  <span className="text-xs font-mono font-bold text-white">
                    {activeCase.afterScore >= 7.5 ? 'C1 Level Proficient' : 'B2 Upper-Int'}
                  </span>
                </div>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={onLaunchMockTest}
                  className="w-full py-2.5 px-4 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                >
                  Начать тренировку в симуляторе
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
