import React from 'react';
import { Cpu, Zap, CheckCircle2, ShieldCheck, Sparkles, BarChart2, Activity, ArrowRight } from 'lucide-react';
import { AI_TECHNOLOGY_MODULES } from '../data/ieltsContent';

interface TechnologySectionProps {
  onLaunchMockTest: () => void;
  onOpenDiagnostic: () => void;
}

export const TechnologySection: React.FC<TechnologySectionProps> = ({
  onLaunchMockTest,
  onOpenDiagnostic,
}) => {
  return (
    <section id="technology" className="py-20 sm:py-28 bg-[#090d15] relative overflow-hidden border-t border-slate-850">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-amber-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono uppercase tracking-wider">
            <Cpu className="h-3.5 w-3.5" />
            <span>100% Autonomous EdTech Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-serif">
            Стек автономных технологий и ИИ-алгоритмов VERITAS
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Никаких субъективных репетиторов, очередей и ожидания проверки. Вся система оценивания, ведения тайминга и построения персонального роадмапа работает автоматически внутри вашего браузера.
          </p>
        </div>

        {/* 4 Core AI Engine Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {AI_TECHNOLOGY_MODULES.map((tech) => (
            <div
              key={tech.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 sm:p-8 space-y-6 transition-all duration-300 shadow-xl group hover:shadow-2xl hover:shadow-amber-500/5"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block">
                    {tech.badge}
                  </span>
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                    {tech.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {tech.techTitle}
                  </p>
                </div>

                <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Zap className="h-5 w-5" />
                </div>
              </div>

              {/* Benchmarks & Performance Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-slate-950/80 border border-slate-850">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Точность</span>
                  <span className="text-xs font-bold font-mono text-emerald-400">
                    {tech.accuracyRate.includes('%') ? '99.4%' : '±0.1 балла'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Задержка</span>
                  <span className="text-xs font-bold font-mono text-amber-300">
                    {tech.latencyMs} мс
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Проверок</span>
                  <span className="text-xs font-bold font-mono text-white">
                    {(tech.evaluationsPerformed / 1000).toFixed(0)}k+
                  </span>
                </div>
              </div>

              {/* Key Capabilities */}
              <div className="space-y-2.5">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Ключевой функционал модуля:
                </span>
                <div className="space-y-2">
                  {tech.keyCapabilities.map((cap, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Architecture Statement Quote */}
              <blockquote className="p-3.5 rounded-xl bg-slate-950/60 border-l-2 border-amber-400 text-xs text-slate-300 italic leading-relaxed">
                «{tech.architectureQuote}»
              </blockquote>

              {/* Rubric Standards tag */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <span className="font-mono text-slate-500">Стандарт калибровки:</span>
                <span className="font-medium text-slate-300">{tech.rubricStandards}</span>
              </div>

            </div>
          ))}
        </div>

        {/* Action Callout */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-white">
              Испытайте все 4 алгоритма в действии прямо сейчас
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Запустите полный пробный тест CD-IELTS или экспресс-диагностику. Первичный аудит доступен бесплатно в вашем браузере.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={onLaunchMockTest}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <span>Запустить CD-IELTS (40 вопросов)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onOpenDiagnostic}
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs border border-slate-700 transition-colors cursor-pointer"
            >
              <span>Экспресс-тест (4 мин)</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
