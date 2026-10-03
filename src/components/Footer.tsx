import React from 'react';
import { ShieldCheck, ArrowRight, BookOpen, Sparkles, Cpu, Download } from 'lucide-react';

interface FooterProps {
  onLaunchMockTest: () => void;
  onOpenDiagnostic: () => void;
  onOpenLeadMagnet: (id?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onLaunchMockTest,
  onOpenDiagnostic,
  onOpenLeadMagnet,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800">
      
      {/* Pre-Footer Autonomous Instant Start Banner */}
      <div className="border-b border-slate-850 py-16 lg:py-20 bg-gradient-to-b from-[#0b0f17] to-slate-950">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-10 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              
              <div className="space-y-3 max-w-xl text-center md:text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
                  Мгновенный старт в браузере
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Готовы узнать свой реальный балл IELTS без ожидания и звонков?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Запустите официальный симулятор CD-IELTS или пройдите 4-минутную экспресс-диагностику. ИИ-анализатор выдаст детальный расчет по критериям сразу по завершении теста.
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Без звонков и менеджеров</span>
                  </div>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <div className="flex items-center gap-1.5 text-amber-300">
                    <Cpu className="h-4 w-4" />
                    <span>Мгновенный ИИ-расчет</span>
                  </div>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>100% в браузере</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 w-full sm:w-auto">
                <button
                  onClick={onLaunchMockTest}
                  className="w-full sm:w-auto md:w-64 py-3.5 px-6 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <span>Начать Full Mock Test</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  onClick={onOpenDiagnostic}
                  className="w-full sm:w-auto md:w-64 py-3 px-6 rounded-xl text-xs sm:text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Экспресс-тест (4 мин)</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 font-serif font-extrabold text-slate-950 text-sm shadow-sm">
                V
              </span>
              <span className="font-serif tracking-wider text-lg font-bold text-white">VERITAS <span className="font-sans font-light text-slate-400 text-xs">IELTS AI</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Полностью автономная онлайн-платформа подготовки к экзамену IELTS Academic & General Training. ИИ-оценка Writing и Speaking по официальным критериям Cambridge Assessment English.
            </p>
            <div className="pt-2 text-[11px] text-slate-500">
              © {new Date().getFullYear()} VERITAS EdTech Systems. Все права защищены.
            </div>
          </div>

          {/* Col 2: Симулятор & Практика */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Экзаменационный тренажер
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onLaunchMockTest} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  CD-IELTS Full Mock Test (40Q)
                </button>
              </li>
              <li>
                <button onClick={onOpenDiagnostic} className="hover:text-amber-400 transition-colors text-left cursor-pointer">
                  Экспресс-диагностика уровня
                </button>
              </li>
              <li>
                <a href="#modules" className="hover:text-amber-400 transition-colors">
                  ИИ-симулятор Writing Task 1 & 2
                </a>
              </li>
              <li>
                <a href="#modules" className="hover:text-amber-400 transition-colors">
                  Голосовой AI-тренажер Speaking
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-amber-400 transition-colors">
                  Калькулятор баллов и сроков
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Материалы и гайды */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Бесплатные материалы
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenLeadMagnet('writing-bible')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="h-3 w-3 text-amber-400 shrink-0" />
                  <span>40 связок для Writing Band 7.5+</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLeadMagnet('speaking-cards')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="h-3 w-3 text-amber-400 shrink-0" />
                  <span>Speaking Part 2 & 3 Карточки</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLeadMagnet('roadmap-8weeks')}
                  className="hover:text-amber-400 transition-colors text-left flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="h-3 w-3 text-amber-400 shrink-0" />
                  <span>Пошаговый Notion-роадмап</span>
                </button>
              </li>
              <li>
                <a href="#technology" className="hover:text-amber-400 transition-colors">
                  Стек ИИ-технологий и NLP
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Юридическая информация */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Платформа & SaaS
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#pricing" className="hover:text-amber-400 transition-colors">
                  Тарифы и подписка
                </a>
              </li>
              <li>
                <span className="text-slate-400">Политика конфиденциальности</span>
              </li>
              <li>
                <span className="text-slate-400">Публичная оферта сервиса</span>
              </li>
              <li>
                <span className="text-slate-400">Безопасность платежей</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-6 border-t border-slate-900 text-[11px] text-slate-400 leading-relaxed">
          IELTS является зарегистрированным товарным знаком University of Cambridge, the British Council и IDP Education Australia. Платформа VERITAS IELTS AI является независимой образовательной SaaS-системой и предоставляет автономные симуляторы и аналитические инструменты оценки.
        </div>

      </div>
    </footer>
  );
};
