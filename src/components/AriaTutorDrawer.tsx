import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Brain, 
  Bot, 
  Target, 
  RotateCcw, 
  CheckCircle2, 
  HelpCircle, 
  MessageSquare,
  Zap,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { requestAriaChat } from '../services/aiEngineClient';
import { AriaContext, AriaChatMessage } from '../services/ariaAITutor';

interface AriaTutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  studentContext?: Partial<AriaContext>;
}

export const AriaTutorDrawer: React.FC<AriaTutorDrawerProps> = ({
  isOpen,
  onClose,
  studentContext,
}) => {
  // Context state
  const [userName, setUserName] = useState<string>(studentContext?.userName || 'Alex');
  const [currentBand, setCurrentBand] = useState<number>(studentContext?.currentBand || 6.5);
  const [targetBand, setTargetBand] = useState<number>(studentContext?.targetBand || 7.5);
  const [currentModule, setCurrentModule] = useState<string>(studentContext?.currentModule || 'Academic Writing & Task 2');
  const [weakAreas] = useState<string[]>(
    studentContext?.weakAreas?.length 
      ? studentContext.weakAreas 
      : ['Task 1 Cohesion Linkers', 'Matching Headings in Reading', 'Part 3 Fluency']
  );

  // Messages state
  const [messages, setMessages] = useState<AriaChatMessage[]>([
    {
      id: 'aria-welcome',
      sender: 'aria',
      text: `Hello ${userName}! I'm **Aria**, your personal 1-on-1 IELTS AI Tutor. I'm actively tracking your diagnostic data toward **Band ${targetBand}** (current baseline: **Band ${currentBand}**).\n\nWhenever you write an essay sentence, get stuck on a reading heading, or feel overwhelmed by grammar, paste it here. I won't just hand you the answer—we will use the **Socratic method** so you master the pattern permanently.\n\nWhat would you like to tackle right now?`,
      timestamp: 'Just now',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || isTyping) return;

    const userMsg: AriaChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const history = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        text: m.text,
      }));

      const context: AriaContext = {
        userName,
        currentBand,
        targetBand,
        weakAreas,
        currentModule,
      };

      const res = await requestAriaChat({
        message: messageContent,
        history,
        context,
      });

      const ariaMsg: AriaChatMessage = {
        id: `aria-${Date.now()}`,
        sender: 'aria',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, ariaMsg]);
    } catch (err: any) {
      const fallbackMsg: AriaChatMessage = {
        id: `aria-err-${Date.now()}`,
        sender: 'aria',
        text: `I noticed a connection hiccup, but let's keep momentum! Remember that for **Band ${targetBand}**, consistency is key. Could you rephrase your question or paste your target sentence once more?`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `aria-reset-${Date.now()}`,
        sender: 'aria',
        text: `Fresh workspace ready, ${userName}! Ready to practice. Submit a sentence to upgrade to **Band ${targetBand}**, or ask about a tricky grammar structure.`,
        timestamp: 'Just now',
      },
    ]);
  };

  // Preset conversation prompts
  const starterPrompts = [
    {
      label: 'Check my practice sentence',
      prompt: 'Check this sentence: "The chart shows that the consumption of energy goes up very fast because people use a lot of cars."',
    },
    {
      label: 'Upgrade "First of all..." for Task 2',
      prompt: 'How can I upgrade the basic transition "First of all, I think..." into an academic C1/C2 structure?',
    },
    {
      label: 'Matching Headings strategy',
      prompt: 'Why do I keep falling for distractors in Reading Passage 2 Matching Headings? Can you give me a Socratic hint?',
    },
    {
      label: 'I feel overwhelmed with study',
      prompt: 'I feel stressed and overwhelmed by all the criteria. What should be my focused 3-step plan for today?',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border-l border-slate-700 h-full flex flex-col shadow-2xl">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#0c121e] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Aria</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                  Personal IELTS AI Tutor
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Powered by Google Gemini AI · 1-on-1 Socratic Mentor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={clearChat}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Начать новую сессию"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Закрыть панель тьютора"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Dynamic Context Banner */}
        <div className="px-4 py-2.5 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Студент:</span>
            <span className="font-semibold text-white">{userName}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">Текущий балл:</span>
            <span className="font-mono text-amber-300 font-bold">{currentBand.toFixed(1)}</span>
            <span className="text-slate-600">→</span>
            <span className="text-slate-400">Цель:</span>
            <span className="font-mono text-emerald-400 font-bold">Band {targetBand.toFixed(1)}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-mono">
            <Target className="h-3 w-3" />
            <span className="truncate max-w-[170px]">{currentModule}</span>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {messages.map((m) => {
            const isAria = m.sender === 'aria';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isAria ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                    isAria
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'bg-slate-800 border border-slate-700 text-slate-200'
                  }`}
                >
                  {isAria ? 'A' : userName.charAt(0) || 'U'}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed ${
                    isAria
                      ? 'bg-slate-950 border border-slate-800 text-slate-200'
                      : 'bg-amber-500/15 border border-amber-500/30 text-white ml-auto'
                  }`}
                >
                  {/* Message body with formatted bolding and line breaks */}
                  <div className="whitespace-pre-line space-y-2">
                    {m.text.split('\n\n').map((paragraph, pIdx) => {
                      // Simple inline markdown bolding parser for C1/C2 highlights
                      const parts = paragraph.split(/(\*\*.*?\*\*)/g);
                      return (
                        <p key={pIdx}>
                          {parts.map((part, partIdx) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return (
                                <strong key={partIdx} className="text-amber-300 font-bold">
                                  {part.slice(2, -2)}
                                </strong>
                              );
                            }
                            if (part.startsWith('*') && part.endsWith('*')) {
                              return (
                                <em key={partIdx} className="text-slate-300 italic">
                                  {part.slice(1, -1)}
                                </em>
                              );
                            }
                            return part;
                          })}
                        </p>
                      );
                    })}
                  </div>

                  <span className="block text-[10px] text-slate-500 mt-2 text-right">
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-xs">
                A
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-amber-300 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                <span>Aria анализирует контекст через Google Gemini...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Starter Prompts Carousel */}
        <div className="px-4 py-2 bg-slate-950/70 border-t border-slate-850 overflow-x-auto flex items-center gap-2 text-xs scrollbar-none">
          <span className="text-[11px] font-mono text-slate-500 shrink-0">Темы:</span>
          {starterPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p.prompt)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/50 text-[11px] whitespace-nowrap transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-800 bg-[#0c121e]">
          <div className="relative rounded-xl bg-slate-950 border border-slate-700 focus-within:border-amber-400 transition-colors">
            <textarea
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Спросите Aria о грамматике, напишите предложение или попросите совет... (Enter для отправки)"
              className="w-full p-3 pr-12 rounded-xl bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isTyping}
              className="absolute right-2.5 bottom-2.5 p-2 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:pointer-events-none text-slate-950 transition-all cursor-pointer shadow-sm"
              title="Отправить вопрос"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
            <span>Shift + Enter для новой строки</span>
            <span className="text-amber-400/80 font-mono">1-on-1 Socratic AI Mentor · No External Tutors</span>
          </div>
        </div>

      </div>
    </div>
  );
};
