/**
 * Character 3-gram Markov transition estimator.
 * Measures sequence predictability based on 3-gram transition statistics.
 * Outputs estimated log10(guesses) capped between 0 and 14.
 */

import { COMMON_PASSWORDS, DICTIONARY_WORDS } from './commonPasswords';

class MarkovEstimator {
  private trigramCounts: Map<string, number> = new Map();
  private bigramTotals: Map<string, number> = new Map();
  private alphabetSize: number = 95; // Printable ASCII 32..126
  private isInitialized: boolean = false;

  constructor() {
    this.trainInitialCorpus();
  }

  /**
   * Builds 3-gram frequency tables from the common passwords and dictionary words
   */
  private trainInitialCorpus() {
    const corpus = [...COMMON_PASSWORDS, ...DICTIONARY_WORDS];
    for (const text of corpus) {
      if (!text || text.length < 2) continue;
      // Use start token ^ and end token $
      const padded = `^${text.toLowerCase()}$`;
      for (let i = 2; i < padded.length; i++) {
        const bigram = padded[i - 2] + padded[i - 1];
        const trigram = bigram + padded[i];

        this.trigramCounts.set(trigram, (this.trigramCounts.get(trigram) || 0) + 1);
        this.bigramTotals.set(bigram, (this.bigramTotals.get(bigram) || 0) + 1);
      }
    }
    this.isInitialized = true;
  }

  /**
   * Estimates log10(number of guesses) for a given password using character 3-gram surprise
   */
  public estimateLogGuesses(password: string): number {
    if (!password || password.length === 0) return 0;
    if (password.length === 1) return 1.5;

    // Base alphabet size estimate for the password's character classes
    let hasLower = false;
    let hasUpper = false;
    let hasDigit = false;
    let hasSymbol = false;

    for (const ch of password) {
      if (/[a-z]/.test(ch)) hasLower = true;
      else if (/[A-Z]/.test(ch)) hasUpper = true;
      else if (/[0-9]/.test(ch)) hasDigit = true;
      else hasSymbol = true;
    }

    let rawPool = 0;
    if (hasLower) rawPool += 26;
    if (hasUpper) rawPool += 26;
    if (hasDigit) rawPool += 10;
    if (hasSymbol) rawPool += 33;
    if (rawPool === 0) rawPool = 26;

    // Brute force theoretical maximum: password.length * log10(rawPool)
    const bruteForceLog10 = password.length * Math.log10(rawPool);

    // Compute Markov log-likelihood with Laplace add-1 smoothing
    const padded = `^${password.toLowerCase()}$`;
    let markovSurpriseBits = 0;

    for (let i = 2; i < padded.length; i++) {
      const bigram = padded[i - 2] + padded[i - 1];
      const trigram = bigram + padded[i];

      const count = this.trigramCounts.get(trigram) || 0;
      const total = this.bigramTotals.get(bigram) || 0;

      // Smoothed probability
      const prob = (count + 1) / (total + this.alphabetSize);
      markovSurpriseBits += -Math.log2(prob);
    }

    // Convert bits to log10(guesses): log10(2^bits) = bits * log10(2) ≈ bits * 0.30103
    let markovLog10 = markovSurpriseBits * 0.30103;

    // Adjust for case and character variety (since 3-gram was lowercase)
    let varietyBonus = 0;
    if (hasUpper && hasLower) varietyBonus += 0.8;
    if (hasDigit) varietyBonus += 0.6;
    if (hasSymbol) varietyBonus += 1.2;

    let estimated = markovLog10 * 0.45 + varietyBonus;

    // Bound with brute-force cap and clamp between [0, 14]
    estimated = Math.min(estimated, bruteForceLog10);
    return Math.max(0, Math.min(14, Number(estimated.toFixed(2))));
  }
}

export const markovEstimator = new MarkovEstimator();
