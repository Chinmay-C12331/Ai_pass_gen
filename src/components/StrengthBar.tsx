import React from 'react';
import { ShieldAlert, ShieldCheck, ShieldOff, Info } from 'lucide-react';
import { STRENGTH_LEVELS, FullEvaluation } from '../model/evaluator';

interface StrengthBarProps {
  evalResult: FullEvaluation;
}

export const StrengthBar: React.FC<StrengthBarProps> = ({ evalResult }) => {
  const { conservativeLevel, conservativeInfo, guessesDisplay, isCommonPasswordOverride, aiLevel, ruleLevel } = evalResult;

  const thresholds = [
    { label: '<10³', desc: '0 - Very weak' },
    { label: '<10⁶', desc: '1 - Weak' },
    { label: '<10⁸', desc: '2 - Medium' },
    { label: '<10¹⁰', desc: '3 - Strong' },
    { label: '≥10¹⁰', desc: '4 - Very strong' }
  ];

  const getStatusIcon = () => {
    if (conservativeLevel === 0) return <ShieldOff className="w-5 h-5 text-red-400" />;
    if (conservativeLevel <= 2) return <ShieldAlert className="w-5 h-5 text-amber-400" />;
    return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
      {/* Top Banner: Level Name, Guesses, and Score Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            {getStatusIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Strength Level
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${conservativeInfo.badgeBg}`}>
                Level {conservativeLevel}: {conservativeInfo.name}
              </span>
            </div>
            <div className="text-lg font-bold text-white font-mono flex items-center gap-2 mt-0.5">
              <span>{guessesDisplay}</span>
            </div>
          </div>
        </div>

        {/* Conservative Score Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs self-start sm:self-auto">
          <div className="w-2 h-2 rounded-full bg-teal-400" />
          <div className="text-right">
            <div className="font-semibold text-slate-200">Conservative Score</div>
            <div className="text-[11px] text-slate-400">
              min(AI: {aiLevel}, Rules: {ruleLevel})
              {isCommonPasswordOverride && ' • Common list override'}
            </div>
          </div>
        </div>
      </div>

      {/* 5-Segment Strength Bar */}
      <div>
        <div className="grid grid-cols-5 gap-2 h-3.5 w-full">
          {STRENGTH_LEVELS.map((lvl) => {
            const isActive = lvl.level <= conservativeLevel;
            let bgColor = 'bg-slate-800/80';
            if (isActive) {
              if (conservativeLevel === 0) bgColor = 'bg-red-500 shadow-lg shadow-red-500/20';
              else if (conservativeLevel === 1) bgColor = 'bg-orange-500 shadow-lg shadow-orange-500/20';
              else if (conservativeLevel === 2) bgColor = 'bg-amber-500 shadow-lg shadow-amber-500/20';
              else if (conservativeLevel === 3) bgColor = 'bg-lime-500 shadow-lg shadow-lime-500/20';
              else bgColor = 'bg-emerald-500 shadow-lg shadow-emerald-500/20';
            }

            return (
              <div
                key={lvl.level}
                className={`relative h-full rounded-md transition-all duration-300 ${bgColor}`}
              />
            );
          })}
        </div>

        {/* Threshold Markers */}
        <div className="grid grid-cols-5 gap-2 mt-2 text-[11px] text-slate-400 font-mono text-center">
          {thresholds.map((t, idx) => (
            <div
              key={idx}
              className={`transition-colors ${idx === conservativeLevel ? 'text-teal-300 font-bold' : 'text-slate-500'}`}
            >
              <div>{t.label}</div>
              <div className="text-[9px] text-slate-500 hidden sm:block">{t.desc.split('- ')[1]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Notice if common password forced level 0 */}
      {isCommonPasswordOverride && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300">
          <Info className="w-4 h-4 shrink-0 text-red-400" />
          <span>
            <strong>Compromised Password Override:</strong> This exact string appears in common leaked breach lists.
            In accordance with cybersecurity best practices, it is strictly assigned Level 0 (Very Weak).
          </span>
        </div>
      )}
    </div>
  );
};
