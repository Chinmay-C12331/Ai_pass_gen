import React, { useState } from 'react';
import { Layers, HelpCircle } from 'lucide-react';
import { CharacterOcclusion } from '../model/evaluator';

interface OcclusionStripProps {
  occlusion: CharacterOcclusion[];
  isVisible: boolean;
}

export const OcclusionStrip: React.FC<OcclusionStripProps> = ({ occlusion, isVisible }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (occlusion.length === 0) return null;

  return (
    <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3">
      {/* Title & Help */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-teal-400" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Which Characters Hurt? (Occlusion Strip)
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <HelpCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Feature ablation sensitivity</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Measures AI strength delta when each character is removed. Red/Amber highlights characters that diminish resilience
        by completing known patterns, predictable walks, or repetitive clusters.
      </p>

      {/* Occlusion Character Boxes */}
      <div className="relative py-2">
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1 bg-slate-950/70 rounded-xl border border-slate-800/80">
          {occlusion.map((item, idx) => {
            let colorClass = 'bg-slate-800 text-slate-300 border-slate-700';
            if (item.status === 'hurts') {
              colorClass = 'bg-red-500/20 text-red-300 border-red-500/50 shadow-sm shadow-red-500/20 font-bold';
            } else if (item.status === 'helps') {
              colorClass = 'bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-sm shadow-teal-500/20 font-bold';
            }

            const charToRender = isVisible ? item.char : '•';

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`relative flex flex-col items-center justify-center min-w-[32px] h-9 px-1.5 rounded-lg border font-mono text-sm cursor-pointer transition-all duration-150 hover:scale-110 hover:z-20 ${colorClass}`}
              >
                <span>{charToRender}</span>
                <span className="text-[9px] text-slate-400 mt-0.5">#{idx + 1}</span>

                {/* Floating Tooltip */}
                {hoveredIdx === idx && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-2 rounded-lg bg-slate-950 border border-slate-700 shadow-2xl text-[11px] text-slate-200 z-50 pointer-events-none font-sans text-center">
                    <div className="font-mono text-xs font-bold text-teal-300 mb-0.5">
                      Character: "{item.char}"
                    </div>
                    <div>{item.tooltip}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-400 border-t border-slate-800/60">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-500/30 border border-red-500/60" />
          <span>Hurts (removing raises score; walk/repeat/pattern)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-slate-800 border border-slate-700" />
          <span>Neutral</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-teal-500/30 border border-teal-500/60" />
          <span>Helps (provides high unpredictability)</span>
        </div>
      </div>
    </div>
  );
};
