import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Cpu, Database, Activity, Gauge, RefreshCw } from 'lucide-react';
import { ModelMetadata } from '../model/neuralModel';

interface ModelDetailsAccordionProps {
  metadata: ModelMetadata;
  inferenceMs: number;
  onRetrain: () => void;
  isTraining: boolean;
}

export const ModelDetailsAccordion: React.FC<ModelDetailsAccordionProps> = ({
  metadata,
  inferenceMs,
  onRetrain,
  isTraining
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Header / Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Cpu className="w-4 h-4 text-teal-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Model Details & Architecture Diagnostics
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 font-mono">
            {metadata.parameterCount.toLocaleString()} params
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <span>{isOpen ? 'Collapse' : 'Expand'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-4 text-xs">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Cpu className="w-3.5 h-3.5 text-teal-400" />
                <span>Parameters</span>
              </div>
              <div className="text-base font-bold font-mono text-white">
                {metadata.parameterCount.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Bi-LSTM + Dense layers</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>Training Set</span>
              </div>
              <div className="text-base font-bold font-mono text-white">
                {metadata.trainingSamples.toLocaleString()} samples
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">350 common + synthetics</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                <span>Validation MAE</span>
              </div>
              <div className="text-base font-bold font-mono text-amber-300">
                {metadata.finalValidationMae.toFixed(3)}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Asymmetric 2x penalty</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                <span>Inference Latency</span>
              </div>
              <div className="text-base font-bold font-mono text-emerald-300">
                {inferenceMs > 0 ? `${inferenceMs.toFixed(1)} ms` : '< 1 ms'}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">{metadata.engine}</div>
            </div>
          </div>

          {/* Architecture Notes */}
          <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2 text-slate-300">
            <div className="font-semibold text-slate-200">Dual-Stream Hybrid Architecture:</div>
            <ul className="list-disc list-inside space-y-1 text-slate-400 leading-relaxed">
              <li>
                <strong className="text-slate-300">Sequential Stream:</strong> 32-token character embedding projected into a 32-unit Bidirectional LSTM (yielding 64 recurrence features) capturing n-gram transitions and positional flow.
              </li>
              <li>
                <strong className="text-slate-300">Heuristic Stream:</strong> 16 normalized feature indicators (Shannon entropy, keyboard walks, l33tspeak dictionary matches, date/year patterns, repeat counts).
              </li>
              <li>
                <strong className="text-slate-300">Asymmetric Loss:</strong> Penalizes overestimation 2× heavier than underestimation, ensuring security guarantees favor caution.
              </li>
              <li>
                <strong className="text-slate-300">IndexedDB Persistence:</strong> Stored locally as <code className="text-teal-300 font-mono">indexeddb://passmeter-hybrid-model-v2</code> for instant page loads.
              </li>
            </ul>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500">
              Cache status: {metadata.isCached ? 'Saved in client browser' : 'In-memory'}
            </span>
            <button
              onClick={onRetrain}
              disabled={isTraining}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTraining ? 'animate-spin' : ''}`} />
              <span>{isTraining ? 'Training...' : 'Re-train Model in Browser'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
