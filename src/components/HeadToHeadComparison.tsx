import React, { useState } from 'react';
import { Adaptation } from '../types/adaptation';
import { FidelityGauge } from './FidelityGauge';
import { QualityGauge } from './QualityGauge';
import { QUADRANT_META } from '../data/adaptations';
import { ArrowLeftRight, BookOpen, Quote, ShieldAlert, Award } from 'lucide-react';

interface HeadToHeadComparisonProps {
  adaptations: Adaptation[];
  onSelectAdaptation: (adaptation: Adaptation) => void;
}

export const HeadToHeadComparison: React.FC<HeadToHeadComparisonProps> = ({
  adaptations,
  onSelectAdaptation,
}) => {
  const [leftId, setLeftId] = useState<string>(adaptations[0]?.id || '');
  const [rightId, setRightId] = useState<string>(adaptations[2]?.id || adaptations[1]?.id || '');

  const leftItem = adaptations.find((a) => a.id === leftId) || adaptations[0];
  const rightItem = adaptations.find((a) => a.id === rightId) || adaptations[1];

  const presets = [
    {
      name: 'Holy Grail vs Inspired Heresy',
      left: 'dune-part-two',
      right: 'the-shining-1980',
    },
    {
      name: 'Gold Standard vs Total Sacrilege',
      left: 'lord-of-the-rings-fellowship',
      right: 'the-last-airbender-2010',
    },
    {
      name: 'Video Game Triumph vs Comic Polariser',
      left: 'the-last-of-us-s1',
      right: 'watchmen-2009',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
            Comparative Dissection
          </span>
          <h2 className="text-2xl lg:text-3xl font-serif font-bold text-stone-100">
            Head-to-Head: Source vs Screen
          </h2>
          <p className="text-sm text-stone-400 mt-1 max-w-2xl">
            Compare how two adaptations chose to handle their source material. Does strict adherence beat audacious reinvention?
          </p>
        </div>

        {/* Curated Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-stone-400 font-mono">Curated:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setLeftId(p.left);
                setRightId(p.right);
              }}
              className="px-2.5 py-1 text-xs rounded-md bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 transition-colors cursor-pointer"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-stone-950/60 border border-stone-800">
        <div>
          <label className="block text-xs font-mono uppercase text-stone-400 mb-1.5">
            Adaptation A
          </label>
          <select
            value={leftId}
            onChange={(e) => setLeftId(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-stone-900 border border-stone-700 rounded-lg text-stone-100 font-serif focus:outline-none focus:border-amber-500"
          >
            {adaptations.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title} ({a.year}) — {QUADRANT_META[a.quadrant].name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-stone-400 mb-1.5">
            Adaptation B
          </label>
          <select
            value={rightId}
            onChange={(e) => setRightId(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-stone-900 border border-stone-700 rounded-lg text-stone-100 font-serif focus:outline-none focus:border-amber-500"
          >
            {adaptations.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title} ({a.year}) — {QUADRANT_META[a.quadrant].name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Head to Head Side-by-Side Display */}
      {leftItem && rightItem && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card Left */}
          <div className="p-6 rounded-2xl border border-stone-800 bg-stone-900/60 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className={`text-xs font-serif font-semibold ${QUADRANT_META[leftItem.quadrant].textColor}`}>
                    {QUADRANT_META[leftItem.quadrant].name}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-stone-100 mt-0.5">
                    {leftItem.title}
                  </h3>
                  <div className="text-xs text-stone-400 mt-1">
                    {leftItem.year} · {leftItem.directorOrShowrunner}
                  </div>
                </div>

                <div className="w-16 h-22 rounded-lg overflow-hidden shrink-0 border border-stone-800 bg-stone-950">
                  <img
                    src={leftItem.posterImage}
                    alt={leftItem.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Gauges */}
              <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800/80 flex items-center justify-around gap-4">
                <FidelityGauge score={leftItem.fidelityScore} size="md" />
                <div className="w-px h-10 bg-stone-800" />
                <QualityGauge score={leftItem.qualityScore} size="md" />
              </div>

              {/* Source Details */}
              <div className="p-4 rounded-xl bg-stone-950/40 border border-stone-800 text-xs space-y-1.5">
                <span className="font-mono uppercase tracking-wider text-[11px] text-stone-400 block">
                  Original Source Material
                </span>
                <div className="font-serif italic font-semibold text-stone-200">
                  "{leftItem.sourceMaterial.title}"
                </div>
                <div className="text-stone-400">
                  By {leftItem.sourceMaterial.creator} ({leftItem.sourceMaterial.year})
                </div>
              </div>

              {/* Author Reaction */}
              {leftItem.authorReaction && (
                <div className="p-4 rounded-xl bg-stone-950/40 border border-stone-800 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-stone-400 font-mono text-[11px] uppercase">
                    <Quote className="w-3.5 h-3.5 text-amber-400" />
                    <span>Author Reaction</span>
                  </div>
                  <p className="font-serif italic text-stone-300">
                    "{leftItem.authorReaction.quote}"
                  </p>
                  <div className="text-[11px] text-stone-400">
                    — {leftItem.authorReaction.creatorName}
                  </div>
                </div>
              )}

              {/* Consensus */}
              <div className="text-xs text-stone-400 leading-relaxed font-sans pt-2 border-t border-stone-800">
                <span className="text-stone-300 font-semibold block mb-1">
                  The Editorial Verdict:
                </span>
                {leftItem.editorialConsensus.verdictSummary}
              </div>
            </div>

            <button
              onClick={() => onSelectAdaptation(leftItem)}
              className="w-full py-2.5 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
            >
              View Full {leftItem.title} Dossier
            </button>
          </div>

          {/* Card Right */}
          <div className="p-6 rounded-2xl border border-stone-800 bg-stone-900/60 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className={`text-xs font-serif font-semibold ${QUADRANT_META[rightItem.quadrant].textColor}`}>
                    {QUADRANT_META[rightItem.quadrant].name}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-stone-100 mt-0.5">
                    {rightItem.title}
                  </h3>
                  <div className="text-xs text-stone-400 mt-1">
                    {rightItem.year} · {rightItem.directorOrShowrunner}
                  </div>
                </div>

                <div className="w-16 h-22 rounded-lg overflow-hidden shrink-0 border border-stone-800 bg-stone-950">
                  <img
                    src={rightItem.posterImage}
                    alt={rightItem.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Gauges */}
              <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800/80 flex items-center justify-around gap-4">
                <FidelityGauge score={rightItem.fidelityScore} size="md" />
                <div className="w-px h-10 bg-stone-800" />
                <QualityGauge score={rightItem.qualityScore} size="md" />
              </div>

              {/* Source Details */}
              <div className="p-4 rounded-xl bg-stone-950/40 border border-stone-800 text-xs space-y-1.5">
                <span className="font-mono uppercase tracking-wider text-[11px] text-stone-400 block">
                  Original Source Material
                </span>
                <div className="font-serif italic font-semibold text-stone-200">
                  "{rightItem.sourceMaterial.title}"
                </div>
                <div className="text-stone-400">
                  By {rightItem.sourceMaterial.creator} ({rightItem.sourceMaterial.year})
                </div>
              </div>

              {/* Author Reaction */}
              {rightItem.authorReaction && (
                <div className="p-4 rounded-xl bg-stone-950/40 border border-stone-800 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-stone-400 font-mono text-[11px] uppercase">
                    <Quote className="w-3.5 h-3.5 text-amber-400" />
                    <span>Author Reaction</span>
                  </div>
                  <p className="font-serif italic text-stone-300">
                    "{rightItem.authorReaction.quote}"
                  </p>
                  <div className="text-[11px] text-stone-400">
                    — {rightItem.authorReaction.creatorName}
                  </div>
                </div>
              )}

              {/* Consensus */}
              <div className="text-xs text-stone-400 leading-relaxed font-sans pt-2 border-t border-stone-800">
                <span className="text-stone-300 font-semibold block mb-1">
                  The Editorial Verdict:
                </span>
                {rightItem.editorialConsensus.verdictSummary}
              </div>
            </div>

            <button
              onClick={() => onSelectAdaptation(rightItem)}
              className="w-full py-2.5 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
            >
              View Full {rightItem.title} Dossier
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
