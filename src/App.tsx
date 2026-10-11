import React, { useState, useEffect } from 'react';
import { Adaptation, Medium, QuadrantId, Review, FilterOptions } from './types/adaptation';
import { INITIAL_ADAPTATIONS, QUADRANT_META } from './data/adaptations';
import { Header } from './components/Header';
import { AdaptationCard } from './components/AdaptationCard';
import { MatrixQuadrantChart } from './components/MatrixQuadrantChart';
import { AdaptationDetailModal } from './components/AdaptationDetailModal';
import { CastVerdictModal } from './components/CastVerdictModal';
import { SubmitAdaptationModal } from './components/SubmitAdaptationModal';
import { HeadToHeadComparison } from './components/HeadToHeadComparison';
import { FidelityRubricView } from './components/FidelityRubricView';
import { Footer } from './components/Footer';
import { Search, SlidersHorizontal, ArrowUpDown, Filter, Sparkles, BookOpen, Layers } from 'lucide-react';

const STORAGE_KEY = 'canonmeter_adaptations_v1';

export default function App() {
  const [adaptations, setAdaptations] = useState<Adaptation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_ADAPTATIONS;
  });

  const [activeTab, setActiveTab] = useState<'scoreboard' | 'matrix' | 'compare' | 'rubric'>('scoreboard');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [mediumFilter, setMediumFilter] = useState<Medium | 'all'>('all');
  const [quadrantFilter, setQuadrantFilter] = useState<QuadrantId | 'all'>('all');
  const [sortBy, setSortBy] = useState<
    'fidelity-desc' | 'fidelity-asc' | 'quality-desc' | 'quality-asc' | 'votes-desc' | 'year-desc' | 'divergence'
  >('fidelity-desc');

  // Modals
  const [selectedDetail, setSelectedDetail] = useState<Adaptation | null>(null);
  const [selectedForVote, setSelectedForVote] = useState<Adaptation | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(adaptations));
    } catch {
      // ignore
    }
  }, [adaptations]);

  // Compute stats
  const totalVotes = adaptations.reduce((acc, a) => acc + a.totalVotes, 0);
  const holyGrailCount = adaptations.filter((a) => a.quadrant === 'holy-grail').length;

  // Filter and sort adaptations
  const filteredAdaptations = adaptations
    .filter((a) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = a.title.toLowerCase().includes(q);
        const matchesSourceTitle = a.sourceMaterial.title.toLowerCase().includes(q);
        const matchesAuthor = a.sourceMaterial.creator.toLowerCase().includes(q);
        const matchesDirector = a.directorOrShowrunner.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSourceTitle && !matchesAuthor && !matchesDirector) {
          return false;
        }
      }

      // Medium
      if (mediumFilter !== 'all' && a.sourceMaterial.medium !== mediumFilter) {
        return false;
      }

      // Quadrant
      if (quadrantFilter !== 'all' && a.quadrant !== quadrantFilter) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'fidelity-desc':
          return b.fidelityScore - a.fidelityScore;
        case 'fidelity-asc':
          return a.fidelityScore - b.fidelityScore;
        case 'quality-desc':
          return b.qualityScore - a.qualityScore;
        case 'quality-asc':
          return a.qualityScore - b.qualityScore;
        case 'votes-desc':
          return b.totalVotes - a.totalVotes;
        case 'year-desc':
          return b.year - a.year;
        case 'divergence': {
          // Highest divergence between quality and fidelity
          const divA = Math.abs(a.qualityScore - a.fidelityScore);
          const divB = Math.abs(b.qualityScore - b.fidelityScore);
          return divB - divA;
        }
        default:
          return 0;
      }
    });

  // Handle Vote Submission
  const handleCastVerdict = (
    adaptationId: string,
    reviewData: Omit<Review, 'id' | 'date' | 'upvotes'>,
    subScores: {
      plotAccuracy: number;
      characterSpirits: number;
      tonalFidelity: number;
      endingFidelity: number;
    }
  ) => {
    setAdaptations((prev) =>
      prev.map((item) => {
        if (item.id !== adaptationId) return item;

        const currentN = item.totalVotes;
        const newN = currentN + 1;

        // Running weighted average for fidelity & quality
        const newFidelity = Math.round(
          (item.fidelityScore * currentN + reviewData.fidelityScore) / newN
        );
        const newQuality = Math.round(
          (item.qualityScore * currentN + reviewData.qualityScore) / newN
        );

        // Sub scores update
        const newPlot = Math.round(
          (item.fidelityBreakdown.plotAccuracy * currentN + subScores.plotAccuracy) / newN
        );
        const newChar = Math.round(
          (item.fidelityBreakdown.characterSpirits * currentN + subScores.characterSpirits) / newN
        );
        const newTone = Math.round(
          (item.fidelityBreakdown.tonalFidelity * currentN + subScores.tonalFidelity) / newN
        );
        const newEnd = Math.round(
          (item.fidelityBreakdown.endingFidelity * currentN + subScores.endingFidelity) / newN
        );

        // Recalculate quadrant
        let newQuadrant: QuadrantId = 'sacrilege';
        if (newFidelity >= 68 && newQuality >= 68) newQuadrant = 'holy-grail';
        else if (newFidelity < 68 && newQuality >= 68) newQuadrant = 'inspired-heresy';
        else if (newFidelity >= 68 && newQuality < 68) newQuadrant = 'dogmatic-slog';

        const newReview: Review = {
          ...reviewData,
          id: `rev-${Date.now()}`,
          date: 'Just now',
          upvotes: 0,
        };

        const updated = {
          ...item,
          fidelityScore: newFidelity,
          qualityScore: newQuality,
          totalVotes: newN,
          quadrant: newQuadrant,
          fidelityBreakdown: {
            plotAccuracy: newPlot,
            characterSpirits: newChar,
            tonalFidelity: newTone,
            endingFidelity: newEnd,
          },
          reviews: [newReview, ...item.reviews],
        };

        // If open in detail view, also update it
        if (selectedDetail?.id === adaptationId) {
          setSelectedDetail(updated);
        }

        return updated;
      })
    );
  };

  // Upvote review handler
  const handleUpvoteReview = (adaptationId: string, reviewId: string) => {
    setAdaptations((prev) =>
      prev.map((item) => {
        if (item.id !== adaptationId) return item;
        const updatedReviews = item.reviews.map((r) => {
          if (r.id !== reviewId) return r;
          const hasUpvoted = !r.hasUpvoted;
          return {
            ...r,
            hasUpvoted,
            upvotes: hasUpvoted ? r.upvotes + 1 : Math.max(0, r.upvotes - 1),
          };
        });
        const updated = { ...item, reviews: updatedReviews };
        if (selectedDetail?.id === adaptationId) {
          setSelectedDetail(updated);
        }
        return updated;
      })
    );
  };

  // Add new adaptation handler
  const handleAddAdaptation = (newAdaptation: Adaptation) => {
    setAdaptations((prev) => [newAdaptation, ...prev]);
    setActiveTab('scoreboard');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSubmitModal={() => setShowSubmitModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Tab 1: Scoreboard Catalog View */}
        {activeTab === 'scoreboard' && (
          <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Search Field */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by film title, book name, author, or director..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm bg-stone-950 border border-stone-800 rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-500 hover:text-stone-300"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2 shrink-0">
                  <ArrowUpDown className="w-4 h-4 text-stone-400 shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-xl text-stone-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="fidelity-desc">Highest Fidelity (Most Faithful)</option>
                    <option value="fidelity-asc">Lowest Fidelity (Most Unfaithful)</option>
                    <option value="quality-desc">Highest Film Quality (Standalone Masterpiece)</option>
                    <option value="quality-asc">Lowest Film Quality (Cinematic Disaster)</option>
                    <option value="divergence">Most Divergent (Faithfulness vs Cinema Gap)</option>
                    <option value="votes-desc">Most Community Votes</option>
                    <option value="year-desc">Release Year (Newest First)</option>
                  </select>
                </div>
              </div>

              {/* Medium & Quadrant Segmented Controls (Buttons / Tabs) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-800/80 text-xs">
                {/* Medium Filter Segment */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1">
                  <span className="text-stone-500 font-mono text-[11px] mr-1 hidden sm:inline">
                    Source:
                  </span>
                  {(
                    [
                      { id: 'all', label: 'All Sources' },
                      { id: 'book', label: 'Novels / Books' },
                      { id: 'comic', label: 'Comics' },
                      { id: 'videogame', label: 'Video Games' },
                      { id: 'manga', label: 'Manga / Anime' },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMediumFilter(m.id)}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                        mediumFilter === m.id
                          ? 'bg-stone-800 text-stone-100 font-semibold'
                          : 'text-stone-400 hover:text-stone-200 hover:bg-stone-850'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Quadrant Filter Segment */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1">
                  <span className="text-stone-500 font-mono text-[11px] mr-1 hidden sm:inline">
                    Quadrant:
                  </span>
                  <button
                    onClick={() => setQuadrantFilter('all')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                      quadrantFilter === 'all'
                        ? 'bg-stone-800 text-stone-100 font-semibold'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    All Quadrants
                  </button>
                  <button
                    onClick={() => setQuadrantFilter('holy-grail')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                      quadrantFilter === 'holy-grail'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                        : 'text-stone-400 hover:text-emerald-400'
                    }`}
                  >
                    The Holy Grail
                  </button>
                  <button
                    onClick={() => setQuadrantFilter('inspired-heresy')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                      quadrantFilter === 'inspired-heresy'
                        ? 'bg-purple-950 text-purple-300 border border-purple-700/50'
                        : 'text-stone-400 hover:text-purple-400'
                    }`}
                  >
                    Inspired Heresy
                  </button>
                  <button
                    onClick={() => setQuadrantFilter('sacrilege')}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                      quadrantFilter === 'sacrilege'
                        ? 'bg-rose-950 text-rose-300 border border-rose-700/50'
                        : 'text-stone-400 hover:text-rose-400'
                    }`}
                  >
                    Total Sacrilege
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count & Quick Metrics */}
            <div className="flex items-center justify-between text-xs text-stone-400 px-1">
              <span>
                Showing{' '}
                <strong className="text-stone-200 font-mono tabular-nums">
                  {filteredAdaptations.length}
                </strong>{' '}
                of{' '}
                <span className="font-mono tabular-nums">{adaptations.length}</span> adaptations
              </span>

              {(searchQuery || mediumFilter !== 'all' || quadrantFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setMediumFilter('all');
                    setQuadrantFilter('all');
                  }}
                  className="text-amber-400 hover:underline cursor-pointer"
                >
                  Reset all filters
                </button>
              )}
            </div>

            {/* Cards Grid */}
            {filteredAdaptations.length === 0 ? (
              <div className="p-16 text-center rounded-2xl border border-stone-800 bg-stone-900/40 space-y-4">
                <BookOpen className="w-10 h-10 text-stone-600 mx-auto" />
                <h3 className="text-lg font-serif font-bold text-stone-200">
                  No adaptations match your query
                </h3>
                <p className="text-xs text-stone-400 max-w-md mx-auto">
                  Try adjusting your search terms or filter selection. Or click "+ Rate an Adaptation" in the top bar to index a new title.
                </p>
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors"
                >
                  Add This Adaptation
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAdaptations.map((adaptation) => (
                  <AdaptationCard
                    key={adaptation.id}
                    adaptation={adaptation}
                    onSelect={(a) => setSelectedDetail(a)}
                    onVote={(a) => setSelectedForVote(a)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: The 2D Matrix Map */}
        {activeTab === 'matrix' && (
          <div className="max-w-7xl mx-auto px-6 py-10">
            <MatrixQuadrantChart
              adaptations={adaptations}
              onSelectAdaptation={(a) => setSelectedDetail(a)}
              selectedQuadrantFilter={quadrantFilter}
              onFilterQuadrant={(q) => {
                setQuadrantFilter(q);
              }}
            />
          </div>
        )}

        {/* Tab 3: Head-to-Head Comparison */}
        {activeTab === 'compare' && (
          <div className="max-w-7xl mx-auto px-6 py-10">
            <HeadToHeadComparison
              adaptations={adaptations}
              onSelectAdaptation={(a) => setSelectedDetail(a)}
            />
          </div>
        )}

        {/* Tab 4: Fidelity Rubric Guide */}
        {activeTab === 'rubric' && (
          <div className="max-w-7xl mx-auto px-6 py-10">
            <FidelityRubricView />
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedDetail && (
        <AdaptationDetailModal
          adaptation={selectedDetail}
          onClose={() => setSelectedDetail(null)}
          onVote={(a) => {
            setSelectedForVote(a);
          }}
          onUpvoteReview={handleUpvoteReview}
        />
      )}

      {selectedForVote && (
        <CastVerdictModal
          adaptation={selectedForVote}
          onClose={() => setSelectedForVote(null)}
          onSubmitVerdict={handleCastVerdict}
        />
      )}

      {showSubmitModal && (
        <SubmitAdaptationModal
          onClose={() => setShowSubmitModal(false)}
          onAddAdaptation={handleAddAdaptation}
        />
      )}

      {/* Footer */}
      <Footer
        onNavigateTab={(tab) => setActiveTab(tab)}
        onOpenSubmit={() => setShowSubmitModal(true)}
      />
    </div>
  );
}
