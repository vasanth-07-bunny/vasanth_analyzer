import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Reel, AnalysisSummary, RecommendationOutput } from '../types';
import {
  Sparkles,
  CheckCircle,
  Loader2,
  X,
  ArrowRight,
  Brain,
  ShieldCheck,
  Zap,
  Terminal,
  Cpu,
  Layers,
} from 'lucide-react';

interface DemoModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: AnalysisSummary;
  recommendation: RecommendationOutput;
  reels: Reel[];
}

const DEMO_STEPS = [
  { step: 1, title: 'Analyzing Reel interactions...', detail: 'Calculating watch completion %, replays, deliberate saves, and quick skips across 8 Reels.' },
  { step: 2, title: 'Extracting semantic signals...', detail: 'Isolating compiler memes, dev career humor, DSA complexity, and laptop hardware benchmarks.' },
  { step: 3, title: 'Building interest graph...', detail: 'Connecting discrete topics into a unified semantic ontology network.' },
  { step: 4, title: 'Detecting underlying interests...', detail: 'Resolving the "Java Paradox": Distinguishing tool keywords from developer culture.' },
  { step: 5, title: 'Filtering low-value content...', detail: 'Applying anti-hype heuristics. Penalized superficial AI job listicles.' },
  { step: 6, title: 'Generating recommendation...', detail: 'Synthesizing career, algorithmic, and engineering signals into high-impact tech content.' },
];

export const DemoModeModal: React.FC<DemoModeModalProps> = ({
  isOpen,
  onClose,
  summary,
  recommendation,
  reels,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      setIsRevealed(false);
      return;
    }

    setCurrentStepIndex(0);
    setIsRevealed(false);

    // Progress through the 6 steps sequentially
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < DEMO_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setTimeout(() => {
            setIsRevealed(true);
            try {
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#34d399', '#10b981', '#6ee7b7', '#a7f3d0', '#ffffff'],
              });
            } catch (e) {
              // fallback if canvas not ready
            }
          }, 600);
          return prev;
        }
      });
    }, 700);

    return () => clearInterval(stepInterval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!isRevealed ? (
          /* Step-by-Step AI Pipeline Analysis Visualizer */
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 font-semibold">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>AI INFERENCE ENGINE ACTIVE</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-zinc-100">
                Processing Behavioral Signals...
              </h2>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Deconstructing short-form video interactions to uncover latent cognitive appetite.
              </p>
            </div>

            {/* 6 Steps Progress List */}
            <div className="space-y-3 pt-2">
              {DEMO_STEPS.map((stepItem, idx) => {
                const isCurrent = idx === currentStepIndex;
                const isDone = idx < currentStepIndex;

                return (
                  <div
                    key={stepItem.step}
                    className={`p-3 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
                      isCurrent
                        ? 'bg-emerald-950/30 border-emerald-500/50 shadow-sm'
                        : isDone
                        ? 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
                        : 'bg-zinc-950/20 border-zinc-900 text-zinc-600 opacity-60'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isDone ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-zinc-700 text-[10px] font-mono flex items-center justify-center text-zinc-500">
                          {stepItem.step}
                        </div>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div
                        className={`text-xs font-mono font-semibold ${
                          isCurrent
                            ? 'text-emerald-300'
                            : isDone
                            ? 'text-zinc-200'
                            : 'text-zinc-500'
                        }`}
                      >
                        Step {stepItem.step}: {stepItem.title}
                      </div>
                      <div className="text-[11px] text-zinc-400 leading-snug">
                        {stepItem.detail}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* The Dramatic Spotify-Wrapped Style Hackathon Reveal (Section 18 & 19) */
          <div className="space-y-6 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE ALGORITHM HAS SPOKEN</span>
            </div>

            {/* The Signature Hackathon Reveal Banner */}
            <div className="space-y-3 p-6 rounded-2xl bg-zinc-950 border border-emerald-500/30 relative overflow-hidden">
              <div className="text-sm font-mono text-zinc-400 uppercase tracking-wider">
                SURFACE OBSERVATION vs DEEP REALITY
              </div>

              <div className="text-xl sm:text-2xl font-bold font-mono text-zinc-400">
                YOU DON'T JUST LIKE JAVA.
              </div>

              <div className="text-2xl sm:text-4xl font-extrabold font-mono text-emerald-400 tracking-tight">
                YOU LIKE SOFTWARE ENGINEERING.
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed pt-2">
                Your feed showed 2 Java memes, but you also saved junior developer workflows, replayed binary search algorithms, and bookmarked GPU hardware benchmarks. The AI identified that you are passionate about <strong className="text-emerald-300">Software Architecture & Production Engineering</strong>.
              </p>
            </div>

            {/* Quick Evidence Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left text-xs text-zinc-300">
              <div className="p-2.5 bg-zinc-950/60 rounded-lg border border-zinc-800 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Repeated engagement with developer culture & compilation memes</span>
              </div>
              <div className="p-2.5 bg-zinc-950/60 rounded-lg border border-zinc-800 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>100% watch & saved coding interview preparation advice</span>
              </div>
              <div className="p-2.5 bg-zinc-950/60 rounded-lg border border-zinc-800 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Replayed algorithmic complexity breakdown</span>
              </div>
              <div className="p-2.5 bg-zinc-950/60 rounded-lg border border-zinc-800 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Rejected superficial AI job listicle hype (72% watch, 0 saves)</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-xs font-bold font-mono text-zinc-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg cursor-pointer"
              >
                EXPLORE INFERRED PROFILE & RECOMMENDATIONS
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
