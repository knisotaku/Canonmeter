import React, { useState } from 'react';
import { Adaptation, Format, Medium, QuadrantId, DivergenceCategory, DivergenceSentiment } from '../types/adaptation';
import { X, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface SubmitAdaptationModalProps {
  onClose: () => void;
  onAddAdaptation: (adaptation: Adaptation) => void;
}

export const SubmitAdaptationModal: React.FC<SubmitAdaptationModalProps> = ({
  onClose,
  onAddAdaptation,
}) => {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState(2024);
  const [format, setFormat] = useState<Format>('movie');
  const [director, setDirector] = useState('');
  const [studio, setStudio] = useState('');
  const [posterUrl, setPosterUrl] = useState('');

  // Source Material
  const [sourceTitle, setSourceTitle] = useState('');
  const [sourceCreator, setSourceCreator] = useState('');
  const [medium, setMedium] = useState<Medium>('book');
  const [sourceYear, setSourceYear] = useState(1990);
  const [sourceSize, setSourceSize] = useState('350 pages');
  const [sourceSynopsis, setSourceSynopsis] = useState('');

  // Scores
  const [fidelityScore, setFidelityScore] = useState(75);
  const [qualityScore, setQualityScore] = useState(80);
  const [fidelityVerdict, setFidelityVerdict] = useState('');
  const [qualityVerdict, setQualityVerdict] = useState('');

  // Key Divergence
  const [divergenceTitle, setDivergenceTitle] = useState('');
  const [divergenceCategory, setDivergenceCategory] = useState<DivergenceCategory>('plot');
  const [divergenceSource, setDivergenceSource] = useState('');
  const [divergenceScreen, setDivergenceScreen] = useState('');
  const [divergenceSentiment, setDivergenceSentiment] = useState<DivergenceSentiment>('improvement');

  // Creator quote
  const [authorName, setAuthorName] = useState('');
  const [authorQuote, setAuthorQuote] = useState('');
  const [authorSentiment, setAuthorSentiment] = useState<'praised' | 'disowned' | 'diplomatic'>('praised');

  const [submitted, setSubmitted] = useState(false);

  const calculateQuadrant = (fidelity: number, quality: number): QuadrantId => {
    if (fidelity >= 68 && quality >= 68) return 'holy-grail';
    if (fidelity < 68 && quality >= 68) return 'inspired-heresy';
    if (fidelity >= 68 && quality < 68) return 'dogmatic-slog';
    return 'sacrilege';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !sourceTitle.trim() || !director.trim()) return;

    const newAdaptation: Adaptation = {
      id: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${year}`,
      title: title.trim(),
      year,
      format,
      directorOrShowrunner: director.trim(),
      streamingOrStudio: studio.trim() || 'Independent / Studio',
      posterImage:
        posterUrl.trim() ||
        'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
      sourceMaterial: {
        title: sourceTitle.trim(),
        creator: sourceCreator.trim() || 'Original Author',
        medium,
        year: sourceYear,
        pageCountOrPlaytime: sourceSize.trim() || 'Standard work',
        synopsis: sourceSynopsis.trim() || 'Source material synopsis.',
      },
      fidelityScore,
      fidelityBreakdown: {
        plotAccuracy: fidelityScore,
        characterSpirits: Math.min(100, fidelityScore + 3),
        tonalFidelity: Math.max(0, fidelityScore - 2),
        endingFidelity: fidelityScore,
      },
      qualityScore,
      totalVotes: 1,
      quadrant: calculateQuadrant(fidelityScore, qualityScore),
      editorialConsensus: {
        fidelityVerdict: fidelityVerdict.trim() || 'Initial community assessed fidelity.',
        qualityVerdict: qualityVerdict.trim() || 'Initial standalone film appraisal.',
        verdictSummary: `${title} balances source fidelity (${fidelityScore}%) with cinema quality (${qualityScore}%).`,
      },
      keyDivergences: divergenceTitle.trim()
        ? [
            {
              id: `div-${Date.now()}`,
              category: divergenceCategory,
              title: divergenceTitle.trim(),
              sourceDescription: divergenceSource.trim() || 'Original canonical event.',
              screenDescription: divergenceScreen.trim() || 'Altered adaptation sequence.',
              sentiment: divergenceSentiment,
              sentimentScore: divergenceSentiment === 'improvement' ? 80 : 30,
              isSpoiler: false,
            },
          ]
        : [],
      authorReaction: {
        creatorName: authorName.trim() || sourceCreator.trim() || 'Original Author',
        role: 'Original Creator',
        quote: authorQuote.trim() || 'No formal statement recorded yet.',
        sentiment: authorSentiment,
        sourceContext: 'Community documented quote.',
      },
      reviews: [
        {
          id: `rev-${Date.now()}`,
          userName: 'Founding Contributor',
          date: 'Just now',
          fidelityScore,
          qualityScore,
          readSourceFirst: true,
          headline: `Initial Assessment for ${title}`,
          content: fidelityVerdict || qualityVerdict || 'Newly added adaptation.',
          upvotes: 1,
        },
      ],
    };

    onAddAdaptation(newAdaptation);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
              Scoreboard Entry
            </span>
            <h3 className="text-xl font-serif font-bold text-stone-100">
              Submit a New Adaptation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-100 rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-12 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-2xl font-serif font-bold text-stone-100">
              Adaptation Added!
            </h4>
            <p className="text-sm text-stone-400 max-w-md mx-auto">
              "{title}" has been indexed into the scoreboard and plotted onto the 2D Fidelity Matrix.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
            {/* Screen Adaptation Section */}
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 block border-b border-stone-800 pb-1">
                1. Screen Adaptation Details
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    Film / Series Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Blade Runner 2049"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-400 mb-1">
                      Year *
                    </label>
                    <input
                      type="number"
                      required
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-400 mb-1">
                      Format
                    </label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value as Format)}
                      className="w-full px-3 py-2 text-sm bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                    >
                      <option value="movie">Movie</option>
                      <option value="tv-series">TV Series</option>
                      <option value="limited-series">Limited Series</option>
                      <option value="animated-series">Animated</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    Director / Showrunner *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Denis Villeneuve"
                    value={director}
                    onChange={(e) => setDirector(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    Studio / Streaming Network
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Warner Bros / HBO"
                    value={studio}
                    onChange={(e) => setStudio(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Source Material Section */}
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 block border-b border-stone-800 pb-1">
                2. Original Source Material
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    Source Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Do Androids Dream of Electric Sheep?"
                    value={sourceTitle}
                    onChange={(e) => setSourceTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    Author / Creator *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Philip K. Dick"
                    value={sourceCreator}
                    onChange={(e) => setSourceCreator(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-400 mb-1">
                      Medium
                    </label>
                    <select
                      value={medium}
                      onChange={(e) => setMedium(e.target.value as Medium)}
                      className="w-full px-3 py-2 text-sm bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                    >
                      <option value="book">Book / Novel</option>
                      <option value="comic">Comic / Graphic Novel</option>
                      <option value="videogame">Video Game</option>
                      <option value="manga">Manga / Anime</option>
                      <option value="play">Stage Play</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-400 mb-1">
                      Original Year
                    </label>
                    <input
                      type="number"
                      value={sourceYear}
                      onChange={(e) => setSourceYear(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    Length / Playtime
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 450 pages or 20 hours"
                    value={sourceSize}
                    onChange={(e) => setSourceSize(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Source Synopsis / Premise
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of original book/game premise..."
                  value={sourceSynopsis}
                  onChange={(e) => setSourceSynopsis(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>

            {/* Score Benchmarks */}
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-purple-400 block border-b border-stone-800 pb-1">
                3. Score Benchmarks & Consensus
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-stone-950/60 border border-stone-800">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-emerald-400 font-semibold">Fidelity Score</span>
                    <span className="font-mono font-bold text-emerald-400 tabular-nums">
                      {fidelityScore}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={fidelityScore}
                    onChange={(e) => setFidelityScore(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-amber-400 font-semibold">Quality Score</span>
                    <span className="font-mono font-bold text-amber-400 tabular-nums">
                      {qualityScore}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={qualityScore}
                    onChange={(e) => setQualityScore(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    Fidelity Consensus Verdict
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Faithfully preserves tone with minor timeline shifts"
                    value={fidelityVerdict}
                    onChange={(e) => setFidelityVerdict(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    Standalone Cinema Consensus Verdict
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Spectacular visuals, gripping pacing and strong cast"
                    value={qualityVerdict}
                    onChange={(e) => setQualityVerdict(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Key Divergence */}
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-300 block border-b border-stone-800 pb-1">
                4. Notable Divergence / Change (Optional)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    Change Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Altered Ending Climax"
                    value={divergenceTitle}
                    onChange={(e) => setDivergenceTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    Sentiment
                  </label>
                  <select
                    value={divergenceSentiment}
                    onChange={(e) => setDivergenceSentiment(e.target.value as DivergenceSentiment)}
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="improvement">Improvement</option>
                    <option value="controversial">Controversial</option>
                    <option value="neutral">Neutral Trim</option>
                    <option value="butchered">Butchered</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    In the Original Source
                  </label>
                  <textarea
                    rows={2}
                    placeholder="What actually happens in the book/comic..."
                    value={divergenceSource}
                    onChange={(e) => setDivergenceSource(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    In the Adaptation
                  </label>
                  <textarea
                    rows={2}
                    placeholder="What the movie or show changed instead..."
                    value={divergenceScreen}
                    onChange={(e) => setDivergenceScreen(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-100 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                Index Adaptation
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
