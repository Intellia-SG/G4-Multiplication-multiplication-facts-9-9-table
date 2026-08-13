// src/core/questions/questionBank.js
// Procedural question generator — 100 questions, 10 types, 10 worlds
// Multiplication Using Multiplication Facts up to 9×9 (MultiplyQuest)
import { BADGES, TABLES } from '../../config/worlds.config.js';

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateDistractors(correct, min, max) {
  const opts = new Set([correct]);
  const offsets = [1, 2, 3, -1, -2, -3, 5, -5];
  const shuffled = shuffleArray(offsets);
  for (const off of shuffled) {
    if (opts.size >= 4) break;
    const candidate = correct + off;
    if (candidate >= min && candidate <= max) opts.add(candidate);
  }
  while (opts.size < 4) opts.add(randInt(min, Math.max(max, correct + 6)));
  return shuffleArray([...opts]);
}

// genFactPair(diff) — the single source of truth for every multiplication generator.
// Picks factorA from TABLES (2-9) and factorB bounded by difficulty (also capped
// at 9, since this module covers facts only up to the 9×9 table), then computes
// product = factorA × factorB. This guarantees every question in the bank stays
// within the 9×9 scope, every one of the 100 questions, every play-through.
// Ranges are pitched for Grade 4 fluency (recalling facts across the full table,
// not just the smaller ×2–×5 facts), so even the "easy" tier stays in the ×4–×9
// range and the top tier drills the hardest facts (×7–×9) that Grade 4 students
// are expected to have automatic recall of.
function genFactPair(diff) {
  const factorA = TABLES[randInt(0, TABLES.length - 1)];
  let factorB;
  if (diff === 1) factorB = randInt(4, 7);
  else if (diff === 2) factorB = randInt(5, 9);
  else factorB = randInt(7, 9);
  return { factorA, factorB, product: factorA * factorB };
}

const englishNames = ['Emma', 'James', 'Oliver', 'Zara', 'Lucas', 'Mia', 'Noah',
  'Ava', 'Ethan', 'Grace', 'Henry', 'Lily', 'Jack', 'Chloe', 'Ravi', 'Ella'];
const femaleNames = ['Emma', 'Zara', 'Mia', 'Ava', 'Grace', 'Lily', 'Chloe', 'Ella'];
function pronoun(name) { return femaleNames.includes(name) ? 'she' : 'he'; }

const contexts = [
  { obj: 'stickers',      container: 'sheets',  emoji: '⭐' },
  { obj: 'pencils',       container: 'boxes',   emoji: '✏️' },
  { obj: 'cupcakes',      container: 'trays',   emoji: '🧁' },
  { obj: 'marbles',       container: 'bags',    emoji: '🔵' },
  { obj: 'apples',        container: 'baskets', emoji: '🍎' },
  { obj: 'robot parts',   container: 'crates',  emoji: '🤖' },
  { obj: 'flowers',       container: 'vases',   emoji: '🌼' },
  { obj: 'trading cards', container: 'packs',   emoji: '🎴' },
  { obj: 'balloons',      container: 'bunches', emoji: '🎈' },
  { obj: 'seashells',     container: 'jars',    emoji: '🐚' },
];
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function singular(word) { return word.endsWith('s') ? word.slice(0, -1) : word; }

// builds 3 plausible-but-wrong repeated-addition strings around the true one
function generateAdditionDistractors(factorA, factorB) {
  const build = (count, val) => Array.from({ length: count }, () => val).join(' + ') + ` = ${count * val}`;
  const strings = new Set([build(factorA, factorB)]);
  const variants = shuffleArray([
    [Math.max(2, factorA - 1), factorB],
    [factorA + 1, factorB],
    [factorA, Math.max(1, factorB - 1)],
    [factorA, factorB + 1],
  ]);
  for (const [count, val] of variants) {
    if (strings.size >= 4) break;
    strings.add(build(count, val));
  }
  return shuffleArray([...strings]).slice(0, 4);
}

// Q1: Fact-family triangle — one of {factorA, factorB, product} is blanked
function genQ1(id, diff) {
  const { factorA, factorB, product } = genFactPair(diff);
  const missingSlot = pick(['product', 'factorA', 'factorB']);
  const correctAnswer = { product, factorA, factorB }[missingSlot];
  const hints = {
    product: [`Multiply ${factorA} × ${factorB} to find the product.`, `${factorA} groups of ${factorB} make the product.`],
    factorA: [`Think: ? × ${factorB} = ${product}.`, `Divide ${product} by ${factorB} to find the missing factor.`],
    factorB: [`Think: ${factorA} × ? = ${product}.`, `Divide ${product} by ${factorA} to find the missing factor.`],
  };
  return {
    id, type: 'factFamilyTriangle', world: 0, difficulty: diff,
    factorA, factorB, product, missingSlot,
    questionText: 'Look at the fact triangle. What is the missing number?',
    visual: 'triangle',
    hint1: hints[missingSlot][0],
    hint2: hints[missingSlot][1],
    explanation: `${factorA} × ${factorB} = ${product}.`,
    options: generateDistractors(correctAnswer, missingSlot === 'product' ? 1 : 1, missingSlot === 'product' ? 90 : 9),
    correctAnswer,
  };
}

// Q2: Doubling strategy — use a known fact to derive a related fact by doubling
function genQ2(id, diff) {
  const smallFactors = [2, 3, 4]; // keeps doubled factor within the ×9 scope
  const factorA = pick(smallFactors);
  const doubledA = factorA * 2;
  const factorB = diff === 1 ? randInt(4, 7) : diff === 2 ? randInt(5, 9) : randInt(7, 9);
  const knownProduct = factorA * factorB;
  const correctAnswer = doubledA * factorB;
  return {
    id, type: 'doubleFactHelper', world: 0, difficulty: diff,
    factorA: doubledA, factorB, product: correctAnswer, missingSlot: 'product',
    questionText: `You know ${factorA} × ${factorB} = ${knownProduct}. Since ${doubledA} is double ${factorA}, what is ${doubledA} × ${factorB}?`,
    visual: 'sentence',
    hint1: `Double the known product: ${knownProduct} doubled is…`,
    hint2: `${doubledA} × ${factorB} = (${factorA} × ${factorB}) × 2.`,
    explanation: `${factorA} × ${factorB} = ${knownProduct}, and doubling gives ${doubledA} × ${factorB} = ${correctAnswer}.`,
    options: generateDistractors(correctAnswer, 1, 90),
    correctAnswer,
  };
}

// Q3: Multiplication sentence — ___ × b = c style, missing slot chosen at random
function genQ3(id, diff) {
  const { factorA, factorB, product } = genFactPair(diff);
  const missingSlot = pick(['factorA', 'factorB', 'product']);
  const correctAnswer = { factorA, factorB, product }[missingSlot];
  const sentence = {
    factorA: `___ × ${factorB} = ${product}`,
    factorB: `${factorA} × ___ = ${product}`,
    product: `${factorA} × ${factorB} = ___`,
  }[missingSlot];
  return {
    id, type: 'multiplicationSentenceBlank', world: 0, difficulty: diff,
    factorA, factorB, product, missingSlot,
    questionText: sentence,
    visual: 'sentence',
    hint1: `Think of the multiplication fact: ${factorA} × ${factorB} = ${product}.`,
    hint2: `Use the multiplication table to find the missing number.`,
    explanation: `${factorA} × ${factorB} = ${product}.`,
    options: generateDistractors(correctAnswer, missingSlot === 'product' ? 1 : 1, missingSlot === 'product' ? 90 : 9),
    correctAnswer,
  };
}

// Q4: Equal groups (visual) — groups × size shown, find the total
function genQ4(id, diff) {
  const { factorA, factorB, product } = genFactPair(diff);
  const c = pick(contexts);
  return {
    id, type: 'equalGroupsMultiply', world: 0, difficulty: diff,
    factorA, factorB, product, missingSlot: 'product',
    questionText: `There are ${factorA} ${c.container} with ${factorB} ${c.obj} in each. How many ${c.obj} in total?`,
    visual: 'groups', itemEmoji: c.emoji,
    hint1: `Count ${factorA} equal groups of ${factorB}.`,
    hint2: `${factorA} × ${factorB} = ?`,
    explanation: `${factorA} × ${factorB} = ${product}. There are ${product} ${c.obj} in total.`,
    options: generateDistractors(product, 1, 90),
    correctAnswer: product,
  };
}

// Q5: Array multiplication — rows × columns array, one dimension blanked, total given
function genQ5(id, diff) {
  const { factorA, factorB, product } = genFactPair(diff);
  const missingSlot = Math.random() > 0.5 ? 'factorA' : 'factorB';
  const correctAnswer = missingSlot === 'factorA' ? factorA : factorB;
  const known = missingSlot === 'factorA' ? factorB : factorA;
  const dimWord = missingSlot === 'factorA' ? 'rows' : 'columns';
  return {
    id, type: 'arrayMultiplication', world: 0, difficulty: diff,
    factorA, factorB, product, missingSlot,
    questionText: missingSlot === 'factorA'
      ? `An array totals ${product} and has ${factorB} columns. How many rows?`
      : `An array totals ${product} and has ${factorA} rows. How many columns?`,
    visual: 'array',
    hint1: `${product} ÷ ${known} = ?`,
    hint2: `Think of the multiplication fact: ? × ${known} = ${product}.`,
    explanation: `${factorA} × ${factorB} = ${product}, so the array has ${factorA} rows and ${factorB} columns.`,
    options: generateDistractors(correctAnswer, 1, 9),
    correctAnswer,
    dimWord,
  };
}

// Q6: Word problem — "groups of" style ("boxes with pencils in each")
function genQ6(id, diff) {
  const { factorA, factorB, product } = genFactPair(diff);
  const name = pick(englishNames);
  const c = pick(contexts);
  return {
    id, type: 'wordProblemGroups', world: 0, difficulty: diff,
    factorA, factorB, product, missingSlot: 'product',
    questionText: `${name} has ${factorA} ${c.container}, with ${factorB} ${c.obj} in each ${singular(c.container)}. How many ${c.obj} does ${pronoun(name)} have in total?`,
    visual: 'word', itemEmoji: c.emoji, characterName: name, objectName: c.obj,
    hint1: `${name} has ${factorA} equal groups of ${factorB}.`,
    hint2: `${factorA} × ${factorB} = ?`,
    explanation: `${factorA} × ${factorB} = ${product}. ${name} has ${product} ${c.obj} in total.`,
    options: generateDistractors(product, 1, 90),
    correctAnswer: product,
  };
}

// Q7: Word problem — array/rows style ("rows of chairs for the fair")
function genQ7(id, diff) {
  const { factorA, factorB, product } = genFactPair(diff);
  const name = pick(englishNames);
  return {
    id, type: 'wordProblemArray', world: 0, difficulty: diff,
    factorA, factorB, product, missingSlot: 'product',
    questionText: `${name} arranges ${factorA} rows of chairs for the school fair, with ${factorB} chairs in each row. How many chairs in total?`,
    visual: 'word', itemEmoji: '🪑', characterName: name, objectName: 'chairs',
    hint1: `${factorA} rows of ${factorB} chairs each.`,
    hint2: `${factorA} × ${factorB} = ?`,
    explanation: `${factorA} × ${factorB} = ${product}. ${name} arranged ${product} chairs in total.`,
    options: generateDistractors(product, 1, 90),
    correctAnswer: product,
  };
}

// Q8: Which repeated addition sentence matches this multiplication fact?
function genQ8(id, diff) {
  const { factorA, factorB, product } = genFactPair(diff);
  const correctAnswer = Array.from({ length: factorA }, () => factorB).join(' + ') + ` = ${product}`;
  return {
    id, type: 'skipCountingHelper', world: 0, difficulty: diff,
    factorA, factorB, product, missingSlot: 'none',
    questionText: `Which repeated addition matches ${factorA} × ${factorB}?`,
    visual: 'choices',
    hint1: `Add ${factorB} to itself ${factorA} times.`,
    hint2: `${factorA} × ${factorB} = ${product}.`,
    explanation: `${factorA} × ${factorB} means adding ${factorB} a total of ${factorA} times, which equals ${product}.`,
    options: generateAdditionDistractors(factorA, factorB),
    correctAnswer,
  };
}

// Q9: True / False — a multiplication fact, sometimes altered
function genQ9(id, diff) {
  const { factorA, factorB, product } = genFactPair(diff);
  const isTrue = Math.random() > 0.5;
  const offset = Math.random() > 0.5 ? 1 : -1;
  const fakeProduct = Math.max(1, product + offset * factorA);
  const displayedProduct = isTrue ? product : fakeProduct;
  return {
    id, type: 'trueFalseFact', world: 0, difficulty: diff,
    factorA, factorB, product: displayedProduct, missingSlot: 'none',
    questionText: `Is it true that ${factorA} × ${factorB} = ${displayedProduct}?`,
    visual: 'truefalse',
    hint1: `Multiply ${factorA} × ${factorB} and compare to ${displayedProduct}.`,
    hint2: `${factorA} × ${factorB} actually equals ${product}.`,
    explanation: `${factorA} × ${factorB} = ${product}, so the statement is ${isTrue ? 'True ✓' : 'False ✗'}.`,
    options: ['True', 'False'],
    correctAnswer: isTrue ? 'True' : 'False',
  };
}

// Q10: Mixed review — combines two formats at higher difficulty, fuels Boss Battle
function genQ10(id, diff) {
  const { factorA, factorB, product } = genFactPair(diff);
  const useTriangle = Math.random() > 0.5;
  if (useTriangle) {
    const name = pick(englishNames);
    const c = pick(contexts);
    const missingSlot = pick(['product', 'factorA', 'factorB']);
    const correctAnswer = { product, factorA, factorB }[missingSlot];
    return {
      id, type: 'mixedReviewBoss', world: 0, difficulty: diff,
      factorA, factorB, product, missingSlot,
      questionText: `${name} is sorting ${c.obj}: ${factorA} × ${factorB} = ${product}. Use the fact to find the missing number.`,
      visual: 'mixed', mixedVisual: 'triangle',
      hint1: `${factorA} × ${factorB} = ${product} — use this to fill in the blank.`,
      hint2: `Rearrange the fact triangle.`,
      explanation: `${factorA} × ${factorB} = ${product}.`,
      options: generateDistractors(correctAnswer, missingSlot === 'product' ? 1 : 1, missingSlot === 'product' ? 90 : 9),
      correctAnswer,
    };
  }
  const missingSlot = Math.random() > 0.5 ? 'factorA' : 'factorB';
  const correctAnswer = missingSlot === 'factorA' ? factorA : factorB;
  const known = missingSlot === 'factorA' ? factorB : factorA;
  return {
    id, type: 'mixedReviewBoss', world: 0, difficulty: diff,
    factorA, factorB, product, missingSlot,
    questionText: `Boss Challenge: An array totals ${product} with ${known} ${missingSlot === 'factorA' ? 'columns' : 'rows'}. How many ${missingSlot === 'factorA' ? 'rows' : 'columns'}?`,
    visual: 'mixed', mixedVisual: 'array',
    hint1: `${product} ÷ ${known} = ?`,
    hint2: `Think: ? × ${known} = ${product}.`,
    explanation: `${factorA} × ${factorB} = ${product}.`,
    options: generateDistractors(correctAnswer, 1, 9),
    correctAnswer,
  };
}

const DISTRIBUTION = [
  ['factFamilyTriangle',        genQ1,  [2, 4, 4]],
  ['doubleFactHelper',          genQ2,  [2, 4, 4]],
  ['multiplicationSentenceBlank', genQ3, [2, 4, 4]],
  ['equalGroupsMultiply',       genQ4,  [2, 3, 5]],
  ['arrayMultiplication',       genQ5,  [2, 4, 4]],
  ['wordProblemGroups',         genQ6,  [2, 3, 5]],
  ['wordProblemArray',          genQ7,  [2, 3, 5]],
  ['skipCountingHelper',        genQ8,  [2, 4, 4]],
  ['trueFalseFact',             genQ9,  [2, 4, 4]],
  ['mixedReviewBoss',           genQ10, [1, 3, 6]],
];

export function generateSessionQuestions() {
  let all = [];
  let counter = 1;
  for (const [type, genFn, [e, m, h]] of DISTRIBUTION) {
    for (let i = 0; i < e; i++) all.push(genFn(`${type}_${counter++}`, 1));
    for (let i = 0; i < m; i++) all.push(genFn(`${type}_${counter++}`, 2));
    for (let i = 0; i < h; i++) all.push(genFn(`${type}_${counter++}`, 3));
  }
  all = shuffleArray(all);
  all.forEach((q, idx) => { q.world = Math.floor(idx / 10); });
  return all;
}

export const BADGE_TESTS = {
  first_fact:             (s) => s.totalScore > 0,
  hot_streak:              (s) => s.maxStreak >= 5,
  fact_family_star:        (s) => s.simulateDone,
  multiplication_master:   (s) => s.totalQuestions > 0 && s.totalScore / s.totalQuestions >= 0.8,
  perfect_table:           (s) => s.worldResults.some(w => w && w.correct === w.total),
  boss_slayer:             (s) => s.bossWon,
  full_journey:            (s) => s.reflectDone,
};

export function checkBadges(sessionState) {
  return BADGES.filter(b => (BADGE_TESTS[b.id] ? BADGE_TESTS[b.id](sessionState) : false));
}

export function scoreAnswer({ isCorrect, isFirstTry, streak }) {
  if (!isCorrect) return { xp: 0, newStreak: 0 };
  let xp = isFirstTry ? 10 : 5;
  const newStreak = streak + 1;
  if (newStreak >= 5 && newStreak % 5 === 0) xp += 5;
  return { xp, newStreak };
}

export function calcStars(correctCount, totalCount = 10) {
  const pct = totalCount > 0 ? correctCount / totalCount : 0;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

export function isWorldUnlocked() {
  return true; // direct phase/world switching is allowed throughout
}

// exported for reuse by Simulate stations (Equal Groups Builder, Flip the Factor, Multiplication Sentence)
export { genFactPair, contexts, englishNames, pronoun, pick, singular, randInt, shuffleArray, generateDistractors };
