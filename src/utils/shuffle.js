// src/utils/shuffle.js

export function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function generateSessionQuestions(bank) {
  if (!bank || !bank.length) return [];
  // Shuffle questions while maintaining 10 questions per district
  const shuffled = shuffleArray(bank);
  shuffled.forEach((q, idx) => {
    q.districtIndex = Math.floor(idx / 10);
  });
  return shuffled;
}
