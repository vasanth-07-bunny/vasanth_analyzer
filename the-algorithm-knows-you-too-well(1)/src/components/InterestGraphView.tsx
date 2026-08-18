import React, { useState } from 'react';
import { InterestGraphNode, InterestGraphLink } from '../types';
import {
  Network,
  Sparkles,
  ChevronRight,
  Brain,
  Zap,
  Info,
  Layers,
  GitBranch,
  FolderTree,
  Sliders,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

interface InterestGraphViewProps {
  nodes: InterestGraphNode[];
  links: InterestGraphLink[];
  selectedCategory?: string | null;
}

export const InterestGraphView: React.FC<InterestGraphViewProps> = ({
  nodes,
  links,
  selectedCategory: initialCategory,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(initialCategory ? 'se' : 'se');
  const [viewMode, setViewMode] = useState<'all' | 'primary' | 'subtopics' | 'tree'>('all');
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({
    se: true,
    prog: true,
    dsa: true,
    hardware: true,
    cyber: true,
    ai: true,
  });

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[1] || nodes[0];

  // SVG coordinate positions for clean, aesthetic network hierarchy
  const getNodeCoordinates = (nodeId: string): { x: number; y: number } => {
    switch (nodeId) {
      // Root
      case 'user':
        return { x: 380, y: 220 };

      // Primary Domains (Depth 1)
      case 'se':
        return { x: 230, y: 120 };
      case 'prog':
        return { x: 530, y: 120 };
      case 'career':
        return { x: 120, y: 220 };
      case 'dsa':
        return { x: 640, y: 220 };
      case 'hardware':
        return { x: 210, y: 340 };
      case 'cyber':
        return { x: 380, y: 380 };
      case 'ai':
        return { x: 550, y: 340 };

      // Sub-topics under Software Engineering (Depth 2)
      case 'sub-se-backend':
        return { x: 130, y: 60 };
      case 'sub-se-devops':
        return { x: 260, y: 40 };

      // Sub-topics under Programming (Depth 2)
      case 'sub-prog-python':
        return { x: 500, y: 40 };
      case 'sub-prog-jsts':
        return { x: 630, y: 60 };
      case 'java':
        return { x: 420, y: 45 };

      // Sub-topics under DSA (Depth 2)
      case 'sub-dsa-divide':
        return { x: 710, y: 160 };
      case 'sub-dsa-structs':
        return { x: 720, y: 290 };

      // Sub-topics under Hardware (Depth 2)
      case 'sub-hw-cache':
        return { x: 110, y: 380 };

      // Sub-topics under Cyber (Depth 2)
      case 'sub-cyber-crypto':
        return { x: 270, y: 420 };

      // Sub-topics under AI (Depth 2)
      case 'sub-ai-vector':
        return { x: 670, y: 380 };

      default:
        return { x: 380, y: 220 };
    }
  };

  // Filter nodes based on viewMode
  const visibleNodes = nodes.filter((node) => {
    if (viewMode === 'primary') {
      return node.depth <= 1;
    }
    if (viewMode === 'subtopics') {
      return node.depth === 2 || node.id === 'user';
    }
    return true;
  });

  const visibleLinks = links.filter((link) => {
    const hasSource = visibleNodes.some((n) => n.id === link.source);
    const hasTarget = visibleNodes.some((n) => n.id === link.target);
    return hasSource && hasTarget;
  });

  const toggleExpand = (parentId: string) => {
    setExpandedParents((prev) => ({ ...prev, [parentId]: !prev[parentId] }));
  };

  return (
    <div className="space-y-4">
      {/* Header & Hierarchy Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-zinc-800/80">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider font-mono flex items-center gap-2">
            <Network className="w-4 h-4 text-emerald-400" />
            Section 3 — Hierarchical Interest & Sub-Topic Graph
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Multi-level semantic mapping: Inspect primary engineering domains, sub-topics, language specializations, and cross-cutting latent links.
          </p>
        </div>

        {/* View Mode Filters */}
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs font-mono">
          <button
            onClick={() => setViewMode('all')}
            className={`px-2.5 py-1 rounded transition-colors ${
              viewMode === 'all'
                ? 'bg-zinc-800 text-emerald-400 font-bold border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Hierarchies
          </button>
          <button
            onClick={() => setViewMode('primary')}
            className={`px-2.5 py-1 rounded transition-colors ${
              viewMode === 'primary'
                ? 'bg-zinc-800 text-emerald-400 font-bold border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Primary Domains
          </button>
          <button
            onClick={() => setViewMode('subtopics')}
            className={`px-2.5 py-1 rounded transition-colors ${
              viewMode === 'subtopics'
                ? 'bg-zinc-800 text-emerald-400 font-bold border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Sub-Topics Only
          </button>
          <button
            onClick={() => setViewMode('tree')}
            className={`px-2.5 py-1 rounded transition-colors ${
              viewMode === 'tree'
                ? 'bg-zinc-800 text-emerald-400 font-bold border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Tree Explorer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Canvas View (8 cols) */}
        {viewMode !== 'tree' ? (
          <div className="lg:col-span-8 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 relative overflow-hidden flex flex-col items-center justify-center min-h-[480px]">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

            {/* Legend / Hierarchy Pill */}
            <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 text-[10px] font-mono">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900/90 text-zinc-300 border border-zinc-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Primary Domain
              </span>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900/90 text-zinc-300 border border-zinc-800">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span> Sub-Topic Specialization
              </span>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900/90 text-zinc-300 border border-zinc-800">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span> Direct Language
              </span>
            </div>

            <svg
              className="w-full h-[450px] max-w-[780px] relative z-10 select-none"
              viewBox="0 0 780 450"
            >
              {/* Draw Links */}
              {visibleLinks.map((link, idx) => {
                const sourceCoord = getNodeCoordinates(link.source);
                const targetCoord = getNodeCoordinates(link.target);
                const isSelectedConnection =
                  selectedNode && (link.source === selectedNode.id || link.target === selectedNode.id);

                let strokeColor = '#3f3f46';
                let isDashed = false;

                if (isSelectedConnection) {
                  strokeColor = '#34d399';
                } else if (link.type === 'parent_child') {
                  strokeColor = '#38bdf888'; // Blue for hierarchical parent-child
                } else if (link.type === 'latent') {
                  strokeColor = '#10b98166';
                  isDashed = true;
                } else if (link.type === 'reinforcement') {
                  strokeColor = '#a855f766';
                  isDashed = true;
                }

                return (
                  <g key={idx}>
                    <line
                      x1={sourceCoord.x}
                      y1={sourceCoord.y}
                      x2={targetCoord.x}
                      y2={targetCoord.y}
                      stroke={strokeColor}
                      strokeWidth={isSelectedConnection ? 2.5 : link.strength > 4 ? 2 : 1.2}
                      strokeDasharray={isDashed ? '4 3' : undefined}
                      className="transition-all duration-300"
                    />
                    {/* Link label for reinforcement/parent-child bridges */}
                    {isSelectedConnection && link.label && (
                      <text
                        x={(sourceCoord.x + targetCoord.x) / 2}
                        y={(sourceCoord.y + targetCoord.y) / 2 - 6}
                        fill="#34d399"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {link.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Draw Nodes */}
              {visibleNodes.map((node) => {
                const coord = getNodeCoordinates(node.id);
                const isSelected = selectedNode?.id === node.id;
                const isRoot = node.id === 'user';
                const isPrimary = node.depth === 1;
                const isSubtopic = node.depth === 2;

                const radius = isRoot ? 32 : isPrimary ? 24 : 17;

                let fillColor = '#18181b';
                let strokeColor = '#3f3f46';
                let textColor = '#d4d4d8';

                if (isRoot) {
                  fillColor = '#064e3b';
                  strokeColor = '#34d399';
                  textColor = '#ffffff';
                } else if (node.id === 'se') {
                  fillColor = isSelected ? '#047857' : '#064e3b';
                  strokeColor = '#10b981';
                  textColor = '#34d399';
                } else if (node.group === 'language' || node.id === 'java') {
                  fillColor = isSelected ? '#78350f' : '#451a03';
                  strokeColor = '#f59e0b';
                  textColor = '#fbbf24';
                } else if (isSubtopic) {
                  fillColor = isSelected ? '#1e3a8a' : '#0f172a';
                  strokeColor = isSelected ? '#38bdf8' : '#1e40af';
                  textColor = '#93c5fd';
                } else if (isSelected) {
                  strokeColor = '#34d399';
                  fillColor = '#27272a';
                }

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className="cursor-pointer transition-transform duration-200 hover:scale-105"
                  >
                    {/* Outer pulse circle for selected or root node */}
                    {(isSelected || isRoot) && (
                      <circle
                        cx={coord.x}
                        cy={coord.y}
                        r={radius + 7}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="1.5"
                        strokeOpacity="0.4"
                        className="animate-pulse"
                      />
                    )}

                    {/* Main Node Body */}
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r={radius}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                    />

                    {/* Node Label */}
                    <text
                      x={coord.x}
                      y={coord.y - 1}
                      fill={textColor}
                      fontSize={isRoot ? '10' : isPrimary ? '9' : '8'}
                      fontWeight={isRoot || isSelected || isPrimary ? '700' : '600'}
                      fontFamily="monospace"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {isRoot
                        ? 'STUDENT'
                        : isSubtopic
                        ? node.label.replace('sub-', '').split(' ')[0]
                        : node.label.split(' ')[0]}
                    </text>
                    <text
                      x={coord.x}
                      y={coord.y + (isSubtopic ? 9 : 11)}
                      fill={isRoot ? '#a7f3d0' : isSubtopic ? '#60a5fa' : '#a1a1aa'}
                      fontSize={isSubtopic ? '7.5' : '8'}
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {isRoot ? 'PROFILE' : `${node.score}%`}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        ) : (
          /* Tree Explorer Mode (8 cols) */
          <div className="lg:col-span-8 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 overflow-y-auto max-h-[480px] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-200 uppercase">
                <FolderTree className="w-4 h-4 text-emerald-400" />
                <span>Hierarchical Taxonomy Tree</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">
                Click to expand/inspect sub-topics
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {/* Root */}
              <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span>ROOT: STUDENT PROFILE</span>
                  <span>100% Signal</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Root telemetry anchor aggregated from 8 interactive Reels.
                </p>
              </div>

              {/* Primary Domains with Child Sub-topics */}
              {nodes
                .filter((n) => n.depth === 1)
                .map((primary) => {
                  const children = nodes.filter((n) => n.parentId === primary.id);
                  const isExpanded = expandedParents[primary.id] ?? true;
                  const isSelected = selectedNodeId === primary.id;

                  return (
                    <div
                      key={primary.id}
                      className={`border rounded-xl p-4 transition-all ${
                        isSelected
                          ? 'border-emerald-500/60 bg-zinc-900'
                          : 'border-zinc-800 bg-zinc-900/60'
                      }`}
                    >
                      <div
                        onClick={() => {
                          setSelectedNodeId(primary.id);
                          toggleExpand(primary.id);
                        }}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              primary.id === 'se' ? 'bg-emerald-400' : 'bg-blue-400'
                            }`}
                          ></span>
                          <span className="font-bold text-zinc-100">{primary.label}</span>
                          {primary.id === 'se' && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              Primary Latent
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-zinc-400 text-xs">{primary.score}% Weight</span>
                          <ChevronRight
                            className={`w-4 h-4 text-zinc-400 transition-transform ${
                              isExpanded ? 'rotate-90' : ''
                            }`}
                          />
                        </div>
                      </div>

                      {/* Sub-topics list */}
                      {isExpanded && children.length > 0 && (
                        <div className="mt-3 pl-4 border-l-2 border-zinc-800 space-y-2 pt-1">
                          {children.map((child) => {
                            const isChildSelected = selectedNodeId === child.id;
                            return (
                              <div
                                key={child.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedNodeId(child.id);
                                }}
                                className={`p-2 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                                  isChildSelected
                                    ? 'bg-blue-950/40 border border-blue-500/40 text-blue-200'
                                    : 'bg-zinc-950/70 border border-zinc-800/80 text-zinc-300 hover:bg-zinc-800/50'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-blue-400 text-xs">└─</span>
                                  <span className="font-semibold text-[11px]">{child.label}</span>
                                  <span className="text-[9px] px-1 rounded bg-zinc-800 text-zinc-400">
                                    Sub-Topic
                                  </span>
                                </div>
                                <span className="text-emerald-400 font-bold text-[11px]">
                                  {child.score}%
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Node Detail & Semantic Reasoning Inspector (4 cols) */}
        <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-zinc-100 font-mono">
                  Interest Node Inspector
                </h3>
              </div>
              <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                Score: {selectedNode.score}%
              </span>
            </div>

            <div>
              <div className="text-base font-bold text-zinc-100 font-mono flex items-center gap-2">
                <span>{selectedNode.label}</span>
                {selectedNode.id === 'se' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Primary Latent
                  </span>
                )}
                {selectedNode.depth === 2 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                    Sub-Topic
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-1 font-mono">
                Hierarchy Depth: Level {selectedNode.depth} ({selectedNode.category} Domain)
              </p>
            </div>

            {/* Inferred Reason Section */}
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
              <div className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>WHY WE INFERRED THIS INTEREST:</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                "{selectedNode.reasoning}"
              </p>
            </div>

            {/* Sub-topics or Child Nodes */}
            {selectedNode.subtopics && selectedNode.subtopics.length > 0 && (
              <div>
                <div className="text-[11px] font-mono text-zinc-400 uppercase mb-2">
                  Hierarchical Sub-Topics:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.subtopics.map((sub, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded bg-blue-950/30 text-blue-300 border border-blue-500/30 text-[11px] font-mono"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contributing Reel Evidence Sources */}
            <div>
              <div className="text-[11px] font-mono text-zinc-400 uppercase mb-2">
                Contributing Reel Evidence:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.sources.map((src, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 text-[11px] font-mono"
                  >
                    {src}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 font-mono flex items-center justify-between">
            <span>Node Group: {selectedNode.group.toUpperCase()}</span>
            <span className="text-emerald-400">Weight: {(selectedNode.strength * 10).toFixed(1)}/10</span>
          </div>
        </div>
      </div>
    </div>
  );
};
