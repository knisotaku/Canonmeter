import React, { useState } from 'react';
import { Adaptation, QuadrantId } from '../types/adaptation';
import { QUADRANT_META } from '../data/adaptations';
import { BookOpen, Film, ArrowRight } from 'lucide-react';

interface MatrixQuadrantChartProps {
  adaptations: Adaptation[];
  onSelectAdaptation: (adaptation: Adaptation) => void;
  selectedQuadrantFilter: QuadrantId | 'all';
  onFilterQuadrant: (q: QuadrantId | 'all') => void;
}

export const MatrixQuadrantChart: React.FC<MatrixQuadrantChartProps> = ({
  adaptations,
  onSelectAdaptation,
  selectedQuadrantFilter,
  onFilterQuadrant,
}) => {
  const [hoveredItem, setHoveredItem] = useState<Adaptation | null>(null);

  // SVG coordinate transformation
  // Canvas width: 800, height: 600, with padding
  const padding = { top: 50, right: 50, bottom: 60, left: 70 };
  const graphWidth = 800 - padding.left - padding.right;
  const graphHeight = 600 - padding.top - padding.bottom;

  // X is Fidelity: 0 to 100 -> padding.left to padding.left + graphWidth
  const getX = (fidelity: number) => padding.left + (fidelity / 100) * graphWidth;
  // Y is Quality: 0 to 100 -> (padding.top + graphHeight) to padding.top (inverted since SVG Y=0 is top)
  const getY = (quality: number) => padding.top + graphHeight - (quality / 100) * graphHeight;

  // Split threshold is 68
  const thresholdX = getX(68);
  const thresholdY = getY(68);

  const quadrants: Array<{
    id: QuadrantId;
    title: string;
    sub: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    accentBg: string;
  }> = [
    {
      id: 'inspired-heresy',
      title: 'Inspired Heresy',
      sub: 'Low Fidelity · High Quality',
      x: padding.left,
      y: padding.top,
      width: thresholdX - padding.left,
      height: thresholdY - padding.top,
      color: '#a855f7',
      accentBg: 'bg-purple-950/20 hover:bg-purple-950/40 border-purple-900/30',
    },
    {
      id: 'holy-grail',
      title: 'The Holy Grail',
      sub: 'High Fidelity · High Quality',
      x: thresholdX,
      y: padding.top,
      width: padding.left + graphWidth - thresholdX,
      height: thresholdY - padding.top,
      color: '#10b981',
      accentBg: 'bg-emerald-950/20 hover:bg-emerald-950/40 border-emerald-900/30',
    },
    {
      id: 'sacrilege',
      title: 'Total Sacrilege',
      sub: 'Low Fidelity · Low Quality',
      x: padding.left,
      y: thresholdY,
      width: thresholdX - padding.left,
      height: padding.top + graphHeight - thresholdY,
      color: '#f43f5e',
      accentBg: 'bg-rose-950/20 hover:bg-rose-950/40 border-rose-900/30',
    },
    {
      id: 'dogmatic-slog',
      title: 'Dogmatic Slog',
      sub: 'High Fidelity · Mixed/Low Quality',
      x: thresholdX,
      y: thresholdY,
      width: padding.left + graphWidth - thresholdX,
      height: padding.top + graphHeight - thresholdY,
      color: '#f59e0b',
      accentBg: 'bg-amber-950/20 hover:bg-amber-950/40 border-amber-900/30',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
            Cartography of Adaptations
          </span>
          <h2 className="text-2xl lg:text-3xl font-serif font-bold text-stone-100">
            The 2D Fidelity-Quality Matrix
          </h2>
          <p className="text-sm text-stone-400 mt-1 max-w-2xl">
            Click any point on the scatter map to inspect the source-vs-screen divergence, or select a quadrant card below to filter the catalog.
          </p>
        </div>

        {/* Quadrant Quick Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-900 rounded-lg border border-stone-800 shrink-0">
          <button
            onClick={() => onFilterQuadrant('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              selectedQuadrantFilter === 'all'
                ? 'bg-stone-800 text-stone-100'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            All ({adaptations.length})
          </button>
          <button
            onClick={() => onFilterQuadrant('holy-grail')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              selectedQuadrantFilter === 'holy-grail'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Holy Grail
          </button>
          <button
            onClick={() => onFilterQuadrant('inspired-heresy')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              selectedQuadrantFilter === 'inspired-heresy'
                ? 'bg-purple-950 text-purple-300 border border-purple-700/50'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Inspired Heresy
          </button>
          <button
            onClick={() => onFilterQuadrant('sacrilege')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              selectedQuadrantFilter === 'sacrilege'
                ? 'bg-rose-950 text-rose-300 border border-rose-700/50'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Sacrilege
          </button>
        </div>
      </div>

      {/* The 2D Interactive Scatter Canvas Container */}
      <div className="relative rounded-2xl border border-stone-800 bg-stone-900/60 p-4 sm:p-6 shadow-xl overflow-hidden">
        <div className="w-full overflow-x-auto">
          <svg
            viewBox="0 0 800 600"
            className="w-full min-w-[640px] max-w-[900px] mx-auto select-none"
          >
            {/* Background Quadrant Shading */}
            {quadrants.map((q) => {
              const isSelected =
                selectedQuadrantFilter === 'all' || selectedQuadrantFilter === q.id;
              return (
                <rect
                  key={q.id}
                  x={q.x}
                  y={q.y}
                  width={q.width}
                  height={q.height}
                  fill={q.color}
                  fillOpacity={isSelected ? 0.05 : 0.015}
                  stroke={q.color}
                  strokeOpacity={isSelected ? 0.15 : 0.05}
                  className="transition-opacity duration-300"
                />
              );
            })}

            {/* Threshold dividing lines (at 68% for each axis) */}
            <line
              x1={thresholdX}
              y1={padding.top}
              x2={thresholdX}
              y2={padding.top + graphHeight}
              stroke="#57534e"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />
            <line
              x1={padding.left}
              y1={thresholdY}
              x2={padding.left + graphWidth}
              y2={thresholdY}
              stroke="#57534e"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />

            {/* Outer Box Border */}
            <rect
              x={padding.left}
              y={padding.top}
              width={graphWidth}
              height={graphHeight}
              fill="none"
              stroke="#44403c"
              strokeWidth="1"
            />

            {/* Axis Labels */}
            {/* X-Axis: Fidelity */}
            <text
              x={padding.left + graphWidth / 2}
              y={padding.top + graphHeight + 42}
              textAnchor="middle"
              className="fill-stone-300 font-serif text-[13px] font-semibold tracking-wide"
            >
              Fidelity to Original Work (0% → 100%)
            </text>
            <text
              x={padding.left}
              y={padding.top + graphHeight + 20}
              textAnchor="start"
              className="fill-stone-400 font-mono text-[10px]"
            >
              0% (In-Name-Only)
            </text>
            <text
              x={thresholdX}
              y={padding.top + graphHeight + 20}
              textAnchor="middle"
              className="fill-stone-400 font-mono text-[10px]"
            >
              68% (Benchmark)
            </text>
            <text
              x={padding.left + graphWidth}
              y={padding.top + graphHeight + 20}
              textAnchor="end"
              className="fill-stone-400 font-mono text-[10px]"
            >
              100% (Literal Gospel)
            </text>

            {/* Y-Axis: Quality */}
            <text
              x={-(padding.top + graphHeight / 2)}
              y={24}
              transform="rotate(-90)"
              textAnchor="middle"
              className="fill-stone-300 font-serif text-[13px] font-semibold tracking-wide"
            >
              Standalone Film / TV Quality (0% → 100%)
            </text>
            <text
              x={padding.left - 10}
              y={padding.top + graphHeight}
              textAnchor="end"
              className="fill-stone-400 font-mono text-[10px]"
            >
              0%
            </text>
            <text
              x={padding.left - 10}
              y={thresholdY + 4}
              textAnchor="end"
              className="fill-stone-400 font-mono text-[10px]"
            >
              68%
            </text>
            <text
              x={padding.left - 10}
              y={padding.top + 8}
              textAnchor="end"
              className="fill-stone-400 font-mono text-[10px]"
            >
              100%
            </text>

            {/* Quadrant Watermark Titles */}
            <text
              x={padding.left + 16}
              y={padding.top + 28}
              className="fill-purple-400/80 font-serif text-[14px] font-bold uppercase tracking-wider"
            >
              Inspired Heresy
            </text>
            <text
              x={padding.left + 16}
              y={padding.top + 44}
              className="fill-purple-400/50 font-sans text-[10px]"
            >
              Loose from Source · Film Masterpiece
            </text>

            <text
              x={padding.left + graphWidth - 16}
              y={padding.top + 28}
              textAnchor="end"
              className="fill-emerald-400/80 font-serif text-[14px] font-bold uppercase tracking-wider"
            >
              The Holy Grail
            </text>
            <text
              x={padding.left + graphWidth - 16}
              y={padding.top + 44}
              textAnchor="end"
              className="fill-emerald-400/50 font-sans text-[10px]"
            >
              Faithful to Text · Film Masterpiece
            </text>

            <text
              x={padding.left + 16}
              y={thresholdY + 28}
              className="fill-rose-400/80 font-serif text-[14px] font-bold uppercase tracking-wider"
            >
              Total Sacrilege
            </text>
            <text
              x={padding.left + 16}
              y={thresholdY + 44}
              className="fill-rose-400/50 font-sans text-[10px]"
            >
              In-Name-Only · Cinematic Failure
            </text>

            <text
              x={padding.left + graphWidth - 16}
              y={thresholdY + 28}
              textAnchor="end"
              className="fill-amber-400/80 font-serif text-[14px] font-bold uppercase tracking-wider"
            >
              Dogmatic Slog
            </text>
            <text
              x={padding.left + graphWidth - 16}
              y={thresholdY + 44}
              textAnchor="end"
              className="fill-amber-400/50 font-sans text-[10px]"
            >
              Panel-for-Panel Faithful · Flawed Cinema
            </text>

            {/* Plotted Adaptation Nodes */}
            {adaptations.map((item) => {
              const cx = getX(item.fidelityScore);
              const cy = getY(item.qualityScore);
              const meta = QUADRANT_META[item.quadrant];
              const isDimmed =
                selectedQuadrantFilter !== 'all' &&
                selectedQuadrantFilter !== item.quadrant;
              const isHovered = hoveredItem?.id === item.id;

              return (
                <g
                  key={item.id}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => onSelectAdaptation(item)}
                >
                  {/* Subtle outer halo */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 16 : 10}
                    fill={meta.color}
                    fillOpacity={isHovered ? 0.35 : 0.15}
                    className="transition-all duration-200"
                  />

                  {/* Inner node */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 7 : 5}
                    fill={meta.color}
                    stroke="#0c0a09"
                    strokeWidth="2"
                    opacity={isDimmed ? 0.3 : 1}
                    className="transition-all duration-200"
                  />

                  {/* Title label near node */}
                  <text
                    x={cx + (cx > 650 ? -12 : 12)}
                    y={cy + 4}
                    textAnchor={cx > 650 ? 'end' : 'start'}
                    className={`font-sans text-[11px] font-semibold transition-all duration-200 ${
                      isHovered
                        ? 'fill-stone-100 font-bold'
                        : isDimmed
                        ? 'fill-stone-600'
                        : 'fill-stone-300'
                    }`}
                  >
                    {item.title} ({item.year})
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hover Inspector Card */}
        {hoveredItem && (
          <div className="mt-4 p-4 rounded-xl border border-stone-800 bg-stone-950/95 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center gap-4">
              <div className="w-14 h-18 rounded-lg overflow-hidden shrink-0 border border-stone-800 bg-stone-900">
                <img
                  src={hoveredItem.posterImage}
                  alt={hoveredItem.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to stylized SVG placeholder
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 text-xs text-stone-400">
                  <span className="font-serif font-semibold text-stone-200">
                    {hoveredItem.title}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{hoveredItem.year}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-400">
                    {hoveredItem.sourceMaterial.creator}
                  </span>
                </div>
                <p className="text-xs text-stone-300 mt-1 max-w-xl font-sans line-clamp-1">
                  {hoveredItem.editorialConsensus.verdictSummary}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <span className="text-emerald-400 font-mono font-bold tabular-nums">
                    Fidelity: {hoveredItem.fidelityScore}%
                  </span>
                  <span aria-hidden="true" className="text-stone-700">·</span>
                  <span className="text-amber-400 font-mono font-bold tabular-nums">
                    Quality: {hoveredItem.qualityScore}%
                  </span>
                  <span aria-hidden="true" className="text-stone-700">·</span>
                  <span className={QUADRANT_META[hoveredItem.quadrant].textColor}>
                    {QUADRANT_META[hoveredItem.quadrant].name}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectAdaptation(hoveredItem)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Inspect Breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 4 Quadrant Explanatory Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quadrants.map((q) => {
          const meta = QUADRANT_META[q.id];
          const count = adaptations.filter((a) => a.quadrant === q.id).length;
          const isSelected = selectedQuadrantFilter === q.id;

          return (
            <div
              key={q.id}
              onClick={() =>
                onFilterQuadrant(isSelected ? 'all' : q.id)
              }
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? `${meta.badgeBg} ${meta.badgeBorder} ring-1 ring-amber-400/40`
                  : 'bg-stone-900/60 border-stone-800 hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`font-serif font-bold text-sm ${meta.textColor}`}>
                  {meta.name}
                </span>
                <span className="font-mono text-xs text-stone-400 tabular-nums">
                  {count} titles
                </span>
              </div>
              <div className="text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-2">
                {meta.tagline}
              </div>
              <p className="text-xs text-stone-400 leading-relaxed font-sans line-clamp-3">
                {meta.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
