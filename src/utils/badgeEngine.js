// src/utils/badgeEngine.js

export const BADGES = [
  { id: 'first_fact',            label: 'First Fact Master',   icon: '🏅', description: 'Answered your first multiplication question correctly' },
  { id: 'hot_streak',            label: 'On Fire!',            icon: '🔥', description: 'Achieved a streak of 5+ correct answers' },
  { id: 'sim_champion',          label: 'Lab Scientist',       icon: '🧪', description: 'Completed all 4 interactive simulation labs' },
  { id: 'perfect_district',      label: 'Flawless District',   icon: '💎', description: 'Scored 10/10 in a single world district' },
  { id: 'boss_slayer',           label: 'Boss Champion',       icon: '👑', description: 'Defeated a World District Boss Battle' },
  { id: 'multiplication_master', label: 'Grand Master',        icon: '🏆', description: 'Completed the full journey with 80%+ accuracy' },
  { id: 'full_journey',          label: 'Full Quest Complete', icon: '🌟', description: 'Completed all 5 phases from Wonder to Reflect' },
];

export function checkBadges(state) {
  const unlocked = [];

  const totalCorrect = state.districtCorrect?.reduce((s, c) => s + (c || 0), 0) || 0;
  if (totalCorrect >= 1) unlocked.push('first_fact');
  if (state.maxStreak >= 5) unlocked.push('hot_streak');
  if (state.simStationsComplete && state.simStationsComplete.every(Boolean)) unlocked.push('sim_champion');
  if (state.districtScores && state.districtScores.some(score => score === 10)) unlocked.push('perfect_district');
  if (state.phaseComplete?.play && totalCorrect >= 80) unlocked.push('multiplication_master');
  if (state.phaseComplete && Object.values(state.phaseComplete).every(Boolean)) unlocked.push('full_journey');

  return unlocked;
}
