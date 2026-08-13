// scripts/generate_audio.js
// Pre-generates all known narration phrases as .mp3 files into public/assets/audio/ and writes src/utils/audioMap.js.
// Usage: npm run generate-audio
// Requires: VITE_ELEVENLABS_API_KEY in .env.local

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const [key, ...vals] = line.split('=');
    if (key && !process.env[key.trim()]) {
      process.env[key.trim()] = vals.join('=').trim();
    }
  }
}
loadEnv();

const API_KEY = process.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2';
const VOICE_MODEL = 'eleven_multilingual_v2';
const AUDIO_DIR = path.join(__dirname, '..', 'public', 'assets', 'audio');
const MAP_PATH  = path.join(__dirname, '..', 'src', 'utils', 'audioMap.js');

const VOICE_SETTINGS = {
  statement:     { stability: 0.65, similarity_boost: 0.80, style: 0.30 },
  question:      { stability: 0.55, similarity_boost: 0.75, style: 0.50 },
  encouragement: { stability: 0.50, similarity_boost: 0.85, style: 0.60 },
  emphasis:      { stability: 0.75, similarity_boost: 0.90, style: 0.20 },
  thinking:      { stability: 0.70, similarity_boost: 0.78, style: 0.40 },
  celebration:   { stability: 0.45, similarity_boost: 0.85, style: 0.80 },
  instruction:   { stability: 0.65, similarity_boost: 0.80, style: 0.30 },
};

const phrases = [
  // INTRO
  { text: "Welcome to MultiplyQuest! Ready to master your multiplication facts up to 9×9 and conquer the kingdom? 🚀", style: 'celebration' },
  // WONDER
  { text: "If Oliver arranges 7 rows of 8 chairs for the school fair, what is the instant way to find the total chairs without counting one by one?", style: 'question' },
  { text: "Let's investigate how times tables turn slow counting into instant answers!", style: 'thinking' },
  // STORY
  { text: 'Oliver is setting up chairs for the grand school fair — 7 rows, with 8 chairs in each row. His teacher asks, "How many chairs in total, Oliver?" He starts counting one by one… 1, 2, 3… but the fair opens in five minutes!', style: 'statement' },
  { text: 'Emma rushes over with a big smile. "You don\'t need to count them one by one, Oliver! We already know 7 × 8 = 56 from our times tables. 7 equal rows of 8 chairs makes 56 chairs — instantly!"', style: 'statement' },
  { text: 'Toby the Owl swoops down gracefully. "Here is a magical math secret: the order never changes the product! 7 × 8 and 8 × 7 both equal 56. So whenever you know one fact, you already know its flipped partner for free!"', style: 'statement' },
  { text: 'Oliver grins and proudly calls back to his teacher: "56 chairs, all ready to go!" The school gates open right on time. "From now on, I will always use multiplication facts instead of slow counting!"', style: 'celebration' },
  // SIMULATE
  { text: "Station A: Array and Grid Visualizer! Adjust the row and column sliders to build any multiplication array and watch the total calculate live!", style: 'instruction' },
  { text: "Station B: Commutative Flip Lab! Rotate the array 90 degrees to see why A × B always equals B × A, and try decomposing big facts!", style: 'instruction' },
  { text: "Station C: Equal Groups and Number Line! Send Toby hopping by equal step sizes along the number line to reach the target!", style: 'instruction' },
  { text: "Station D: Fact Family Triangle! Explore how multiplication and division are connected in every three-number fact family!", style: 'instruction' },
  // PLAY & BOSS
  { text: "Incredible streak! You're unstoppable! 🔥", style: 'celebration' },
  { text: "Triple strike! Fantastic multiplication recall! ⭐", style: 'celebration' },
  { text: "Spot on! That's correct! 🎉", style: 'celebration' },
  { text: "Not quite, but good effort! Check the multiplication fact and try again.", style: 'thinking' },
  { text: "Here is your first clue! Look at the number groups carefully.", style: 'encouragement' },
  { text: "Here is the key clue to solve this fact family!", style: 'encouragement' },
  { text: "District Complete! Awesome job mastering these multiplication facts! 🏆", style: 'celebration' },
  { text: "The Boss Battle begins! Answer all questions correctly and protect your three lives to claim the district crown! 👑", style: 'emphasis' },
  { text: "Victory! You defeated the boss and claimed the golden badge! 🏆", style: 'celebration' },
  // REFLECT
  { text: "Time to reflect on your multiplication journey! Check your key takeaways and review your scorecard! 📓", style: 'statement' },
  { text: "Congratulations! You are a certified Multiplication Grand Master! 🏆✨", style: 'celebration' },
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 50);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--index') out.index = parseInt(args[++i], 10);
    if (args[i] === '--text') out.text = args[++i];
    if (args[i] === '--style') out.style = args[++i];
    if (args[i] === '--list') out.list = true;
  }
  return out;
}

async function generateAudio(text, style) {
  if (!API_KEY) {
    throw new Error('VITE_ELEVENLABS_API_KEY is not set in .env.local');
  }
  const settings = VOICE_SETTINGS[style] ?? VOICE_SETTINGS.statement;
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'xi-api-key': API_KEY },
      body: JSON.stringify({ text, model_id: VOICE_MODEL, voice_settings: settings }),
    }
  );
  if (!res.ok) throw new Error(`ElevenLabs error ${res.status}: ${await res.text()}`);
  const buf = await res.arrayBuffer();
  return Buffer.from(buf);
}

(async () => {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
  const { index, text: cliText, style: cliStyle, list } = parseArgs();

  if (list) {
    phrases.forEach((p, i) => console.log(`[${i}] (${p.style}) ${p.text.slice(0, 70)}…`));
    return;
  }

  if (cliText) {
    const style = cliStyle || 'statement';
    const filename = `audio_${slugify(cliText)}.mp3`;
    const filePath = path.join(AUDIO_DIR, filename);
    console.log(`🎙  Generating single statement (${style}): "${cliText.slice(0, 60)}…"`);
    const buf = await generateAudio(cliText, style);
    fs.writeFileSync(filePath, buf);
    console.log(`✅  Saved: public/assets/audio/${filename}`);
    return;
  }

  if (Number.isInteger(index)) {
    const phrase = phrases[index];
    if (!phrase) {
      console.error(`❌  No phrase at index ${index}. Run with --list to see valid indices.`);
      return;
    }
    const filename = `audio_${slugify(phrase.text)}_${index}.mp3`;
    const filePath = path.join(AUDIO_DIR, filename);
    console.log(`🎙  Generating [${index}] ${phrase.style}: "${phrase.text.slice(0, 60)}…"`);
    const buf = await generateAudio(phrase.text, phrase.style);
    fs.writeFileSync(filePath, buf);
    console.log(`✅  Saved: public/assets/audio/${filename}`);
    return;
  }

  const audioMapEntries = [];
  let generated = 0;

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const filename = `audio_${slugify(text)}_${i}.mp3`;
    const filePath = path.join(AUDIO_DIR, filename);
    const assetPath = `/assets/audio/${filename}`;

    audioMapEntries.push([text, assetPath]);

    if (fs.existsSync(filePath)) {
      console.log(`⏭  Skipping (exists): ${filename}`);
      continue;
    }

    if (API_KEY) {
      try {
        process.stdout.write(`🎙  Generating [${i + 1}/${phrases.length}] ${style}: "${text.slice(0, 48)}…" `);
        const buf = await generateAudio(text, style);
        fs.writeFileSync(filePath, buf);
        console.log(`✓ ${filename}`);
        generated++;
        await new Promise((r) => setTimeout(r, 400));
      } catch (err) {
        console.error(`\n❌  Failed: ${err.message}`);
      }
    }
  }

  const mapContent = `// src/utils/audioMap.js
// AUTO-GENERATED by scripts/generate_audio.js — do not edit by hand.
// Run \`npm run generate-audio\` to regenerate with API key.

export const audioMap = {
${audioMapEntries.map(([text, p]) => `  ${JSON.stringify(text)}: ${JSON.stringify(p)},`).join('\n')}
};

export default audioMap;
`;
  fs.writeFileSync(MAP_PATH, mapContent);

  console.log(`\n✅  Done. audioMap.js updated (${audioMapEntries.length} entries).`);
})();
