import React from 'react';
import { Adaptation } from '../types/adaptation';
import { FidelityGauge } from './FidelityGauge';
import { QualityGauge } from './QualityGauge';
import { QUADRANT_META } from '../data/adaptations';
import { ArrowRight, MessageSquare, ThumbsUp } from 'lucide-react';

interface AdaptationCardProps {
  adaptation: Adaptation;
  onSelect: (adaptation: Adaptation) => void;
  onVote: (adaptation: Adaptation) => void;
}

export const AdaptationCard: React.FC<AdaptationCardProps> = ({
  adaptation,
  onSelect,
  onVote,
}) => {
  const quadrantMeta = QUADRANT_META[adaptation.quadrant];
  const primaryDivergence = adaptation.keyDivergences[0];

  return (
    <article className="group relative rounded-2xl border border-stone-800 bg-stone-900/50 hover:bg-stone-900/80 transition-all duration-300 hover:border-stone-700 flex flex-col justify-between overflow-hidden shadow-lg">
      <div className="p-6 space-y-5">
        {/* Top Kicker & Quadrant (Clean unboxed metadata) */}
        <div className="flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <span className="capitalize">{adaptation.format.replace('-', ' ')}</span>
            <span aria-hidden="true">·</span>
            <span>{adaptation.year}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate max-w-[150px]">{adaptation.directorOrShowrunner}</span>
          </div>

          <span className={`font-serif font-semibold ${quadrantMeta.textColor}`}>
            {quadrantMeta.name}
          </span>
        </div>

        {/* Primary Title Lockup */}
        <div className="flex gap-4 items-start">
          {/* Thumbnail Poster with Fallback */}
          <div className="w-20 h-28 rounded-xl overflow-hidden shrink-0 border border-stone-800 bg-stone-950 relative shadow-inner">
            <img
              src={adaptation.posterImage}
              alt={`${adaptation.title} poster`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Graceful fallback container
                const target = e.target as HTMLElement;
                target.style.display = 'none';
              }}
            />
            {/* Fallback pattern if image is hidden */}
            <div className="absolute inset-0 -z-10 flex flex-col items-center justify-center p-2 text-center bg-stone-950 text-stone-400">
              <span className="font-serif text-[11px] font-bold text-stone-300 line-clamp-2">
                {adaptation.title}
              </span>
              <span className="text-[9px] text-stone-400 mt-1">
                {adaptation.year}
              </span>
            </div>
          </div>

          {/* Title and Source Details */}
          <div className="space-y-1.5 flex-1 min-w-0">
            <h3
              onClick={() => onSelect(adaptation)}
              className="text-xl font-serif font-bold text-stone-100 hover:text-amber-400 transition-colors cursor-pointer line-clamp-1"
            >
              {adaptation.title}
            </h3>

            {/* Source Material Unboxed Metadata */}
            <div className="text-xs text-stone-400 space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-stone-400">Adapted from</span>
                <span className="text-stone-300 font-serif italic font-medium">
                  "{adaptation.sourceMaterial.title}"
                </span>
              </div>
              <div className="flex items-center gap-2 text-stone-400 text-[11px]">
                <span className="capitalize">{adaptation.sourceMaterial.medium}</span>
                <span aria-hidden="true">·</span>
                <span>{adaptation.sourceMaterial.creator}</span>
                <span aria-hidden="true">·</span>
                <span>{adaptation.sourceMaterial.year}</span>
              </div>
            </div>

            {/* Editorial One-Liner */}
            <p className="text-xs text-stone-300 line-clamp-2 pt-1 font-sans leading-relaxed">
              {adaptation.editorialConsensus.verdictSummary}
            </p>
          </div>
        </div>

        {/* Dual Gauges Section */}
        <div className="pt-2 pb-1 border-t border-stone-800/80 flex items-center justify-between gap-4">
          <FidelityGauge score={adaptation.fidelityScore} size="md" />
          <div className="w-px h-10 bg-stone-800" />
          <QualityGauge score={adaptation.qualityScore} size="md" />
        </div>

        {/* Notable Divergence Teaser */}
        {primaryDivergence && (
          <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800/80 text-xs space-y-1">
            <div className="flex items-center justify-between text-stone-400 text-[11px]">
              <span className="uppercase tracking-wider font-mono text-amber-400/90">
                Key Change · {primaryDivergence.category}
              </span>
              <span className="text-stone-400 font-mono tabular-nums">
                {primaryDivergence.sentimentScore}% approval
              </span>
            </div>
            <div className="font-semibold text-stone-200">
              {primaryDivergence.title}
            </div>
            <p className="text-stone-400 line-clamp-1 text-[11px]">
              {primaryDivergence.screenDescription}
            </p>
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="px-6 py-3.5 bg-stone-950/40 border-t border-stone-800/80 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-stone-400">
          <span className="font-mono tabular-nums">{adaptation.totalVotes.toLocaleString()}</span>
          <span>verdicts</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{adaptation.reviews.length}</span>
          <span>reviews</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onVote(adaptation)}
            className="px-3 py-1.5 text-xs font-medium text-stone-300 hover:text-stone-100 bg-stone-800/80 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          >
            Vote
          </button>
          <button
            onClick={() => onSelect(adaptation)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <span>Breakdown</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
