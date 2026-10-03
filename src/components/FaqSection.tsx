import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, ArrowRight } from 'lucide-react';
import { FAQ_ITEMS } from '../data/ieltsContent';

interface FaqSectionProps {
  onLaunchMockTest: () => void;
  onOpenDiagnostic: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ 
  onLaunchMockTest,
  onOpenDiagnostic,
}) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 lg:py-24 border-b border-slate-800/80 bg-[#0d131f]/50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            07. Ответы на частые вопросы
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-3" style={{ textWrap: 'balance' }}>
            Все, что нужно знать об автономной подготовке
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            О работе ИИ-алгоритмов, точности оценивания, симуляторе экзамена и прямом доступе без репетиторов.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3.5 mb-10">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-850/60 transition-colors"
                >
                  <span className="text-sm sm:text-base font-bold text-white">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-amber-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-850/80">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Ready to start box */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white block">Готовы проверить свой балл прямо сейчас?</span>
              <span className="text-xs text-slate-400">Мгновенный старт в браузере без звонков, менеджеров и ввода данных банковской карты.</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              onClick={onLaunchMockTest}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
            >
              <span>Запустить Full Mock Test</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onOpenDiagnostic}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              <span>Экспресс-тест (4 мин)</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
