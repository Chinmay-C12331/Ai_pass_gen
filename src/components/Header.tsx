import React from 'react';
import { Shield, Sparkles, Cpu, CheckCircle2, RefreshCw } from 'lucide-react';
import { ModelTrainingProgress, ModelMetadata } from '../model/neuralModel';

interface HeaderProps {
  activeTab: 'predictor' | 'compare' | 'generator' | 'about';
  setActiveTab: (tab: 'predictor' | 'compare' | 'generator' | 'about') => void;
  progress: ModelTrainingProgress;
  metadata: ModelMetadata;
  onRetrain: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  progress,
  metadata,
  onRetrain
}) => {
  const isTraining = progress.epoch < progress.totalEpochs;

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Project Title */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/10 border border-teal-500/30 text-teal-400 shadow-inner">
              <Shield className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-400 rounded-full animate-ping opacity-75" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500 rounded-full border-2 border-slate-950" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white font-mono">
                  PassMeter <span className="text-teal-400">AI</span>
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800/80 text-teal-300 border border-teal-500/20 font-medium">
                  Local AI
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                AI-Based Password Strength Prediction • Dual Bi-LSTM & Heuristic Engine
              </p>
            </div>
          </div>

          {/* Model Status Badge & Navigation */}
          <div className="flex items-center justify-between md:justify-end gap-3 flex-wrap">
            {/* Status Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              {isTraining ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span className="text-amber-300 font-medium">
                    Training {progress.epoch}/{progress.totalEpochs}
                  </span>
                </>
              ) : metadata.isFallback ? (
                <>
                  <Cpu className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-blue-300">Heuristic Fallback</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  <span className="text-teal-300">
                    {metadata.isCached ? 'Model Cached' : 'Neural Ready'}
                  </span>
                  <span className="text-slate-500 text-[10px]">({metadata.engine.replace('TensorFlow.js', 'TF.js')})</span>
                </>
              )}
            </div>

            {/* Nav Tabs */}
            <nav className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs sm:text-sm">
              <button
                onClick={() => setActiveTab('predictor')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'predictor'
                    ? 'bg-teal-500 text-slate-950 shadow-md font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Predictor
              </button>
              <button
                onClick={() => setActiveTab('compare')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'compare'
                    ? 'bg-teal-500 text-slate-950 shadow-md font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Compare
              </button>
              <button
                onClick={() => setActiveTab('generator')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'generator'
                    ? 'bg-teal-500 text-slate-950 shadow-md font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                Generator
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'about'
                    ? 'bg-teal-500 text-slate-950 shadow-md font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                About
              </button>
            </nav>
          </div>
        </div>

        {/* Global In-Browser Training Progress Bar (shows while training) */}
        {isTraining && (
          <div className="mt-3 p-2.5 rounded-lg bg-teal-950/40 border border-teal-500/30 text-xs">
            <div className="flex items-center justify-between text-teal-300 mb-1.5">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-400" />
                <span className="font-medium">{progress.statusText}</span>
              </div>
              <span className="font-mono text-teal-200">
                {Math.round((progress.epoch / progress.totalEpochs) * 100)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 transition-all duration-300 rounded-full"
                style={{ width: `${(progress.epoch / progress.totalEpochs) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
