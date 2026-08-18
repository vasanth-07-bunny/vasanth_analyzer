import React, { useState } from 'react';
import { RecommendationOutput, UserFeedbackState, FeedbackActionType } from '../types';
import {
  Sparkles,
  Play,
  HelpCircle,
  ThumbsDown,
  CheckCircle2,
  ShieldCheck,
  Clock,
  AlertOctagon,
  ChevronDown,
  ChevronUp,
  Award,
  Layers,
  Flame,
  Zap,
  TrendingUp,
  Sliders,
  Filter,
} from 'lucide-react';

interface RecommendationCardProps {
  recommendation: RecommendationOutput;
  feedbackState: UserFeedbackState;
  onWatch: () => void;
  onFeedback: (
    type: FeedbackActionType,
    topic?: string,
    subtopic?: string
  ) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  feedbackState,
  onWatch,
  onFeedback,
}) => {
  const [showDeepReasoning, setShowDeepReasoning] = useState(false);
  const [showQualityBreakdown, setShowQualityBreakdown] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; subtext: string } | null>(null);
  const [lastAction, setLastAction] = useState<FeedbackActionType | null>(null);

  const quality = recommendation.qualityBreakdown;

  const triggerFeedback = (
    type: FeedbackActionType,
    topic?: string,
    subtopic?: string
  ) => {
    setLastAction(type);
    onFeedback(type, topic, subtopic);

    const messages: Record<FeedbackActionType, { text: string; subtext: string }> = {
      more_like_this: {
        text: `Boosted Interest Weight: ${topic || recommendation.category}`,
        subtext: `Prioritizing ${subtopic ? `${subtopic} & ` : ''}${recommendation.category} systems in next recommendation ranking.`,
      },
      less_like_this: {
        text: `Decreased Weight: ${topic || recommendation.category}`,
        subtext: `Shifting recommendation distribution toward alternative computer science domains.`,
      },
      too_easy: {
        text: 'Adaptive Profile Updated: Advanced Difficulty',
        subtext: 'Boosting complex system architectures, concurrency models, and low-level mechanics.',
      },
      too_advanced: {
        text: 'Adaptive Profile Updated: Foundational Focus',
        subtext: 'Recommending core principles, step-by-step algorithms, and clear visual models.',
      },
      less_hype: {
        text: 'Strict Quality Filter Enabled',
        subtext: 'Applying aggressive penalty to sensationalized titles & superficial listicles.',
      },
      not_interested: {
        text: 'Recommendation Dismissed',
        subtext: 'Item removed from your feed and profile weights updated.',
      },
    };

    setToastMessage(messages[type]);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="relative bg-zinc-900 border border-emerald-500/40 rounded-2xl p-6 shadow-xl overflow-hidden space-y-6">
      {/* Toast Notification with Mathematical Profile Feedback */}
      {toastMessage && (
        <div className="absolute top-4 right-4 z-30 bg-emerald-500 text-zinc-950 px-4 py-2 rounded-lg shadow-2xl flex items-start gap-2.5 max-w-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="text-xs font-mono">
            <div className="font-bold">{toastMessage.text}</div>
            <div className="text-[11px] opacity-90 text-zinc-900 leading-tight mt-0.5">
              {toastMessage.subtext}
            </div>
          </div>
        </div>
      )}

      {/* Top Header Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            NEXT REEL FOR YOU — AI RECOMMENDED
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
            DOMAIN: {recommendation.category}
          </span>
          {recommendation.subtopic && (
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              SUB-TOPIC: {recommendation.subtopic}
            </span>
          )}
          <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
            DIFFICULTY: {recommendation.difficulty}
          </span>
          {quality && (
            <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 font-bold">
              GRADE: {quality.qualityGrade}
            </span>
          )}
        </div>
      </div>

      {/* Title & Channel Pitch */}
      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-bold font-mono text-zinc-100 leading-tight">
          "{recommendation.recommendedTechReel}"
        </h3>

        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
          <span className="text-emerald-400 font-semibold">{recommendation.channelName}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-zinc-400" />
            {recommendation.durationString}
          </span>
          <span>•</span>
          <span className="text-zinc-300">Confidence: {recommendation.confidence}</span>
        </div>
      </div>

      {/* 4 Score Metrics Indicators with Quality Rigor */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800 text-center">
          <div className="text-[10px] font-mono text-zinc-400 uppercase">INTEREST MATCH</div>
          <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
            {recommendation.interestMatch}%
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full"
              style={{ width: `${recommendation.interestMatch}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800 text-center">
          <div className="text-[10px] font-mono text-zinc-400 uppercase">TECH RELEVANCE</div>
          <div className="text-lg font-bold text-blue-400 font-mono mt-0.5">
            {recommendation.techRelevance}%
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-blue-400 h-full rounded-full"
              style={{ width: `${recommendation.techRelevance}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800 text-center">
          <div className="text-[10px] font-mono text-zinc-400 uppercase">HYPE RISK</div>
          <div className="text-lg font-bold text-emerald-300 font-mono mt-0.5">
            {recommendation.hypeRisk}
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full w-[12%]"></div>
          </div>
        </div>

        <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800 text-center">
          <div className="text-[10px] font-mono text-zinc-400 uppercase">VALUE SCORE</div>
          <div className="text-lg font-bold text-purple-400 font-mono mt-0.5">
            {recommendation.valueScore}/100
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-purple-400 h-full rounded-full"
              style={{ width: `${recommendation.valueScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Semantic Connection Reason */}
      <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
        <div className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          <span>WHY THIS RECOMMENDATION:</span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          "{recommendation.whyThisRecommendation}"
        </p>
      </div>

      {/* Content Quality & Rigor Assessment System */}
      {quality && (
        <div className="bg-zinc-950/80 border border-purple-500/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-300 uppercase">
              <Award className="w-4 h-4 text-purple-400" />
              <span>Content Quality & Technical Rigor System</span>
            </div>
            <button
              onClick={() => setShowQualityBreakdown(!showQualityBreakdown)}
              className="text-[11px] font-mono text-zinc-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
            >
              <span>{showQualityBreakdown ? 'Hide Rigor Matrix' : 'View Quality Pillars'}</span>
              {showQualityBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>Technical Accuracy</span>
                <span className="font-bold text-zinc-200">{quality.technicalAccuracy}%</span>
              </div>
              <div className="w-full bg-zinc-950 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{ width: `${quality.technicalAccuracy}%` }}
                ></div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>Depth of Explanation</span>
                <span className="font-bold text-zinc-200">{quality.depthOfExplanation}%</span>
              </div>
              <div className="w-full bg-zinc-950 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-blue-400 h-full rounded-full"
                  style={{ width: `${quality.depthOfExplanation}%` }}
                ></div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>Educational Value</span>
                <span className="font-bold text-zinc-200">{quality.educationalValue}%</span>
              </div>
              <div className="w-full bg-zinc-950 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-purple-400 h-full rounded-full"
                  style={{ width: `${quality.educationalValue}%` }}
                ></div>
              </div>
            </div>
          </div>

          {showQualityBreakdown && (
            <div className="pt-2 border-t border-zinc-800/80 space-y-2 text-xs">
              <div className="text-zinc-300">
                <strong className="text-purple-300 font-mono">Evaluator Verdict:</strong> {quality.verdict}
              </div>
              {quality.strengths.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {quality.strengths.map((str, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono"
                    >
                      ✓ {str}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Behavioral Evidence Checklist */}
      <div className="space-y-2">
        <div className="text-xs font-mono text-zinc-400 font-semibold uppercase flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Behavioral Evidence Tracing:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {recommendation.evidenceChecklist.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 p-2 rounded-lg bg-zinc-950/50 border border-zinc-800/80 text-xs text-zinc-300"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-snug">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Anti-Keyword Comparison Box */}
      {recommendation.alternativeBadRecommendation && (
        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3 text-xs">
          <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-mono font-semibold text-amber-300">
              What A Weak Keyword Engine Would Have Recommended:
            </div>
            <p className="text-zinc-300">
              <span className="line-through text-zinc-400">"{recommendation.alternativeBadRecommendation.title}"</span> —{' '}
              {recommendation.alternativeBadRecommendation.whyBad}
            </p>
          </div>
        </div>
      )}

      {/* Key Takeaways Collapsible */}
      <div className="pt-1">
        <button
          onClick={() => setShowDeepReasoning(!showDeepReasoning)}
          className="text-xs font-mono text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition-colors"
        >
          <span>
            {showDeepReasoning ? 'Hide Syllabus & Learning Objectives' : 'View Syllabus & Key Concepts Covered'}
          </span>
          {showDeepReasoning ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showDeepReasoning && (
          <div className="mt-3 p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs text-zinc-300">
            <div className="font-mono text-emerald-400 font-semibold mb-1">
              Curated High-Value Takeaways:
            </div>
            <ul className="list-disc pl-4 space-y-1 leading-relaxed">
              {recommendation.keyLearningTakeaways.map((takeaway, idx) => (
                <li key={idx}>{takeaway}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action Buttons & Complete User Feedback Control Loop */}
      <div className="pt-4 border-t border-zinc-800 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
        {/* Primary Watch & Explain */}
        <div className="flex items-center gap-2">
          <button
            onClick={onWatch}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold font-mono text-zinc-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md cursor-pointer whitespace-nowrap"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>WATCH TECH REEL</span>
          </button>

          <button
            onClick={() => setShowDeepReasoning(!showDeepReasoning)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors border border-zinc-700/60 whitespace-nowrap"
          >
            <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
            <span>WHY THIS?</span>
          </button>
        </div>

        {/* User Feedback Mechanism with all 5 required controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono text-zinc-400 uppercase mr-1 hidden sm:inline">
            Feedback Loop:
          </span>

          <button
            onClick={() => triggerFeedback('more_like_this', recommendation.category, recommendation.subtopic)}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors whitespace-nowrap flex items-center gap-1 ${
              lastAction === 'more_like_this'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                : 'text-zinc-200 bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 hover:text-emerald-300'
            }`}
            title="Increase weight for this category and sub-topic"
          >
            <span>+ More like this</span>
          </button>

          <button
            onClick={() => triggerFeedback('less_like_this', recommendation.category, recommendation.subtopic)}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors whitespace-nowrap flex items-center gap-1 ${
              lastAction === 'less_like_this'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                : 'text-zinc-300 bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 hover:text-amber-300'
            }`}
            title="Decrease weight for this category"
          >
            <span>- Less like this</span>
          </button>

          <button
            onClick={() => triggerFeedback('too_easy')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors whitespace-nowrap flex items-center gap-1 ${
              feedbackState.difficultyBias === 'Advanced'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                : 'text-zinc-300 bg-zinc-950 border border-zinc-800 hover:border-blue-500/50 hover:text-blue-300'
            }`}
            title="Adapt profile to recommend more advanced technical depth"
          >
            <Zap className="w-3 h-3 text-blue-400" />
            <span>Too easy</span>
          </button>

          <button
            onClick={() => triggerFeedback('too_advanced')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors whitespace-nowrap flex items-center gap-1 ${
              feedbackState.difficultyBias === 'Beginner'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                : 'text-zinc-300 bg-zinc-950 border border-zinc-800 hover:border-purple-500/50 hover:text-purple-300'
            }`}
            title="Adapt profile to recommend foundational & intermediate concepts"
          >
            <span>Too advanced</span>
          </button>

          <button
            onClick={() => triggerFeedback('less_hype')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors whitespace-nowrap flex items-center gap-1 ${
              feedbackState.hypeStrictness === 'Strict'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                : 'text-zinc-300 bg-zinc-950 border border-zinc-800 hover:border-rose-500/50 hover:text-rose-300'
            }`}
            title="Enforce strict anti-hype filtering on recommendations"
          >
            <Filter className="w-3 h-3 text-rose-400" />
            <span>Show fewer hype videos</span>
          </button>

          <button
            onClick={() => triggerFeedback('not_interested')}
            className="p-1.5 rounded-md text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
            title="Dismiss this recommendation"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
