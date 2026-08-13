// src/components/phases/StoryPhase.jsx
import React, { useEffect, useState } from 'react';
import './StoryPhase.css';
import { STORY_PANELS } from '../../data/storyContent.js';
import { useAudio } from '../../hooks/useAudio.js';
import { storyNarration } from '../../utils/narration.js';

function StoryImage({ panel }) {
  const [imgSrc, setImgSrc] = useState(`/assets/images/story_${panel.panel}.png`);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgSrc(`/assets/images/story_${panel.panel}.png`);
    setImgError(false);
  }, [panel.panel]);

  function handleError() {
    if (imgSrc.endsWith('.png')) {
      setImgSrc(`/assets/images/story_${panel.panel}.jpg`);
    } else {
      setImgError(true);
    }
  }

  return (
    <div className="story-image-container">
      {!imgError ? (
        <img
          key={panel.panel}
          src={imgSrc}
          alt={panel.title}
          onError={handleError}
          className="story-full-img"
        />
      ) : (
        <div className="story-img-fallback" style={{ background: panel.imageBg }}>
          <span className="fallback-emoji">{panel.imageEmoji}</span>
          <span className="fallback-title">{panel.title}</span>
          <span className="fallback-highlight">{panel.highlight}</span>
        </div>
      )}
    </div>
  );
}

export default function StoryPhase({ state, dispatch }) {
  const panel = STORY_PANELS[state?.storyPanel || 0] || STORY_PANELS[0];
  const { narrate, stopAll } = useAudio(state?.audioEnabled);
  const totalPanels = STORY_PANELS.length;
  const currentPanelIdx = state?.storyPanel || 0;
  const isLastPanel = currentPanelIdx >= totalPanels - 1;

  useEffect(() => {
    stopAll();
    const timer = setTimeout(() => narrate(storyNarration(currentPanelIdx)), 300);
    return () => { clearTimeout(timer); stopAll(); };
  }, [currentPanelIdx, narrate, stopAll]);

  function handleNext() {
    stopAll();
    dispatch({ type: 'NEXT_STORY_PANEL' });
  }

  function handlePrev() {
    stopAll();
    dispatch({ type: 'PREV_STORY_PANEL' });
  }

  return (
    <div className="story-wrap">
      <div className="story-container anim-slide-up" key={currentPanelIdx}>
        {/* Top Progress Bar Row */}
        <div className="story-progress-bar-row">
          <div className="story-track">
            <div
              className="story-fill"
              style={{ width: `${((currentPanelIdx + 1) / totalPanels) * 100}%` }}
            />
          </div>
          <span className="story-counter-text">{currentPanelIdx + 1} / {totalPanels}</span>
        </div>

        {/* Main Horizontal Story Card */}
        <div className="story-main-card">
          {/* Left: Complete Image in 16:9 frame */}
          <div className="story-image-section">
            <StoryImage panel={panel} />
          </div>

          {/* Right: Story Content */}
          <div className="story-content-section">
            <h2 className="story-title">{panel.title}</h2>
            <p className="story-text">{panel.text}</p>

            {panel.highlight && (
              <div className="story-prompt-pill">
                <span className="prompt-icon">💡</span>
                <span className="prompt-text">{panel.highlight}</span>
              </div>
            )}

            {/* Character Badge */}
            <div className="story-character-badge">
              <div className="character-avatar-circle">
                <span className="character-emoji">{panel.characterEmoji || '🦉'}</span>
              </div>
              <span className="character-name">{panel.character} · {panel.characterRole}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Centered Dots + Right Next Button */}
        <div className="story-footer-nav">
          <div className="story-dots-center">
            {STORY_PANELS.map((_, i) => (
              <span
                key={i}
                className={`story-nav-dot ${i === currentPanelIdx ? 'active' : ''} ${i < currentPanelIdx ? 'done' : ''}`}
              />
            ))}
          </div>

          <div className="story-nav-actions">
            {currentPanelIdx > 0 && (
              <button
                type="button"
                id="story-prev-btn"
                className="btn-outline story-prev-btn"
                onClick={handlePrev}
                aria-label="Previous story"
              >
                ← Previous
              </button>
            )}
            <button
              type="button"
              id="story-next-btn"
              className="btn-primary story-next-btn"
              onClick={handleNext}
              aria-label={isLastPanel ? 'Start Simulating' : 'Next story'}
            >
              {!isLastPanel ? 'Next →' : 'Start Simulating! 🧪'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
