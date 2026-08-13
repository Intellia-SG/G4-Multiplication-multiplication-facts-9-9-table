# MultiplyQuest — Multiplication Facts up to 9×9

A gamified, narrated Grade 4 math module building fluency with multiplication
facts up to the 9×9 table, built on the same five-phase architecture (Wonder →
Story → Simulate → Play → Reflect) as the `equal-groups-main` reference
module. Aligned to Singapore MOE Primary 4 Mathematics syllabus.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build       # production build → dist/
npm run preview     # preview the production build locally
```

## What's in this module

- **Wonder** — 5 curiosity-hook questions about multiplication facts, one
  shown per visit.
- **Story** — "The Great School Fair Rush," a 4-slide narrated story
  introducing the commutative property (A × B = B × A) through Ravi, Zara,
  and Tally the Owl. Ships with placeholder illustrations sized 1672×941px
  (16:9) — see `src/assets/story/README.md` for the exact art brief per
  slide when your final artwork is ready; drop in replacement files with no
  code changes needed.
- **Simulate** — three hands-on stations, all with larger text/tap targets
  for readability: Equal Groups Builder (tap-to-build equal groups →
  running total), Flip the Factor (commutative / doubling / related-division
  challenges off one fact), Multiplication Sentence (fill-in-the-blank,
  number pad).
- **Play** — 100 procedurally generated questions across 10 question types
  (fact triangles, doubling strategy, sentence blanks, equal-groups word
  problems, arrays, skip-counting, true/false, mixed boss review), spread
  over 10 themed worlds (10 questions each, one per ×2–×9 table plus two
  mixed-review worlds), in 4 play modes (Guided, Independent, Timed, Boss
  Battle). Every question comes from `genFactPair()`, so every fact stays
  within the 9×9 scope. Text and buttons are enlarged here too, for easier
  reading and tapping during gameplay.
- **Reflect** — a 5-question recap quiz, a confidence check-in, and a summary
  of key takeaways.

Per the module spec, **only Simulate and Play use the enlarged font sizes /
touch targets** — Wonder, Story, Intro, and Reflect keep the original
reference-module sizing untouched.

## Audio pipeline

This module uses the same ElevenLabs-only narration pipeline as the
reference module (Alice voice, no browser-TTS fallback). `src/utils/
audioMap.js` ships intentionally empty — no API key was available in this
build environment — and narration silently skips; the app works perfectly
fine without it.

To generate narration audio:

1. Add `VITE_ELEVENLABS_API_KEY=your_key_here` to a `.env.local` file in the
   project root.
2. Run `npm run generate-audio`. This hits the ElevenLabs API for every
   phrase in `scripts/generate_audio.js`, saves `.mp3` files to
   `public/assets/audio/`, and rewrites `src/utils/audioMap.js`.
3. If you ever edit narration text in `src/utils/narration.js`, update the
   matching entry in `scripts/generate_audio.js`'s `phrases` array, re-run
   the generator, then optionally run `npm run clean-audio` to delete any
   now-orphaned `.mp3` files.

## Project structure

```
src/
  components/        Shared UI: Button, NumberPad, ArrayGrid, FactFamilyTriangle, ...
  config/             characters.config.js, worlds.config.js, audio.config.js
  core/
    audio/            useAudio.js — playback hook
    hooks/            useKeyboard.js, useViewport.js
    questions/        questionBank.js (100-question generator), questionFactory.js
  features/
    wonder/  story/  simulate/  play/  reflect/      One folder per phase
  styles/             design-tokens.css, globals.css, themes/
  utils/              audio.js (playback engine), narration.js, audioMap.js
scripts/              generate_audio.js, clean_audio.js
```

## Deployment

Deploys cleanly to Vercel (or any static host) — `vite.config.js` uses
`base: '/'` for a root deploy. Run `npm run build` and upload `dist/`.
