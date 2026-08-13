// src/components/simulations/EqualGroupsJumperStation.jsx
import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

export default function EqualGroupsJumperStation({ onComplete, audioEnabled }) {
  const [activeTab, setActiveTab] = useState('hopper'); // 'hopper' | 'packer'
  const [currentHops, setCurrentHops] = useState(0);
  const [hopSize] = useState(7);
  const targetLanding = 42;
  const [hasHoppedTarget, setHasHoppedTarget] = useState(false);

  // Packer Mode
  const numChests = 5;
  const [gemsPerChest, setGemsPerChest] = useState(2);
  const targetPackGems = 35; // 5 * 7 = 35
  const [hasPackedTarget, setHasPackedTarget] = useState(false);

  const [feedback, setFeedback] = useState('');
  const { sounds } = useAudio(audioEnabled);

  const currentLanding = currentHops * hopSize;
  const maxLine = 56;
  const currentTotalGems = numChests * gemsPerChest;
  const hasPerformedActivity = hasHoppedTarget || hasPackedTarget;

  function handleHopOnce() {
    sounds.click();
    if (currentLanding + hopSize > maxLine) return;
    const nextHops = currentHops + 1;
    setCurrentHops(nextHops);

    const nextLanding = nextHops * hopSize;
    if (nextLanding === targetLanding) {
      sounds.correct();
      setHasHoppedTarget(true);
      setFeedback(`🎉 Target Reached! ${nextHops} jumps of ${hopSize} = ${targetLanding}! Exactly on mark!`);
    } else if (nextLanding > targetLanding) {
      sounds.wrong();
      setFeedback(`Overshot target 42! Landed on ${nextLanding}. Tap 'Reset' to try again.`);
    } else {
      setFeedback(`Hop ${nextHops}: Landed on ${nextLanding} (${nextHops} × ${hopSize} = ${nextLanding})`);
    }
  }

  function handleResetHops() {
    sounds.click();
    setCurrentHops(0);
    setFeedback('');
  }

  function handleAddGem() {
    sounds.click();
    if (gemsPerChest >= 9) return;
    const next = gemsPerChest + 1;
    setGemsPerChest(next);

    const nextTotal = numChests * next;
    if (nextTotal === targetPackGems) {
      sounds.correct();
      setHasPackedTarget(true);
      setFeedback(`🎉 Perfect Packaging! 5 chests × ${next} gems = ${targetPackGems} total gems!`);
    } else {
      setFeedback(`Now: 5 chests with ${next} gems each = ${nextTotal} gems.`);
    }
  }

  function handleRemoveGem() {
    sounds.click();
    if (gemsPerChest <= 1) return;
    const next = gemsPerChest - 1;
    setGemsPerChest(next);
    setFeedback(`Now: 5 chests with ${next} gems each = ${numChests * next} gems.`);
  }

  return (
    <div className="station-content-wrap anim-fade-in">
      {/* Header Info */}
      <div className="station-header-row">
        <div className="station-title-box">
          <h3 className="station-main-title">Station C · Equal Groups & Number Line Lab</h3>
          <p className="station-instruction">Experience how repeated addition steps build multiplication totals!</p>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            className={`btn-sm ${activeTab === 'hopper' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => { setActiveTab('hopper'); setFeedback(''); }}
          >
            🦘 Hop to 42
          </button>
          <button
            className={`btn-sm ${activeTab === 'packer' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => { setActiveTab('packer'); setFeedback(''); }}
          >
            📦 Pack 35 Gems
          </button>
        </div>
      </div>

      {activeTab === 'hopper' ? (
        <>
          {/* Hopper Mission Card */}
          <div className="station-mission-card">
            <div>
              <span className="mission-text">🎯 Target: Reach <strong className="mission-highlight">42</strong> in jumps of 7!</span>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Tap 'Hop (+7)' repeatedly to jump Toby along the number line to the target.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button className="btn-primary btn-sm" onClick={handleHopOnce}>
                🦘 Hop (+7)
              </button>
              <button className="btn-outline btn-sm" onClick={handleResetHops}>
                ↺ Reset
              </button>
            </div>
          </div>

          {feedback && (
            <div className="anim-slide-up" style={{ color: feedback.startsWith('🎉') ? '#86efac' : '#fde047', fontWeight: 800, fontSize: '0.92rem', textAlign: 'center' }}>
              {feedback}
            </div>
          )}

          {/* Equation Banner */}
          <div className="equation-banner">
            <span className="highlight-num">{currentHops} hops</span>
            <span>×</span>
            <span className="highlight-num">{hopSize} step</span>
            <span>=</span>
            <span className="highlight-num">Landed on {currentLanding}</span>
          </div>

          {/* Number Line */}
          <div className="number-line-container">
            <div className="number-line-track">
              {/* Target Marker */}
              <div
                style={{
                  position: 'absolute',
                  left: `${(targetLanding / maxLine) * 100}%`,
                  top: '-24px',
                  transform: 'translateX(-50%)',
                  background: 'rgba(34, 197, 94, 0.3)',
                  border: '1.5px solid #22c55e',
                  borderRadius: '6px',
                  padding: '1px 5px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  color: '#86efac',
                }}
              >
                Target 42 🏁
              </div>

              {/* Tick Marks */}
              {Array.from({ length: 9 }).map((_, i) => {
                const val = i * 7;
                const pct = (val / maxLine) * 100;
                return (
                  <div key={i} className="number-line-tick" style={{ left: `${pct}%` }}>
                    <span className="number-line-label">{val}</span>
                  </div>
                );
              })}

              {/* Toby Hopper */}
              <div
                className="number-line-landing"
                style={{ left: `${Math.min(100, (currentLanding / maxLine) * 100)}%` }}
                title={`Toby is at ${currentLanding}`}
              >
                🦉
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Packer Mission Card */}
          <div className="station-mission-card">
            <div>
              <span className="mission-text">🎯 Target: Pack <strong className="mission-highlight">35 gems</strong> into 5 chests!</span>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Add or remove gems per chest until the 5 chests total 35 gems (5 × 7 = 35).
              </p>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button className="btn-primary btn-sm" onClick={handleAddGem}>
                +1 Gem/Chest
              </button>
              <button className="btn-outline btn-sm" onClick={handleRemoveGem}>
                -1 Gem/Chest
              </button>
            </div>
          </div>

          {feedback && (
            <div className="anim-slide-up" style={{ color: feedback.startsWith('🎉') ? '#86efac' : '#fde047', fontWeight: 800, fontSize: '0.92rem', textAlign: 'center' }}>
              {feedback}
            </div>
          )}

          {/* Equation Banner */}
          <div className="equation-banner">
            <span className="highlight-num">5 chests</span>
            <span>×</span>
            <span className="highlight-num">{gemsPerChest} gems</span>
            <span>=</span>
            <span className="highlight-num">{currentTotalGems} gems total</span>
          </div>

          {/* Chests Display */}
          <div className="qr-groups-container">
            {Array.from({ length: numChests }).map((_, c) => (
              <div key={c} className="qr-group-box">
                <span className="qr-group-badge">Chest {c + 1}</span>
                <div className="qr-group-items">
                  {Array.from({ length: gemsPerChest }).map((_, g) => (
                    <span key={g} className="qr-group-item">💎</span>
                  ))}
                </div>
              </div>
            ))}
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
            Complete Station C ✓
          </button>
        ) : (
          <div className="mission-locked-pill">
            🔒 Hop Toby to target 42 or pack 35 gems into 5 chests to unlock Station Completion!
          </div>
        )}
      </div>
    </div>
  );
}
