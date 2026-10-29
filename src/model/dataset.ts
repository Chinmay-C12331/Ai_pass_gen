/**
 * Training dataset generator for PassMeter AI.
 * Combines common passwords and synthetic variants.
 * Generates reference labels = log10(guess number) capped [0, 14].
 */

import { COMMON_PASSWORDS, COMMON_PASSWORDS_RANK, DICTIONARY_WORDS } from './commonPasswords';
import { markovEstimator } from './markov';
import { extractFeatureVector } from './features';

export interface DatasetItem {
  password: string;
  tokens: number[];      // integer ASCII tokens padded/truncated to 32
  features: Float32Array; // 16 handcrafted features
  label: number;         // log10(guesses) in [0, 14]
}

const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomString(chars: string, length: number): string {
  let res = '';
  for (let i = 0; i < length; i++) {
    res += chars[Math.floor(Math.random() * chars.length)];
  }
  return res;
}

/**
 * Encodes a password into fixed-length 32 integer token IDs (1..95, 0 = padding)
 */
export function encodePasswordTokens(password: string, maxLen: number = 32): number[] {
  const truncated = password.slice(0, maxLen);
  const tokens = new Array(maxLen).fill(0);
  for (let i = 0; i < truncated.length; i++) {
    const code = truncated.charCodeAt(i);
    // Map ASCII 32..126 to 1..95, non-ASCII to 95
    if (code >= 32 && code <= 126) {
      tokens[i] = code - 31;
    } else {
      tokens[i] = 95;
    }
  }
  return tokens;
}

/**
 * Computes reference score for training:
 * min((rank in common list), markov estimate) capped [0, 14]
 */
export function computeReferenceScore(password: string): number {
  if (!password || password.length === 0) return 0;
  const lower = password.toLowerCase();

  const markovScore = markovEstimator.estimateLogGuesses(password);

  let rankScore: number | null = null;
  if (COMMON_PASSWORDS_RANK.has(lower)) {
    const rank = COMMON_PASSWORDS_RANK.get(lower)!;
    // rank 1 -> log10(1) = 0. rank 100 -> 2. rank 1000 -> 3
    rankScore = Math.max(0, Math.log10(Math.max(1, rank)));
  }

  let finalScore = markovScore;
  if (rankScore !== null) {
    finalScore = Math.min(rankScore, markovScore);
  }

  // Common corporate pattern trap (e.g., Password1! or Admin@123) should be rated low
  if (/^[A-Z][a-z]+[0-9]+[!@#$%^&*]$/.test(password) && password.length <= 10) {
    finalScore = Math.min(finalScore, 4.5);
  }

  return Math.max(0, Math.min(14, Number(finalScore.toFixed(2))));
}

/**
 * Builds synthetic samples to augment common passwords
 */
export function buildTrainingDataset(targetSize: number = 950): DatasetItem[] {
  const seen = new Set<string>();
  const dataset: DatasetItem[] = [];

  const addSample = (pwd: string) => {
    if (!pwd || seen.has(pwd)) return;
    seen.add(pwd);
    const tokens = encodePasswordTokens(pwd);
    const features = extractFeatureVector(pwd);
    const label = computeReferenceScore(pwd);
    dataset.push({ password: pwd, tokens, features, label });
  };

  // 1. Add all common passwords (~350 items)
  for (const pwd of COMMON_PASSWORDS) {
    addSample(pwd);
  }

  // 2. Add word + digits & word + symbol patterns
  for (const word of DICTIONARY_WORDS) {
    addSample(word);
    addSample(word + '123');
    addSample(word + '2024');
    addSample(word + '!');
    addSample(word.charAt(0).toUpperCase() + word.slice(1) + '1');
    addSample(word.charAt(0).toUpperCase() + word.slice(1) + '123!');
  }

  // 3. Add keyboard walks
  const walks = [
    '123456', '12345678', '987654321', 'qwerty', 'qwertyuiop', 'asdfghjkl',
    'zxcvbnm', '1q2w3e4r', 'zaq12wsx', 'qazwsxedc', '123qwe', 'asdf1234'
  ];
  for (const w of walks) {
    addSample(w);
    addSample(w + '!');
    addSample(w + '99');
  }

  // 4. Add random passwords with varying entropy
  // Digits only
  for (let len = 4; len <= 12; len += 2) {
    for (let k = 0; k < 6; k++) {
      addSample(randomString(DIGITS, len));
    }
  }

  // Lowercase only
  for (let len = 5; len <= 14; len += 3) {
    for (let k = 0; k < 8; k++) {
      addSample(randomString(LOWER, len));
    }
  }

  // Alphanumeric
  for (let len = 6; len <= 18; len += 3) {
    for (let k = 0; k < 15; k++) {
      addSample(randomString(LOWER + UPPER + DIGITS, len));
    }
  }

  // High entropy with symbols (Strong to Very Strong)
  for (let len = 10; len <= 24; len += 2) {
    for (let k = 0; k < 20; k++) {
      addSample(randomString(LOWER + UPPER + DIGITS + SYMBOLS, len));
    }
  }

  // 5. Add multi-word passphrases (e.g. correct-horse-battery-staple)
  for (let k = 0; k < 30; k++) {
    const w1 = randomChoice(DICTIONARY_WORDS);
    const w2 = randomChoice(DICTIONARY_WORDS);
    const w3 = randomChoice(DICTIONARY_WORDS);
    const w4 = randomChoice(DICTIONARY_WORDS);
    const sep = randomChoice(['-', '_', '.', ' ']);
    addSample(`${w1}${sep}${w2}${sep}${w3}`);
    addSample(`${w1}${sep}${w2}${sep}${w3}${sep}${w4}`);
  }

  // Shuffle dataset using Fisher-Yates
  for (let i = dataset.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [dataset[i], dataset[j]] = [dataset[j], dataset[i]];
  }

  return dataset.slice(0, targetSize);
}
