import React, { useState, useMemo } from 'react';
import {
  Reel,
  UserFeedbackState,
  RecommendationOutput,
  FeedbackActionType,
} from './types';
import { INITIAL_SAMPLE_REELS, PRESET_FEED_PROFILES } from './data/sampleReels';
import {
  analyzeUserInterests,
  rankRecommendations,
} from './services/interestEngine';
import { requestAIAnalysis } from './services/geminiService';

import { Header } from './components/Header';
import { ReelFeed } from './components/ReelFeed';
import { InterestGraphView } from './components/InterestGraphView';
import { AlgorithmThoughts } from './components/AlgorithmThoughts';
import { RecommendationCard } from './components/RecommendationCard';
import { DemoModeModal } from './components/DemoModeModal';
import { ReelPlayerModal } from './components/ReelPlayerModal';
import { KeywordVsLatentModal } from './components/KeywordVsLatentModal';
import { HypeFilterInspector } from './components/HypeFilterInspector';
import { AddReelModal } from './components/AddReelModal';
import { PrivacyBanner } from './components/PrivacyBanner';

import {
  Sparkles,
  Brain,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Terminal,
  Activity,
  Sliders,
  Filter,
  Award,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  // Feed state
  const [reels, setReels] = useState<Reel[]>(INITIAL_SAMPLE_REELS);
  const [activePresetId, setActivePresetId] = useState<string>('default');

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'overview' | 'graph' | 'algorithm' | 'hype' | 'comparison'>('overview');

  // User feedback state
  const [feedbackState, setFeedbackState] = useState<UserFeedbackState>({
    difficultyBias: 'Adaptive',
    hypeStrictness: 'Normal',
    categoryBoosts: {},
    subtopicBoosts: {},
    dismissedRecommendationIds: [],
    bookmarkedRecommendationIds: [],
    feedbackLog: [],
  });

  // Modals state
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activePreviewReel, setActivePreviewReel] = useState<Reel | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Derive analysis and ranked recommendations dynamically
  const { interestScores, summary, graphNodes, graphLinks } = useMemo(() => {
    return analyzeUserInterests(reels, feedbackState);
  }, [reels, feedbackState]);

  const rankedRecs = useMemo(() => {
    return rankRecommendations(reels, feedbackState);
  }, [reels, feedbackState]);

  const primaryRecommendation = rankedRecs[0];

  // Handlers for interactive Reel card modifications
  const handleToggleLike = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) =>
        r.id === reelId
          ? { ...r, behavior: { ...r.behavior, liked: !r.behavior.liked } }
          : r
      )
    );
  };

  const handleToggleSave = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) =>
        r.id === reelId
          ? { ...r, behavior: { ...r.behavior, saved: !r.behavior.saved } }
          : r
      )
    );
  };

  const handleToggleReplay = (reelId: string) => {
    setReels((prev) =>
      prev.map((r) =>
        r.id === reelId
          ? { ...r, behavior: { ...r.behavior, replay: !r.behavior.replay } }
          : r
      )
    );
  };

  const handleUpdateWatchPct = (reelId: string, pct: number) => {
    setReels((prev) =>
      prev.map((r) =>
        r.id === reelId
          ? {
              ...r,
              behavior: {
                ...r.behavior,
                watchedPct: pct,
                skippedEarly: pct < 40,
              },
            }
          : r
      )
    );
  };

  // Feedback loop handler
  const handleFeedback = (
    type: FeedbackActionType,
    topic?: string,
    subtopic?: string
  ) => {
    setFeedbackState((prev) => {
      const next = { ...prev };
      const impactNote =
        type === 'more_like_this'
          ? `Boosted +10% weight for ${topic || 'domain'}`
          : type === 'less_like_this'
          ? `Decreased -10% weight for ${topic || 'domain'}`
          : type === 'too_easy'
          ? 'Difficulty adapted to Advanced'
          : type === 'too_advanced'
          ? 'Difficulty adapted to Foundational'
          : type === 'less_hype'
          ? 'Strict anti-hype filtering enabled'
          : 'Recommendation dismissed';

      next.feedbackLog = [
        ...next.feedbackLog,
        {
          id: `fb-${Date.now()}`,
          type,
          topic,
          subtopic,
          recommendationId: primaryRecommendation?.id,
          recommendationTitle: primaryRecommendation?.recommendedTechReel,
          timestamp: Date.now(),
          impactNote,
        },
      ];

      if (type === 'more_like_this') {
        if (topic) {
          next.categoryBoosts = {
            ...next.categoryBoosts,
            [topic]: (next.categoryBoosts[topic] || 0) + 1,
          };
        }
        if (subtopic) {
          next.subtopicBoosts = {
            ...next.subtopicBoosts,
            [subtopic]: (next.subtopicBoosts[subtopic] || 0) + 1,
          };
        }
      } else if (type === 'less_like_this') {
        if (topic) {
          next.categoryBoosts = {
            ...next.categoryBoosts,
            [topic]: (next.categoryBoosts[topic] || 0) - 1,
          };
        }
        if (subtopic) {
          next.subtopicBoosts = {
            ...next.subtopicBoosts,
            [subtopic]: (next.subtopicBoosts[subtopic] || 0) - 1,
          };
        }
      } else if (type === 'too_easy') {
        next.difficultyBias = 'Advanced';
      } else if (type === 'too_advanced') {
        next.difficultyBias = 'Beginner';
      } else if (type === 'less_hype') {
        next.hypeStrictness = prev.hypeStrictness === 'Strict' ? 'Ultra' : 'Strict';
      } else if (type === 'not_interested' && primaryRecommendation) {
        next.dismissedRecommendationIds = [
          ...next.dismissedRecommendationIds,
          primaryRecommendation.id,
        ];
      }

      return next;
    });
  };

  const handleResetFeed = () => {
    setReels(INITIAL_SAMPLE_REELS);
    setActivePresetId('default');
    setFeedbackState({
      difficultyBias: 'Adaptive',
      hypeStrictness: 'Normal',
      categoryBoosts: {},
      subtopicBoosts: {},
      dismissedRecommendationIds: [],
      bookmarkedRecommendationIds: [],
      feedbackLog: [],
    });
  };

  const handleSelectPreset = (presetId: string) => {
    const found = PRESET_FEED_PROFILES.find((p) => p.id === presetId);
    if (found) {
      setReels(found.reels);
      setActivePresetId(presetId);
      setIsAddModalOpen(false);
    }
  };

  const handleAddCustomReel = (newReel: Reel) => {
    setReels((prev) => [newReel, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleRunAIAnalysis = async () => {
    setIsAnalyzing(true);
    setIsDemoModalOpen(true);
    try {
      await requestAIAnalysis(reels);
    } catch (e) {
      console.warn('AI service fallback engaged:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Privacy Guarantee Banner (Section 15 Spec) */}
      <PrivacyBanner />

      {/* Main Top Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRunDemo={handleRunAIAnalysis}
        onResetFeed={handleResetFeed}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        isAnalyzing={isAnalyzing}
        reelCount={reels.length}
      />

      {/* Live Profile Telemetry Bar */}
      <div className="bg-zinc-900/80 border-b border-zinc-800/80 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-300">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>AI AGENT STATUS:</span>
            <span className="text-emerald-400 font-bold">ONLINE & INFERRING</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400 hidden sm:inline">
              Profile: <strong className="text-zinc-200">{summary.primaryInterest}</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              Difficulty: <strong className="text-blue-400">{feedbackState.difficultyBias}</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              Hype Filter: <strong className="text-amber-400">{feedbackState.hypeStrictness}</strong>
            </span>
            {feedbackState.feedbackLog.length > 0 && (
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Feedback Count: {feedbackState.feedbackLog.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Dynamic Tab Panels */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Recommendation Card Prominently Positioned */}
            {primaryRecommendation ? (
              <RecommendationCard
                recommendation={primaryRecommendation}
                feedbackState={feedbackState}
                onWatch={() => {
                  setActivePreviewReel({
                    id: primaryRecommendation.id,
                    reelNumber: 'REC 01',
                    title: primaryRecommendation.recommendedTechReel,
                    category: primaryRecommendation.category as any,
                    content: primaryRecommendation.whyThisRecommendation,
                    behavior: { watchedPct: 100, liked: true, replay: true, saved: true },
                    semanticTags: ['AI Recommended', primaryRecommendation.category, primaryRecommendation.subtopic || 'Systems'],
                    directTopics: [primaryRecommendation.recommendedTechReel],
                    latentTopics: ['Software Engineering', primaryRecommendation.category],
                    durationSeconds: 60,
                    creatorHandle: primaryRecommendation.channelName,
                    viewCount: '1.8M',
                    likeCount: '320K',
                    commentCount: '4.2K',
                    visualPreviewType: 'dsa_anim',
                    qualityBreakdown: primaryRecommendation.qualityBreakdown,
                  });
                }}
                onFeedback={handleFeedback}
              />
            ) : null}

            {/* Reel Feed Component */}
            <ReelFeed
              reels={reels}
              onToggleLike={handleToggleLike}
              onToggleSave={handleToggleSave}
              onToggleReplay={handleToggleReplay}
              onUpdateWatchPct={handleUpdateWatchPct}
              onSelectReelToPreview={(reel) => setActivePreviewReel(reel)}
            />

            {/* Algorithm Thoughts Preview */}
            <AlgorithmThoughts
              interestScores={interestScores}
              summary={summary}
              onSelectCategory={() => setActiveTab('algorithm')}
            />

            {/* Interactive Graph Component */}
            <InterestGraphView
              nodes={graphNodes}
              links={graphLinks}
            />
          </div>
        )}

        {activeTab === 'graph' && (
          <InterestGraphView
            nodes={graphNodes}
            links={graphLinks}
          />
        )}

        {activeTab === 'algorithm' && (
          <AlgorithmThoughts
            interestScores={interestScores}
            summary={summary}
          />
        )}

        {activeTab === 'hype' && <HypeFilterInspector />}

        {activeTab === 'comparison' && (
          <KeywordVsLatentModal
            isOpen={true}
            onClose={() => setActiveTab('overview')}
            summary={summary}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-800/80 py-6 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>The Algorithm Knows You Too Well — AI Recommendation Engine</span>
          </div>
          <div>
            Built with React, TypeScript, and Hierarchical Latent Semantic Engine
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <DemoModeModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        reels={reels}
        summary={summary}
        recommendation={primaryRecommendation}
      />

      <AddReelModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddReel={handleAddCustomReel}
        presets={PRESET_FEED_PROFILES}
        activePresetId={activePresetId}
        onSelectPreset={handleSelectPreset}
      />

      {activePreviewReel && (
        <ReelPlayerModal
          reel={activePreviewReel}
          onClose={() => setActivePreviewReel(null)}
          onToggleLike={() => handleToggleLike(activePreviewReel.id)}
          onToggleSave={() => handleToggleSave(activePreviewReel.id)}
        />
      )}
    </div>
  );
}
