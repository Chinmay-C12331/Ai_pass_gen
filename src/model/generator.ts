/**
 * Cryptographically secure password generator for PassMeter AI.
 * Supports customizable length, character sets, ambiguous character exclusion,
 * and automatic clipboard copying.
 */

export interface GeneratorOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeAmbiguous: boolean;
}

export const DEFAULT_GENERATOR_OPTIONS: GeneratorOptions = {
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeAmbiguous: true
};

const UPPERCASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const NUMBER_CHARS = '0123456789';
const SYMBOL_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Characters frequently confused in print/screen (e.g., l, 1, I, o, 0, O)
const AMBIGUOUS_CHARS = new Set(['l', '1', 'I', 'o', '0', 'O', '|', '/', '\\', '`', "'", '"', ':', ';']);

export function generateSecurePassword(options: GeneratorOptions): string {
  const {
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
    excludeAmbiguous
  } = options;

  let upper = UPPERCASE_CHARS;
  let lower = LOWERCASE_CHARS;
  let numbers = NUMBER_CHARS;
  let symbols = SYMBOL_CHARS;

  if (excludeAmbiguous) {
    upper = upper.split('').filter((c) => !AMBIGUOUS_CHARS.has(c)).join('');
    lower = lower.split('').filter((c) => !AMBIGUOUS_CHARS.has(c)).join('');
    numbers = numbers.split('').filter((c) => !AMBIGUOUS_CHARS.has(c)).join('');
    symbols = symbols.split('').filter((c) => !AMBIGUOUS_CHARS.has(c)).join('');
  }

  const pools: string[] = [];
  if (includeUppercase && upper.length > 0) pools.push(upper);
  if (includeLowercase && lower.length > 0) pools.push(lower);
  if (includeNumbers && numbers.length > 0) pools.push(numbers);
  if (includeSymbols && symbols.length > 0) pools.push(symbols);

  // Fallback if user unchecks everything
  if (pools.length === 0) {
    pools.push(lower.length > 0 ? lower : LOWERCASE_CHARS);
  }

  const fullPool = pools.join('');
  const passwordChars: string[] = [];

  // Guarantee at least one char from each chosen pool
  for (const p of pools) {
    const randomIdx = getRandomInt(0, p.length - 1);
    passwordChars.push(p[randomIdx]);
  }

  // Fill remaining characters from full combined pool
  const remainingCount = Math.max(0, length - passwordChars.length);
  for (let i = 0; i < remainingCount; i++) {
    const randomIdx = getRandomInt(0, fullPool.length - 1);
    passwordChars.push(fullPool[randomIdx]);
  }

  // Shuffle using cryptographically secure Durstenfeld algorithm
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = getRandomInt(0, i);
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  return passwordChars.join('');
}

/**
 * Returns a cryptographically secure random integer between min and max inclusive
 */
function getRandomInt(min: number, max: number): number {
  const range = max - min + 1;
  const maxSafe = Math.floor(0xffffffff / range) * range;
  const buf = new Uint32Array(1);

  let val = 0;
  do {
    window.crypto.getRandomValues(buf);
    val = buf[0];
  } while (val >= maxSafe);

  return min + (val % range);
}

/**
 * Copies text to system clipboard with fallback support
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Try fallback
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}
