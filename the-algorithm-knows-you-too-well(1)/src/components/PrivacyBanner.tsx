import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const PrivacyBanner: React.FC = () => {
  return (
    <div className="bg-zinc-950 border-t border-zinc-800/80 py-4 px-4 sm:px-6 lg:px-8 text-center text-xs text-zinc-500 font-mono">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Privacy Guarantee:</strong> Analyzes local anonymized Reel interaction telemetry. No credentials or scraping required.
          </span>
        </div>
        <div className="text-[11px] text-zinc-400">
          AI-Powered Technology Reel Recommendation Agent • Hackathon Solution Prototype
        </div>
      </div>
    </div>
  );
};
