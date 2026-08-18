import React, { useState, useEffect } from 'react';
import { Reel } from '../types';
import { calculateReelInteractionScore } from '../services/interestEngine';
import {
  X,
  Heart,
  Bookmark,
  Repeat,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Sparkles,
  AlertTriangle,
  Terminal,
  Cpu,
  Shield,
  Code,
  Zap,
  ArrowRight,
} from 'lucide-react';

interface ReelPlayerModalProps {
  reel: Reel | null;
  onClose: () => void;
  onToggleLike: (reelId: string) => void;
  onToggleSave: (reelId: string) => void;
  onToggleReplay: (reelId: string) => void;
}

export const ReelPlayerModal: React.FC<ReelPlayerModalProps> = ({
  reel,
  onClose,
  onToggleLike,
  onToggleSave,
  onToggleReplay,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!reel) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0; // loop
        }
        return prev + 2;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [reel]);

  if (!reel) return null;

  const interactionScore = calculateReelInteractionScore(reel);
  const isHype = reel.hypeClassification?.isHype || reel.id === 'reel-06';

  // Render animated simulated visual inside the vertical phone frame
  const renderVisualContent = () => {
    switch (reel.visualPreviewType) {
      case 'meme':
        return (
          <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-6 text-center font-mono relative overflow-hidden">
            <div className="absolute inset-0 bg-emerald-500/5 backdrop-blur-[2px]"></div>
            <div className="relative z-10 w-full max-w-[280px] bg-zinc-900/90 border border-zinc-700/80 rounded-lg p-4 shadow-xl text-left">
              <div className="flex items-center gap-1.5 pb-2 border-b border-zinc-800 text-[10px] text-zinc-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                <span className="ml-2 font-mono">Main.java — bash</span>
              </div>
              <pre className="text-[11px] text-zinc-300 mt-2 font-mono leading-relaxed">
                <span className="text-purple-400">public class</span> Main &#123;{'\n'}
                {'  '}<span className="text-purple-400">public static void</span> main(...) &#123;{'\n'}
                {'    '}<span className="text-zinc-500">// 4 hours of debugging...</span>{'\n'}
                {'    '}System.out.println(<span className="text-emerald-300">"IT WORKS! 💀"</span>);{'\n'}
                {'  '}&#125;{'\n'}
                &#125;
              </pre>
              <div className="mt-3 p-2 bg-emerald-950/40 border border-emerald-500/40 rounded text-[11px] text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>BUILD SUCCESSFUL (0 errors)</span>
              </div>
            </div>
            <div className="relative z-10 mt-6 px-4 py-2 bg-zinc-900/80 border border-zinc-800 rounded-full text-xs font-medium text-zinc-200">
              POV: You finally fixed NullPointerException 🎉
            </div>
          </div>
        );

      case 'code':
        return (
          <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-6 text-center font-mono relative overflow-hidden">
            <div className="relative z-10 w-full max-w-[280px] bg-zinc-900 border border-purple-500/30 rounded-lg p-4 shadow-xl text-left">
              <div className="text-[11px] font-semibold text-purple-400 flex items-center justify-between">
                <span>INTERVIEW REEL</span>
                <span className="text-[10px] text-zinc-400">O(log N) vs O(N)</span>
              </div>
              <div className="mt-3 space-y-2 text-[11px] text-zinc-300">
                <div className="p-2 bg-zinc-950 rounded border border-zinc-800 flex items-center justify-between">
                  <span>Linear Search:</span>
                  <span className="text-rose-400 font-mono">1,000,000 steps</span>
                </div>
                <div className="p-2 bg-purple-950/40 rounded border border-purple-500/40 flex items-center justify-between">
                  <span>Binary Search:</span>
                  <span className="text-emerald-400 font-mono">20 steps max 🔥</span>
                </div>
              </div>
              <div className="mt-3 text-[11px] text-zinc-400">
                "Stop memorizing solutions. Understand the search space halving property!"
              </div>
            </div>
          </div>
        );

      case 'career':
        return (
          <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            <div className="relative z-10 w-full max-w-[280px] bg-zinc-900/95 border border-blue-500/30 rounded-lg p-4 shadow-xl text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 pb-2 border-b border-zinc-800">
                <Code className="w-4 h-4" />
                <span>Junior Dev Git Commits</span>
              </div>
              <div className="mt-3 space-y-1.5 font-mono text-[11px]">
                <div className="text-emerald-400">✓ git add .</div>
                <div className="text-emerald-400">✓ git commit -m "fix final final"</div>
                <div className="text-rose-400">✗ CONFLICT: production branch</div>
                <div className="text-amber-400">⚡ 10 pending PR comments</div>
              </div>
              <div className="mt-3 p-2 bg-blue-950/30 border border-blue-500/30 rounded text-[11px] text-blue-300">
                "Senior dev: Let's do a quick sync before we push to prod 🫠"
              </div>
            </div>
          </div>
        );

      case 'hardware':
        return (
          <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-6 text-center font-mono relative overflow-hidden">
            <div className="relative z-10 w-full max-w-[280px] bg-zinc-900 border border-emerald-500/30 rounded-lg p-4 shadow-xl text-left">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 pb-2 border-b border-zinc-800">
                <span>GPU BENCHMARK</span>
                <span>CUDA & VRAM</span>
              </div>
              <div className="mt-3 space-y-2 text-[11px]">
                <div>
                  <div className="flex justify-between text-zinc-400 mb-1">
                    <span>RTX 5070 (12GB VRAM)</span>
                    <span className="text-emerald-400 font-semibold">142 FPS / Local LLM Fast</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full w-[85%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-zinc-400 mb-1">
                    <span>RTX 5060 (8GB VRAM)</span>
                    <span className="text-zinc-300">98 FPS</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-zinc-600 h-full w-[60%]"></div>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-[11px] text-zinc-400">
                "For ML engineers: 12GB VRAM is the bare minimum for local QLoRA fine-tuning!"
              </div>
            </div>
          </div>
        );

      case 'ai_hype':
        return (
          <div className="w-full h-full bg-gradient-to-b from-amber-950/40 via-zinc-950 to-zinc-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            <div className="relative z-10 w-full max-w-[280px] bg-zinc-900/90 border border-amber-500/40 rounded-lg p-4 shadow-xl text-left">
              <div className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-mono font-bold w-max">
                CLICKBAIT DETECTED
              </div>
              <h4 className="text-sm font-bold text-amber-300 mt-2">
                "USE THESE 10 AI WEBSITES OR YOU'LL BE REPLACED IN 2026! 😱"
              </h4>
              <p className="text-xs text-zinc-400 mt-2">
                "Guaranteed $250K job without writing a single line of code!"
              </p>
              <div className="mt-3 p-2 bg-zinc-950 rounded border border-zinc-800 text-[10px] font-mono text-zinc-400">
                AI Agent Verdict: Low-entropy engagement trap. 0 architectural insights. Filtered out.
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-6 text-center font-mono relative overflow-hidden">
            <div className="relative z-10 w-full max-w-[280px] bg-zinc-900 border border-rose-500/30 rounded-lg p-4 shadow-xl text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 pb-2 border-b border-zinc-800">
                <Shield className="w-4 h-4" />
                <span>TLS 1.3 Handshake</span>
              </div>
              <div className="mt-3 space-y-1.5 text-[11px] text-zinc-300">
                <div className="flex items-center gap-2 text-emerald-400">
                  <ArrowRight className="w-3 h-3" /> ClientHello (Supported Ciphers)
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                  <ArrowRight className="w-3 h-3" /> ServerHello + Certificate
                </div>
                <div className="flex items-center gap-2 text-purple-400">
                  <ArrowRight className="w-3 h-3" /> Diffie-Hellman Key Exchange
                </div>
                <div className="p-1.5 bg-rose-950/30 border border-rose-500/30 rounded text-rose-300 mt-2">
                  🔒 Symmetric AES-256 Tunnel Established
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-6 text-center font-mono">
            <Sparkles className="w-8 h-8 text-emerald-400 mb-2" />
            <div className="text-xs text-zinc-300">{reel.title}</div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-zinc-800/80 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Column: Simulated Vertical Mobile Reel Player (5 cols) */}
        <div className="lg:col-span-5 bg-black flex flex-col items-center justify-center p-4 border-b lg:border-b-0 lg:border-r border-zinc-800 relative">
          <div className="relative w-[280px] h-[480px] bg-zinc-950 rounded-2xl border-4 border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
            {/* Top Reel Header Bar with simulated story progress */}
            <div className="absolute top-2 inset-x-2 z-20 flex gap-1">
              <div className="h-1 bg-zinc-700 rounded-full flex-1 overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-100"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Video Canvas / Animation */}
            <div className="flex-1 relative">{renderVisualContent()}</div>

            {/* Floating Right Side Controls (Like, Save, Replay, Share, Audio) */}
            <div className="absolute right-3 bottom-16 z-20 flex flex-col items-center gap-3">
              <button
                onClick={() => onToggleLike(reel.id)}
                className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                  reel.behavior.liked
                    ? 'bg-rose-500 text-white border-rose-400'
                    : 'bg-zinc-900/80 text-zinc-300 border-zinc-700/60 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${reel.behavior.liked ? 'fill-current' : ''}`} />
              </button>
              <span className="text-[10px] font-mono text-zinc-300 -mt-2">{reel.likeCount}</span>

              <button
                onClick={() => onToggleSave(reel.id)}
                className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                  reel.behavior.saved
                    ? 'bg-emerald-500 text-white border-emerald-400'
                    : 'bg-zinc-900/80 text-zinc-300 border-zinc-700/60 hover:text-white'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${reel.behavior.saved ? 'fill-current' : ''}`} />
              </button>
              <span className="text-[10px] font-mono text-zinc-300 -mt-2">Save</span>

              <button
                onClick={() => onToggleReplay(reel.id)}
                className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${
                  reel.behavior.replay
                    ? 'bg-purple-500 text-white border-purple-400'
                    : 'bg-zinc-900/80 text-zinc-300 border-zinc-700/60 hover:text-white'
                }`}
              >
                <Repeat className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-full bg-zinc-900/80 text-zinc-400 border border-zinc-700/60 hover:text-white"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="p-3 bg-gradient-to-t from-black via-black/80 to-transparent z-10 text-left">
              <div className="text-xs font-semibold text-zinc-200">{reel.creatorHandle}</div>
              <div className="text-[11px] text-zinc-300 line-clamp-2 mt-0.5">{reel.title}</div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  {reel.category}
                </span>
                <span className="text-[9px] font-mono text-zinc-400">
                  {reel.viewCount} views • {reel.durationSeconds}s
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Behavioral Telemetry & Semantic Extraction (7 cols) */}
        <div className="lg:col-span-7 p-6 flex flex-col justify-between overflow-y-auto space-y-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                  {reel.reelNumber}
                </span>
                <h3 className="text-base font-semibold text-zinc-100">{reel.title}</h3>
              </div>
              <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                Score: {interactionScore} pts
              </div>
            </div>

            {/* Content Abstract */}
            <p className="text-xs text-zinc-400 mt-3 leading-relaxed">{reel.content}</p>

            {/* Live Telemetry Breakdown */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                <div className="text-[10px] text-zinc-400 font-mono">WATCHED</div>
                <div className="text-sm font-bold text-zinc-200 font-mono mt-0.5">
                  {reel.behavior.watchedPct}%
                </div>
              </div>
              <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                <div className="text-[10px] text-zinc-400 font-mono">LIKED</div>
                <div className={`text-sm font-bold font-mono mt-0.5 ${reel.behavior.liked ? 'text-rose-400' : 'text-zinc-400'}`}>
                  {reel.behavior.liked ? 'YES (+2)' : 'NO (0)'}
                </div>
              </div>
              <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                <div className="text-[10px] text-zinc-400 font-mono">SAVED</div>
                <div className={`text-sm font-bold font-mono mt-0.5 ${reel.behavior.saved ? 'text-emerald-400' : 'text-zinc-400'}`}>
                  {reel.behavior.saved ? 'YES (+4)' : 'NO (0)'}
                </div>
              </div>
              <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                <div className="text-[10px] text-zinc-400 font-mono">REPLAY</div>
                <div className={`text-sm font-bold font-mono mt-0.5 ${reel.behavior.replay ? 'text-purple-400' : 'text-zinc-400'}`}>
                  {reel.behavior.replay ? 'YES (+3)' : 'NO (0)'}
                </div>
              </div>
            </div>

            {/* Semantic Signal Extraction */}
            <div className="mt-4 p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-3">
              <div className="text-xs font-semibold text-zinc-300 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Semantic Feature Extraction</span>
              </div>

              <div>
                <div className="text-[11px] text-zinc-400 font-mono">DIRECT SURFACE TOPICS:</div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {reel.directTopics.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] bg-zinc-900 text-zinc-300 border border-zinc-800 font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[11px] text-zinc-400 font-mono">INFERRED LATENT INTERESTS:</div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {reel.latentTopics.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Hype Filter Status if applicable */}
            {isHype && (
              <div className="mt-3 p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs">
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hype Layer Analysis</span>
                </div>
                <p className="mt-1 text-[11px] text-amber-300/80 leading-relaxed">
                  Flagged as low-density sensationalized content. The user skipped early without bookmarking or liking. Weighted down in recommendation pipeline.
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-zinc-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-md text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
            >
              Close Simulator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
