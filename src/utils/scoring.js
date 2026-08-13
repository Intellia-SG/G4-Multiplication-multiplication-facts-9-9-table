// src/utils/scoring.js

export function calcXP(attemptCount, hintsUsed, streak) {
  let base = 10;
  if (attemptCount > 1) base = Math.max(4, base - (attemptCount - 1) * 3);
  if (hintsUsed > 0) base = Math.max(3, base - hintsUsed * 2);
  const streakBonus = streak >= 5 ? 10 : streak >= 3 ? 5 : 0;
  return base + streakBonus;
}

export function calcStars(score) {
  if (score === null || score === undefined) return 0;
  if (score >= 9) return 3;
  if (score >= 7) return 2;
  if (score >= 5) return 1;
  return 0;
}
