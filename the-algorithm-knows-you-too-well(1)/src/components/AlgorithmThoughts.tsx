import React, { useState } from 'react';
import { InterestScore, AnalysisSummary } from '../types';
import {
  Sparkles,
  Brain,
  CheckCircle,
  Info,
  ShieldCheck,
  Award,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AlgorithmThoughtsProps {
  interestScores: InterestScore[];
  summary: AnalysisSummary;
  onSelectCategory?: (category: string) => void;
}

export const AlgorithmThoughts: React.FC<AlgorithmThoughtsProps> = ({
  interestScores,
  summary,
  onSelectCategory,
}) => {
  const [expandedSubtopicsCategory, setExpandedSubtopicsCategory] = useState<string | null>(
    'Software Engineering'
  );

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-zinc-800/80">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <Brain className="w-4 h-4 text-emerald-400" />
            Section 2 — What The Algorithm Thinks
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Latent semantic inference model vs naive keyword matching. Discovering the student's true technical appetite.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800">
            Average Quality Score: <strong className="text-purple-400">{summary.averageQualityScore}/100</strong>
          </span>
        </div>
      </div>

      {/* Main Core Discovery Card */}
      <div className="relative bg-zinc-900 border border-emerald-500/30 rounded-2xl p-6 overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Brain className="w-48 h-48 text-emerald-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-400 font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>CORE INFERENCE DISCOVERY</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-mono font-bold text-zinc-100 tracking-tight">
              {summary.headlineDiscovery}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              The AI discovered that interactions with Java memes, junior developer lifestyle, and coding interviews represent a unified curiosity in <strong className="text-zinc-200">Software Engineering & Production Systems</strong>, rather than a narrow appetite for Java-only memes.
            </p>
          </div>

          <div className="bg-zinc-950/80 border border-zinc-800 p-4 rounded-xl shrink-0 w-full md:w-auto text-left space-y-2">
            <div className="text-[11px] font-mono text-zinc-400 uppercase">Primary Latent Domain</div>
            <div className="text-base font-bold text-emerald-400 font-mono">
              Software Engineering
            </div>
            <div className="text-[11px] text-zinc-400">
              Confidence: <span className="text-zinc-200 font-semibold">High (94%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interest Profile Bars with Subtopic Hierarchies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Scored Bars & Hierarchical Sub-Topics */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-semibold text-zinc-200 uppercase tracking-wider">
              Inferred Interest Profile & Sub-Topics
            </h4>
            <span className="text-[11px] font-mono text-zinc-400">Weighted Multi-Signal</span>
          </div>

          <div className="space-y-4 pt-1">
            {interestScores.map((item) => {
              const isJavaKeyword = item.category.toLowerCase().includes('java');
              const isPrimaryLatent = item.category === 'Software Engineering';
              const hasSubtopics = item.subtopics && item.subtopics.length > 0;
              const isExpanded = expandedSubtopicsCategory === item.category;

              return (
                <div
                  key={item.category}
                  className="p-3 bg-zinc-950/50 rounded-xl border border-zinc-800/80 space-y-2 group"
                >
                  <div
                    onClick={() => {
                      onSelectCategory?.(item.category);
                      if (hasSubtopics) {
                        setExpandedSubtopicsCategory(isExpanded ? null : item.category);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold transition-colors ${
                            isPrimaryLatent
                              ? 'text-emerald-400 font-bold'
                              : isJavaKeyword
                              ? 'text-amber-400/90'
                              : 'text-zinc-200 group-hover:text-zinc-100'
                          }`}
                        >
                          {item.category.toUpperCase()}
                        </span>
                        {item.isLatent ? (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans">
                            Latent
                          </span>
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-sans">
                            Direct
                          </span>
                        )}
                        {hasSubtopics && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                            {item.subtopics!.length} Sub-topics
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-400 text-[11px]">{item.level}</span>
                        <span className="font-bold text-zinc-100 font-mono w-10 text-right">
                          {item.score}%
                        </span>
                        {hasSubtopics && (
                          <span className="text-zinc-400">
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-zinc-800 flex">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isPrimaryLatent
                            ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                            : isJavaKeyword
                            ? 'bg-amber-400/70'
                            : item.score > 60
                            ? 'bg-zinc-300'
                            : 'bg-zinc-500'
                        }`}
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>

                    <p className="text-[11px] text-zinc-400 mt-1.5 line-clamp-1 group-hover:text-zinc-300 transition-colors">
                      {item.description}
                    </p>
                  </div>

                  {/* Expanded Subtopics Breakdown */}
                  {hasSubtopics && isExpanded && (
                    <div className="mt-3 pt-3 border-t border-zinc-800/80 space-y-2 pl-2">
                      <div className="text-[10px] font-mono text-zinc-400 uppercase">
                        Sub-Topic Specializations:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.subtopics!.map((sub) => (
                          <div
                            key={sub.id}
                            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between text-[11px] font-mono"
                          >
                            <span className="text-zinc-200 truncate">{sub.name}</span>
                            <span className="text-blue-400 font-bold shrink-0 ml-2">
                              {sub.score}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 cols: Explainability, Quality Scoring, and Java Paradox */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-amber-300">
              <Info className="w-4 h-4" />
              <span>THE "JAVA PARADOX" RESOLVED</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Why did Java score only <strong className="text-amber-300">33%</strong> even though 2 Reels explicitly mentioned Java?
            </p>
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 space-y-2 font-mono">
              <div className="text-rose-400">✗ Weak Keyword Model:</div>
              <div className="pl-2 border-l border-zinc-800">
                Count occurrences of "Java" → 2 hits → Conclude: "User wants more Java memes".
              </div>
              <div className="text-emerald-400 pt-1">✓ Our Latent Agent:</div>
              <div className="pl-2 border-l border-emerald-500/30 text-zinc-300">
                "Java meme" = Humor about compiler frustration + syntax structure. Combined with coding interviews and dev lifestyle, this signals curiosity in <strong>Software Engineering & Backend Systems</strong>.
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>BEHAVIORAL EVIDENCE SIGNALS</span>
            </div>
            <ul className="space-y-2 text-xs text-zinc-300">
              {summary.evidenceItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
