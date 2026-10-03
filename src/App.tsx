import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AudienceSection } from './components/AudienceSection';
import { InteractiveCalculator } from './components/InteractiveCalculator';
import { ModulesSection } from './components/ModulesSection';
import { PricingSection } from './components/PricingSection';
import { TechnologySection } from './components/TechnologySection';
import { CaseStudiesSection } from './components/CaseStudiesSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { DiagnosticQuizModal } from './components/DiagnosticQuizModal';
import { LeadMagnetModal } from './components/LeadMagnetModal';
import { DesignConceptDrawer } from './components/DesignConceptDrawer';
import { MockTestView } from './components/mock/MockTestView';
import { AriaTutorDrawer } from './components/AriaTutorDrawer';

export default function App() {
  const [isMockTestActive, setIsMockTestActive] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isLeadMagnetOpen, setIsLeadMagnetOpen] = useState(false);
  const [selectedLeadMagnetId, setSelectedLeadMagnetId] = useState('writing-bible');
  const [isConceptGuideOpen, setIsConceptGuideOpen] = useState(false);
  const [isAriaOpen, setIsAriaOpen] = useState(false);

  const handleOpenLeadMagnet = (magnetId?: string) => {
    if (magnetId) {
      setSelectedLeadMagnetId(magnetId);
    }
    setIsLeadMagnetOpen(true);
  };

  // If Full Mock Test simulation is active, render the dedicated CD-IELTS workspace
  if (isMockTestActive) {
    return <MockTestView onExit={() => setIsMockTestActive(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* 1. Top Bar Contract */}
      <Header
        onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
        onToggleConceptGuide={() => setIsConceptGuideOpen(true)}
        onLaunchMockTest={() => setIsMockTestActive(true)}
        onOpenAria={() => setIsAriaOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection
          onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
          onOpenLeadMagnet={handleOpenLeadMagnet}
          onLaunchMockTest={() => setIsMockTestActive(true)}
        />

        {/* 2. Кому подойдет курс (Audience & Segmentation) */}
        <AudienceSection
          onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
        />

        {/* 3. Интерактивный Калькулятор & План */}
        <InteractiveCalculator
          onLaunchMockTest={() => setIsMockTestActive(true)}
          onOpenLeadMagnet={handleOpenLeadMagnet}
        />

        {/* 4. Модули обучения & Интерактивный разбор эссе 6.0 vs 8.0 */}
        <ModulesSection
          onLaunchMockTest={() => setIsMockTestActive(true)}
          onOpenLeadMagnet={handleOpenLeadMagnet}
        />

        {/* 5. Тарифы и форматы обучения (SaaS Platform Pass) */}
        <PricingSection
          onLaunchMockTest={() => setIsMockTestActive(true)}
          onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
        />

        {/* 6. Технологии ИИ и архитектура автономии (TechnologySection) */}
        <TechnologySection
          onLaunchMockTest={() => setIsMockTestActive(true)}
          onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
        />

        {/* 7. Отзывы и кейсы («Было → Стало» + TRF) */}
        <CaseStudiesSection
          onLaunchMockTest={() => setIsMockTestActive(true)}
        />

        {/* 8. Часто задаваемые вопросы (FAQ) */}
        <FaqSection
          onLaunchMockTest={() => setIsMockTestActive(true)}
          onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
        />
      </main>

      {/* 9. Футер и финальный захват */}
      <Footer
        onLaunchMockTest={() => setIsMockTestActive(true)}
        onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
        onOpenLeadMagnet={handleOpenLeadMagnet}
      />

      {/* Floating 1-on-1 AI Tutor Button */}
      <button
        onClick={() => setIsAriaOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer group border border-amber-300"
        title="Открыть персонального тьютора Aria"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-slate-950"></span>
        </span>
        <Sparkles className="h-4 w-4" />
        <span>Aria · 1-on-1 AI Tutor</span>
      </button>

      {/* Interactive Modals & Drawers */}
      <DiagnosticQuizModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        onLaunchMockTest={() => {
          setIsDiagnosticOpen(false);
          setIsMockTestActive(true);
        }}
      />

      <LeadMagnetModal
        isOpen={isLeadMagnetOpen}
        onClose={() => setIsLeadMagnetOpen(false)}
        initialMagnetId={selectedLeadMagnetId}
      />

      <DesignConceptDrawer
        isOpen={isConceptGuideOpen}
        onClose={() => setIsConceptGuideOpen(false)}
      />

      {/* Aria Personal IELTS AI Tutor Drawer */}
      <AriaTutorDrawer
        isOpen={isAriaOpen}
        onClose={() => setIsAriaOpen(false)}
        studentContext={{
          userName: 'Alex',
          currentBand: 6.5,
          targetBand: 7.5,
          weakAreas: ['Task 1 Cohesion Linkers', 'Matching Headings in Reading', 'Part 3 Fluency'],
          currentModule: 'Academic Writing & Task 2',
        }}
      />
    </div>
  );
}
