// src/components/simulations/FactTriangleStation.jsx
import React, { useState } from 'react';
import './Stations.css';
import FactFamilyTriangle from '../FactFamilyTriangle.jsx';
import { useAudio } from '../../hooks/useAudio.js';

const FACT_SETS = [
  { factorA: 6, factorB: 9, product: 54, missingSlot: 'product', challengeText: 'What is the top product: 6 × 9 = ?' },
  { factorA: 7, factorB: 8, product: 56, missingSlot: 'factorA', challengeText: 'What is the missing factor: ? × 8 = 56 (56 ÷ 8)?' },
  { factorA: 9, factorB: 4, product: 36, missingSlot: 'factorB', challengeText: 'What is the missing factor: 9 × ? = 36 (36 ÷ 9)?' },
];

export default function FactTriangleStation({ onComplete, audioEnabled }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [completedSets, setCompletedSets] = useState([false, false, false]);
  const [feedback, setFeedback] = useState('');
  const { sounds } = useAudio(audioEnabled);

  const currentFact = FACT_SETS[currentIdx];
  const correctVal = currentFact[currentFact.missingSlot];
  const hasSolvedAny = completedSets.some(Boolean);
  const allDone = completedSets.every(Boolean);

  const options = [correctVal, correctVal + 2, Math.max(1, correctVal - 2), correctVal + 4].sort(() => Math.random() - 0.5);

  function handleSelectOption(val) {
    if (val === correctVal) {
      sounds.correct();
      setRevealed(true);
      const updated = [...completedSets];
      updated[currentIdx] = true;
      setCompletedSets(updated);
      setFeedback(`🎉 Solved! ${currentFact.factorA} × ${currentFact.factorB} = ${currentFact.product}! Fact Family unlocked!`);

      if (currentIdx < 2) {
        setTimeout(() => {
          setCurrentIdx(currentIdx + 1);
          setRevealed(false);
          setFeedback('');
        }, 1300);
      }
    } else {
      sounds.wrong();
      setFeedback('Check the related multiplication or division clue and try again!');
    }
  }

  return (
    <div className="station-content-wrap anim-fade-in">
      {/* Header Info */}
      <div className="station-header-row">
        <div className="station-title-box">
          <h3 className="station-main-title">Station D · Fact Family & Division Link Lab</h3>
          <p className="station-instruction">Every 3 numbers form 2 multiplication and 2 related division facts!</p>
        </div>
        <div className="mission-badge">
          Family {currentIdx + 1} of 3
        </div>
      </div>

      {/* Mission Banner */}
      <div className="station-mission-card">
        <div>
          <span className="mission-text">🧩 Question: <strong className="mission-highlight">{currentFact.challengeText}</strong></span>
          <p style={{ margin: '2px 0 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Tap the correct number from choices to reveal the missing triangle node!
          </p>
        </div>
      </div>

      {feedback && (
        <div className="anim-slide-up" style={{ color: feedback.startsWith('🎉') ? '#86efac' : '#fde047', fontWeight: 800, fontSize: '0.92rem', textAlign: 'center' }}>
          {feedback}
        </div>
      )}

      {/* Triangle Interactive Area */}
      <div className="fact-triangle-interactive-wrap">
        <FactFamilyTriangle
          product={currentFact.product}
          factorA={currentFact.factorA}
          factorB={currentFact.factorB}
          missing={revealed ? 'none' : currentFact.missingSlot}
        />

        {/* 4 Connected Equations */}
        <div className="triangle-equations-grid">
          <div className={`eq-pill ${revealed ? 'highlight' : ''}`}>
            {currentFact.factorA} × {currentFact.factorB} = {revealed ? currentFact.product : (currentFact.missingSlot === 'product' ? '?' : currentFact.product)}
          </div>
          <div className={`eq-pill ${revealed ? 'highlight' : ''}`}>
            {currentFact.factorB} × {currentFact.factorA} = {revealed ? currentFact.product : (currentFact.missingSlot === 'product' ? '?' : currentFact.product)}
          </div>
          <div className={`eq-pill ${revealed ? 'highlight' : ''}`}>
            {revealed ? currentFact.product : (currentFact.missingSlot === 'product' ? '?' : currentFact.product)} ÷ {currentFact.factorA} = {revealed ? currentFact.factorB : (currentFact.missingSlot === 'factorB' ? '?' : currentFact.factorB)}
          </div>
          <div className={`eq-pill ${revealed ? 'highlight' : ''}`}>
            {revealed ? currentFact.product : (currentFact.missingSlot === 'product' ? '?' : currentFact.product)} ÷ {currentFact.factorB} = {revealed ? currentFact.factorA : (currentFact.missingSlot === 'factorA' ? '?' : currentFact.factorA)}
          </div>
        </div>

        {/* Selectable Options */}
        {!revealed && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '6px' }}>
            {options.map((opt, i) => (
              <button
                key={i}
                className="btn-outline"
                style={{ fontSize: '1.25rem', minWidth: '68px', padding: '6px 18px' }}
                onClick={() => handleSelectOption(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer Action: ONLY appears once student solves fact family mystery */}
      <div className="station-action-footer">
        {hasSolvedAny ? (
          <button
            className={allDone ? "btn-green anim-bounce-in" : "btn-primary anim-bounce-in"}
            onClick={() => {
              sounds.levelUp();
              onComplete();
            }}
          >
            {allDone ? "Complete All Simulations & Start Practicing! 🎮" : "Finish Lab D ✨"}
          </button>
        ) : (
          <div className="mission-locked-pill">
            🔒 Select the correct missing node above to unlock Station Completion!
          </div>
        )}
      </div>
    </div>
  );
}
