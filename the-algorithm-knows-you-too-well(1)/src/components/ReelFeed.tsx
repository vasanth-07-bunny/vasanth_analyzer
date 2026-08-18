import React from 'react';
import { Reel } from '../types';
import { calculateReelInteractionScore } from '../services/interestEngine';
import {
  Heart,
  Bookmark,
  Repeat,
  Share2,
  AlertTriangle,
  Play,
  Flame,
  CheckCircle2,
  Code,
  Laptop,
  Shield,
  Sparkles,
  Terminal,
  Clock,
  Eye,
} from 'lucide-react';

interface ReelFeedProps {
  reels: Reel[];
  onToggleLike: (reelId: string) => void;
  onToggleSave: (reelId: string) => void;
  onToggleReplay: (reelId: string) => void;
  onUpdateWatchPct: (reelId: string, pct: number) => void;
  onSelectReelToPreview: (reel: Reel) => void;
}

export const ReelFeed: React.FC<ReelFeedProps> = ({
  reels,
  onToggleLike,
  onToggleSave,
  onToggleReplay,
  onUpdateWatchPct,
  onSelectReelToPreview,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Programming Meme':
        return <Terminal className="w-3.5 h-3.5 text-amber-400" />;
      case 'Developer Career':
      case 'Career / Programming':
        return <Code className="w-3.5 h-3.5 text-blue-400" />;
      case 'Hardware':
        return <Laptop className="w-3.5 h-3.5 text-emerald-400" />;
      case 'DSA':
        return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
      case 'Cybersecurity':
        return <Shield className="w-3.5 h-3.5 text-rose-400" />;
      case 'AI / Career':
        return <Flame className="w-3.5 h-3.5 text-orange-400" />;
      default:
        return <Terminal className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-zinc-800/80">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Section 1 — Interactive Reel Feed
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real student scrolling history & behavioral telemetry. Tweak likes, saves, or watch time to see the AI adapt live.
          </p>
        </div>
        <div className="text-xs font-mono text-zinc-400 bg-zinc-900 px-3 py-1 rounded-md border border-zinc-800 shrink-0">
          Total Analyzed: <span className="text-emerald-400 font-semibold">{reels.length} Reels</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reels.map((reel) => {
          const interactionScore = calculateReelInteractionScore(reel);
          const isHype = reel.hypeClassification?.isHype || reel.id === 'reel-06';

          return (
            <div
              key={reel.id}
              className={`group relative bg-zinc-900/90 rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                isHype
                  ? 'border-amber-500/30 hover:border-amber-500/60 bg-amber-950/10'
                  : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/90 hover:bg-zinc-900'
              }`}
            >
              {/* Top Banner / Number & Category */}
              <div className="p-4 pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-[11px] font-semibold text-zinc-300 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/50">
                    {reel.reelNumber}
                  </span>

                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-800/80 border border-zinc-700/50 text-[11px] font-medium text-zinc-300">
                    {getCategoryIcon(reel.category)}
                    <span className="truncate max-w-[120px]">{reel.category}</span>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-zinc-100 line-clamp-2 leading-snug group-hover:text-emerald-300 transition-colors">
                  {reel.title}
                </h3>

                <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {reel.content}
                </p>

                {/* Hype Warning Pill if applicable */}
                {isHype && (
                  <div className="mt-2.5 flex items-center gap-1.5 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                    <span className="truncate">Flagged: Low-Value / Hype Bait</span>
                  </div>
                )}
              </div>

              {/* Behavioral Indicators & Live Telemetry Controls */}
              <div className="p-4 pt-0 mt-auto space-y-3">
                {/* Watch Percentage Slider */}
                <div className="bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/80">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-400" /> Watch Time
                    </span>
                    <span
                      className={`font-semibold ${
                        reel.behavior.watchedPct >= 90
                          ? 'text-emerald-400'
                          : reel.behavior.watchedPct >= 70
                          ? 'text-amber-400'
                          : 'text-zinc-400'
                      }`}
                    >
                      {reel.behavior.watchedPct}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="2"
                    value={reel.behavior.watchedPct}
                    onChange={(e) => onUpdateWatchPct(reel.id, Number(e.target.value))}
                    className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                  />
                </div>

                {/* Interactive Action Buttons (Like, Save, Replay, Watch Preview) */}
                <div className="flex items-center justify-between gap-1 pt-1">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleLike(reel.id)}
                      className={`p-1.5 rounded-md text-xs font-medium border transition-colors ${
                        reel.behavior.liked
                          ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                          : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                      title={reel.behavior.liked ? 'Liked (+2 pts)' : 'Not liked'}
                    >
                      <Heart className={`w-3.5 h-3.5 ${reel.behavior.liked ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => onToggleSave(reel.id)}
                      className={`p-1.5 rounded-md text-xs font-medium border transition-colors ${
                        reel.behavior.saved
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                          : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                      title={reel.behavior.saved ? 'Saved (+4 pts high intentionality)' : 'Not saved'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${reel.behavior.saved ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => onToggleReplay(reel.id)}
                      className={`p-1.5 rounded-md text-xs font-medium border transition-colors ${
                        reel.behavior.replay
                          ? 'bg-purple-500/15 border-purple-500/40 text-purple-400'
                          : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                      title={reel.behavior.replay ? 'Replayed (+3 pts comprehension)' : 'No replay'}
                    >
                      <Repeat className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectReelToPreview(reel)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60 transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current text-emerald-400" />
                    <span>Simulator</span>
                  </button>
                </div>

                {/* Semantic Tags & Weight summary */}
                <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-1 overflow-hidden">
                    <span className="text-zinc-400 truncate max-w-[120px]">
                      {reel.semanticTags[0] || 'Tag'}
                    </span>
                    {reel.semanticTags[1] && (
                      <span className="text-zinc-400 text-[10px] bg-zinc-800/50 px-1 rounded truncate max-w-[80px]">
                        +{reel.semanticTags.length - 1}
                      </span>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-1 text-zinc-400">
                    <span>Weight:</span>
                    <span className="font-semibold text-emerald-400">{interactionScore}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
