import React from 'react';
import { ShieldCheck, AlertTriangle, BookOpen, Lock, Users, Cpu } from 'lucide-react';

export const AboutTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-teal-400" />
          <h2 className="text-base font-bold text-white">
            About PassMeter AI • Student Cybersecurity Project
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Title: <strong>"AI-Based Password Strength Prediction"</strong>. This research implementation explores
          how character-level recurrent deep learning (Bi-LSTM) combined with heuristic feature engineering can evaluate password crackability
          substantially better than rigid corporate character-set policies.
        </p>
      </div>

      {/* 5 Core Ideas in Plain Words */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-teal-400" />
          How PassMeter AI Works (In 5 Points)
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 font-bold shrink-0 text-xs">
              1
            </span>
            <div>
              <strong className="text-slate-200">Beyond Naive Rules:</strong>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                Traditional rules only check length and character classes (e.g. 1 uppercase + 1 number). This gives users a false sense of security for patterns like <code>Password1!</code> which attackers crack in milliseconds.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 font-bold shrink-0 text-xs">
              2
            </span>
            <div>
              <strong className="text-slate-200">Bidirectional LSTM Sequence Encoding:</strong>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                Passwords are tokenized at the ASCII character level and processed through a 32-unit Bidirectional LSTM neural network, learning directional dependencies and n-gram transition patterns.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 font-bold shrink-0 text-xs">
              3
            </span>
            <div>
              <strong className="text-slate-200">Handcrafted Heuristic Feature Fusion:</strong>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                The LSTM representation is concatenated with 16 structural metrics: spatial keyboard walks (e.g. <code>qwerty</code>, <code>asdf</code>), Shannon entropy, 4-digit calendar years, l33tspeak dictionary matches, and repetition runs.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 font-bold shrink-0 text-xs">
              4
            </span>
            <div>
              <strong className="text-slate-200">Asymmetric Security Loss Function:</strong>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                During browser training, the loss function penalizes overestimating password strength about twice as heavily as underestimating it. In security, giving false optimism is dangerous.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 font-bold shrink-0 text-xs">
              5
            </span>
            <div>
              <strong className="text-slate-200">Conservative Safeguards & Occlusion:</strong>
              <p className="text-slate-400 mt-0.5 leading-relaxed">
                The final rating enforces a conservative minimum between the AI prediction and rule checks, automatically assigns Level 0 to any breach-listed password, and uses occlusion ablation to reveal exactly which characters compromise strength.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Notice Card */}
      <div className="p-5 rounded-2xl bg-teal-950/30 border border-teal-500/40 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-teal-300 font-bold text-sm">
          <Lock className="w-4 h-4 text-teal-400" />
          Strict Privacy Guarantee
        </div>
        <p className="text-xs text-teal-200/90 leading-relaxed">
          <strong>Your password is processed in this browser and never sent anywhere.</strong> Zero network calls are made after the page loads. No passwords are ever logged, sent to telemetry, or persisted in storage or cookies.
        </p>
      </div>

      {/* Limitations Notice Card */}
      <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Academic Model Limitations
        </div>
        <p className="text-xs text-amber-200/90 leading-relaxed">
          <strong>Small demo model trained on a tiny list; not a replacement for real security tools.</strong> This educational model is trained on ~950 synthetic and curated patterns within browser memory limits. Production password managers evaluate multi-gigabyte zxcvbn corpora and billions of breach records.
        </p>
      </div>

      {/* Project Credits Card */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
          <Users className="w-4 h-4 text-teal-400" />
          Project Contributors
        </div>
        <p className="text-xs text-slate-400">
          Developed as a university cybersecurity and machine learning laboratory project:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="font-semibold text-slate-200 text-xs">Chinmay J C</div>
            <div className="text-[11px] font-mono text-teal-400 mt-0.5">20241CSE0841</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="font-semibold text-slate-200 text-xs">Akash</div>
            <div className="text-[11px] font-mono text-teal-400 mt-0.5">20241CSE0836</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="font-semibold text-slate-200 text-xs">Bheemsen</div>
            <div className="text-[11px] font-mono text-teal-400 mt-0.5">20241CSE0844</div>
          </div>
        </div>
      </div>
    </div>
  );
};
