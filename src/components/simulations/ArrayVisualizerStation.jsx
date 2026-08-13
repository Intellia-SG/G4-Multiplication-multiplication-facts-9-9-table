// src/components/simulations/ArrayVisualizerStation.jsx
import React, { useState } from 'react';
import './Stations.css';
import { useAudio } from '../../hooks/useAudio.js';

const MISSIONS = [
  { id: 1, title: 'Paint a 4 × 6 array', targetRows: 4, targetCols: 6, targetProduct: 24, prompt: 'Tap or drag on the grid to highlight 4 rows and 6 columns!' },
  { id: 2, title: 'Paint an array totaling 28', targetRows: 4, targetCols: 7, targetProduct: 28, prompt: 'Highlight an array of rows & columns that equals 28 (e.g. 4 × 7 or 7 × 4)!' },
  { id: 3, title: 'Build a square array for 6 × 6', targetRows: 6, targetCols: 6, targetProduct: 36, prompt: 'Set both rows and columns to 6 to create a 36-item square array!' },
];

export default function ArrayVisualizerStation({ onComplete, audioEnabled }) {
  const [selectedRows, setSelectedRows] = useState(3);
  const [selectedCols, setSelectedCols] = useState(5);
  const [missionIdx, setMissionIdx] = useState(0);
  const [completedMissions, setCompletedMissions] = useState([false, false, false]);
  const [feedback, setFeedback] = useState('');
  const { sounds } = useAudio(audioEnabled);

  const product = selectedRows * selectedCols;
  const currentMission = MISSIONS[missionIdx];
  const allMissionsDone = completedMissions.every(Boolean);
  const hasCompletedAny = completedMissions.some(Boolean);

  function handleCellClick(r, c) {
    sounds.click();
    setSelectedRows(r + 1);
    setSelectedCols(c + 1);
    setFeedback('');
  }

  function handleCheckMission() {
    let success = false;
    if (missionIdx === 0 && ((selectedRows === 4 && selectedCols === 6) || (selectedRows === 6 && selectedCols === 4))) {
      success = true;
    } else if (missionIdx === 1 && product === 28) {
      success = true;
    } else if (missionIdx === 2 && selectedRows === 6 && selectedCols === 6) {
      success = true;
    }

    if (success) {
      sounds.correct();
      const updated = [...completedMissions];
      updated[missionIdx] = true;
      setCompletedMissions(updated);
      setFeedback('🎉 Target achieved! Excellent visual array modeling!');

      if (missionIdx < 2) {
        setTimeout(() => {
          setMissionIdx(missionIdx + 1);
          setFeedback('');
        }, 1200);
      }
    } else {
      sounds.wrong();
      setFeedback(`Keep adjusting! Currently: ${selectedRows} rows × ${selectedCols} cols = ${product} total.`);
    }
  }

  return (
    <div className="station-content-wrap anim-fade-in">
      {/* Header Info */}
      <div className="station-header-row">
        <div className="station-title-box">
          <h3 className="station-main-title">Station A · Array & Grid Visualizer Lab</h3>
          <p className="station-instruction">Tap any cell to paint an active multiplication array and see skip-counting live.</p>
        </div>
        <div className="mission-badge">
          Mission {missionIdx + 1} of 3
        </div>
      </div>

      {/* Mission Banner */}
      <div className="station-mission-card">
        <div>
          <span className="mission-text">🎯 Goal: <strong className="mission-highlight">{currentMission.title}</strong></span>
          <p style={{ margin: '2px 0 0 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{currentMission.prompt}</p>
        </div>
        <button
          className="btn-primary btn-sm"
          onClick={handleCheckMission}
        >
          Check Array ✓
        </button>
      </div>

      {feedback && (
        <div className="anim-slide-up" style={{ color: feedback.startsWith('🎉') ? '#86efac' : '#fde047', fontWeight: 800, fontSize: '0.92rem', textAlign: 'center' }}>
          {feedback}
        </div>
      )}

      {/* Dynamic Equation Banner */}
      <div className="equation-banner">
        <span className="highlight-num">{selectedRows} rows</span>
        <span>×</span>
        <span className="highlight-num">{selectedCols} cols</span>
        <span>=</span>
        <span className="highlight-num">{product} items</span>
      </div>

      {/* Interactive 7x8 Grid Canvas */}
      <div className="interactive-grid-canvas">
        {Array.from({ length: 7 }).map((_, r) => (
          <div key={r} className="grid-row-container">
            <span className="grid-row-label">R{r + 1}</span>
            {Array.from({ length: 8 }).map((_, c) => {
              const isActive = r < selectedRows && c < selectedCols;
              return (
                <span
                  key={c}
                  className={`grid-dot ${isActive ? '' : 'inactive'}`}
                  onClick={() => handleCellClick(r, c)}
                  title={`Tap to size: ${r + 1} rows × ${c + 1} cols`}
                >
                  {isActive ? '🍎' : '·'}
                </span>
              );
            })}
          </div>
        ))}

        {/* Skip-counting footer */}
        <div className="skip-count-row">
          {Array.from({ length: selectedCols }).map((_, c) => (
            <span key={c} className="skip-count-tag" title={`${c + 1} rows of ${selectedRows}`}>
              {(c + 1) * selectedRows}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Action: ONLY appears once student performs & completes the activity */}
      <div className="station-action-footer">
        {hasCompletedAny ? (
          <button
            className={allMissionsDone ? "btn-green anim-bounce-in" : "btn-primary anim-bounce-in"}
            onClick={() => {
              sounds.levelUp();
              onComplete();
            }}
          >
            {allMissionsDone ? "Complete Station A ✓" : "Finish Station A ✨"}
          </button>
        ) : (
          <div className="mission-locked-pill">
            🔒 Paint the array above & click "Check Array ✓" to unlock Station Completion!
          </div>
        )}
      </div>
    </div>
  );
}
