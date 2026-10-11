import React, { useState } from 'react';
import { Adaptation, DivergenceCategory } from '../types/adaptation';
import { FidelityGauge } from './FidelityGauge';
import { QualityGauge } from './QualityGauge';
import { QUADRANT_META } from '../data/adaptations';
import {
  X,
  BookOpen,
  Film,
  Quote,
  Eye,
  EyeOff,
  ThumbsUp,
  MessageSquare,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Share2,
  Check,
} from 'lucide-react';

interface AdaptationDetailModalProps {
  adaptation: Adaptation;
  onClose: () => void;
  onVote: (adaptation: Adaptation) => void;
  onUpvoteReview: (adaptationId: string, reviewId: string) => void;
}

export const AdaptationDetailModal: React.FC<AdaptationDetailModalProps> = ({
  adaptation,
  onClose,
  onVote,
  onUpvoteReview,
}) => {
  const [showSpoilers, setShowSpoilers] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DivergenceCategory | 'all'>('all');
  const [reviewFilter, setReviewFilter] = useState<'all' | 'readers-only'>('all');
  const [copiedLink, setCopiedLink] = useState(false);

  const quadrantMeta = QUADRANT_META[adaptation.quadrant];

  const filteredDivergences = adaptation.keyDivergences.filter((div) => {
    if (selectedCategory !== 'all' && div.category !== selectedCategory) return false;
    return true;
  });

  const filteredReviews = adaptation.reviews.filter((rev) => {
    if (reviewFilter === 'readers-only' && !rev.readSourceFirst) return false;
    return true;
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'praised':
        return <span className="text-emerald-400 font-serif text-xs">Author Praised</span>;
      case 'disowned':
        return <span className="text-rose-400 font-serif text-xs">Author Disowned</span>;
      default:
        return <span className="text-stone-400 font-serif text-xs">Diplomatic</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Sticky Bar with Close */}
        <div className="sticky top-0 z-20 px-6 py-4 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-lg text-stone-100 truncate">
              {adaptation.title}
            </span>
            <span className="text-xs text-stone-400">({adaptation.year})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              title="Copy share link"
              className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 space-y-8">
          {/* Header Showcase Split */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Poster & Basic Metadata */}
            <div className="md:col-span-4 space-y-4">
              <div className="rounded-xl overflow-hidden border border-stone-800 bg-stone-950 aspect-3/4 max-w-[260px] mx-auto md:max-w-none shadow-md">
                <img
                  src={adaptation.posterImage}
                  alt={adaptation.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>

              {/* Technical Credits defined cleanly */}
              <div className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 text-xs space-y-2">
                <div className="flex justify-between text-stone-400">
                  <span>Format</span>
                  <span className="text-stone-200 capitalize">
                    {adaptation.format.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Direction</span>
                  <span className="text-stone-200 text-right truncate max-w-[160px]">
                    {adaptation.directorOrShowrunner}
                  </span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Studio / Network</span>
                  <span className="text-stone-200 text-right truncate max-w-[160px]">
                    {adaptation.streamingOrStudio}
                  </span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Quadrant</span>
                  <span className={`font-serif font-semibold ${quadrantMeta.textColor}`}>
                    {quadrantMeta.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Scores & Sub-Metrics */}
            <div className="md:col-span-8 space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                  Canon vs Cinema Assessment
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 mt-1">
                  {adaptation.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-stone-400 mt-1">
                  <span>Adapted from</span>
                  <span className="font-serif italic text-stone-200">
                    "{adaptation.sourceMaterial.title}"
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{adaptation.sourceMaterial.creator}</span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{adaptation.sourceMaterial.medium}</span>
                </div>
              </div>

              {/* Big Dual Meter Display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-stone-950/80 border border-stone-800">
                <div className="space-y-3">
                  <FidelityGauge score={adaptation.fidelityScore} size="lg" />
                  <p className="text-xs text-stone-400 leading-relaxed font-sans">
                    {adaptation.editorialConsensus.fidelityVerdict}
                  </p>
                </div>

                <div className="space-y-3 sm:border-l sm:border-stone-800 sm:pl-4">
                  <QualityGauge score={adaptation.qualityScore} size="lg" />
                  <p className="text-xs text-stone-400 leading-relaxed font-sans">
                    {adaptation.editorialConsensus.qualityVerdict}
                  </p>
                </div>
              </div>

              {/* 4-Pillar Fidelity Sub-Indices */}
              <div className="space-y-3 p-4 rounded-xl border border-stone-800 bg-stone-950/40">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="uppercase font-mono text-[11px] tracking-wider text-stone-300">
                    Fidelity Breakdown
                  </span>
                  <span className="font-mono text-[11px]">Source Rubric</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="flex justify-between text-stone-300 mb-1">
                      <span>Narrative & Plot Accuracy</span>
                      <span className="font-mono font-bold tabular-nums text-emerald-400">
                        {adaptation.fidelityBreakdown.plotAccuracy}%
                      </span>
                    </div>
                    <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${adaptation.fidelityBreakdown.plotAccuracy}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-stone-300 mb-1">
                      <span>Character Spirit & Integrity</span>
                      <span className="font-mono font-bold tabular-nums text-emerald-400">
                        {adaptation.fidelityBreakdown.characterSpirits}%
                      </span>
                    </div>
                    <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${adaptation.fidelityBreakdown.characterSpirits}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-stone-300 mb-1">
                      <span>Tonal & Thematic Resonance</span>
                      <span className="font-mono font-bold tabular-nums text-emerald-400">
                        {adaptation.fidelityBreakdown.tonalFidelity}%
                      </span>
                    </div>
                    <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${adaptation.fidelityBreakdown.tonalFidelity}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-stone-300 mb-1">
                      <span>Climax & Ending Resolution</span>
                      <span className="font-mono font-bold tabular-nums text-emerald-400">
                        {adaptation.fidelityBreakdown.endingFidelity}%
                      </span>
                    </div>
                    <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${adaptation.fidelityBreakdown.endingFidelity}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action: Vote Now */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-amber-950/20 border border-amber-800/40">
                <div>
                  <div className="text-sm font-semibold text-amber-300">
                    Disagree with this score?
                  </div>
                  <div className="text-xs text-stone-400 mt-0.5">
                    Cast your own fidelity and quality ratings to adjust the community average.
                  </div>
                </div>
                <button
                  onClick={() => onVote(adaptation)}
                  className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm"
                >
                  Cast Your Verdict
                </button>
              </div>
            </div>
          </div>

          {/* Author / Creator Reaction */}
          {adaptation.authorReaction && (
            <div className="p-6 rounded-2xl bg-stone-950/60 border border-stone-800 relative">
              <div className="flex items-center justify-between text-xs text-stone-400 mb-3">
                <div className="flex items-center gap-2">
                  <Quote className="w-4 h-4 text-amber-400" />
                  <span className="uppercase font-mono tracking-wider text-stone-300">
                    The Creator’s Verdict
                  </span>
                </div>
                {getSentimentBadge(adaptation.authorReaction.sentiment)}
              </div>

              <blockquote className="text-stone-200 font-serif italic text-base sm:text-lg leading-relaxed">
                "{adaptation.authorReaction.quote}"
              </blockquote>

              <div className="mt-3 flex items-center justify-between text-xs text-stone-400 border-t border-stone-800/60 pt-3">
                <div>
                  <span className="font-semibold text-stone-200">
                    {adaptation.authorReaction.creatorName}
                  </span>
                  <span aria-hidden="true" className="mx-2">·</span>
                  <span>{adaptation.authorReaction.role}</span>
                </div>
                <span className="text-[11px] text-stone-400 hidden sm:inline">
                  {adaptation.authorReaction.sourceContext}
                </span>
              </div>
            </div>
          )}

          {/* Source Material vs Screen Side-by-Side Reference */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold text-stone-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Source Material Context</span>
            </h3>

            <div className="p-5 rounded-2xl bg-stone-950/40 border border-stone-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-400 pb-2 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-200">
                    "{adaptation.sourceMaterial.title}"
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{adaptation.sourceMaterial.creator}</span>
                  <span aria-hidden="true">·</span>
                  <span>Published {adaptation.sourceMaterial.year}</span>
                </div>
                <span className="font-mono text-stone-400">
                  {adaptation.sourceMaterial.pageCountOrPlaytime}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
                {adaptation.sourceMaterial.synopsis}
              </p>
            </div>
          </div>

          {/* Key Divergences Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-serif font-bold text-stone-100">
                  Key Changes & Divergences
                </h3>
                <span className="text-xs font-mono text-stone-400 tabular-nums">
                  ({filteredDivergences.length})
                </span>
              </div>

              {/* Spoiler and Category Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSpoilers(!showSpoilers)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-300 hover:text-stone-100 bg-stone-800 rounded-lg transition-colors cursor-pointer"
                >
                  {showSpoilers ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                      <span>Hide Spoilers</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-stone-400" />
                      <span>Show Spoilers</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Category Filter Pills (Functional Buttons) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {(['all', 'character', 'plot', 'tone', 'ending', 'worldbuilding'] as const).map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg capitalize whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-amber-400 text-stone-950 font-semibold'
                        : 'bg-stone-800/80 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            {/* Divergence Cards */}
            <div className="space-y-3">
              {filteredDivergences.map((div) => {
                const isBlurred = div.isSpoiler && !showSpoilers;

                return (
                  <div
                    key={div.id}
                    className="p-4 rounded-xl border border-stone-800 bg-stone-950/60 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <div className="flex items-center gap-2">
                        <span className="font-mono uppercase tracking-wider text-[11px] text-amber-400">
                          {div.category}
                        </span>
                        {div.isSpoiler && (
                          <span className="text-[10px] text-amber-500 font-mono">
                            [Spoiler]
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-stone-400">
                          Community Consensus:
                        </span>
                        <span
                          className={`font-semibold capitalize ${
                            div.sentiment === 'improvement'
                              ? 'text-emerald-400'
                              : div.sentiment === 'butchered'
                              ? 'text-rose-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {div.sentiment} ({div.sentimentScore}%)
                        </span>
                      </div>
                    </div>

                    <h4 className="font-serif font-bold text-base text-stone-200">
                      {div.title}
                    </h4>

                    {isBlurred ? (
                      <div
                        onClick={() => setShowSpoilers(true)}
                        className="p-3 rounded-lg bg-stone-900 border border-stone-800 text-xs text-amber-400/90 text-center cursor-pointer hover:bg-stone-850 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Contains narrative spoiler. Click to reveal.</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                        <div className="p-3 rounded-lg bg-stone-900/80 border border-stone-800/80 space-y-1">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block">
                            In The Original Source
                          </span>
                          <p className="text-stone-300 leading-relaxed font-sans">
                            {div.sourceDescription}
                          </p>
                        </div>

                        <div className="p-3 rounded-lg bg-stone-900/80 border border-stone-800/80 space-y-1">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400/90 block">
                            In The Screen Adaptation
                          </span>
                          <p className="text-stone-300 leading-relaxed font-sans">
                            {div.screenDescription}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Community Reviews Section */}
          <div className="space-y-4 pt-4 border-t border-stone-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-100">
                  Community Verdicts & Reviews
                </h3>
                <span className="text-xs text-stone-400">
                  Audience analyses balancing source fidelity and cinema craft
                </span>
              </div>

              {/* Reader vs All Filter */}
              <div className="flex items-center gap-1.5 p-1 bg-stone-950 rounded-lg border border-stone-800 text-xs">
                <button
                  onClick={() => setReviewFilter('all')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    reviewFilter === 'all'
                      ? 'bg-stone-800 text-stone-100'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  All Reviews
                </button>
                <button
                  onClick={() => setReviewFilter('readers-only')}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    reviewFilter === 'readers-only'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/40'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Source Readers Only
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredReviews.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-stone-950/40 border border-stone-800 text-stone-400 text-xs">
                  No reviews match the current filter. Be the first to submit a verdict!
                </div>
              ) : (
                filteredReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-xl border border-stone-800 bg-stone-950/50 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-400">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-200">
                          {rev.userName}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{rev.date}</span>
                        {rev.readSourceFirst && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-emerald-400 text-[11px] font-mono">
                              [Read Source First]
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-emerald-400 font-mono font-bold tabular-nums">
                          Fidelity: {rev.fidelityScore}%
                        </span>
                        <span className="text-amber-400 font-mono font-bold tabular-nums">
                          Quality: {rev.qualityScore}%
                        </span>
                      </div>
                    </div>

                    <h4 className="font-serif font-bold text-base text-stone-100">
                      {rev.headline}
                    </h4>

                    <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
                      {rev.content}
                    </p>

                    {(rev.favoriteChange || rev.leastFavoriteChange) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs border-t border-stone-800/60">
                        {rev.favoriteChange && (
                          <div className="text-stone-400">
                            <span className="text-emerald-400 font-semibold">Best Change: </span>
                            <span className="text-stone-300">{rev.favoriteChange}</span>
                          </div>
                        )}
                        {rev.leastFavoriteChange && (
                          <div className="text-stone-400">
                            <span className="text-rose-400 font-semibold">Worst Change: </span>
                            <span className="text-stone-300">{rev.leastFavoriteChange}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 text-xs">
                      <button
                        onClick={() => onUpvoteReview(adaptation.id, rev.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                          rev.hasUpvoted
                            ? 'bg-amber-400/20 border-amber-400/50 text-amber-300'
                            : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span className="font-mono tabular-nums">{rev.upvotes}</span>
                        <span>Helpful</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
