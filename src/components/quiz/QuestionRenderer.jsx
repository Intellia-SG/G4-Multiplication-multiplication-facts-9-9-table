// src/components/quiz/QuestionRenderer.jsx
import React from 'react';
import './QuestionRenderer.css';
import FactFamilyTriangle from '../FactFamilyTriangle.jsx';
import ArrayGrid from '../ArrayGrid.jsx';

function VisualDiagram({ visual, visualData }) {
  if (!visual || !visualData) return null;

  if (visual === 'triangle') {
    return (
      <div className="qr-visual-center">
        <FactFamilyTriangle
          product={visualData.product}
          factorA={visualData.factorA}
          factorB={visualData.factorB}
          missing={visualData.missing}
        />
      </div>
    );
  }

  if (visual === 'array') {
    return (
      <div className="qr-visual-center">
        <ArrayGrid
          groups={Math.min(visualData.factorA || 3, 7)}
          size={Math.min(visualData.factorB || 4, 9)}
          itemEmoji={visualData.itemEmoji || '🍎'}
          compact={true}
        />
      </div>
    );
  }

  if (visual === 'groups') {
    const groupsCount = Math.min(visualData.factorA || 3, 6);
    const inEach = Math.min(visualData.factorB || 4, 8);
    return (
      <div className="qr-groups-container">
        {Array.from({ length: groupsCount }).map((_, gIdx) => (
          <div key={gIdx} className="qr-group-box">
            <span className="qr-group-badge">Group {gIdx + 1}</span>
            <div className="qr-group-items">
              {Array.from({ length: inEach }).map((_, iIdx) => (
                <span key={iIdx} className="qr-group-item">{visualData.itemEmoji || '⭐'}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default function QuestionRenderer({
  question,
  onAnswer,
  hintsShown,
  showHint,
  onHint,
  isLocked,
  onPrev,
  onNext,
  canPrev
}) {
  if (!question) return null;

  const { category, questionText, options, visual, visualData, hint1, hint2 } = question;
  const categoryTag = category || 'MULTIPLICATION FACTS';

  return (
    <div className="qr-wrap glass-card">
      {/* Top category badge tag */}
      <div className="qr-category-badge">
        <span className="cat-icon">✖️</span> {categoryTag}
      </div>

      {/* Question text */}
      <p className="qr-question">{questionText}</p>

      {/* Visual aid if available */}
      {visual && visualData && (
        <div className="qr-visual">
          <VisualDiagram visual={visual} visualData={visualData} />
        </div>
      )}

      {/* Options — 2x2 grid */}
      <div className={`qr-options ${options?.length === 2 ? 'two-cols' : 'four-cols'}`}>
        {options?.map((opt, i) => (
          <button
            key={i}
            className="qr-option"
            onClick={() => !isLocked && onAnswer(opt)}
            disabled={isLocked}
            aria-label={`Option: ${opt}`}
          >
            <span className="qr-opt-text">{String(opt)}</span>
          </button>
        ))}
      </div>

      {/* Hint display */}
      {showHint === 1 && hint1 && (
        <div className="qr-hint anim-slide-up">
          <span className="hint-icon">💡</span>
          <span>{hint1}</span>
        </div>
      )}
      {showHint === 2 && hint2 && (
        <div className="qr-hint anim-slide-up">
          <span className="hint-icon">🔑</span>
          <span>{hint2}</span>
        </div>
      )}

      {/* Bottom Action Row: Hint Button + Prev + Next in one sleek bar */}
      <div className="qr-actions-row">
        {hintsShown < 2 && onHint ? (
          <button className="hint-btn" onClick={onHint} aria-label="Show hint">
            💡 Hint {hintsShown + 1}
          </button>
        ) : <div />}

        <div className="qr-nav-btns">
          {onPrev && (
            <button
              className="btn-outline qr-nav-btn"
              onClick={onPrev}
              disabled={!canPrev}
              aria-label="Previous question"
            >
              ← Prev
            </button>
          )}
          {onNext && (
            <button
              className="btn-primary qr-nav-btn"
              onClick={onNext}
              aria-label="Next question"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
