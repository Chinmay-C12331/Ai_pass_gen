/**
 * Unified evaluation engine for PassMeter AI.
 * Combines Simple Rules, Pattern-based Zxcvbn-style heuristic, and Neural AI Model.
 * Computes conservative score, occlusion analysis, and comparative metrics.
 */

import { analyzeDiagnostics, PasswordDiagnostics } from './features';
import { markovEstimator } from './markov';
import { neuralPasswordModel } from './neuralModel';
import { COMMON_PASSWORDS_SET, COMMON_PASSWORDS_RANK } from './commonPasswords';
import { calculateCrackTimes, AttackerScenario } from './timeToCrack';

export interface LevelInfo {
  level: number;
  name: string;
  colorName: string;
  badgeBg: string;
  barColor: string;
  textColor: string;
  ringColor: string;
}

export const STRENGTH_LEVELS: LevelInfo[] = [
  {
    level: 0,
    name: 'Very weak',
    colorName: 'Red',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/30',
    barColor: 'bg-red-500',
    textColor: 'text-red-400',
    ringColor: 'ring-red-500/30'
  },
  {
    level: 1,
    name: 'Weak',
    colorName: 'Orange',
    badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    barColor: 'bg-orange-500',
    textColor: 'text-orange-400',
    ringColor: 'ring-orange-500/30'
  },
  {
    level: 2,
    name: 'Medium',
    colorName: 'Amber',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    barColor: 'bg-amber-500',
    textColor: 'text-amber-400',
    ringColor: 'ring-amber-500/30'
  },
  {
    level: 3,
    name: 'Strong',
    colorName: 'Lime',
    badgeBg: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
    barColor: 'bg-lime-500',
    textColor: 'text-lime-400',
    ringColor: 'ring-lime-500/30'
  },
  {
    level: 4,
    name: 'Very strong',
    colorName: 'Green',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    barColor: 'bg-emerald-500',
    textColor: 'text-emerald-400',
    ringColor: 'ring-emerald-500/30'
  }
];

export function logGuessesToLevel(logGuesses: number): number {
  if (logGuesses < 3) return 0;
  if (logGuesses < 6) return 1;
  if (logGuesses < 8) return 2;
  if (logGuesses < 10) return 3;
  return 4;
}

export interface CharacterOcclusion {
  char: string;
  index: number;
  delta: number; // scoreWithout - scoreWith. Positive means removing raises score (hurts strength)
  status: 'hurts' | 'neutral' | 'helps';
  tooltip: string;
}

export interface ComparisonEvaluation {
  simpleLevel: number;
  simpleName: string;
  simpleExplanation: string;

  patternLogGuesses: number;
  patternLevel: number;
  patternName: string;
  patternExplanation: string;

  aiLogGuesses: number;
  aiLevel: number;
  aiName: string;
  aiExplanation: string;

  isCorporateTrap: boolean;
}

export interface FullEvaluation {
  password: string;
  aiLogGuesses: number;
  aiLevel: number;

  ruleLogGuesses: number;
  ruleLevel: number;

  conservativeLevel: number;
  conservativeInfo: LevelInfo;
  isCommonPasswordOverride: boolean;

  guessesDisplay: string;
  diagnostics: PasswordDiagnostics;
  occlusion: CharacterOcclusion[];
  crackTimes: AttackerScenario[];
  comparison: ComparisonEvaluation;
  inferenceMs: number;
}

/**
 * Evaluates strength using naive rule-based criteria (length + character types)
 */
export function evaluateSimpleRules(password: string): { level: number; name: string; explanation: string } {
  if (!password) {
    return { level: 0, name: 'Very weak', explanation: 'No input provided' };
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);

  if (hasLower && hasUpper) score++;
  if (hasDigit && hasSymbol) score++;

  const level = Math.min(4, score);
  const names = ['Very weak', 'Weak', 'Medium', 'Strong', 'Very strong'];

  return {
    level,
    name: names[level],
    explanation: `Checks length (${password.length}) and presence of character groups (upper, lower, digits, symbols).`
  };
}

/**
 * Evaluates strength using pattern heuristics (Markov + dictionary + walk penalties)
 */
export function evaluatePatternBased(password: string, diag: PasswordDiagnostics): { logGuesses: number; level: number; explanation: string } {
  if (!password) {
    return { logGuesses: 0, level: 0, explanation: 'Empty' };
  }

  const markov = markovEstimator.estimateLogGuesses(password);
  let score = markov;

  if (diag.isCommonPassword) {
    const rank = COMMON_PASSWORDS_RANK.get(password.toLowerCase()) || 1;
    score = Math.min(score, Math.log10(Math.max(1, rank)));
  }

  if (diag.hasKeyboardWalk) {
    score = Math.max(1.0, score - 2.8);
  }

  if (diag.hasYear) {
    score = Math.max(1.0, score - 2.0);
  }

  if (diag.hasL33tDictionaryWord && !diag.isCommonPassword) {
    score = Math.max(2.0, score - 3.2);
  }

  if (diag.longestRepeat >= 3) {
    score = Math.max(1.5, score - 1.5);
  }

  score = Math.max(0, Math.min(14, Number(score.toFixed(2))));
  const level = logGuessesToLevel(score);

  return {
    logGuesses: score,
    level,
    explanation: 'Applies 3-gram transition entropy, keyboard walk tracking, and l33tspeak dictionary penalties.'
  };
}

/**
 * Performs character-by-character occlusion analysis
 */
export function computeOcclusion(
  password: string,
  baseScore: number,
  diag: PasswordDiagnostics
): CharacterOcclusion[] {
  if (!password || password.length === 0) return [];
  if (password.length > 48) {
    // For very long passwords, sample or limit to 48 chars
    password = password.slice(0, 48);
  }

  const result: CharacterOcclusion[] = [];

  for (let i = 0; i < password.length; i++) {
    const char = password[i];
    const without = password.slice(0, i) + password.slice(i + 1);

    // Predict score without this character
    const predWithout = neuralPasswordModel.predict(without);
    const scoreWithout = predWithout.logGuesses;

    // delta = scoreWithout - baseScore
    // If delta > 0.1, removing this character RAISES score -> this character hurt the password!
    // If delta < -0.1, removing this character DROPS score -> this character helped the password!
    let delta = Number((scoreWithout - baseScore).toFixed(2));

    // Refine with rule-based heuristics if single character is part of a walk or repeat
    if (diag.hasKeyboardWalk && diag.keyboardWalkPattern && diag.keyboardWalkPattern.includes(char.toLowerCase())) {
      delta = Math.max(delta, 0.45);
    }
    if (diag.longestRepeat >= 3 && i > 0 && password[i] === password[i - 1]) {
      delta = Math.max(delta, 0.35);
    }

    let status: 'hurts' | 'neutral' | 'helps' = 'neutral';
    let tooltip = '';

    if (delta > 0.15) {
      status = 'hurts';
      tooltip = `Hurts strength (+${delta} if removed). Predictable pattern/walk component.`;
    } else if (delta < -0.2) {
      status = 'helps';
      tooltip = `Helps strength (${delta} if removed). Adds high character entropy.`;
    } else {
      status = 'neutral';
      tooltip = `Neutral impact (~${delta} delta). Standard character.`;
    }

    result.push({
      char,
      index: i,
      delta,
      status,
      tooltip
    });
  }

  return result;
}

/**
 * Full master evaluation combining all models and constraints
 */
export function evaluatePassword(password: string): FullEvaluation {
  const diag = analyzeDiagnostics(password);

  // 1. AI Model inference
  const aiPred = neuralPasswordModel.predict(password);
  let aiLogGuesses = aiPred.logGuesses;
  let aiLevel = logGuessesToLevel(aiLogGuesses);

  // 2. Pattern-based rule estimate
  const patternEval = evaluatePatternBased(password, diag);
  let ruleLogGuesses = patternEval.logGuesses;
  let ruleLevel = patternEval.level;

  // 3. Simple rules
  const simpleEval = evaluateSimpleRules(password);

  // 4. Conservative score rule:
  // "Show the final displayed level as the minimum of the AI model level and a rule-based zxcvbn-style estimate,
  // and always force level 0 for passwords in the common list. Label this 'Conservative score'."
  const isCommon = diag.isCommonPassword;
  let conservativeLevel = Math.min(aiLevel, ruleLevel);

  if (isCommon) {
    conservativeLevel = 0;
    aiLevel = 0;
    aiLogGuesses = Math.min(aiLogGuesses, 2.0);
    ruleLevel = 0;
    ruleLogGuesses = Math.min(ruleLogGuesses, 1.8);
  }

  const conservativeInfo = STRENGTH_LEVELS[conservativeLevel];

  // Guesses display formatting: "about 10^X guesses"
  const guessesPower = Math.max(0, conservativeLevel === 0 && isCommon ? 2.5 : aiLogGuesses);
  const guessesDisplay = `about 10^${guessesPower.toFixed(1)} guesses`;

  // Time-to-crack based on effective log10 guesses
  const crackTimes = calculateCrackTimes(guessesPower);

  // Occlusion analysis
  const occlusion = computeOcclusion(password, aiLogGuesses, diag);

  // Comparison details
  const isTrap = simpleEval.level >= 3 && conservativeLevel <= 1;

  const comparison: ComparisonEvaluation = {
    simpleLevel: simpleEval.level,
    simpleName: simpleEval.name,
    simpleExplanation: simpleEval.explanation,

    patternLogGuesses: ruleLogGuesses,
    patternLevel: ruleLevel,
    patternName: STRENGTH_LEVELS[ruleLevel].name,
    patternExplanation: patternEval.explanation,

    aiLogGuesses,
    aiLevel,
    aiName: STRENGTH_LEVELS[aiLevel].name,
    aiExplanation: 'Bi-LSTM character sequence recurrence + 16 fused handcrafted features.',

    isCorporateTrap: isTrap
  };

  return {
    password,
    aiLogGuesses,
    aiLevel,
    ruleLogGuesses,
    ruleLevel,
    conservativeLevel,
    conservativeInfo,
    isCommonPasswordOverride: isCommon,
    guessesDisplay,
    diagnostics: diag,
    occlusion,
    crackTimes,
    comparison,
    inferenceMs: aiPred.inferenceMs
  };
}
