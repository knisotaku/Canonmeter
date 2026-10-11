import React, { useState } from 'react';
import { Adaptation, Review } from '../types/adaptation';
import { getFidelityTier, getQualityTier } from '../data/adaptations';
import { X, BookOpen, Film, CheckCircle2 } from 'lucide-react';

interface CastVerdictModalProps {
  adaptation: Adaptation;
  onClose: () => void;
  onSubmitVerdict: (
    adaptationId: string,
    review: Omit<Review, 'id' | 'date' | 'upvotes'>,
    subScores: {
      plotAccuracy: number;
      characterSpirits: number;
      tonalFidelity: number;
      endingFidelity: number;
    }
  ) => void;
}

export const CastVerdictModal: React.FC<CastVerdictModalProps> = ({
  adaptation,
  onClose,
  onSubmitVerdict,
}) => {
  const [fidelityScore, setFidelityScore] = useState(adaptation.fidelityScore);
  const [qualityScore, setQualityScore] = useState(adaptation.qualityScore);
  const [plotAccuracy, setPlotAccuracy] = useState(adaptation.fidelityBreakdown.plotAccuracy);
  const [characterSpirits, setCharacterSpirits] = useState(adaptation.fidelityBreakdown.characterSpirits);
  const [tonalFidelity, setTonalFidelity] = useState(adaptation.fidelityBreakdown.tonalFidelity);
  const [endingFidelity, setEndingFidelity] = useState(adaptation.fidelityBreakdown.endingFidelity);

  const [readSourceFirst, setReadSourceFirst] = useState(true);
  const [userName, setUserName] = useState('');
  const [headline, setHeadline] = useState('');
  const [content, setContent] = useState('');
  const [favoriteChange, setFavoriteChange] = useState('');
  const [leastFavoriteChange, setLeastFavoriteChange] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const fidelityTier = getFidelityTier(fidelityScore);
  const qualityTier = getQualityTier(qualityScore);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim() || !content.trim()) return;

    onSubmitVerdict(
      adaptation.id,
      {
        userName: userName.trim() || 'Anonymous Purist',
        fidelityScore,
        qualityScore,
        readSourceFirst,
        headline: headline.trim(),
        content: content.trim(),
        favoriteChange: favoriteChange.trim() || undefined,
        leastFavoriteChange: leastFavoriteChange.trim() || undefined,
      },
      {
        plotAccuracy,
        characterSpirits,
        tonalFidelity,
        endingFidelity,
      }
    );

    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
              Cast Community Verdict
            </span>
            <h3 className="text-xl font-serif font-bold text-stone-100">
              {adaptation.title} ({adaptation.year})
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
              Verdict Recorded!
            </h4>
            <p className="text-sm text-stone-400 max-w-md mx-auto">
              Your fidelity and quality ratings have updated the community aggregates for {adaptation.title}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Primary Sliders Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-stone-950/60 border border-stone-800">
              {/* Fidelity Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-stone-300 font-semibold">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>Fidelity Score</span>
                  </div>
                  <span className="font-mono text-base font-bold text-emerald-400 tabular-nums">
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

                <div className="flex justify-between text-[11px] text-stone-400">
                  <span>0% (In Name Only)</span>
                  <span className={fidelityTier.accent}>{fidelityTier.label}</span>
                  <span>100% (Literal)</span>
                </div>
              </div>

              {/* Quality Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-stone-300 font-semibold">
                    <Film className="w-4 h-4 text-amber-400" />
                    <span>Quality Score</span>
                  </div>
                  <span className="font-mono text-base font-bold text-amber-400 tabular-nums">
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

                <div className="flex justify-between text-[11px] text-stone-400">
                  <span>0% (Disaster)</span>
                  <span className={qualityTier.accent}>{qualityTier.label}</span>
                  <span>100% (Masterpiece)</span>
                </div>
              </div>
            </div>

            {/* Sub-Indices for granular fidelity */}
            <div className="space-y-3 p-4 rounded-xl border border-stone-800 bg-stone-950/30">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-300 block">
                Fidelity Sub-Rubric (Optional Tweaks)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="flex justify-between text-stone-400 mb-1">
                    <span>Plot & Event Accuracy</span>
                    <span className="font-mono tabular-nums">{plotAccuracy}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={plotAccuracy}
                    onChange={(e) => setPlotAccuracy(Number(e.target.value))}
                    className="w-full accent-stone-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-stone-400 mb-1">
                    <span>Character Spirit</span>
                    <span className="font-mono tabular-nums">{characterSpirits}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={characterSpirits}
                    onChange={(e) => setCharacterSpirits(Number(e.target.value))}
                    className="w-full accent-stone-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-stone-400 mb-1">
                    <span>Tonal Resonance</span>
                    <span className="font-mono tabular-nums">{tonalFidelity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={tonalFidelity}
                    onChange={(e) => setTonalFidelity(Number(e.target.value))}
                    className="w-full accent-stone-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-stone-400 mb-1">
                    <span>Climax / Ending</span>
                    <span className="font-mono tabular-nums">{endingFidelity}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={endingFidelity}
                    onChange={(e) => setEndingFidelity(Number(e.target.value))}
                    className="w-full accent-stone-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Source Reader Toggle */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-950/40 border border-stone-800">
              <input
                type="checkbox"
                id="readSource"
                checked={readSourceFirst}
                onChange={(e) => setReadSourceFirst(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 bg-stone-800 border-stone-700 focus:ring-amber-500 cursor-pointer"
              />
              <label htmlFor="readSource" className="text-xs text-stone-300 cursor-pointer select-none">
                I read the book / played the game / read the manga prior to watching this adaptation.
              </label>
            </div>

            {/* Review Input Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Your Handle / Pen Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. CinemaReader99"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-950 border border-stone-800 rounded-lg text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Verdict Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Faithful in spirit, with smart modern updates"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-950 border border-stone-800 rounded-lg text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Review & Justification *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain why the adaptation succeeded or failed to preserve the core canon, and how it holds up as cinema..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-950 border border-stone-800 rounded-lg text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-emerald-400 mb-1">
                    Favorite Change from the Source (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Streamlined the council meeting scene"
                    value={favoriteChange}
                    onChange={(e) => setFavoriteChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-100 placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-rose-400 mb-1">
                    Most Egregious Departure (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ruined the character arc in the climax"
                    value={leastFavoriteChange}
                    onChange={(e) => setLeastFavoriteChange(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-lg text-stone-100 placeholder-stone-600 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
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
                className="px-5 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                Publish Verdict
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
