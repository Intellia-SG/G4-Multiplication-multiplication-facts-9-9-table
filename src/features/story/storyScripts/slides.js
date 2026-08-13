// src/features/story/storyScripts/slides.js
//
// All 4 story slides for "The Great School Fair Rush".
// Drop matching artwork into src/assets/story/ as 1.png – 4.png, sized
// 1672×941px (16:9), replacing the placeholder images shipped with this
// module. See the SlideImage fallback in StoryPhase.jsx — if a file is
// ever missing at runtime, it degrades gracefully to a placeholder frame.

export const STORY_SLIDES = [
  {
    title: 'The Great School Fair Rush 🎡',
    text: "Ravi is setting up chairs for the school fair — 7 rows, with 8 chairs in each row. His teacher asks, \"How many chairs in total, Ravi?\" He starts counting one by one… 1, 2, 3… but the fair opens in five minutes!",
    highlight: '🤔  7 rows of 8 chairs — how many chairs in total?',
    answer: null,
    narrationIdx: 0,
  },
  {
    title: 'Zara Knows the Fact! ✖️',
    text: 'Zara laughs and says, "You don\'t need to count them one by one! We already know 7 × 8 = 56 from our times tables. 7 equal rows of 8 chairs is exactly 56 chairs — instantly!"',
    highlight: '✖️  7 × 8 = 56',
    answer: null,
    narrationIdx: 1,
  },
  {
    title: 'Tally Flips the Fact! 🦉',
    text: 'Tally the Owl swoops down. "Here\'s a secret: it doesn\'t matter which order you multiply in! 7 × 8 and 8 × 7 always give the same answer. So if you know one fact, you already know its flip too!"',
    highlight: '🧩  7 × 8 = 56  AND  8 × 7 = 56',
    answer: null,
    narrationIdx: 2,
  },
  {
    title: 'Ravi Never Loses Count Again 🚀',
    text: 'Ravi grins and calls back to his teacher: "56 chairs, all set!" The fair opens right on time. "From now on, I\'ll use my multiplication facts instead of counting everything one by one!"',
    highlight: '🚀  Multiplication facts — the fast way to find the total!',
    answer: null,
    narrationIdx: 3,
  },
];
