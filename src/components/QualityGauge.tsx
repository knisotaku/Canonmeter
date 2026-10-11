import React from 'react';
import { getQualityTier } from '../data/adaptations';
import { Film } from 'lucide-react';

interface QualityGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const QualityGauge: React.FC<QualityGaugeProps> = ({
  score,
  size = 'md',
  showLabel = true,
}) => {
  const tier = getQualityTier(score);

  const getBorderAndBg = (s: number) => {
    if (s >= 85) return 'border-amber-500/40 bg-amber-950/40 text-amber-300';
    if (s >= 70) return 'border-amber-600/30 bg-amber-950/30 text-amber-300';
    if (s >= 50) return 'border-stone-500/40 bg-stone-900/60 text-stone-300';
    return 'border-rose-500/40 bg-rose-950/40 text-rose-300';
  };

  const getProgressColor = (s: number) => {
    if (s >= 85) return '#fbbf24'; // amber-400
    if (s >= 70) return '#38bdf8'; // sky-400
    if (s >= 50) return '#a8a29e'; // stone-400
    return '#f43f5e'; // rose-500
  };

  const radius = size === 'sm' ? 18 : size === 'lg' ? 34 : 26;
  const strokeWidth = size === 'sm' ? 3 : size === 'lg' ? 4.5 : 3.5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`relative flex items-center justify-center rounded-xl border ${getBorderAndBg(
          score
        )} ${
          size === 'sm'
            ? 'w-11 h-11'
            : size === 'lg'
            ? 'w-20 h-20'
            : 'w-15 h-15'
        }`}
      >
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 p-1"
          viewBox="0 0 80 80"
        >
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="opacity-15"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={getProgressColor(score)}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="relative flex flex-col items-center justify-center text-center">
          <span
            className={`font-mono font-bold tabular-nums tracking-tight leading-none ${
              size === 'sm'
                ? 'text-xs'
                : size === 'lg'
                ? 'text-2xl'
                : 'text-base'
            }`}
          >
            {score}%
          </span>
          {size === 'lg' && (
            <span className="text-[9px] uppercase tracking-widest text-stone-400 mt-0.5">
              Film
            </span>
          )}
        </div>
      </div>

      {showLabel && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-stone-400">
            <Film className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="uppercase tracking-wider font-mono text-[11px]">
              Quality
            </span>
          </div>
          <span
            className={`font-serif text-sm font-semibold leading-tight ${tier.accent}`}
          >
            {tier.label}
          </span>
          <span className="text-[11px] text-stone-400 font-sans">
            Cinema Standard
          </span>
        </div>
      )}
    </div>
  );
};
