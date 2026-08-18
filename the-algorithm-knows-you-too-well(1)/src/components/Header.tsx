import React from 'react';
import { Sparkles, Activity, Layers, ShieldAlert, Cpu, RefreshCw, Play, PlusCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: 'overview' | 'graph' | 'algorithm' | 'hype' | 'comparison';
  setActiveTab: (tab: 'overview' | 'graph' | 'algorithm' | 'hype' | 'comparison') => void;
  onRunDemo: () => void;
  onResetFeed: () => void;
  onOpenAddModal: () => void;
  isAnalyzing: boolean;
  reelCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onRunDemo,
  onResetFeed,
  onOpenAddModal,
  isAnalyzing,
  reelCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 border-b border-zinc-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Title (Single text element with strict contract) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="font-mono text-sm tracking-wider font-semibold text-zinc-100 uppercase truncate">
            The Algorithm Knows You Too Well
          </span>
        </div>

        {/* Zone 2: Navigation Links (4-5 single-line items) */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/90 p-1 rounded-lg border border-zinc-800/80 text-xs font-medium text-zinc-400">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50'
                : 'hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            Reel Feed ({reelCount})
          </button>
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'graph'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50'
                : 'hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            Interest Graph
          </button>
          <button
            onClick={() => setActiveTab('algorithm')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'algorithm'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50'
                : 'hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            Algorithm Thoughts
          </button>
          <button
            onClick={() => setActiveTab('hype')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'hype'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50'
                : 'hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            Hype Filter
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'comparison'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50'
                : 'hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            Keyword vs Latent
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenAddModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 transition-colors whitespace-nowrap"
            title="Add Custom Reel or Select Preset"
          >
            <PlusCircle className="w-3.5 h-3.5 text-zinc-400" />
            <span>Feed Preset</span>
          </button>

          <button
            onClick={onResetFeed}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition-colors"
            title="Reset to default 8 Reels"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onRunDemo}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-sm disabled:opacity-50 whitespace-nowrap cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>{isAnalyzing ? 'Analyzing...' : 'Run AI Analysis'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
