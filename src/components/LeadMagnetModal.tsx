import React, { useState } from 'react';
import { X, Download, FileText, CheckCircle2, Sparkles, BookOpen, Layers } from 'lucide-react';
import { LEAD_MAGNETS } from '../data/ieltsContent';

interface LeadMagnetModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMagnetId?: string;
}

export const LeadMagnetModal: React.FC<LeadMagnetModalProps> = ({
  isOpen,
  onClose,
  initialMagnetId = 'writing-bible',
}) => {
  const [selectedId, setSelectedId] = useState<string>(initialMagnetId);
  const [userContact, setUserContact] = useState('');
  const [userName, setUserName] = useState('');
  const [isDownloaded, setIsDownloaded] = useState(false);

  if (!isOpen) return null;

  const currentMagnet = LEAD_MAGNETS.find((m) => m.id === selectedId) || LEAD_MAGNETS[0];

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userContact) return;
    setIsDownloaded(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Библиотека полезных материалов Veritas</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Бесплатные материалы для подготовки к IELTS
          </h3>
        </div>

        {/* Lead Magnet Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {LEAD_MAGNETS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedId(item.id);
                setIsDownloaded(false);
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                selectedId === item.id
                  ? 'bg-amber-500/10 border-amber-400 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="block text-[11px] font-semibold text-amber-400 truncate">
                {item.targetBand}
              </span>
              <span className="block text-xs font-bold text-white truncate">
                {item.title}
              </span>
            </button>
          ))}
        </div>

        {/* Current Lead Magnet Content Preview */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 mb-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <span className="text-xs font-mono text-amber-400 block mb-1">
                {currentMagnet.targetBand} · {currentMagnet.pageCount}
              </span>
              <h4 className="text-base sm:text-lg font-bold text-white">
                {currentMagnet.title}
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                {currentMagnet.description}
              </p>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl text-amber-400 shrink-0">
              <FileText className="h-6 w-6" />
            </div>
          </div>

          <p className="text-xs sm:text-sm font-serif italic text-slate-300 mb-4 bg-slate-900/60 p-3 rounded-lg border border-slate-850">
            «{currentMagnet.contentPreview}»
          </p>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Содержание материала:
            </span>
            <ul className="space-y-1.5 text-xs text-slate-200">
              {currentMagnet.highlights.map((pt: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 1-Click Instant Download in Browser */}
        {!isDownloaded ? (
          <div className="space-y-3">
            <button
              onClick={() => setIsDownloaded(true)}
              className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/10"
            >
              <Download className="h-4 w-4" />
              <span>Открыть и скачать PDF напрямую в браузере (Мгновенно)</span>
            </button>
            <p className="text-[11px] text-center text-slate-400">
              Без регистрации по телефону, без ожидания звонков. Прямой доступ к материалу.
            </p>
          </div>
        ) : (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-2">
            <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto" />
            <h5 className="text-sm font-bold text-white">Материал готов к изучению!</h5>
            <p className="text-xs text-slate-300">
              Руководство открыто. Вы можете использовать его во время прохождения симулятора CD-IELTS.
            </p>
            <button
              onClick={onClose}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg cursor-pointer"
            >
              <span>Перейти к практике</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
