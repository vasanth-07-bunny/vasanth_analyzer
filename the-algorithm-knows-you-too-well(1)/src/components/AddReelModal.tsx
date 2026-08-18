import React, { useState } from 'react';
import { Reel, ReelCategory } from '../types';
import { PRESET_FEED_PROFILES } from '../data/sampleReels';
import { X, Plus, Sparkles, Sliders, CheckCircle2, Bookmark, Heart, Repeat } from 'lucide-react';

interface AddReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (presetId: string) => void;
  onAddCustomReel: (reel: Reel) => void;
  activePresetId?: string;
}

export const AddReelModal: React.FC<AddReelModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
  onAddCustomReel,
  activePresetId = 'default',
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');

  // Custom Reel form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ReelCategory>('Programming Meme');
  const [content, setContent] = useState('');
  const [watchedPct, setWatchedPct] = useState(90);
  const [liked, setLiked] = useState(true);
  const [saved, setSaved] = useState(false);
  const [replay, setReplay] = useState(false);
  const [tagsInput, setTagsInput] = useState('DSA, Algorithms, Complexity');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newReel: Reel = {
      id: `reel-custom-${Date.now()}`,
      reelNumber: `REEL CUSTOM`,
      title: title.trim(),
      category: category,
      content: content.trim() || 'Custom student interaction logged in session.',
      behavior: {
        watchedPct: Number(watchedPct),
        liked,
        saved,
        replay,
        shared: false,
        skippedEarly: watchedPct < 40,
      },
      semanticTags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      directTopics: [category, title.split(' ')[0]],
      latentTopics: ['Software Engineering', 'Technical Curiosity'],
      durationSeconds: 35,
      creatorHandle: '@student_feed',
      viewCount: '500K',
      likeCount: '80K',
      commentCount: '1.2K',
      visualPreviewType: 'code',
    };

    onAddCustomReel(newReel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-800">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-mono font-bold text-zinc-100 uppercase">
              Feed Scenarios & Custom Reel Injection
            </h3>
          </div>

          {/* Tab Switcher */}
          <div className="flex rounded-lg bg-zinc-950 p-1 border border-zinc-800">
            <button
              onClick={() => setActiveTab('presets')}
              className={`flex-1 py-1.5 rounded-md text-xs font-mono font-semibold transition-colors ${
                activeTab === 'presets'
                  ? 'bg-zinc-800 text-emerald-400 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Select Student Persona Preset
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`flex-1 py-1.5 rounded-md text-xs font-mono font-semibold transition-colors ${
                activeTab === 'custom'
                  ? 'bg-zinc-800 text-emerald-400 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              + Inject Custom Reel
            </button>
          </div>

          {activeTab === 'presets' ? (
            /* Presets List */
            <div className="space-y-2.5 pt-2 max-h-[60vh] overflow-y-auto">
              {PRESET_FEED_PROFILES.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => {
                    onSelectPreset(preset.id);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    activePresetId === preset.id
                      ? 'bg-emerald-950/20 border-emerald-500/50 shadow-sm'
                      : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-zinc-100">
                      {preset.name}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">
                      {preset.reels.length} Reels
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {preset.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            /* Custom Reel Form */
            <form onSubmit={handleCustomSubmit} className="space-y-3 pt-2">
              <div>
                <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                  Reel Title:
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Why PostgreSQL MVCC is faster than MySQL locks"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                    Category:
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ReelCategory)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Programming Meme">Programming Meme</option>
                    <option value="Developer Career">Developer Career</option>
                    <option value="DSA">DSA / Algorithms</option>
                    <option value="Hardware">Hardware / Architecture</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="System Design">System Design</option>
                    <option value="AI / Career">AI / Career</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                    Watch Completion ({watchedPct}%):
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={watchedPct}
                    onChange={(e) => setWatchedPct(Number(e.target.value))}
                    className="w-full mt-2 accent-emerald-400"
                  />
                </div>
              </div>

              {/* Behavior checkboxes */}
              <div className="flex items-center gap-4 pt-1 text-xs font-mono text-zinc-300">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={liked}
                    onChange={(e) => setLiked(e.target.checked)}
                    className="accent-rose-500 rounded"
                  />
                  <span>Liked (+2)</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saved}
                    onChange={(e) => setSaved(e.target.checked)}
                    className="accent-emerald-500 rounded"
                  />
                  <span>Saved (+4)</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={replay}
                    onChange={(e) => setReplay(e.target.checked)}
                    className="accent-purple-500 rounded"
                  />
                  <span>Replayed (+3)</span>
                </label>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-mono bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-mono font-bold text-zinc-950 bg-emerald-400 hover:bg-emerald-300"
                >
                  Add Reel & Recalculate
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
