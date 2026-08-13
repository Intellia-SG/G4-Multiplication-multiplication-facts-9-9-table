// src/utils/narration.js
// 1:1 strict parity narration helper for MultiplyQuest

export const say       = (text) => ({ text, style: 'statement' });
export const ask       = (text) => ({ text, style: 'question' });
export const cheer     = (text) => ({ text, style: 'celebration' });
export const emphasize = (text) => ({ text, style: 'emphasis' });
export const think     = (text) => ({ text, style: 'thinking' });
export const celebrate = (text) => ({ text, style: 'celebration' });
export const instruct  = (text) => ({ text, style: 'instruction' });
export const encourage = (text) => ({ text, style: 'encouragement' });

// ─── INTRO ────────────────────────────────────────────────────────────────
export function introNarration() {
  return [
    cheer("Welcome to MultiplyQuest! Ready to master your multiplication facts up to 9×9 and conquer the kingdom? 🚀")
  ];
}

// ─── WONDER ──────────────────────────────────────────────────────────────
export function wonderNarration() {
  return [
    ask("If Oliver arranges 7 rows of 8 chairs for the school fair, what is the instant way to find the total chairs without counting one by one?"),
    think("Let's investigate how times tables turn slow counting into instant answers!")
  ];
}

// ─── STORY ───────────────────────────────────────────────────────────────
const STORY_SCRIPTS = [
  [say('Oliver is setting up chairs for the grand school fair — 7 rows, with 8 chairs in each row. His teacher asks, "How many chairs in total, Oliver?" He starts counting one by one… 1, 2, 3… but the fair opens in five minutes!')],
  [say('Emma rushes over with a big smile. "You don\'t need to count them one by one, Oliver! We already know 7 × 8 = 56 from our times tables. 7 equal rows of 8 chairs makes 56 chairs — instantly!"')],
  [say('Toby the Owl swoops down gracefully. "Here is a magical math secret: the order never changes the product! 7 × 8 and 8 × 7 both equal 56. So whenever you know one fact, you already know its flipped partner for free!"')],
  [celebrate('Oliver grins and proudly calls back to his teacher: "56 chairs, all ready to go!" The school gates open right on time. "From now on, I will always use multiplication facts instead of slow counting!"')],
];

export function storyNarration(panelIndex) {
  return STORY_SCRIPTS[panelIndex] || STORY_SCRIPTS[0];
}

// ─── SIMULATE ────────────────────────────────────────────────────────────
const SIM_INTROS = [
  [instruct("Station A: Array and Grid Visualizer! Adjust the row and column sliders to build any multiplication array and watch the total calculate live!")],
  [instruct("Station B: Commutative Flip Lab! Rotate the array 90 degrees to see why A × B always equals B × A, and try decomposing big facts!")],
  [instruct("Station C: Equal Groups and Number Line! Send Toby hopping by equal step sizes along the number line to reach the target!")],
  [instruct("Station D: Fact Family Triangle! Explore how multiplication and division are connected in every three-number fact family!")],
];

export function simStationIntro(stationIndex) {
  return SIM_INTROS[stationIndex] || SIM_INTROS[0];
}

// ─── PLAY ─────────────────────────────────────────────────────────────────
export function playQuestionNarration(questionText) {
  return [say(questionText || "Look at the multiplication problem and choose the correct answer.")];
}

export function playCorrectNarration(streak = 1) {
  if (streak >= 5) return [cheer("Incredible streak! You're unstoppable! 🔥")];
  if (streak >= 3) return [cheer("Triple strike! Fantastic multiplication recall! ⭐")];
  return [cheer("Spot on! That's correct! 🎉")];
}

export function playWrongNarration() {
  return [think("Not quite, but good effort! Check the multiplication fact and try again.")];
}

export function playHint1Narration() {
  return [encourage("Here is your first clue! Look at the number groups carefully.")];
}

export function playHint2Narration() {
  return [encourage("Here is the key clue to solve this fact family!")];
}

export function districtCompleteNarration() {
  return [celebrate("District Complete! Awesome job mastering these multiplication facts! 🏆")];
}

export function bossStartNarration() {
  return [emphasize("The Boss Battle begins! Answer all questions correctly and protect your three lives to claim the district crown! 👑")];
}

export function bossWinNarration() {
  return [celebrate("Victory! You defeated the boss and claimed the golden badge! 🏆")];
}

// ─── REFLECT ────────────────────────────────────────────────────────────
export function reflectNarration() {
  return [say("Time to reflect on your multiplication journey! Check your key takeaways and review your scorecard! 📓")];
}

export function reflectCompleteNarration() {
  return [celebrate("Congratulations! You are a certified Multiplication Grand Master! 🏆✨")];
}
