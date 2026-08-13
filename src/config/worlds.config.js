// src/config/worlds.config.js
export const WORLDS = [
  { id: 0, name: 'Sticker Swap Market',   emoji: '🏷️', accent: '#ff6f61',
    description: 'Count sticker sheets fast using the ×2 table',
    tableFocus: 2,
    boss: { name: 'Swap Boss',      emoji: '⭐', reward: 'Market Star Badge 🏷️' } },
  { id: 1, name: 'Chess Club Championship', emoji: '♟️', accent: '#ab47bc',
    description: 'Set up chessboards and teams using the ×3 table',
    tableFocus: 3,
    boss: { name: 'Grandmaster Boss', emoji: '♟️', reward: 'Chess Champ Badge ♟️' } },
  { id: 2, name: 'Music Band Rehearsal',  emoji: '🎸', accent: '#ec407a',
    description: 'Arrange rows of instrument stands using the ×4 table',
    tableFocus: 4,
    boss: { name: 'Rhythm Boss',     emoji: '🥁', reward: 'Band Badge 🎸' } },
  { id: 3, name: 'Science Fair Showcase', emoji: '🔬', accent: '#ffa726',
    description: 'Organise display tables using the ×5 table',
    tableFocus: 5,
    boss: { name: 'Lab Boss',        emoji: '🧪', reward: 'Science Badge 🔬' } },
  { id: 4, name: 'Basketball League',     emoji: '🏀', accent: '#66bb6a',
    description: 'Count players across teams using the ×6 table',
    tableFocus: 6,
    boss: { name: 'Coach Boss',      emoji: '🥅', reward: 'League Badge 🏀' } },
  { id: 5, name: 'Art Mural Project',     emoji: '🎨', accent: '#29b6f6',
    description: 'Tile a mosaic grid using the ×7 table',
    tableFocus: 7,
    boss: { name: 'Mural Boss',      emoji: '🖼️', reward: 'Artist Badge 🎨' } },
  { id: 6, name: 'Robotics Workshop',     emoji: '🤖', accent: '#c0ca33',
    description: 'Pack robot parts into crates using the ×8 table',
    tableFocus: 8,
    boss: { name: 'Circuit Boss',    emoji: '⚙️', reward: 'Robotics Badge 🤖' } },
  { id: 7, name: 'Space Launch Control',  emoji: '🚀', accent: '#5c6bc0',
    description: 'Arrange satellite arrays using the ×9 table',
    tableFocus: 9,
    boss: { name: 'Orbit Boss',      emoji: '🛰️', reward: 'Launch Badge 🚀' } },
  { id: 8, name: 'Grand School Fair',     emoji: '🎡', accent: '#283593',
    description: 'Mixed review of ×2 through ×9 across every fair stall',
    tableFocus: 'mixed-2-9',
    boss: { name: 'Fair Champion',   emoji: '🎪', reward: 'Fair Badge 🎡' } },
  { id: 9, name: "Owl's Wisdom Tower",    emoji: '🏛️', accent: '#00bcd4',
    description: "Master every multiplication fact at Tally's tower",
    tableFocus: 'mixed-all',
    boss: { name: 'Grand Master Owl', emoji: '👑', reward: 'Multiplication Master Badge 👑' } },
];

// ── Play modes (within each world) ──
export const PLAY_MODES = [
  {
    id: 'guided',
    name: 'Guided Practice',
    icon: '🧭',
    desc: '5 questions with hints, no time pressure',
    questionCount: 5,
    hints: true,
    timed: false,
    lives: false,
  },
  {
    id: 'independent',
    name: 'Independent Practice',
    icon: '✍️',
    desc: '10 questions, no hints, full XP',
    questionCount: 10,
    hints: false,
    timed: false,
    lives: false,
  },
  {
    id: 'timed',
    name: 'Timed Challenge',
    icon: '⏱️',
    desc: '8 questions in 60 seconds, bonus XP',
    questionCount: 8,
    hints: false,
    timed: true,
    timeLimit: 60,
    lives: false,
  },
  {
    id: 'boss',
    name: 'Boss Battle',
    icon: '👑',
    desc: '5 questions, 3 lives — defeat the boss!',
    questionCount: 5,
    hints: false,
    timed: false,
    lives: true,
  },
];

// ── Badges ──
export const BADGES = [
  { id: 'first_fact',        name: 'First Fact',          icon: '🏅', desc: 'First correct multiplication-fact answer' },
  { id: 'hot_streak',        name: 'Hot Streak',          icon: '🔥', desc: '5 consecutive correct' },
  { id: 'fact_family_star',  name: 'Fact Family Star',    icon: '🥈', desc: 'Completed Simulate' },
  { id: 'multiplication_master', name: 'Multiplication Master', icon: '🥇', desc: '80%+ correct overall' },
  { id: 'perfect_table',     name: 'Perfect Table',       icon: '💎', desc: 'A perfect world score' },
  { id: 'boss_slayer',       name: 'Boss Slayer',         icon: '👑', desc: 'Defeated a boss battle' },
  { id: 'full_journey',      name: 'Full Journey',        icon: '🌟', desc: 'Completed every phase' },
];

// ── XP economy ──
export const XP_REWARDS = {
  CORRECT: 10,
  STREAK_BONUS: 15, // on 5+ streak (replaces base)
  STATION_COMPLETE: 20,
  WORLD_COMPLETE: 50,
  BOSS_WIN: 100,
};

// ── The legal factors for this module (MOE P4 scope — facts up to 9×9) ──
export const TABLES = [2, 3, 4, 5, 6, 7, 8, 9];
