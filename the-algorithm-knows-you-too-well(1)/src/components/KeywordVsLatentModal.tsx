import React from 'react';
import { X, AlertOctagon, CheckCircle2, Sparkles, Brain, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';

interface KeywordVsLatentModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  inline?: boolean;
}

export const KeywordVsLatentModal: React.FC<KeywordVsLatentModalProps> = ({
  isOpen = true,
  onClose,
  inline = false,
}) => {
  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>HACKATHON ARCHITECTURAL DIFFERENTIATOR</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-mono text-zinc-100">
          Naive Keyword Matching vs Latent Interest Agent
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
          Why traditional social-media recommendation algorithms fail students by optimizing for shallow engagement rather than deep technical growth.
        </p>
      </div>

      {/* Side by Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card: Naive Keyword Matching */}
        <div className="bg-zinc-950 border border-rose-500/30 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase">
                <AlertOctagon className="w-4 h-4" />
                <span>Weak Keyword Matcher</span>
              </div>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                Low Intelligence
              </span>
            </div>

            <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 font-mono text-[11px] text-zinc-300">
              <div className="text-zinc-500">// Naive Rule Engine:</div>
              <div className="text-rose-300 mt-1">
                if (reel.tags.includes('Java')) &#123;{'\n'}
                {'  '}return getMostViralJavaMeme();{'\n'}
                &#125;
              </div>
            </div>

            <div className="space-y-2 text-xs text-zinc-300">
              <div className="font-semibold text-zinc-200">Observed Feed:</div>
              <p className="text-zinc-400 text-[11px]">
                Student watched 2 Java memes and 1 coding interview joke.
              </p>
              <div className="font-semibold text-rose-400 pt-1">Algorithmic Conclusion:</div>
              <p className="p-2.5 rounded bg-rose-950/20 border border-rose-500/20 text-rose-200 text-xs">
                "The user is obsessed with Java. Send them 50 more Java syntax memes and 'Top 10 Java Tips' listicles."
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400 font-mono">
            Outcome: <strong className="text-rose-400">Echo Chamber Brainrot</strong>. Zero real CS career advancement.
          </div>
        </div>

        {/* Right Card: Latent Interest Understanding */}
        <div className="bg-zinc-950 border border-emerald-500/40 rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-lg">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                <Brain className="w-4 h-4" />
                <span>Our Latent Semantic Agent</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                Cognitive Reasoning
              </span>
            </div>

            <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 font-mono text-[11px] text-zinc-300">
              <div className="text-zinc-500">// Multi-Signal Latent Ontology:</div>
              <div className="text-emerald-300 mt-1">
                synthesize(cultureMemes, workflowReels, hardware, dsa){'\n'}
                → Inferred: <span className="text-white font-bold">SOFTWARE ENGINEERING (89%)</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-zinc-300">
              <div className="font-semibold text-zinc-200">Observed Feed:</div>
              <p className="text-zinc-400 text-[11px]">
                Java meme + dev life + coding interview + RTX GPU comparison.
              </p>
              <div className="font-semibold text-emerald-400 pt-1">Algorithmic Conclusion:</div>
              <p className="p-2.5 rounded bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 text-xs">
                "Java is merely a syntax artifact. The student is cultivating interest in Software Architecture, Developer Tools, and System Performance."
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400 font-mono">
            Outcome: <strong className="text-emerald-400">High-Value Tech Recommendations</strong> that bridge entertainment into mastery!
          </div>
        </div>
      </div>

      {/* 3 Core Tenets Banner */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left text-xs">
        <div className="space-y-1">
          <div className="font-mono font-bold text-zinc-200 flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold">01.</span> Anti-Echo Chamber
          </div>
          <p className="text-zinc-400 text-[11px]">
            Does not trap the student in infinite repeats of the same meme template.
          </p>
        </div>
        <div className="space-y-1">
          <div className="font-mono font-bold text-zinc-200 flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold">02.</span> Hype Filtration
          </div>
          <p className="text-zinc-400 text-[11px]">
            Actively demotes get-rich-quick AI spam and sensationalized fear mongering.
          </p>
        </div>
        <div className="space-y-1">
          <div className="font-mono font-bold text-zinc-200 flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold">03.</span> Scroll Elevation
          </div>
          <p className="text-zinc-400 text-[11px]">
            Transforms passive leisure scrolling into practical software engineering insights.
          </p>
        </div>
      </div>
    </div>
  );

  if (inline) {
    return <div className="p-2">{content}</div>;
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {content}
      </div>
    </div>
  );
};
