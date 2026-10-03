import React, { useState, useMemo } from 'react';
import { Calculator, Calendar, Clock, BarChart3, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { LevelTier, ExamType } from '../types/ielts';

interface InteractiveCalculatorProps {
  onLaunchMockTest: () => void;
  onOpenLeadMagnet: (id?: string) => void;
}

export const InteractiveCalculator: React.FC<InteractiveCalculatorProps> = ({
  onLaunchMockTest,
  onOpenLeadMagnet,
}) => {
  const [currentLevel, setCurrentLevel] = useState<LevelTier>('b2');
  const [targetBand, setTargetBand] = useState<number>(7.5);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(8);
  const [examType, setExamType] = useState<ExamType>('academic');

  // Calculation logic based on Cambridge ESOL research (approx 100-120 guided hours per +0.5 band increase)
  const calculation = useMemo(() => {
    let currentScore = 5.0;
    if (currentLevel === 'b2') currentScore = 6.0;
    if (currentLevel === 'c1') currentScore = 7.0;

    const diff = Math.max(0, targetBand - currentScore);
    // Approx 100 hours per 0.5 band increase in focused environment
    const hoursPerHalfBand = 90;
    const totalHoursNeeded = Math.max(30, Math.round((diff / 0.5) * hoursPerHalfBand));
    const estimatedWeeks = Math.max(3, Math.ceil(totalHoursNeeded / hoursPerWeek));
    const estimatedMonths = (estimatedWeeks / 4.2).toFixed(1);

    // Projected sectional scores
    const projectedListening = Math.min(9.0, targetBand + 0.5);
    const projectedReading = Math.min(9.0, targetBand + (examType === 'general' ? 0.0 : 0.5));
    const projectedWriting = Math.max(6.0, targetBand);
    const projectedSpeaking = Math.max(6.5, targetBand);

    // Focus breakdown percentage
    let writingFocus = 35;
    let speakingFocus = 30;
    let readingFocus = 20;
    let listeningFocus = 15;

    if (diff > 1.0) {
      writingFocus = 40;
      speakingFocus = 30;
      readingFocus = 15;
      listeningFocus = 15;
    }

    return {
      currentScore,
      diff,
      totalHoursNeeded,
      estimatedWeeks,
      estimatedMonths,
      projectedListening,
      projectedReading,
      projectedWriting,
      projectedSpeaking,
      writingFocus,
      speakingFocus,
      readingFocus,
      listeningFocus,
    };
  }, [currentLevel, targetBand, hoursPerWeek, examType]);

  return (
    <section id="calculator" className="py-16 lg:py-24 border-b border-slate-800/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            02. Интерактивный калькулятор
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-4" style={{ textWrap: 'balance' }}>
            Рассчитайте точные сроки и часы подготовки к вашему целевому баллу
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            В основе расчета — методологическая статистика Cambridge Assessment: среднее количество академических часов для прироста на 0.5–1.5 балла с учетом вашего темпа.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Input Parameters (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            
            {/* 1. Current Level Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                1. Ваш текущий уровень (или предыдущий результат)
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'b1' as LevelTier, label: 'B1 Intermediate', band: '~5.0–5.5' },
                  { id: 'b2' as LevelTier, label: 'B2 Upper-Int', band: '~6.0–6.5' },
                  { id: 'c1' as LevelTier, label: 'C1 Advanced', band: '~7.0–7.5' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentLevel(item.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      currentLevel === item.id
                        ? 'bg-amber-500/10 border-amber-400 text-white shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span className="block text-xs font-bold">{item.label}</span>
                    <span className="block text-[11px] font-mono text-amber-400">{item.band}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Target Band Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  2. Желаемый балл (Target Band)
                </label>
                <span className="text-sm font-extrabold text-amber-400 font-mono">
                  IELTS {targetBand.toFixed(1)}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[6.5, 7.0, 7.5, 8.0, 8.5].map((band) => (
                  <button
                    key={band}
                    onClick={() => setTargetBand(band)}
                    className={`py-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      targetBand === band
                        ? 'bg-amber-400 border-amber-400 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 font-medium'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-mono">{band.toFixed(1)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Hours per Week Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  3. Сколько часов в неделю готовы уделять
                </label>
                <span className="text-sm font-bold text-white font-mono">
                  {hoursPerWeek} ч / неделю
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="20"
                step="2"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                className="w-full accent-amber-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                <span>4 ч (в спокойном темпе)</span>
                <span>8–10 ч (стандарт)</span>
                <span>20 ч (супер-интенсив)</span>
              </div>
            </div>

            {/* 4. Format Selection */}
            <div className="pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                4. Направление экзамена
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setExamType('academic')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    examType === 'academic'
                      ? 'bg-slate-800 border-amber-400 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Academic (Вузы, стипендии)
                </button>
                <button
                  onClick={() => setExamType('general')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    examType === 'general'
                      ? 'bg-slate-800 border-amber-400 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  General Training (Иммиграция)
                </button>
              </div>
            </div>

          </div>

          {/* Right: Calculated Personalized Plan (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl">
            
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
              <Calculator className="h-4 w-4" />
              <span>Ваш расчетный план подготовки</span>
            </div>

            {/* Estimated Duration Big Numbers */}
            <div className="grid grid-cols-2 gap-4 my-6 pb-6 border-b border-slate-800">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Calendar className="h-3.5 w-3.5 text-amber-400" />
                  <span>Рекомендуемый срок</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                  ~{calculation.estimatedWeeks} <span className="text-sm font-sans font-normal text-slate-400">недель</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  ({calculation.estimatedMonths} месяца при {hoursPerWeek} ч/нед)
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  <span>Чистые часы практики</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
                  {calculation.totalHoursNeeded} <span className="text-sm font-sans font-normal text-slate-400">часов</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  включая 12 полных эссе
                </span>
              </div>
            </div>

            {/* Projected Score Matrix */}
            <div className="mb-6">
              <span className="text-xs font-semibold text-slate-400 block mb-2.5">
                Прогнозируемый профиль баллов по секциям:
              </span>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2">
                  <span className="block text-[10px] text-slate-400">Listening</span>
                  <span className="text-sm font-bold text-white font-mono">{calculation.projectedListening.toFixed(1)}</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2">
                  <span className="block text-[10px] text-slate-400">Reading</span>
                  <span className="text-sm font-bold text-white font-mono">{calculation.projectedReading.toFixed(1)}</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2">
                  <span className="block text-[10px] text-slate-400">Writing</span>
                  <span className="text-sm font-bold text-amber-400 font-mono">{calculation.projectedWriting.toFixed(1)}</span>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2">
                  <span className="block text-[10px] text-slate-400">Speaking</span>
                  <span className="text-sm font-bold text-amber-400 font-mono">{calculation.projectedSpeaking.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* Strategic Focus Allocation */}
            <div className="mb-6 bg-slate-950/80 border border-slate-800/80 rounded-xl p-4">
              <span className="text-xs font-semibold text-slate-300 block mb-2">
                Рекомендуемый баланс внимания программы:
              </span>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Writing (Task 1 + Task 2)</span>
                    <span className="font-mono text-amber-400 font-bold">{calculation.writingFocus}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${calculation.writingFocus}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Speaking (Part 2 & 3 Fluency)</span>
                    <span className="font-mono text-blue-400 font-bold">{calculation.speakingFocus}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: `${calculation.speakingFocus}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Reading & Listening (Speed & Traps)</span>
                    <span className="font-mono text-emerald-400 font-bold">{calculation.readingFocus + calculation.listeningFocus}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${calculation.readingFocus + calculation.listeningFocus}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={onLaunchMockTest}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md shadow-amber-500/10 cursor-pointer"
              >
                <span>Начать персональное тестирование в браузере</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => onOpenLeadMagnet('roadmap-8weeks')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-xl transition-colors cursor-pointer"
              >
                <span>Скачать пошаговый Notion-роадмап на 8 недель</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
