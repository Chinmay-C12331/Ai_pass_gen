/**
 * Time-to-crack calculations for 3 standard threat models:
 * 1. Online throttled: 100 guesses / hour (0.02778 guesses/sec)
 * 2. Online unthrottled: 10 guesses / second
 * 3. Offline fast hash: 10,000,000,000 (10 billion) guesses / second
 */

export interface AttackerScenario {
  id: string;
  name: string;
  rateDescription: string;
  ratePerSecond: number;
  logRatePerSecond: number;
  timeDisplay: string;
  riskLevel: 'instant' | 'high' | 'moderate' | 'safe';
  explanation: string;
}

export function formatSeconds(secondsLog10: number): string {
  // If secondsLog10 < 0 => less than 1 second
  if (secondsLog10 < -1) {
    return 'Instant (< 0.01s)';
  }
  if (secondsLog10 < 0) {
    return 'Less than a second';
  }

  // Convert to actual number if log10 <= 15 (safe from float truncation)
  if (secondsLog10 <= 15) {
    const s = Math.pow(10, secondsLog10);

    if (s < 60) {
      return `${Math.max(1, Math.round(s))} seconds`;
    }
    const mins = s / 60;
    if (mins < 60) {
      return `${Math.round(mins)} minutes`;
    }
    const hours = mins / 60;
    if (hours < 24) {
      return `${Math.round(hours)} hours`;
    }
    const days = hours / 24;
    if (days < 365) {
      return `${Math.round(days)} days`;
    }
    const years = days / 365.25;
    if (years < 100) {
      return `${Math.round(years)} years`;
    }
    const centuries = years / 100;
    if (centuries < 100) {
      return `${Math.round(centuries)} centuries`;
    }
    if (years < 1e6) {
      return `${Math.round(years / 1000)} thousand years`;
    }
    return `${(years / 1e6).toFixed(1)} million years`;
  }

  // Log10 is extremely high (> 10^15 seconds)
  // log10(years) = log10(seconds) - log10(31557600) ≈ log10(seconds) - 7.5
  const logYears = secondsLog10 - 7.5;
  if (logYears < 10) {
    return `${Math.round(Math.pow(10, logYears - 2))} centuries`;
  }
  return `Centuries (10^${Math.round(logYears)} years)`;
}

export function calculateCrackTimes(log10Guesses: number): AttackerScenario[] {
  // 1. Online Throttled: 100 guesses / hour = 100 / 3600 = 0.027778 guesses/sec
  // log10(rate) = log10(100/3600) = 2 - 3.5563 = -1.5563
  const logRateThrottled = Math.log10(100 / 3600);
  const logSecThrottled = log10Guesses - logRateThrottled;

  // 2. Online Unthrottled: 10 guesses / sec
  // log10(10) = 1.0
  const logRateUnthrottled = 1.0;
  const logSecUnthrottled = log10Guesses - logRateUnthrottled;

  // 3. Offline Fast Hash (GPU hash cluster: MD5/NTLM @ 10 billion guesses/sec)
  // log10(10^10) = 10.0
  const logRateOffline = 10.0;
  const logSecOffline = log10Guesses - logRateOffline;

  const scenarios: AttackerScenario[] = [
    {
      id: 'online-throttled',
      name: 'Online Throttled',
      rateDescription: '100 attempts / hour (Rate-limited login form, CAPTCHA)',
      ratePerSecond: 100 / 3600,
      logRatePerSecond: logRateThrottled,
      timeDisplay: formatSeconds(logSecThrottled),
      riskLevel: logSecThrottled < 2 ? 'instant' : logSecThrottled < 5 ? 'high' : logSecThrottled < 7 ? 'moderate' : 'safe',
      explanation: 'Protected by IP throttling or account lockout after repeated failed attempts.'
    },
    {
      id: 'online-unthrottled',
      name: 'Online Unthrottled',
      rateDescription: '10 attempts / second (API endpoint with no rate limits)',
      ratePerSecond: 10,
      logRatePerSecond: logRateUnthrottled,
      timeDisplay: formatSeconds(logSecUnthrottled),
      riskLevel: logSecUnthrottled < 2 ? 'instant' : logSecUnthrottled < 5 ? 'high' : logSecUnthrottled < 8 ? 'moderate' : 'safe',
      explanation: 'Vulnerable API or login form allowing continuous automated credential stuffing.'
    },
    {
      id: 'offline-fast',
      name: 'Offline Fast Hash',
      rateDescription: '10 billion attempts / second (Leaked database, multi-GPU rig)',
      ratePerSecond: 1e10,
      logRatePerSecond: logRateOffline,
      timeDisplay: formatSeconds(logSecOffline),
      riskLevel: logSecOffline < 1 ? 'instant' : logSecOffline < 4 ? 'high' : logSecOffline < 7 ? 'moderate' : 'safe',
      explanation: 'Attacker obtained password hash dump and attacks it locally with dedicated GPU clusters.'
    }
  ];

  return scenarios;
}
