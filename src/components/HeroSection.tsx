import React from 'react';
import { ArrowRight, CheckCircle2, Award, Clock, Sparkles, FileText, ChevronRight, Cpu } from 'lucide-react';
import { IMAGES, PLATFORM_STATS } from '../data/ieltsContent';

interface HeroSectionProps {
  onOpenDiagnostic: () => void;
  onOpenLeadMagnet: (id?: string) => void;
  onLaunchMockTest: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenDiagnostic,
  onOpenLeadMagnet,
  onLaunchMockTest,
}) => {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
      {/* Background radial accent glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Direct Value Offer (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Editorial kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                <Cpu className="h-3 w-3" />
                Автономная SaaS-платформа IELTS 2026
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">Academic & General</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]" style={{ textWrap: 'balance' }}>
              Подготовка к <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">IELTS 7.0–8.5+</span> в браузере с мгновенной ИИ-оценкой за 3 секунды
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              100% самостоятельное обучение без репетиторов, звонков и ожидания проверки. Официальный симулятор Computer-Delivered IELTS, речевой ИИ-экзаменатор и построчный аудит эссе по 4 кембриджским критериям.
            </p>

            {/* 3 Key Value Pillars (Unboxed, clean typographic structure) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong className="text-white block font-medium">ИИ-аудит за 3 секунды</strong> Построчный анализ Writing по TR, CC, LR, GRA</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong className="text-white block font-medium">Речевой AI-тренажер</strong> Оценка Speaking с замером WPM, пауз и PEEL-структуры</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong className="text-white block font-medium">Без звонков и людей</strong> Мгновенный старт практики сразу в окне браузера</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={onLaunchMockTest}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <span>Начать Full Mock Test (CD-IELTS)</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onOpenDiagnostic}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                <span>Экспресс-тест уровня (4 мин)</span>
              </button>
            </div>

            {/* Lead Magnet Micro-trigger */}
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <span className="text-amber-400 font-semibold">Подарок в приложении:</span>
              <button
                onClick={() => onOpenLeadMagnet('writing-bible')}
                className="inline-flex items-center gap-1 text-slate-300 hover:text-white underline underline-offset-4 decoration-amber-500/50 transition-colors cursor-pointer"
              >
                <FileText className="h-3.5 w-3.5 text-amber-400" />
                <span>Гайд «40 академических связок для Writing Band 7.5+» (PDF)</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

          </div>

          {/* Right Column: Visual Anchor & Verified Proof Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Image Frame */}
              <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-2xl">
                <img
                  src={IMAGES.hero}
                  alt="Автономная подготовка к IELTS на платформе VERITAS"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center"
                />
                
                {/* Contrast scrim gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                {/* Overlaid Verified Result Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-4 shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-amber-400" />
                      <span className="text-xs font-semibold text-white">Верифицированный результат пользователя</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">TRF #24KZ012480</span>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5 text-center pt-1 border-t border-slate-800">
                    <div className="bg-slate-800/80 rounded p-1">
                      <span className="block text-[10px] text-slate-400">Listening</span>
                      <span className="text-xs font-bold text-amber-300 font-mono">8.5</span>
                    </div>
                    <div className="bg-slate-800/80 rounded p-1">
                      <span className="block text-[10px] text-slate-400">Reading</span>
                      <span className="text-xs font-bold text-amber-300 font-mono">8.0</span>
                    </div>
                    <div className="bg-slate-800/80 rounded p-1">
                      <span className="block text-[10px] text-slate-400">Writing</span>
                      <span className="text-xs font-bold text-amber-300 font-mono">7.5</span>
                    </div>
                    <div className="bg-slate-800/80 rounded p-1">
                      <span className="block text-[10px] text-slate-400">Speaking</span>
                      <span className="text-xs font-bold text-amber-300 font-mono">7.5</span>
                    </div>
                    <div className="bg-amber-500/20 border border-amber-500/40 rounded p-1">
                      <span className="block text-[10px] text-amber-300 font-medium">Overall</span>
                      <span className="text-sm font-extrabold text-amber-400 font-mono">8.0</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* Platform Stat Row */}
        <div className="mt-16 pt-10 border-t border-slate-850 grid grid-cols-2 md:grid-cols-4 gap-6">
          {PLATFORM_STATS.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <span className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                {stat.value}
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-200">
                {stat.label}
              </p>
              <p className="text-[11px] text-slate-400">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
