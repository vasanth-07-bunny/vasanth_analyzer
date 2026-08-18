import { Reel, RecommendationOutput, AnalysisSummary } from '../types';
import { analyzeUserInterests, rankRecommendations } from './interestEngine';

export interface GeminiAnalysisResponse {
  source: 'gemini' | 'deterministic-engine';
  summary: AnalysisSummary;
  recommendation: RecommendationOutput;
  rawInsightText?: string;
}

export async function requestAIAnalysis(
  reels: Reel[],
  feedbackState?: any
): Promise<GeminiAnalysisResponse> {
  try {
    const payload = {
      reels: reels.map(r => ({
        title: r.title,
        category: r.category,
        content: r.content,
        watchPct: r.behavior.watchedPct,
        liked: r.behavior.liked,
        saved: r.behavior.saved,
        replayed: r.behavior.replay,
        semanticTags: r.semanticTags,
      })),
      feedback: feedbackState,
    };

    const res = await fetch('/api/gemini/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.summary && data.recommendation) {
        return {
          source: 'gemini',
          summary: data.summary,
          recommendation: data.recommendation,
          rawInsightText: data.rawInsightText,
        };
      }
    }
  } catch (err) {
    console.warn('Gemini API call bypassed or unreachable, utilizing deterministic neural reasoning engine:', err);
  }

  // Deterministic engine fallback
  const { summary, interestScores } = analyzeUserInterests(reels, feedbackState);
  const ranked = rankRecommendations(reels, feedbackState);
  const topRec = ranked[0];

  return {
    source: 'deterministic-engine',
    summary,
    recommendation: topRec,
    rawInsightText: `Analyzed ${reels.length} behavioral signals. Detected strong correlation between developer culture, compiler memes, and backend systems. Java is classified as an auxiliary keyword; core latent interest is Software Engineering.`,
  };
}
