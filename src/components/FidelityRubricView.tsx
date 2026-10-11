import React from 'react';
import { BookOpen, Film, Compass, ShieldCheck, Check, AlertCircle } from 'lucide-react';

export const FidelityRubricView: React.FC = () => {
  const tiers = [
    {
      score: '90% – 100%',
      title: 'Canonical Gospel (Near-Literal)',
      accent: 'text-emerald-400 border-emerald-800/60 bg-emerald-950/20',
      description:
        'Surgical respect for source dialogue, plot architecture, character psychology, and thematic spirit. Alterations are purely cinematic trims (e.g., cutting extraneous journeys or non-essential exposition).',
      example: 'No Country for Old Men (96%), The Fellowship of the Ring (91%)',
    },
    {
      score: '75% – 89%',
      title: 'Faithful Translation (True to Spirit)',
      accent: 'text-emerald-300 border-emerald-800/40 bg-emerald-950/10',
      description:
        'Prunes or consolidates characters and adjusts pacing for cinema without compromising the author’s philosophical message or character arcs. Fans recognizing the core journey feel deeply honored.',
      example: 'Dune: Part Two (84%), The Last of Us S1 (89%), Fight Club (82%)',
    },
    {
      score: '50% – 74%',
      title: 'Balanced Adaptation (Smart Pruning)',
      accent: 'text-amber-300 border-amber-800/40 bg-amber-950/10',
      description:
        'Substantial structural reorganizations, merged characters, or altered subplots, but preserves the overarching premise, memorable quotes, and character identities.',
      example: 'Watchmen (83% panel copy, but altered action spirit), Scott Pilgrim (74%)',
    },
    {
      score: '25% – 49%',
      title: 'Inspired Heresy / Radical Divergence',
      accent: 'text-purple-400 border-purple-800/40 bg-purple-950/10',
      description:
        'Uses the source material merely as a springboard for the director’s personal thematic agenda. Characters, tones, or endings are totally replaced. Can yield great cinema, but fails as a faithful adaptation.',
      example: 'The Shining (36%), Blade Runner (34%), Howl’s Moving Castle (44%)',
    },
    {
      score: '0% – 24%',
      title: 'In Name Only (Total Sacrilege)',
      accent: 'text-rose-400 border-rose-800/40 bg-rose-950/10',
      description:
        'Discards the lore, mangles character personalities, contradicts basic worldbuilding rules, and exhibits contempt for the source fan base. Usually disowned by original creators.',
      example: 'The Last Airbender 2010 (16%), Dragonball Evolution (11%), Percy Jackson 2010 (28%)',
    },
  ];

  const pillars = [
    {
      num: '01',
      title: 'Narrative & Event Architecture (30%)',
      desc: 'Are major incidents, plot turns, betrayals, and climaxes preserved in sequence and consequence?',
    },
    {
      num: '02',
      title: 'Character Integrity & Motivations (30%)',
      desc: 'Do the characters embody the flaws, speech patterns, and moral ambiguities crafted on the page, or are they reduced to Hollywood tropes?',
    },
    {
      num: '03',
      title: 'Philosophical & Thematic Resonance (25%)',
      desc: 'Does the ending deliver the author’s warning or insight, or was it softened to provide an unearned crowd-pleasing resolution?',
    },
    {
      num: '04',
      title: 'World Rules & Mechanical Lore (15%)',
      desc: 'Are magic systems, technology constraints, and societal structures respected rather than arbitrarily broken for convenient spectacle?',
    },
  ];

  return (
    <div className="space-y-10 max-w-4xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="space-y-3 pb-6 border-b border-stone-800">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
          The Canon Standard
        </span>
        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-stone-100">
          The Adaptation Fidelity Rubric
        </h2>
        <p className="text-base text-stone-300 font-sans leading-relaxed">
          How do we separate an "inspired translation" from an "ignorant betrayal"? The CanonMeter Rubric calculates fidelity through four weighted pillars designed to distinguish genuine cinematic necessity from destructive studio interference.
        </p>
      </div>

      {/* The 4 Evaluation Pillars */}
      <div className="space-y-4">
        <h3 className="text-xl font-serif font-bold text-stone-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span>The Four Pillars of Faithfulness</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pillars.map((p) => (
            <div
              key={p.num}
              className="p-5 rounded-xl border border-stone-800 bg-stone-900/60 space-y-2"
            >
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span className="font-mono text-amber-400 font-semibold">{p.num}</span>
                <span className="font-mono text-stone-400">Weighted Rubric</span>
              </div>
              <h4 className="font-serif font-bold text-base text-stone-200">
                {p.title}
              </h4>
              <p className="text-xs text-stone-400 font-sans leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* The Fidelity Tiers */}
      <div className="space-y-4">
        <h3 className="text-xl font-serif font-bold text-stone-100 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Fidelity Score Tiers</span>
        </h3>

        <div className="space-y-3">
          {tiers.map((t) => (
            <div
              key={t.score}
              className={`p-5 rounded-xl border ${t.accent} space-y-2`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <span className="font-mono font-bold text-sm tabular-nums">
                  {t.score}
                </span>
                <span className="font-serif font-bold text-base text-stone-200">
                  {t.title}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 font-sans leading-relaxed">
                {t.description}
              </p>

              <div className="text-xs text-stone-400 pt-1 border-t border-stone-800/40">
                <span className="font-semibold text-stone-300">Benchmarks: </span>
                <span>{t.example}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The Crucial Philosophy Note */}
      <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-800/40 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>Why Low Fidelity Isn't Always Bad (The "Inspired Heresy" Axiom)</span>
        </div>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
          Fidelity measures adherence, not quality. Stanley Kubrick took Stephen King’s <em>The Shining</em> and produced a 36% fidelity adaptation that King despised. Yet Kubrick created an undeniable cinema masterpiece (93% Quality). CanonMeter celebrates both truths: readers get the honest warning that the book was abandoned, while film lovers get the recommendation of cinematic brilliance.
        </p>
      </div>
    </div>
  );
};
