import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Play, Pause, Volume2, Sparkles, Clock, CheckCircle2, RotateCcw } from 'lucide-react';
import { SPEAKING_PARTS, evaluateIELTSSpeaking } from '../../data/ieltsDemoTest';
import { AIEvaluationResult } from '../../types/mockTest';
import { requestSpeakingEvaluation } from '../../services/aiEngineClient';

interface SpeakingSectionProps {
  currentPart: number; // 1, 2, or 3
  onSelectPart: (part: number) => void;
  transcripts: { part1: string[]; part2: string; part3: string[] };
  onUpdateTranscript: (part: number, text: string) => void;
  speakingEvaluation?: AIEvaluationResult;
  onEvaluationComplete: (result: AIEvaluationResult) => void;
}

export const SpeakingSection: React.FC<SpeakingSectionProps> = ({
  currentPart,
  onSelectPart,
  transcripts,
  onUpdateTranscript,
  speakingEvaluation,
  onEvaluationComplete,
}) => {
  const activePart = SPEAKING_PARTS.find((p) => p.partNumber === currentPart) || SPEAKING_PARTS[0];
  const [isRecording, setIsRecording] = useState(false);
  const [prepTimeRemaining, setPrepTimeRemaining] = useState<number>(60);
  const [isPrepping, setIsPrepping] = useState(false);
  const [speechTimer, setSpeechTimer] = useState(0);
  const [isExaminerSpeaking, setIsExaminerSpeaking] = useState(false);
  const [sampleSpeechText, setSampleSpeechText] = useState('');
  const [prepNotes, setPrepNotes] = useState('');

  const prepIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const speechIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Play examiner question with SpeechSynthesis
  const speakExaminerPrompt = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsExaminerSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-GB';
      utterance.rate = 0.95;
      utterance.onend = () => setIsExaminerSpeaking(false);
      utterance.onerror = () => setIsExaminerSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Start 1-minute preparation timer for Part 2
  const startPrepTimer = () => {
    setIsPrepping(true);
    setPrepTimeRemaining(60);
    if (prepIntervalRef.current) clearInterval(prepIntervalRef.current);

    prepIntervalRef.current = setInterval(() => {
      setPrepTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(prepIntervalRef.current!);
          setIsPrepping(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Toggle Microphone recording
  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
    } else {
      // Start recording
      setIsRecording(true);
      setSpeechTimer(0);

      // Start recording timer
      speechIntervalRef.current = setInterval(() => {
        setSpeechTimer((prev) => prev + 1);
      }, 1000);

      // Web Speech Recognition if available, or simulate realistic transcription
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        try {
          const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-GB';

          recognition.onresult = (event: any) => {
            let currentText = '';
            for (let i = 0; i < event.results.length; i++) {
              currentText += event.results[i][0].transcript + ' ';
            }
            setSampleSpeechText(currentText);
            onUpdateTranscript(currentPart, currentText);
          };

          recognition.start();
        } catch {
          // Fallback to text simulation
        }
      }
    }
  };

  // Fill sample response for quick review
  const handleInsertSampleResponse = () => {
    let sample = '';
    if (currentPart === 1) {
      sample = "I'm originally from Almaty. What I appreciate most is the dramatic proximity of the Tian Shan mountains, which provides an incredible natural escape from urban congestion. In recent years, technological tools like digital planners and synchronized cloud calendars have dramatically streamlined how I prioritize academic assignments.";
    } else if (currentPart === 2) {
      sample = "I would like to describe an ambitious academic endeavor I completed last year, which was designing a centralized solar-powered water filtration prototype for an engineering competition. The foremost obstacle was managing supply shortages and balancing rigorous algorithmic modeling with hardware fabrication. By establishing a rigid agile workflow and consulting university mentors, we succeeded in testing the system, and receiving the first prize was an extraordinarily fulfilling milestone.";
    } else {
      sample = "From my perspective, modern society idolizes rapid metrics of success primarily because digital communications amplify instant gratification and social comparison. When young individuals witness hyper-visible breakthrough founders online, it fosters unrealistic psychological expectations that can inhibit long-term perseverance.";
    }
    setSampleSpeechText(sample);
    onUpdateTranscript(currentPart, sample);
  };

  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleRunEvaluation = async () => {
    const text = sampleSpeechText || transcripts.part2 || (transcripts.part1 && transcripts.part1.join(' ')) || (transcripts.part3 && transcripts.part3.join(' ')) || "Sample candidate response...";
    setIsEvaluating(true);
    try {
      const output = await requestSpeakingEvaluation({
        part: `Part ${currentPart}` as 'Part 1' | 'Part 2' | 'Part 3',
        targetQuestion: activePart.title,
        candidateTranscript: text,
      });

      const evalResult: AIEvaluationResult = {
        overallBand: output.overallBand,
        criteriaScores: {
          taskResponse: output.criteriaScores.fluencyCoherence,
          coherenceCohesion: output.criteriaScores.fluencyCoherence,
          lexicalResource: output.criteriaScores.lexicalResource,
          grammaticalAccuracy: output.criteriaScores.grammaticalAccuracy,
        },
        scores: {
          criterion1: {
            name: 'Fluency & Coherence',
            band: output.criteriaScores.fluencyCoherence,
            feedback: output.detailedFeedback.fluencyCoherence,
          },
          criterion2: {
            name: 'Lexical Resource',
            band: output.criteriaScores.lexicalResource,
            feedback: output.detailedFeedback.lexicalResource,
          },
          criterion3: {
            name: 'Grammatical Range & Accuracy',
            band: output.criteriaScores.grammaticalAccuracy,
            feedback: output.detailedFeedback.grammaticalAccuracy,
          },
          criterion4: {
            name: 'Pronunciation',
            band: output.criteriaScores.pronunciation,
            feedback: output.detailedFeedback.pronunciation,
          },
        },
        summaryRecommendation: output.overallBand >= 8.0
          ? 'Fluent, natural delivery with strong academic register and minimal filler pauses.'
          : 'Competent spoken production; minimize conversational fillers and extend abstract discourse depth.',
        detectedStrengths: output.transcriptAnalysis.keyCollocationsUsed.slice(0, 3),
        detectedWeaknesses: output.transcriptAnalysis.grammarErrors.map((g) => `${g.phrase} → ${g.correction}`),
      };

      onEvaluationComplete(evalResult);
    } catch (err) {
      console.error('Failed speaking evaluation:', err);
      const evalResult = evaluateIELTSSpeaking([text], Math.max(45, speechTimer));
      onEvaluationComplete(evalResult);
    } finally {
      setIsEvaluating(false);
    }
  };

  useEffect(() => {
    return () => {
      if (prepIntervalRef.current) clearInterval(prepIntervalRef.current);
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);
      window.speechSynthesis?.cancel();
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Speaking Parts Header Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 block mb-1">
            Official IELTS Speaking Simulator
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {activePart.title}
          </h2>
        </div>

        {/* Part Tabs */}
        <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              onClick={() => onSelectPart(p)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentPart === p
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Part {p}
            </button>
          ))}
        </div>
      </div>

      {/* Part Details & Interactive Elements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Examiner Questions / Cue Card (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Инструкция экзаменатора:
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activePart.instructions}
            </p>
          </div>

          {/* Part 1 or Part 3 Questions */}
          {(currentPart === 1 || currentPart === 3) && activePart.questions && (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                Вопросы экзаменатора:
              </span>
              {activePart.questions.map((q, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono text-slate-500 block mb-1">Вопрос {idx + 1}</span>
                    <p className="text-sm font-medium text-white">{q}</p>
                  </div>
                  <button
                    onClick={() => speakExaminerPrompt(q)}
                    className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 shrink-0 transition-colors cursor-pointer"
                    title="Озвучить вопрос голосом экзаменатора"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Part 2: Cue Card with 1-Minute Prep Countdown */}
          {currentPart === 2 && activePart.cueCard && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-400/80 shadow-lg">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-2">
                  Candidate Task Card (Cue Card)
                </span>
                <h4 className="text-base sm:text-lg font-bold text-white mb-3">
                  {activePart.cueCard.topic}
                </h4>
                <p className="text-xs text-slate-400 mb-2">You should say:</p>
                <ul className="space-y-1.5 text-xs text-slate-200 pl-4 list-disc">
                  {activePart.cueCard.bulletPoints.map((bp, idx) => (
                    <li key={idx}>{bp}</li>
                  ))}
                </ul>
              </div>

              {/* 1-Minute Preparation Timer Box */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Время на подготовку заметок:</span>
                  <span className="text-xs text-slate-400">1 минута по официальным правилам</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="font-mono text-lg font-bold text-amber-400 bg-slate-950 px-3 py-1 rounded border border-slate-700">
                    {prepTimeRemaining}s
                  </div>
                  <button
                    onClick={startPrepTimer}
                    disabled={isPrepping}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isPrepping ? 'Идет отсчет...' : 'Старт (1 мин)'}
                  </button>
                </div>
              </div>

              {/* Candidate Scratchpad Notepad */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Черновик для заметок (Scratchpad):
                </label>
                <textarea
                  value={prepNotes}
                  onChange={(e) => setPrepNotes(e.target.value)}
                  placeholder="Запишите ключевые слова и связки (e.g. 1. solar project, 2. supply shortage, 3. agile workflow)..."
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-amber-400 resize-none h-20"
                />
              </div>
            </div>
          )}

        </div>

        {/* Right: Audio Recording Console & Speech Analytics (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          
          <div className="text-center pb-4 border-b border-slate-800">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Запись устного ответа кандидата
            </span>
            <div className="font-mono text-3xl font-extrabold text-white my-2">
              00:{speechTimer.toString().padStart(2, '0')}
            </div>
            <span className="text-xs text-slate-400">
              Лимит времени: ~{activePart.speakingTimeSeconds} сек.
            </span>
          </div>

          {/* Animated Visualizer / Microphone Button */}
          <div className="flex flex-col items-center justify-center py-4">
            <button
              onClick={toggleRecording}
              className={`h-20 w-20 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xl ${
                isRecording
                  ? 'bg-rose-500 text-white ring-8 ring-rose-500/20 animate-pulse'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 ring-4 ring-amber-400/20'
              }`}
            >
              {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
            </button>
            <span className="text-xs font-bold text-slate-300 mt-3">
              {isRecording ? 'Идет запись речи... Нажмите для завершения' : 'Нажмите микрофон для ответа'}
            </span>

            {/* Visual audio frequency bars */}
            {isRecording && (
              <div className="flex items-center gap-1 mt-4 h-6">
                {[40, 70, 90, 60, 100, 50, 80, 45, 95, 30].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="w-1 bg-amber-400 rounded-full animate-bounce"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Live Transcript / Response Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Транскрипт вашей речи:
              </span>
              <button
                onClick={handleInsertSampleResponse}
                className="text-[11px] text-amber-400 hover:underline cursor-pointer"
              >
                Вставить образец речи
              </button>
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl min-h-[90px] text-xs font-serif text-slate-300 leading-relaxed italic">
              {sampleSpeechText || transcripts.part2 || 'Здесь появится расшифровка вашего голоса в реальном времени...'}
            </div>
          </div>

          {/* Run Evaluation Button */}
          <button
            onClick={handleRunEvaluation}
            className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/10"
          >
            <Sparkles className="h-4 w-4" />
            <span>Оценить Speaking (AI Evaluator)</span>
          </button>

          {/* Evaluation Result */}
          {speakingEvaluation && (
            <div className="p-4 rounded-xl bg-slate-900 border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Оценка Speaking:</span>
                <span className="font-mono font-extrabold text-amber-400 text-sm">
                  Band {speakingEvaluation.overallBand.toFixed(1)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-950 border border-slate-850">
                  <span className="text-slate-400 block">Fluency:</span>
                  <span className="font-bold text-white font-mono">{speakingEvaluation.scores.criterion1.band.toFixed(1)}</span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-850">
                  <span className="text-slate-400 block">Lexical:</span>
                  <span className="font-bold text-white font-mono">{speakingEvaluation.scores.criterion2.band.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 italic">
                {speakingEvaluation.summaryRecommendation}
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
