/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  X,
  Sparkles,
  Shield,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Header } from './components/Header';
import { StrengthBar } from './components/StrengthBar';
import { WhyPanel } from './components/WhyPanel';
import { OcclusionStrip } from './components/OcclusionStrip';
import { TimeToCrackTable } from './components/TimeToCrackTable';
import { ModelDetailsAccordion } from './components/ModelDetailsAccordion';
import { CompareTab } from './components/CompareTab';
import { GeneratorPanel } from './components/GeneratorPanel';
import { AboutTab } from './components/AboutTab';
import {
  neuralPasswordModel,
  ModelTrainingProgress,
  ModelMetadata
} from './model/neuralModel';
import { evaluatePassword, FullEvaluation } from './model/evaluator';
import { copyToClipboard } from './model/generator';

// 6 specified example passwords
const EXAMPLE_PASSWORDS = [
  { value: '123456', label: '123456', tag: 'Breach Top 1' },
  { value: 'Password1!', label: 'Password1!', tag: 'Corporate Trap' },
  { value: 'qwerty123', label: 'qwerty123', tag: 'Keyboard Walk' },
  { value: 'P@ssw0rd', label: 'P@ssw0rd', tag: 'L33tspeak' },
  { value: 'Tr0ub4dor&3', label: 'Tr0ub4dor&3', tag: 'Deceptive' },
  { value: 'correct-horse-battery-staple', label: 'correct-horse-battery-staple', tag: 'Passphrase' }
];

export default function App() {
  const [password, setPassword] = useState<string>('Password1!');
  const [debouncedPassword, setDebouncedPassword] = useState<string>('Password1!');
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'predictor' | 'compare' | 'generator' | 'about'>('predictor');
  const [copied, setCopied] = useState<boolean>(false);

  const [progress, setProgress] = useState<ModelTrainingProgress>({
    epoch: 0,
    totalEpochs: 20,
    loss: 0,
    statusText: 'Initializing AI Engine...'
  });

  const [metadata, setMetadata] = useState<ModelMetadata>(() =>
    neuralPasswordModel.getModelMetadata()
  );

  // Initialize neural model in browser on start
  useEffect(() => {
    const unsubProgress = neuralPasswordModel.subscribeProgress((p) => setProgress(p));
    const unsubMeta = neuralPasswordModel.subscribeMetadata((m) => setMetadata(m));

    // Initialize or load from IndexedDB
    neuralPasswordModel.initialize().catch((err) => {
      console.warn('Initialization notice:', err);
    });

    return () => {
      unsubProgress();
      unsubMeta();
    };
  }, []);

  // Debounce 100 ms as requested
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPassword(password);
    }, 100);
    return () => clearTimeout(timer);
  }, [password]);

  // Evaluate password whenever debouncedPassword or model state changes
  const evalResult: FullEvaluation = useMemo(() => {
    return evaluatePassword(debouncedPassword);
  }, [debouncedPassword, progress.epoch]);

  const handleCopy = async () => {
    if (!password) return;
    const ok = await copyToClipboard(password);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRetrain = () => {
    neuralPasswordModel.trainNewModel();
  };

  const handleSelectExample = (pwd: string) => {
    setPassword(pwd);
    setDebouncedPassword(pwd);
  };

  const handleApplyFromGenerator = (pwd: string) => {
    setPassword(pwd);
    setDebouncedPassword(pwd);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500 selection:text-slate-950">
      {/* App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        progress={progress}
        metadata={metadata}
        onRetrain={handleRetrain}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Persistent Input & Example Strip (Shown on Predictor and Compare tabs) */}
        {(activeTab === 'predictor' || activeTab === 'compare') && (
          <div className="space-y-4">
            {/* Input Card */}
            <div className="relative bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 shadow-2xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <label
                  htmlFor="password-input"
                  className="font-semibold text-slate-300 flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-teal-400" />
                  <span>Enter Password to Predict Strength:</span>
                </label>
                <div className="flex items-center gap-3 text-slate-400">
                  <span className="font-mono text-teal-300 font-medium">
                    {password.length} chars
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[11px] text-teal-400/80">
                    Live AI Inference (100ms debounce)
                  </span>
                </div>
              </div>

              {/* Password Input Box */}
              <div className="relative flex items-center bg-slate-950 rounded-xl border border-slate-800 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all">
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Type any password or phrase..."
                  autoComplete="off"
                  spellCheck="false"
                  className="w-full bg-transparent px-4 py-3.5 font-mono text-base sm:text-lg text-white placeholder-slate-600 focus:outline-none"
                />

                {/* Right Input Buttons */}
                <div className="flex items-center gap-1 pr-2 shrink-0">
                  {password && (
                    <button
                      onClick={() => setPassword('')}
                      title="Clear input"
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={handleCopy}
                    disabled={!password}
                    title="Copy to clipboard"
                    className="p-2 rounded-lg text-slate-400 hover:text-teal-300 hover:bg-slate-800 transition-colors disabled:opacity-40"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setActiveTab('generator')}
                    title="Open Password Generator"
                    className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 text-xs font-semibold transition-all ml-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate</span>
                  </button>
                </div>
              </div>

              {/* 6 Clickable Example Passwords */}
              <div className="pt-1">
                <div className="text-[11px] text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Quick Test Examples:</span>
                  <span className="text-[10px] text-slate-500">Click to evaluate</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {EXAMPLE_PASSWORDS.map((ex) => {
                    const isSelected = password === ex.value;
                    return (
                      <button
                        key={ex.value}
                        onClick={() => handleSelectExample(ex.value)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono shrink-0 border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-teal-500/20 border-teal-500 text-teal-300 font-bold'
                            : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        <span>{ex.label}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-sans">
                          {ex.tag}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Predictor (Core Dashboard) */}
        {activeTab === 'predictor' && (
          <div className="space-y-6">
            {/* 1. Strength Bar */}
            <StrengthBar evalResult={evalResult} />

            {/* 2. Side-by-side Grid: Why? Panel & Which Characters Hurt Strip */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WhyPanel
                diagnostics={evalResult.diagnostics}
                passwordLength={debouncedPassword.length}
              />
              <div className="space-y-6">
                <OcclusionStrip
                  occlusion={evalResult.occlusion}
                  isVisible={showPassword}
                />
              </div>
            </div>

            {/* 3. Time-to-Crack Table for 3 Threat Models */}
            <TimeToCrackTable scenarios={evalResult.crackTimes} />

            {/* 4. Model Details Accordion */}
            <ModelDetailsAccordion
              metadata={metadata}
              inferenceMs={evalResult.inferenceMs}
              onRetrain={handleRetrain}
              isTraining={progress.epoch < progress.totalEpochs}
            />
          </div>
        )}

        {/* Tab 2: Compare (Tri-Method Scoring) */}
        {activeTab === 'compare' && (
          <CompareTab
            evalResult={evalResult}
            onSelectExample={handleSelectExample}
          />
        )}

        {/* Tab 3: Generator */}
        {activeTab === 'generator' && (
          <GeneratorPanel onApplyPassword={handleApplyFromGenerator} />
        )}

        {/* Tab 4: About & Academic Project Credits */}
        {activeTab === 'about' && <AboutTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2 font-mono text-slate-300">
            <Shield className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-semibold text-teal-300">PassMeter AI</span>
            <span>• In-Browser Deep Learning Cybersecurity System</span>
          </div>

          <div className="text-slate-400 text-xs">
            Project by <strong className="text-slate-200">Chinmay J C (20241CSE0841)</strong>,{' '}
            <strong className="text-slate-200">Akash (20241CSE0836)</strong>,{' '}
            <strong className="text-slate-200">Bheemsen (20241CSE0844)</strong>
          </div>

          <div className="text-[11px] text-slate-400">
            All neural inferences and pattern analyses execute strictly client-side. Zero passwords leave your device.
          </div>
        </div>
      </footer>
    </div>
  );
}
