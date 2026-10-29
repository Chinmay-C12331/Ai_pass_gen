import React from 'react';
import { AlertTriangle, Lightbulb, CheckCircle, Hash } from 'lucide-react';
import { PasswordDiagnostics } from '../model/features';

interface WhyPanelProps {
  diagnostics: PasswordDiagnostics;
  passwordLength: number;
}

export const WhyPanel: React.FC<WhyPanelProps> = ({ diagnostics, passwordLength }) => {
  const { reasons, tip, entropy, lowercaseCount, uppercaseCount, digitCount, symbolCount } = diagnostics;

  if (passwordLength === 0) {
    return (
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 text-slate-400 text-sm flex items-center justify-center min-h-[140px]">
        Type or generate a password above to view real-time AI security rationale and tips.
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Why? Analysis & Vulnerabilities
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Entropy: ~{Math.round(entropy)} bits
        </span>
      </div>

      {/* Up to 3 reasons */}
      <div className="space-y-2">
        {reasons.length > 0 ? (
          reasons.map((reason, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300"
            >
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 font-bold text-[10px] shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{reason}</span>
            </div>
          ))
        ) : (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-teal-950/30 border border-teal-500/30 text-xs text-teal-300">
            <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
            <span>No typical low-entropy traps detected (no keyboard walks, simple dates, or obvious dictionary words).</span>
          </div>
        )}
      </div>

      {/* Character Breakdown Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-center">
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px]">
          <div className="text-slate-400">Length</div>
          <div className="font-mono font-bold text-teal-300 text-sm">{passwordLength}</div>
        </div>
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px]">
          <div className="text-slate-400">Lowercase</div>
          <div className="font-mono font-bold text-slate-200 text-sm">{lowercaseCount}</div>
        </div>
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px]">
          <div className="text-slate-400">Uppercase</div>
          <div className="font-mono font-bold text-slate-200 text-sm">{uppercaseCount}</div>
        </div>
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px]">
          <div className="text-slate-400">Numbers</div>
          <div className="font-mono font-bold text-slate-200 text-sm">{digitCount}</div>
        </div>
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] col-span-2 sm:col-span-1">
          <div className="text-slate-400">Symbols</div>
          <div className="font-mono font-bold text-slate-200 text-sm">{symbolCount}</div>
        </div>
      </div>

      {/* 1 Actionable Tip */}
      <div className="flex items-start gap-3 p-3 rounded-xl bg-teal-950/40 border border-teal-500/30 text-xs">
        <div className="p-1 rounded-lg bg-teal-500/20 text-teal-400 shrink-0 mt-0.5">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <div className="font-semibold text-teal-200 mb-0.5">Recommendation Tip</div>
          <div className="text-teal-300/90 leading-relaxed">{tip}</div>
        </div>
      </div>
    </div>
  );
};
