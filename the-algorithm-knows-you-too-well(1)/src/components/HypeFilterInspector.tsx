import React, { useState } from 'react';
import { detectHypePattern } from '../services/interestEngine';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Search,
  Flame,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const HypeFilterInspector: React.FC = () => {
  const [testTitle, setTestTitle] = useState('10 AI tools that will GUARANTEE you a $200K job in 30 days');
  const [testDescription, setTestDescription] = useState('This one secret prompt replaces entire software engineering departments without writing code.');

  const result = detectHypePattern(testTitle, testDescription);

  const presetExamples = [
    {
      title: '10 AI tools that will GUARANTEE you a $200K job',
      desc: 'Secret tools that feel illegal to know and make passive income.',
      label: 'Toxic Hype Bait (Filtered)',
      type: 'bad',
    },
    {
      title: 'How vector databases actually work under the hood',
      desc: 'HNSW indexing, cosine similarity, and high dimensional embeddings explained.',
      label: 'Deep Technical (Promoted)',
      type: 'good',
    },
    {
      title: 'Why transformers use attention mechanisms',
      desc: 'Query, key, value matrix multiplication and self-attention math breakdown.',
      label: 'Rigorous CS (Promoted)',
      type: 'good',
    },
    {
      title: 'Make $500/day with this ONE AI tool in 10 seconds',
      desc: 'Guaranteed success, no experience required!',
      label: 'Listicle Scam (Filtered)',
      type: 'bad',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-zinc-800/80">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Section 8 — Content Quality & Hype Detection Layer
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Detects clickbait, guaranteed income promises, and superficial listicles to ensure recommendations are genuinely educational.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Interactive Hype Scanner */}
        <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-200 uppercase">
              <Search className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real-Time Hype Pattern Scanner</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">Interactive Tester</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                Reel / Video Title to Evaluate:
              </label>
              <input
                type="text"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Enter video title..."
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                Content Description / Subtitle:
              </label>
              <textarea
                value={testDescription}
                onChange={(e) => setTestDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                placeholder="Enter description..."
              />
            </div>
          </div>

          {/* Preset Buttons */}
          <div>
            <div className="text-[11px] font-mono text-zinc-400 uppercase mb-2">Test Presets:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presetExamples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setTestTitle(ex.title);
                    setTestDescription(ex.desc);
                  }}
                  className={`p-2 rounded-lg text-left text-xs border transition-colors ${
                    ex.type === 'bad'
                      ? 'bg-amber-950/20 border-amber-500/30 hover:bg-amber-950/40 text-amber-200'
                      : 'bg-emerald-950/20 border-emerald-500/30 hover:bg-emerald-950/40 text-emerald-200'
                  }`}
                >
                  <div className="font-mono text-[10px] font-bold uppercase mb-0.5">{ex.label}</div>
                  <div className="text-[11px] line-clamp-1 font-mono text-zinc-300">"{ex.title}"</div>
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Analysis Result Card */}
          <div
            className={`p-4 rounded-xl border space-y-3 ${
              result.hypeRisk === 'High'
                ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                : result.hypeRisk === 'Medium'
                ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {result.hypeRisk === 'High' ? (
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                )}
                <span className="font-mono font-bold text-sm">
                  {result.hypeRisk === 'High'
                    ? 'FLAGGED: High Hype Risk (Filtered)'
                    : result.hypeRisk === 'Medium'
                    ? 'CAUTION: Moderate Sensationalism'
                    : 'CLEARED: High Technical Rigor (Promoted)'}
                </span>
              </div>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-950/80">
                Score: {result.hypeScore}/100
              </span>
            </div>

            {result.patterns.length > 0 ? (
              <div className="space-y-1">
                <div className="text-[11px] font-mono uppercase text-zinc-400">
                  Detected Red Flags:
                </div>
                <ul className="list-disc pl-4 space-y-0.5 text-xs">
                  {result.patterns.map((p, idx) => (
                    <li key={idx} className="text-rose-300 font-mono">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-xs text-emerald-300 font-mono">
                ✓ Zero spam patterns detected. Clear architectural and conceptual focus.
              </p>
            )}
          </div>
        </div>

        {/* Right 5 cols: Filtering Rules & Heuristics Matrix */}
        <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="pb-2 border-b border-zinc-800">
            <h3 className="text-xs font-mono font-bold text-zinc-200 uppercase">
              Filter Heuristics Matrix
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              The AI distinguishes genuine entertainment with tech value from engagement bait.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 space-y-1">
              <div className="font-mono text-rose-400 font-bold flex items-center gap-1.5">
                <span>✗ DEMOTED PATTERNS</span>
              </div>
              <ul className="text-zinc-400 text-[11px] space-y-1 pl-2">
                <li>• Guaranteed salary or job promises ("$200K without degree")</li>
                <li>• "This ONE tool will replace software engineers"</li>
                <li>• "10 AI websites that feel illegal to know"</li>
                <li>• Fear-based career displacement clickbait</li>
              </ul>
            </div>

            <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 space-y-1">
              <div className="font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                <span>✓ PROMOTED PATTERNS</span>
              </div>
              <ul className="text-zinc-400 text-[11px] space-y-1 pl-2">
                <li>• Architectural trade-offs (e.g. B-Trees vs LSM Trees)</li>
                <li>• Visual complexity analysis & algorithmic mechanics</li>
                <li>• Low-level hardware memory hierarchy & cache misses</li>
                <li>• Protocol implementations (HTTPS, TLS 1.3, TCP handshake)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
