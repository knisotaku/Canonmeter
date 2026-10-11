import React from 'react';
import { getFidelityTier } from '../data/adaptations';
import { BookOpen } from 'lucide-react';

interface FidelityGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const FidelityGauge: React.FC<FidelityGaugeProps> = ({
  score,
  size = 'md',
  showLabel = true,
}) => {
  const tier = getFidelityTier(score);

  const getBorderAndBg = (s: number) => {
    if (s >= 85) return 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300';
    if (s >= 70) return 'border-emerald-600/30 bg-emerald-950/30 text-emerald-300';
    if (s >= 50) return 'border-amber-500/40 bg-amber-950/40 text-amber-300';
    if (s >= 30) return 'border-orange-500/40 bg-orange-950/40 text-orange-300';
    return 'border-rose-500/40 bg-rose-950/40 text-rose-300';
  };

  const getProgressColor = (s: number) => {
    if (s >= 80) return '#10b981'; // emerald
    if (s >= 65) return '#34d399'; // light emerald
    if (s >= 50) return '#f59e0b'; // amber
    if (s >= 30) return '#f97316'; // orange
    return '#f43f5e'; // rose
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
              Canon
            </span>
          )}
        </div>
      </div>

      {showLabel && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs text-stone-400">
            <BookOpen className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="uppercase tracking-wider font-mono text-[11px]">
              Fidelity
            </span>
          </div>
          <span
            className={`font-serif text-sm font-semibold leading-tight ${tier.accent}`}
          >
            {tier.label}
          </span>
          <span className="text-[11px] text-stone-400 font-sans">
            {tier.tier}
          </span>
        </div>
      )}
    </div>
  );
};
