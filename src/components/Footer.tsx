import React from 'react';

interface FooterProps {
  onNavigateTab: (tab: 'scoreboard' | 'matrix' | 'compare' | 'rubric') => void;
  onOpenSubmit: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab, onOpenSubmit }) => {
  return (
    <footer className="border-t border-stone-800 bg-stone-950 text-stone-400 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-stone-100 font-serif font-bold text-lg">
            <span className="text-amber-400">◈</span>
            <span>CanonMeter</span>
          </div>
          <p className="text-xs text-stone-400 max-w-md font-sans">
            The adaptation fidelity and quality scoreboard for movies and television. Measuring source faithfulness alongside cinematic craft.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-stone-400 font-sans">
          <button
            onClick={() => onNavigateTab('scoreboard')}
            className="hover:text-stone-200 transition-colors cursor-pointer"
          >
            Scoreboard
          </button>
          <button
            onClick={() => onNavigateTab('matrix')}
            className="hover:text-stone-200 transition-colors cursor-pointer"
          >
            Matrix Map
          </button>
          <button
            onClick={() => onNavigateTab('compare')}
            className="hover:text-stone-200 transition-colors cursor-pointer"
          >
            Head-to-Head
          </button>
          <button
            onClick={() => onNavigateTab('rubric')}
            className="hover:text-stone-200 transition-colors cursor-pointer"
          >
            Fidelity Rubric
          </button>
          <button
            onClick={onOpenSubmit}
            className="hover:text-amber-400 text-stone-300 transition-colors cursor-pointer"
          >
            Submit Adaptation
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 font-mono">
        <div>© 2026 CanonMeter. Dedicated to books, comics, games, and the directors who adapt them.</div>
        <div>Fidelity $\ge$ 68% / Quality $\ge$ 68% = The Holy Grail</div>
      </div>
    </footer>
  );
};
