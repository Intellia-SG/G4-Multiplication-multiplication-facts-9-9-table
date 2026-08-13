// src/components/simulations/CommutativeFlipStation.jsx
import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

export default function CommutativeFlipStation({ onComplete, audioEnabled }) {
  const [activeMode, setActiveMode] = useState('flip'); // 'flip' | 'split'
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasRotated, setHasRotated] = useState(false);
  const [splitSelected, setSplitSelected] = useState({ partA: null, partB: null });
  const [feedback, setFeedback] = useState('');
  const { sounds } = useAudio(audioEnabled);

  // Flip Mode numbers
  const rows = isFlipped ? 8 : 3;
  const cols = isFlipped ? 3 : 8;
  const total = 24;

  // Split Mode numbers: 7 × 8 decomposed into (5 × 8) + (2 × 8) = 40 + 16 = 56
  const splitRows = 7;
  const splitCols = 8;
  const partARows = 5;
  const partBRows = 2;
  const correctPartA = 40;
  const correctPartB = 16;

  const isDecomposeSolved = splitSelected.partA === correctPartA && splitSelected.partB === correctPartB;
  const hasPerformedActivity = hasRotated || isDecomposeSolved;

  function handleRotate() {
    sounds.click();
    setIsFlipped(!isFlipped);
    setHasRotated(true);
    setFeedback(`🔄 Flipped! ${isFlipped ? '8 × 3' : '3 × 8'} = ${isFlipped ? '3 × 8' : '8 × 3'} = 24! Order changes, total stays 24!`);
  }

  function handleSelectSplitPart(part, val) {
    sounds.click();
    const updated = { ...splitSelected, [part]: val };
    setSplitSelected(updated);

    if (updated.partA === correctPartA && updated.partB === correctPartB) {
      sounds.correct();
      setFeedback('🎉 Incredible! (5 × 8 = 40) + (2 × 8 = 16) = 56! Decomposing makes 7 × 8 easy!');
    } else if (updated.partA !== null && updated.partB !== null) {
      sounds.wrong();
      setFeedback('Check the two partial products: 5 × 8 and 2 × 8!');
    }
  }

  return (
    <div className="station-content-wrap anim-fade-in">
      {/* Header Info */}
      <div className="station-header-row">
        <div className="station-title-box">
          <h3 className="station-main-title">Station B · Commutative Flip & Decompose Lab</h3>
          <p className="station-instruction">Experience why factor order never changes the product, and break down hard facts!</p>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className={`btn-sm ${activeMode === 'flip' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => { setActiveMode('flip'); setFeedback(''); }}
          >
            🔄 90° Factor Flip
          </button>
          <button
            className={`btn-sm ${activeMode === 'split' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => { setActiveMode('split'); setFeedback(''); }}
          >
            ✂️ Decompose 7×8
          </button>
        </div>
      </div>

      {activeMode === 'flip' ? (
        <>
          {/* Flip Mode */}
          <div className="station-mission-card">
            <div>
              <span className="mission-text">🎯 Activity: Tap <strong className="mission-highlight">Rotate 90°</strong> to swap rows & columns!</span>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Notice how the dots rotate into a new shape, but the total stays exactly 24.
              </p>
            </div>
            <button className="btn-primary btn-sm" onClick={handleRotate}>
              🔄 Rotate 90° ({rows}×{cols})
            </button>
          </div>

          {feedback && (
            <div className="anim-slide-up" style={{ color: '#86efac', fontWeight: 800, fontSize: '0.92rem', textAlign: 'center' }}>
              {feedback}
            </div>
          )}

          {/* Equation banner */}
          <div className="equation-banner">
            <span className="highlight-num">{rows} rows</span>
            <span>×</span>
            <span className="highlight-num">{cols} cols</span>
            <span>=</span>
            <span className="highlight-num">24 total</span>
            <span style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
              (3 × 8 = 8 × 3)
            </span>
          </div>

          {/* 2D Grid Canvas */}
          <div className="interactive-grid-canvas">
            {Array.from({ length: rows }).map((_, r) => (
              <div key={r} className="grid-row-container">
                <span className="grid-row-label">R{r + 1}</span>
                {Array.from({ length: cols }).map((_, c) => (
                  <span key={c} className="grid-dot">
                    ⭐
                  </span>
                ))}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Decompose / Split Mode */}
          <div className="station-mission-card">
            <div>
              <span className="mission-text">✂️ Break Apart: <strong className="mission-highlight">7 × 8 = (5 × 8) + (2 × 8)</strong></span>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Select the correct product for each colored section to solve 7 × 8!
              </p>
            </div>
          </div>

          {feedback && (
            <div className="anim-slide-up" style={{ color: feedback.startsWith('🎉') ? '#86efac' : '#fde047', fontWeight: 800, fontSize: '0.92rem', textAlign: 'center' }}>
              {feedback}
            </div>
          )}

          {/* Interactive Split Selectors */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#60a5fa', fontWeight: 800, fontSize: '0.92rem' }}>🟦 5 rows × 8 =</span>
              {[35, 40, 45].map((val) => (
                <button
                  key={val}
                  className={`btn-sm ${splitSelected.partA === val ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '5px 12px', minHeight: '32px' }}
                  onClick={() => handleSelectSplitPart('partA', val)}
                >
                  {val}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#f472b6', fontWeight: 800, fontSize: '0.92rem' }}>🟪 2 rows × 8 =</span>
              {[12, 16, 18].map((val) => (
                <button
                  key={val}
                  className={`btn-sm ${splitSelected.partB === val ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '5px 12px', minHeight: '32px' }}
                  onClick={() => handleSelectSplitPart('partB', val)}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Split Canvas */}
          <div className="interactive-grid-canvas">
            {Array.from({ length: splitRows }).map((_, r) => {
              const isPartB = r >= partARows;
              return (
                <div key={r} className="grid-row-container">
                  <span className="grid-row-label">R{r + 1}</span>
                  {Array.from({ length: splitCols }).map((_, c) => (
                    <span
                      key={c}
                      className={`grid-dot ${isPartB ? 'split-b' : 'split-a'}`}
                    >
                      {isPartB ? '🫐' : '🍓'}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Footer Action: ONLY appears once student performs & completes the activity */}
      <div className="station-action-footer">
        {hasPerformedActivity ? (
          <button
            className="btn-green anim-bounce-in"
            onClick={() => {
              sounds.levelUp();
              onComplete();
            }}
          >
            Complete Station B ✓
          </button>
        ) : (
          <div className="mission-locked-pill">
            🔒 Tap "Rotate 90°" or solve the Decompose Split above to unlock Station Completion!
          </div>
        )}
      </div>
    </div>
  );
}
