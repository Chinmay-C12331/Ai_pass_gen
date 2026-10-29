import React from 'react';
import { AlertCircle, CheckCircle2, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import { FullEvaluation, STRENGTH_LEVELS } from '../model/evaluator';

interface CompareTabProps {
  evalResult: FullEvaluation;
  onSelectExample: (pwd: string) => void;
}

export const CompareTab: React.FC<CompareTabProps> = ({ evalResult, onSelectExample }) => {
  const { comparison, password } = evalResult;

  const simpleInfo = STRENGTH_LEVELS[comparison.simpleLevel];
  const patternInfo = STRENGTH_LEVELS[comparison.patternLevel];
  const aiInfo = STRENGTH_LEVELS[comparison.aiLevel];

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-400" />
          Triple Evaluation Comparison: Simple Rules vs. Pattern vs. AI Model
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          Traditional corporate password policies rely on naive regex checks (e.g., "At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 symbol").
          Attackers exploit this by constructing predictable sequences (like <code className="text-teal-300 font-mono">Password1!</code> or <code className="text-teal-300 font-mono">Welcome@2024</code>)
          that fulfill corporate rules perfectly while being trivial to crack in seconds.
        </p>

        {/* Corporate Trap Callout */}
        {comparison.isCorporateTrap && (
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
              <ShieldAlert className="w-4 h-4" />
              Corporate Password Trap Detected!
            </div>
            <p>
              Notice how <strong>Simple Rules</strong> rates "{password}" as <strong>{simpleInfo.name}</strong> because it checks off length and character set checkboxes.
              However, <strong>PassMeter AI</strong> correctly rates it as <strong>{aiInfo.name}</strong> because the neural model and dictionary scanner recognize the underlying predictable pattern!
            </p>
          </div>
        )}
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Method 1: Simple Rules */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Method 1</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Heuristic Regex</span>
            </div>
            <h3 className="text-sm font-bold text-slate-200 mb-3">Simple Corporate Rules</h3>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center mb-4">
              <div className="text-[11px] text-slate-400 mb-1">Evaluated Rating</div>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${simpleInfo.badgeBg}`}>
                Level {comparison.simpleLevel}: {simpleInfo.name}
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="font-semibold text-slate-300">How it evaluates:</div>
              <p className="leading-relaxed">
                Checks string length &gt;= 8, presence of uppercase, lowercase, numbers, and special symbols.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-red-400/90 flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>Blind to keyboard walks, dictionary words, and common substitutions.</span>
          </div>
        </div>

        {/* Method 2: Pattern-Based */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Method 2</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">Markov + Rules</span>
            </div>
            <h3 className="text-sm font-bold text-slate-200 mb-3">Pattern-Based (zxcvbn-style)</h3>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center mb-4">
              <div className="text-[11px] text-slate-400 mb-1">Evaluated Rating</div>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${patternInfo.badgeBg}`}>
                Level {comparison.patternLevel}: {patternInfo.name}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                ~10^{comparison.patternLogGuesses.toFixed(1)} guesses
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="font-semibold text-slate-300">How it evaluates:</div>
              <p className="leading-relaxed">
                Uses 3-gram character transition entropy, spatial keyboard walk graph matching, and l33t normalization.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-teal-300/90 flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>Understands sequence predictability and spatial keyboard physics.</span>
          </div>
        </div>

        {/* Method 3: Neural AI Model */}
        <div className="bg-slate-900/90 rounded-2xl p-5 border border-teal-500/30 ring-1 ring-teal-500/20 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">Method 3</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono font-semibold">Deep Learning</span>
            </div>
            <h3 className="text-sm font-bold text-white mb-3">PassMeter Hybrid AI Net</h3>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-teal-500/30 text-center mb-4">
              <div className="text-[11px] text-slate-400 mb-1">Evaluated Rating</div>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${aiInfo.badgeBg}`}>
                Level {comparison.aiLevel}: {aiInfo.name}
              </div>
              <div className="text-[10px] text-teal-300 font-mono mt-1">
                ~10^{comparison.aiLogGuesses.toFixed(1)} guesses
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="font-semibold text-slate-200">How it evaluates:</div>
              <p className="leading-relaxed">
                Dual-input Bidirectional LSTM encoding sequence context fused with 16 structural entropy vectors, trained with asymmetric safety loss.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-teal-500/20 text-[11px] text-teal-300 font-medium flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-teal-400" />
            <span>Learns non-linear interactions and overestimation resistance.</span>
          </div>
        </div>
      </div>

      {/* Trap Demonstration Benchmarks */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Try These Classical Corporate Trap Test Cases:
        </h3>
        <p className="text-xs text-slate-400">
          Click any example to load it and compare the scoring divergence live:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <button
            onClick={() => onSelectExample('Password1!')}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition-all"
          >
            <div>
              <div className="font-mono text-sm font-bold text-teal-300">Password1!</div>
              <div className="text-[10px] text-slate-400">Simple: Strong vs AI: Weak</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={() => onSelectExample('qwerty123')}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition-all"
          >
            <div>
              <div className="font-mono text-sm font-bold text-teal-300">qwerty123</div>
              <div className="text-[10px] text-slate-400">Walk + Sequential digits</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={() => onSelectExample('correct-horse-battery-staple')}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition-all"
          >
            <div>
              <div className="font-mono text-sm font-bold text-emerald-400">correct-horse-...</div>
              <div className="text-[10px] text-slate-400">High entropy passphrase</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
