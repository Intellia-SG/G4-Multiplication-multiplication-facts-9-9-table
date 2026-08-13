// src/data/questionBank.js
// Procedural question bank — 100 questions across 10 themed world districts for Multiplication Facts up to 9×9.

export const DISTRICTS = [
  { id: 0, name: 'Sticker Swap Market',   icon: '🏷️', tableFocus: 2, boss: { name: 'Swap Boss', emoji: '⭐', reward: 'Market Star Badge 🏷️' } },
  { id: 1, name: 'Chess Championship',    icon: '♟️', tableFocus: 3, boss: { name: 'Grandmaster Boss', emoji: '♟️', reward: 'Chess Champ Badge ♟️' } },
  { id: 2, name: 'Rhythm Band Rehearsal', icon: '🎸', tableFocus: 4, boss: { name: 'Rhythm Boss', emoji: '🥁', reward: 'Band Badge 🎸' } },
  { id: 3, name: 'Science Fair Showcase', icon: '🔬', tableFocus: 5, boss: { name: 'Lab Boss', emoji: '🧪', reward: 'Science Badge 🔬' } },
  { id: 4, name: 'Basketball League',     icon: '🏀', tableFocus: 6, boss: { name: 'Coach Boss', emoji: '🥅', reward: 'League Badge 🏀' } },
  { id: 5, name: 'Mosaic Art Project',    icon: '🎨', tableFocus: 7, boss: { name: 'Mural Boss', emoji: '🖼️', reward: 'Artist Badge 🎨' } },
  { id: 6, name: 'Robotics Workshop',     icon: '🤖', tableFocus: 8, boss: { name: 'Circuit Boss', emoji: '⚙️', reward: 'Robotics Badge 🤖' } },
  { id: 7, name: 'Space Launch Control',  icon: '🚀', tableFocus: 9, boss: { name: 'Orbit Boss', emoji: '🛰️', reward: 'Launch Badge 🚀' } },
  { id: 8, name: 'Grand School Fair',     icon: '🎡', tableFocus: 'mixed', boss: { name: 'Fair Champion', emoji: '🎪', reward: 'Fair Badge 🎡' } },
  { id: 9, name: "Owl's Wisdom Tower",    icon: '🏛️', tableFocus: 'all', boss: { name: 'Grand Master Owl', emoji: '👑', reward: 'Multiplication Master Badge 👑' } },
];

const TABLES = [2, 3, 4, 5, 6, 7, 8, 9];
const ENGLISH_NAMES = ['Oliver', 'Emma', 'Jack', 'Mia', 'Lucas', 'Chloe', 'Noah', 'Ava', 'Ethan', 'Grace', 'Henry', 'Lily', 'Liam', 'Ella'];
const CONTEXTS = [
  { obj: 'stickers',      container: 'sheets',  emoji: '⭐' },
  { obj: 'pencils',       container: 'boxes',   emoji: '✏️' },
  { obj: 'cupcakes',      container: 'trays',   emoji: '🧁' },
  { obj: 'marbles',       container: 'bags',    emoji: '🔵' },
  { obj: 'apples',        container: 'baskets', emoji: '🍎' },
  { obj: 'robot parts',   container: 'crates',  emoji: '🤖' },
  { obj: 'flowers',       container: 'vases',   emoji: '🌼' },
  { obj: 'trading cards', container: 'packs',   emoji: '🎴' },
  { obj: 'balloons',      container: 'bunches', emoji: '🎈' },
  { obj: 'gems',          container: 'chests',  emoji: '💎' },
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateDistractors(correct, min = 1, max = 81) {
  const opts = new Set([correct]);
  const offsets = [1, 2, -1, -2, 5, -5, 10, -10, 3, -3];
  const shuffledOffsets = shuffle(offsets);
  for (const off of shuffledOffsets) {
    if (opts.size >= 4) break;
    const candidate = correct + off;
    if (candidate >= min && candidate <= max) opts.add(candidate);
  }
  while (opts.size < 4) {
    opts.add(randInt(min, Math.max(max, correct + 12)));
  }
  return shuffle([...opts]);
}

function genFact(tableFilter, difficulty) {
  let factorA = tableFilter && typeof tableFilter === 'number' ? tableFilter : pick(TABLES);
  let factorB;
  if (difficulty === 1) factorB = randInt(2, 5);
  else if (difficulty === 2) factorB = randInt(4, 8);
  else factorB = randInt(6, 9);
  return { factorA, factorB, product: factorA * factorB };
}

// Generate the 100 question list distributed across 10 districts
export function generateQuestionBank() {
  const questions = [];
  let qId = 1;

  DISTRICTS.forEach((district, dIdx) => {
    const table = district.tableFocus;

    for (let qInDist = 0; qInDist < 10; qInDist++) {
      const difficulty = qInDist < 3 ? 1 : qInDist < 7 ? 2 : 3;
      const { factorA, factorB, product } = genFact(table, difficulty);
      const name = pick(ENGLISH_NAMES);
      const ctx = pick(CONTEXTS);
      const typeChoice = qInDist % 5;

      let qObj = {};

      if (typeChoice === 0) {
        // Fact Family Triangle
        const missing = pick(['product', 'factorA', 'factorB']);
        const correct = { product, factorA, factorB }[missing];
        qObj = {
          id: `q_${qId++}`,
          districtIndex: dIdx,
          category: `FACT FAMILY · ${district.name.toUpperCase()}`,
          questionText: `What is the missing number in this fact triangle?`,
          visual: 'triangle',
          visualData: { factorA, factorB, product, missing },
          options: generateDistractors(correct, 1, missing === 'product' ? 81 : 9),
          correctAnswer: correct,
          hint1: `Think: ${factorA} × ${factorB} = ${product}.`,
          hint2: missing === 'product' ? `Multiply the two bottom factors.` : `Divide ${product} by the known factor.`,
          explanation: `${factorA} × ${factorB} = ${product}. The missing value is ${correct}.`,
        };
      } else if (typeChoice === 1) {
        // Commutative / Flip Factor or Sentence Blank
        const missing = pick(['factorA', 'factorB', 'product']);
        const correct = { factorA, factorB, product }[missing];
        const sentence = missing === 'factorA'
          ? `___ × ${factorB} = ${product}`
          : missing === 'factorB'
            ? `${factorA} × ___ = ${product}`
            : `${factorA} × ${factorB} = ___`;

        qObj = {
          id: `q_${qId++}`,
          districtIndex: dIdx,
          category: `MULTIPLICATION SENTENCE · ${district.name.toUpperCase()}`,
          questionText: `Complete the sentence: ${sentence}`,
          visual: 'sentence',
          visualData: { factorA, factorB, product, missing },
          options: generateDistractors(correct, 1, missing === 'product' ? 81 : 9),
          correctAnswer: correct,
          hint1: `Use your ${factorA} times table facts.`,
          hint2: `${factorA} × ${factorB} = ${product}.`,
          explanation: `${factorA} × ${factorB} = ${product}. The missing number is ${correct}.`,
        };
      } else if (typeChoice === 2) {
        // Equal Groups Word Problem
        qObj = {
          id: `q_${qId++}`,
          districtIndex: dIdx,
          category: `EQUAL GROUPS · ${district.name.toUpperCase()}`,
          questionText: `${name} has ${factorA} ${ctx.container} with ${factorB} ${ctx.obj} in each. How many ${ctx.obj} in total?`,
          visual: 'groups',
          visualData: { factorA, factorB, itemEmoji: ctx.emoji },
          options: generateDistractors(product, 1, 81),
          correctAnswer: product,
          hint1: `${factorA} equal groups of ${factorB}.`,
          hint2: `Calculate ${factorA} × ${factorB}.`,
          explanation: `${factorA} × ${factorB} = ${product}. ${name} has ${product} ${ctx.obj} in total.`,
        };
      } else if (typeChoice === 3) {
        // Array Grid Visual Problem
        qObj = {
          id: `q_${qId++}`,
          districtIndex: dIdx,
          category: `ARRAY MODEL · ${district.name.toUpperCase()}`,
          questionText: `An array has ${factorA} rows with ${factorB} items in each row. What is the total?`,
          visual: 'array',
          visualData: { factorA, factorB, itemEmoji: ctx.emoji },
          options: generateDistractors(product, 1, 81),
          correctAnswer: product,
          hint1: `Count ${factorA} rows of ${factorB}.`,
          hint2: `${factorA} × ${factorB} = ?`,
          explanation: `${factorA} rows of ${factorB} equals ${factorA} × ${factorB} = ${product}.`,
        };
      } else {
        // True / False Fact
        const isTrue = Math.random() > 0.5;
        const fakeProduct = product + (Math.random() > 0.5 ? factorA : -factorA);
        const displayed = isTrue ? product : Math.max(1, fakeProduct);
        qObj = {
          id: `q_${qId++}`,
          districtIndex: dIdx,
          category: `FACT VERIFICATION · ${district.name.toUpperCase()}`,
          questionText: `Is it true that ${factorA} × ${factorB} = ${displayed}?`,
          visual: 'truefalse',
          visualData: { factorA, factorB, product: displayed },
          options: ['True', 'False'],
          correctAnswer: isTrue ? 'True' : 'False',
          hint1: `Work out ${factorA} × ${factorB}.`,
          hint2: `${factorA} × ${factorB} is ${product}.`,
          explanation: `${factorA} × ${factorB} = ${product}. So ${factorA} × ${factorB} = ${displayed} is ${isTrue ? 'True ✓' : 'False ✗'}.`,
        };
      }

      questions.push(qObj);
    }
  });

  return questions;
}

const defaultQuestionBank = generateQuestionBank();
export default defaultQuestionBank;
