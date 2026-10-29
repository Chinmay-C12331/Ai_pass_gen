import React, { useState } from 'react';
import { Sparkles, Copy, Check, Sliders, ShieldCheck } from 'lucide-react';
import {
  GeneratorOptions,
  DEFAULT_GENERATOR_OPTIONS,
  generateSecurePassword,
  copyToClipboard
} from '../model/generator';

interface GeneratorPanelProps {
  onApplyPassword: (password: string) => void;
}

export const GeneratorPanel: React.FC<GeneratorPanelProps> = ({ onApplyPassword }) => {
  const [options, setOptions] = useState<GeneratorOptions>(DEFAULT_GENERATOR_OPTIONS);
  const [generatedPassword, setGeneratedPassword] = useState<string>(() =>
    generateSecurePassword(DEFAULT_GENERATOR_OPTIONS)
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  const handleGenerate = async (opts = options) => {
    const pwd = generateSecurePassword(opts);
    setGeneratedPassword(pwd);
    onApplyPassword(pwd);

    // Auto copy to clipboard as explicitly requested
    const success = await copyToClipboard(pwd);
    if (success) {
      setCopied(true);
      setCopiedToast(true);
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setCopiedToast(false), 3000);
    }
  };

  const handleManualCopy = async () => {
    if (!generatedPassword) return;
    const success = await copyToClipboard(generatedPassword);
    if (success) {
      setCopied(true);
      setCopiedToast(true);
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setCopiedToast(false), 3000);
    }
  };

  const updateOption = <K extends keyof GeneratorOptions>(key: K, val: GeneratorOptions[K]) => {
    const updated = { ...options, [key]: val };
    setOptions(updated);
    handleGenerate(updated);
  };

  return (
    <div className="space-y-6">
      {/* Generated Password Result Card */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-teal-500/30 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400" />
            <h2 className="text-base font-bold text-white">
              AI-Optimized Strong Password Generator
            </h2>
          </div>
          <span className="text-xs text-teal-300 font-mono">
            Cryptographically Secure (Web Crypto CSPRNG)
          </span>
        </div>

        {/* Display Box */}
        <div className="relative flex items-center bg-slate-950 rounded-xl border border-slate-800 p-2 sm:p-3">
          <div className="flex-1 font-mono text-base sm:text-xl font-bold tracking-wider text-teal-300 break-all select-all px-2 py-1">
            {generatedPassword}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleManualCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-semibold transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Auto-copy Feedback Notice */}
        {copiedToast && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Copied to clipboard automatically!</strong> Also loaded into the PassMeter AI Predictor for real-time analysis.
            </span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => handleGenerate()}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate New Password & Copy</span>
          </button>
        </div>
      </div>

      {/* Generator Configuration Card */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-teal-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Generation Parameters
          </h3>
        </div>

        {/* Length Slider & Quick Buttons */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Password Length</span>
            <span className="font-mono font-bold text-teal-300 text-sm bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
              {options.length} characters
            </span>
          </div>

          <input
            type="range"
            min={8}
            max={64}
            value={options.length}
            onChange={(e) => updateOption('length', parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
          />

          {/* Quick presets */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <span className="text-[11px] text-slate-500">Quick Presets:</span>
            {[12, 16, 20, 24, 32].map((len) => (
              <button
                key={len}
                onClick={() => updateOption('length', len)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                  options.length === len
                    ? 'bg-teal-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {len}
              </button>
            ))}
          </div>
        </div>

        {/* Character Sets Toggles */}
        <div className="space-y-3 border-t border-slate-800 pt-5">
          <div className="text-xs font-semibold text-slate-300">Character Sets to Include:</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Uppercase */}
            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={options.includeUppercase}
                onChange={(e) => updateOption('includeUppercase', e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-teal-500 focus:ring-teal-400 focus:ring-offset-slate-950 bg-slate-800"
              />
              <div>
                <div className="font-semibold text-slate-200">Uppercase Letters</div>
                <div className="text-[11px] text-slate-500 font-mono">A B C D E F ...</div>
              </div>
            </label>

            {/* Lowercase */}
            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={options.includeLowercase}
                onChange={(e) => updateOption('includeLowercase', e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-teal-500 focus:ring-teal-400 focus:ring-offset-slate-950 bg-slate-800"
              />
              <div>
                <div className="font-semibold text-slate-200">Lowercase Letters</div>
                <div className="text-[11px] text-slate-500 font-mono">a b c d e f ...</div>
              </div>
            </label>

            {/* Numbers */}
            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={options.includeNumbers}
                onChange={(e) => updateOption('includeNumbers', e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-teal-500 focus:ring-teal-400 focus:ring-offset-slate-950 bg-slate-800"
              />
              <div>
                <div className="font-semibold text-slate-200">Numbers</div>
                <div className="text-[11px] text-slate-500 font-mono">0 1 2 3 4 5 6 7 8 9</div>
              </div>
            </label>

            {/* Symbols */}
            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
              <input
                type="checkbox"
                checked={options.includeSymbols}
                onChange={(e) => updateOption('includeSymbols', e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-teal-500 focus:ring-teal-400 focus:ring-offset-slate-950 bg-slate-800"
              />
              <div>
                <div className="font-semibold text-slate-200">Special Symbols</div>
                <div className="text-[11px] text-slate-500 font-mono">! @ # $ % ^ & * ...</div>
              </div>
            </label>
          </div>
        </div>

        {/* Ambiguous Characters Checkbox */}
        <div className="border-t border-slate-800 pt-5">
          <label className="flex items-start gap-3 p-3.5 rounded-xl bg-teal-950/20 border border-teal-500/30 cursor-pointer hover:bg-teal-950/30 transition-colors">
            <input
              type="checkbox"
              checked={options.excludeAmbiguous}
              onChange={(e) => updateOption('excludeAmbiguous', e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 text-teal-500 focus:ring-teal-400 focus:ring-offset-slate-950 bg-slate-800 mt-0.5"
            />
            <div className="text-xs">
              <div className="font-semibold text-teal-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                Exclude Ambiguous Characters
              </div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Avoids easily confused glyphs such as <code className="text-teal-300 font-mono">l, 1, I, o, 0, O, |, /</code> so passwords can be read and typed accurately without mistakes.
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};
