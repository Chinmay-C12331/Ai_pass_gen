/**
 * Handcrafted feature extraction for password strength prediction.
 * Extracts 16 normalized numeric features for the hybrid neural model
 * and semantic diagnostic indicators for human explanations.
 */

import { DICTIONARY_WORDS, COMMON_PASSWORDS_SET } from './commonPasswords';

// Keyboard layout adjacency models
const QWERTY_ROWS = [
  '`1234567890-=',
  'qwertyuiop[]\\',
  "asdfghjkl;'",
  'zxcvbnm,./'
];

const NUMPAD_GRID = [
  '789',
  '456',
  '123',
  '0'
];

export interface PasswordDiagnostics {
  length: number;
  lowercaseCount: number;
  uppercaseCount: number;
  digitCount: number;
  symbolCount: number;
  entropy: number;
  longestRepeat: number;
  hasKeyboardWalk: boolean;
  keyboardWalkPattern: string | null;
  hasYear: boolean;
  yearValue: number | null;
  hasL33tDictionaryWord: boolean;
  matchedDictionaryWord: string | null;
  isCommonPassword: boolean;
  isSequentialNumber: boolean;
  reasons: string[];
  tip: string;
}

/**
 * Normalizes l33tspeak characters to plain Latin letters
 */
export function normalizeL33t(str: string): string {
  return str
    .toLowerCase()
    .replace(/@/g, 'a')
    .replace(/4/g, 'a')
    .replace(/8/g, 'b')
    .replace(/3/g, 'e')
    .replace(/1/g, 'l')
    .replace(/!/g, 'i')
    .replace(/\|/g, 'l')
    .replace(/0/g, 'o')
    .replace(/\$/g, 's')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/\+/g, 't');
}

/**
 * Detects common keyboard walks (e.g., "qwerty", "asdfgh", "12345", "zxcv")
 */
export function detectKeyboardWalk(str: string): { found: boolean; pattern: string | null } {
  if (str.length < 3) return { found: false, pattern: null };
  const lower = str.toLowerCase();

  // Check horizontal QWERTY rows forward and reverse
  for (const row of QWERTY_ROWS) {
    for (let len = 3; len <= 8; len++) {
      for (let i = 0; i <= row.length - len; i++) {
        const sub = row.substring(i, i + len);
        const subRev = sub.split('').reverse().join('');
        if (lower.includes(sub)) {
          return { found: true, pattern: sub };
        }
        if (lower.includes(subRev)) {
          return { found: true, pattern: subRev };
        }
      }
    }
  }

  // Check simple alphabetic sequences
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  for (let len = 3; len <= 7; len++) {
    for (let i = 0; i <= alphabet.length - len; i++) {
      const sub = alphabet.substring(i, i + len);
      const subRev = sub.split('').reverse().join('');
      if (lower.includes(sub)) return { found: true, pattern: sub };
      if (lower.includes(subRev)) return { found: true, pattern: subRev };
    }
  }

  // Check numpad horizontal / vertical walks
  for (const row of NUMPAD_GRID) {
    if (lower.includes(row) && row.length >= 3) {
      return { found: true, pattern: row };
    }
  }

  return { found: false, pattern: null };
}

/**
 * Computes Shannon entropy (bits) of the string
 */
export function computeEntropy(str: string): number {
  if (!str) return 0;
  const len = str.length;
  const frequencies = new Map<string, number>();
  for (const ch of str) {
    frequencies.set(ch, (frequencies.get(ch) || 0) + 1);
  }

  let entropy = 0;
  for (const count of frequencies.values()) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }
  return entropy * len; // Total information content in bits
}

/**
 * Finds the longest run of repeated identical characters (e.g., 'aaa')
 */
export function findLongestRepeat(str: string): number {
  if (!str) return 0;
  let maxRun = 1;
  let currentRun = 1;
  for (let i = 1; i < str.length; i++) {
    if (str[i] === str[i - 1]) {
      currentRun++;
      if (currentRun > maxRun) maxRun = currentRun;
    } else {
      currentRun = 1;
    }
  }
  return maxRun;
}

/**
 * Detects 4-digit years between 1920 and 2099
 */
export function detectYear(str: string): { found: boolean; year: number | null } {
  const match = str.match(/\b(19\d{2}|20\d{2})\b/) || str.match(/(19\d{2}|20\d{2})/);
  if (match) {
    const yr = parseInt(match[1], 10);
    if (yr >= 1920 && yr <= 2099) {
      return { found: true, year: yr };
    }
  }
  return { found: false, year: null };
}

/**
 * Checks if string is a simple sequential number pattern (e.g. 123456, 987654)
 */
export function detectSequentialNumbers(str: string): boolean {
  if (!/^\d{3,}$/.test(str)) return false;
  let isAsc = true;
  let isDesc = true;
  for (let i = 1; i < str.length; i++) {
    const diff = str.charCodeAt(i) - str.charCodeAt(i - 1);
    if (diff !== 1) isAsc = false;
    if (diff !== -1) isDesc = false;
  }
  return isAsc || isDesc;
}

/**
 * Checks for dictionary words under direct match or l33t normalization
 */
export function detectDictionaryWord(str: string): { found: boolean; word: string | null } {
  const lower = str.toLowerCase();
  const normalized = normalizeL33t(str);

  // Exact or contains match on words with length >= 4
  for (const word of DICTIONARY_WORDS) {
    if (lower.includes(word)) {
      return { found: true, word };
    }
    if (normalized.includes(word)) {
      return { found: true, word };
    }
  }
  return { found: false, word: null };
}

/**
 * Extracts comprehensive diagnostics, reasons, and tips for the "Why?" panel
 */
export function analyzeDiagnostics(password: string): PasswordDiagnostics {
  const len = password.length;
  let lowercaseCount = 0;
  let uppercaseCount = 0;
  let digitCount = 0;
  let symbolCount = 0;

  for (const ch of password) {
    if (/[a-z]/.test(ch)) lowercaseCount++;
    else if (/[A-Z]/.test(ch)) uppercaseCount++;
    else if (/[0-9]/.test(ch)) digitCount++;
    else symbolCount++;
  }

  const entropy = computeEntropy(password);
  const longestRepeat = findLongestRepeat(password);
  const walkCheck = detectKeyboardWalk(password);
  const yearCheck = detectYear(password);
  const dictCheck = detectDictionaryWord(password);
  const isCommon = COMMON_PASSWORDS_SET.has(password.toLowerCase());
  const isSeq = detectSequentialNumbers(password);

  const reasons: string[] = [];

  if (isCommon) {
    reasons.push('Appears in known compromised password databases');
  }
  if (walkCheck.found) {
    reasons.push(`Keyboard pattern detected ("${walkCheck.pattern}")`);
  }
  if (dictCheck.found) {
    if (dictCheck.word && normalizeL33t(password).includes(dictCheck.word) && !password.toLowerCase().includes(dictCheck.word)) {
      reasons.push(`L33tspeak substitution of common word "${dictCheck.word}"`);
    } else {
      reasons.push(`Contains dictionary word "${dictCheck.word}"`);
    }
  }
  if (yearCheck.found) {
    reasons.push(`Contains predictable calendar year (${yearCheck.year})`);
  }
  if (isSeq) {
    reasons.push('Sequential number sequence (very easy to guess)');
  }
  if (longestRepeat >= 3) {
    reasons.push(`Repeated identical characters (${longestRepeat} in a row)`);
  }
  if (len > 0 && len < 8) {
    reasons.push(`Too short (${len} characters; brute-force attacks crack quickly)`);
  }
  if (reasons.length === 0 && len > 0 && (lowercaseCount === len || digitCount === len)) {
    reasons.push('Uses only a single character set (no diversity)');
  }
  if (reasons.length === 0 && len > 0 && entropy < 25) {
    reasons.push('Low character entropy (predictable distribution)');
  }

  // Determine top actionable tip
  let tip = 'Your password looks resilient against standard dictionary & walk attacks!';
  if (isCommon) {
    tip = 'Never use common phrases. Use a randomized passphrase with 4+ unrelated words.';
  } else if (len < 12) {
    tip = 'Increase length to at least 14-16 characters; length beats complexity alone.';
  } else if (walkCheck.found) {
    tip = 'Avoid physical keyboard paths like "qwerty" or "1234" which attackers test first.';
  } else if (yearCheck.found) {
    tip = 'Remove years or birthdays; date patterns are automatically targeted in dictionaries.';
  } else if (dictCheck.found) {
    tip = 'Simple l33t substitutes like "@" for "a" or "0" for "o" are easily cracked by modern attack masks.';
  } else if (symbolCount === 0 || digitCount === 0) {
    tip = 'Mix in numbers and punctuation across the middle of words, not just at the end.';
  }

  return {
    length: len,
    lowercaseCount,
    uppercaseCount,
    digitCount,
    symbolCount,
    entropy,
    longestRepeat,
    hasKeyboardWalk: walkCheck.found,
    keyboardWalkPattern: walkCheck.pattern,
    hasYear: yearCheck.found,
    yearValue: yearCheck.year,
    hasL33tDictionaryWord: dictCheck.found,
    matchedDictionaryWord: dictCheck.word,
    isCommonPassword: isCommon,
    isSequentialNumber: isSeq,
    reasons: reasons.slice(0, 3),
    tip
  };
}

/**
 * Generates the 16-dimensional normalized feature vector for TensorFlow.js
 */
export function extractFeatureVector(password: string): Float32Array {
  const diag = analyzeDiagnostics(password);
  const vec = new Float32Array(16);

  if (password.length === 0) return vec;

  const len = Math.min(password.length, 64);
  vec[0] = len / 32.0;                                // normalized length
  vec[1] = diag.lowercaseCount / Math.max(1, len);    // ratio lowercase
  vec[2] = diag.uppercaseCount / Math.max(1, len);    // ratio uppercase
  vec[3] = diag.digitCount / Math.max(1, len);        // ratio digits
  vec[4] = diag.symbolCount / Math.max(1, len);       // ratio symbols
  vec[5] = Math.min(diag.entropy, 120.0) / 100.0;     // normalized entropy
  vec[6] = Math.min(diag.longestRepeat, 8) / 8.0;     // repeat ratio
  vec[7] = diag.hasKeyboardWalk ? 1.0 : 0.0;          // walk indicator
  vec[8] = diag.hasYear ? 1.0 : 0.0;                  // year indicator
  vec[9] = diag.hasL33tDictionaryWord ? 1.0 : 0.0;    // l33t dictionary word
  vec[10] = diag.isCommonPassword ? 1.0 : 0.0;        // common blacklist
  vec[11] = diag.isSequentialNumber ? 1.0 : 0.0;      // sequential numbers
  vec[12] = (diag.uppercaseCount > 0 && diag.lowercaseCount > 0 && diag.digitCount > 0 && diag.symbolCount > 0) ? 1.0 : 0.0; // all 4 charsets
  vec[13] = /^[A-Z][a-z]+[0-9]+[!@#$%^&*]$/.test(password) ? 1.0 : 0.0; // Naive corporate trap pattern (e.g. Password1!)
  vec[14] = Math.min(new Set(password).size, 32) / 32.0; // unique character diversity
  vec[15] = Math.min(password.length, 12) / 12.0;     // thresholded length factor

  return vec;
}
