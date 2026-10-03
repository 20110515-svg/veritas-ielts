import React, { useState } from 'react';
import { Check, ShieldCheck, HelpCircle, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { PRICING_PLANS } from '../data/ieltsContent';
import { PricingPlan } from '../types/ielts';

interface PricingSectionProps {
  onLaunchMockTest: () => void;
  onOpenDiagnostic: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ 
  onLaunchMockTest,
  onOpenDiagnostic,
}) => {
  const [currency, setCurrency] = useState<'kzt' | 'rub' | 'usd'>('kzt');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'quarterly'>('monthly');

  const formatPrice = (plan: PricingPlan) => {
    let base = 0;
    let symbol = '';

    if (currency === 'kzt') {
      base = plan.monthlyPriceKzt;
      symbol = '₸';
    } else if (currency === 'rub') {
      base = plan.monthlyPriceRub;
      symbol = '₽';
    } else {
      base = plan.monthlyPriceUsd;
      symbol = '$';
    }

    if (base === 0) {
      return {
        amount: '0',
        period: 'навсегда',
        symbol,
      };
    }

    if (billingCycle === 'quarterly') {
      const discounted = Math.round(base * 0.8);
      return {
        amount: discounted.toLocaleString('ru-RU'),
        period: '/ мес. (при оплате за 3 мес)',
        symbol,
        oldAmount: base.toLocaleString('ru-RU'),
      };
    }

    return {
      amount: base.toLocaleString('ru-RU'),
      period: '/ мес.',
      symbol,
    };
  };

  const handlePlanClick = (planId: string) => {
    if (planId === 'free-diagnostic') {
      onOpenDiagnostic();
    } else {
      onLaunchMockTest();
    }
  };

  return (
    <section id="pricing" className="py-16 lg:py-24 border-b border-slate-800/80 bg-[#0b0f17]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            04. Прямой SaaS-доступ к платформе
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-3" style={{ textWrap: 'balance' }}>
            Прозрачные тарифы без менеджеров и скрытых доплат
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Доступ активируется мгновенно прямо в окне браузера. Никаких телефонных звонков, оффлайн-пакетов или ожидания расписания.
          </p>
        </div>

        {/* Toggles Bar: Currency + Billing */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-800">
          
          {/* Billing cycle toggle */}
          <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Помесячная подписка
            </button>
            <button
              onClick={() => setBillingCycle('quarterly')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                billingCycle === 'quarterly'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Квартальный Pass (-20%)
            </button>
          </div>

          {/* Currency Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Валюта:</span>
            <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-xl">
              {(['kzt', 'rub', 'usd'] as const).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-2.5 py-1 text-xs font-semibold uppercase rounded-md transition-all cursor-pointer ${
                    currency === curr
                      ? 'bg-slate-700 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const price = formatPrice(plan);

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl flex flex-col justify-between p-6 sm:p-8 transition-all ${
                  plan.isPopular
                    ? 'bg-slate-900 border-2 border-amber-400 shadow-2xl shadow-amber-500/10 ring-1 ring-amber-400/20'
                    : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Popularity Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-bold text-[11px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                    Самый популярный выбор
                  </div>
                )}

                <div>
                  {/* Plan Header */}
                  <div className="mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block mb-1">
                      {plan.kicker}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      {plan.title}
                    </h3>
                  </div>

                  {/* Price display */}
                  <div className="mb-6 pb-6 border-b border-slate-800">
                    <div className="flex items-baseline gap-1">
                      {price.amount === '0' ? (
                        <span className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                          Бесплатно
                        </span>
                      ) : (
                        <>
                          <span className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                            {price.amount} {price.symbol}
                          </span>
                          <span className="text-xs text-slate-400 ml-1">
                            {price.period}
                          </span>
                        </>
                      )}
                    </div>
                    {price.oldAmount && (
                      <span className="text-xs text-slate-500 line-through mt-0.5 block">
                        Обычная цена: {price.oldAmount} {price.symbol}
                      </span>
                    )}
                  </div>

                  {/* Ideal For note */}
                  <p className="text-xs text-slate-300 mb-6 italic leading-relaxed">
                    {plan.idealFor}
                  </p>

                  {/* Included Feature List */}
                  <div className="space-y-3 mb-8">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      В тариф включено:
                    </span>
                    {plan.includedFeatures.map((f, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{f}</span>
                      </div>
                    ))}

                    {plan.excludedFeatures && plan.excludedFeatures.length > 0 && (
                      <div className="pt-2 space-y-2 border-t border-slate-850">
                        {plan.excludedFeatures.map((ef, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-500">
                            <span className="h-4 w-4 flex items-center justify-center text-slate-600 font-bold shrink-0">✕</span>
                            <span className="line-through">{ef}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Direct Action Button */}
                <div>
                  <button
                    onClick={() => handlePlanClick(plan.id)}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      plan.isPopular
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center mt-3">
                    <Zap className="h-3 w-3 text-amber-400" />
                    <span>{plan.accessMode}</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Quiet assurance note */}
        <div className="mt-12 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400 max-w-2xl mx-auto">
          Все учебные материалы, тесты, проверка Writing и симулятор Speaking доступны 24/7 сразу после клика прямо в веб-приложении.
        </div>

      </div>
    </section>
  );
};
