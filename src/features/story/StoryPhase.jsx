// src/features/story/StoryPhase.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CharacterDialogue from './CharacterDialogue.jsx';
import Button from '../../components/Button.jsx';
import { STORY_SLIDES } from './storyScripts/slides.js';
import { storyNarrations } from '../../utils/narration.js';

// ── Story slide images — drop into src/assets/story/ as 1.png – 4.png ──
// Vite resolves these at build time via ES module imports (same pattern as
// the equal-groups reference); the onError fallback below handles any
// missing file gracefully so the slide never hard-errors at runtime.
import story1 from '../../assets/story/1.png';
import story2 from '../../assets/story/2.png';
import story3 from '../../assets/story/3.png';
import story4 from '../../assets/story/4.png';

const SLIDE_IMAGES = [story1, story2, story3, story4];

const CHAR_DIALOGUE = [
  '"Zara, can you help me figure this out without counting every chair?" — Ravi 🪑',
  '"You don\'t need to count one by one — just remember the multiplication fact!" — Zara ✖️',
  '"Once you know one fact, you actually know its flip too!" — Tally the Owl 🦉',
  '"Now I\'ll use my multiplication facts instead of counting everything one by one!" — Ravi 🚀',
];

// Per-slide image with graceful error-fallback to a placeholder
function SlideImage({ src, alt }) {
  const [errored, setErrored] = useState(false);
  useEffect(() => { setErrored(false); }, [src]);

  if (errored) {
    return (
      <div className="story-image-placeholder">
        <span className="story-image-placeholder-icon">🖼️</span>
        <span>Image coming soon</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className="story-image"
      onError={() => setErrored(true)}
    />
  );
}

export default function StoryPhase({ onComplete, playNarration, stop }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection]       = useState(1);
  const narrationSlideRef = useRef(-1);

  const total  = STORY_SLIDES.length;
  const slide  = STORY_SLIDES[currentSlide];
  const isLast = currentSlide === total - 1;

  // Fire narration on each slide
  useEffect(() => {
    const seg = storyNarrations.multiplicationFacts[currentSlide];
    if (seg) {
      narrationSlideRef.current = currentSlide;
      playNarration?.([seg]);
    }
    return () => { stop?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlide]);

  const goTo = (idx) => {
    stop?.();
    setDirection(idx > currentSlide ? 1 : -1);
    setCurrentSlide(idx);
  };
  const goNext = () => (isLast ? onComplete?.() : goTo(currentSlide + 1));
  const goBack = () => currentSlide > 0 && goTo(currentSlide - 1);

  return (
    <div className="story-screen">
      <div className="story-card glass-card">

        {/* ── Slide image ── */}
        <div className="story-image-full">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.35 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              style={{ width: '100%', height: '100%' }}
            >
              <SlideImage src={SLIDE_IMAGES[currentSlide]} alt={slide.title} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Scrollable text content ── */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            initial={{ opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 24 }}
            transition={{ duration: 0.26 }}
            className="story-content"
          >
            <h2 className="story-title">{slide.title}</h2>
            <p className="story-body">{slide.text}</p>
            {slide.highlight && (
              <div className="story-highlight">{slide.highlight}</div>
            )}
            {slide.answer && <p className="story-answer">💡 {slide.answer}</p>}
            <CharacterDialogue slideIndex={currentSlide} text={CHAR_DIALOGUE[currentSlide]} />
          </motion.div>
        </AnimatePresence>

        {/* ── Navigation bar (never scrolls away — flex-shrink: 0) ── */}
        <div className="story-nav">
          <Button variant="outline" size="sm" onClick={goBack} disabled={currentSlide === 0}>
            ← Back
          </Button>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div className="story-dots">
              {STORY_SLIDES.map((_, i) => (
                <button
                  key={i}
                  className={`story-dot ${i === currentSlide ? 'active' : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              {currentSlide + 1} / {total}
            </span>
          </div>

          <Button variant="primary" size="sm" onClick={goNext}>
            {isLast ? 'Simulate! 🧪' : 'Next →'}
          </Button>
        </div>

      </div>
    </div>
  );
}
