export type Medium = 'book' | 'comic' | 'videogame' | 'manga' | 'play' | 'folklore';

export type Format = 'movie' | 'tv-series' | 'limited-series' | 'animated-series';

export type QuadrantId = 'holy-grail' | 'inspired-heresy' | 'dogmatic-slog' | 'sacrilege';

export type DivergenceCategory = 'plot' | 'character' | 'tone' | 'ending' | 'worldbuilding';

export type DivergenceSentiment = 'improvement' | 'controversial' | 'neutral' | 'butchered';

export interface Divergence {
  id: string;
  category: DivergenceCategory;
  title: string;
  sourceDescription: string;
  screenDescription: string;
  sentiment: DivergenceSentiment;
  sentimentScore: number; // % who liked the change
  isSpoiler: boolean;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  date: string;
  fidelityScore: number;
  qualityScore: number;
  readSourceFirst: boolean;
  headline: string;
  content: string;
  favoriteChange?: string;
  leastFavoriteChange?: string;
  upvotes: number;
  hasUpvoted?: boolean;
}

export interface AuthorReaction {
  creatorName: string;
  role: string;
  quote: string;
  sentiment: 'praised' | 'disowned' | 'diplomatic';
  sourceContext: string;
}

export interface FidelityBreakdown {
  plotAccuracy: number; // 0 - 100
  characterSpirits: number; // 0 - 100
  tonalFidelity: number; // 0 - 100
  endingFidelity: number; // 0 - 100
}

export interface SourceMaterial {
  title: string;
  creator: string;
  medium: Medium;
  year: number;
  pageCountOrPlaytime: string;
  synopsis: string;
}

export interface Adaptation {
  id: string;
  title: string;
  year: number;
  format: Format;
  directorOrShowrunner: string;
  streamingOrStudio: string;
  posterImage: string;
  backdropImage?: string;
  sourceMaterial: SourceMaterial;
  fidelityScore: number; // 0 - 100
  fidelityBreakdown: FidelityBreakdown;
  qualityScore: number; // 0 - 100
  totalVotes: number;
  quadrant: QuadrantId;
  editorialConsensus: {
    fidelityVerdict: string;
    qualityVerdict: string;
    verdictSummary: string;
  };
  keyDivergences: Divergence[];
  authorReaction: AuthorReaction;
  reviews: Review[];
  compareWithId?: string; // For comparing e.g. Dune 1984 vs Dune 2024
}

export interface FilterOptions {
  searchQuery: string;
  medium: Medium | 'all';
  quadrant: QuadrantId | 'all';
  sortBy: 'fidelity-desc' | 'fidelity-asc' | 'quality-desc' | 'quality-asc' | 'votes-desc' | 'year-desc' | 'divergence';
  sourceReaderFilter: 'all' | 'readers-only' | 'screen-only';
}
