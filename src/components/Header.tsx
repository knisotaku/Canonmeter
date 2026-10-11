import React from 'react';
import { Plus } from 'lucide-react';

interface HeaderProps {
  activeTab: 'scoreboard' | 'matrix' | 'compare' | 'rubric';
  setActiveTab: (tab: 'scoreboard' | 'matrix' | 'compare' | 'rubric') => void;
  onOpenSubmitModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSubmitModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('scoreboard')}
          className="text-xl font-serif font-bold tracking-tight text-stone-100 hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <span className="text-amber-400 font-serif">◈</span>
          <span>CanonMeter</span>
        </button>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-400">
          <button
            onClick={() => setActiveTab('scoreboard')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-100 cursor-pointer ${
              activeTab === 'scoreboard' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Scoreboard
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-100 cursor-pointer ${
              activeTab === 'matrix' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Matrix Map
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-100 cursor-pointer ${
              activeTab === 'compare' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Head-to-Head
          </button>
          <button
            onClick={() => setActiveTab('rubric')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-100 cursor-pointer ${
              activeTab === 'rubric' ? 'text-amber-400 font-semibold' : ''
            }`}
          >
            Fidelity Rubric
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSubmitModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Rate an Adaptation</span>
          </button>
        </div>
      </div>
    </header>
  );
};
