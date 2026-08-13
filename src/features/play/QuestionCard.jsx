// src/features/play/QuestionCard.jsx
import React from 'react';
import HintBubble from '../../components/HintBubble.jsx';
import FactFamilyTriangle from '../../components/FactFamilyTriangle.jsx';
import ArrayGrid from '../../components/ArrayGrid.jsx';

/**
 * Renders a single question card with topic badge, visual aid,
 * question text, option grid, optional hint, and mascot row.
 */
export default function QuestionCard({
  question,
  selected,
  confirmed,
  onSelect,
  showHint,
  worldAccent,
}) {
  const { type, questionText, visual, mixedVisual, options, correctAnswer, explanation,
    factorA, factorB, product, missingSlot, itemEmoji } = question;

  const topicLabel = type.replace(/([A-Z])/g, ' $1').trim().toLowerCase();
  const effectiveVisual = visual === 'mixed' ? mixedVisual : visual;

  return (
    <div className="question-card glass-card">
      {/* Topic badge */}
      <div className="topic-badge" style={{ borderColor: `${worldAccent}66`, color: worldAccent }}>
        {topicLabel}
      </div>

      {/* Question text */}
      <p className="question-text">{questionText}</p>

      {/* Visual aid */}
      {effectiveVisual === 'triangle' && (
        <div className="question-visual">
          <FactFamilyTriangle product={product} factorA={factorA} factorB={factorB} missing={missingSlot || 'none'} animated />
        </div>
      )}
      {(effectiveVisual === 'groups' || effectiveVisual === 'word') && (
        <div className="question-visual">
          <ArrayGrid groups={Math.min(factorA, 6)} size={Math.min(factorB, 6)} itemEmoji={itemEmoji || '🍎'} />
        </div>
      )}
      {effectiveVisual === 'array' && (
        <div className="question-visual">
          <ArrayGrid groups={Math.min(factorA, 6)} size={Math.min(factorB, 6)} itemEmoji="🟦" />
        </div>
      )}
      {(effectiveVisual === 'sentence' || effectiveVisual === 'truefalse') && (
        <div className="question-visual">
          <div className="number-sentence">
            <span className="ns-num">{missingSlot === 'factorA' ? '?' : factorA}</span>
            <span className="ns-op">×</span>
            <span className="ns-num">{missingSlot === 'factorB' ? '?' : factorB}</span>
            <span className="ns-op">=</span>
            <span className="ns-blank">{missingSlot === 'product' ? '?' : product}</span>
          </div>
        </div>
      )}

      {/* Hint */}
      {showHint && !confirmed && (
        <HintBubble>{question.hint1}</HintBubble>
      )}

      {/* Options */}
      <div className="options-grid">
        {options.map((opt) => {
          let cls = 'option-btn';
          if (confirmed) {
            if (opt === correctAnswer) cls += ' correct';
            else if (opt === selected) cls += ' wrong';
            else cls += ' disabled';
          } else if (selected === opt) {
            cls += ' selected';
          }
          return (
            <button key={opt} className={cls} onClick={() => onSelect(opt)} disabled={confirmed}>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explanation shown after confirmation */}
      {confirmed && explanation && (
        <div style={{
          marginTop: 14,
          padding: '10px 14px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 'var(--radius-md)',
          fontSize: '1rem',
          color: 'rgba(255,255,255,0.8)',
        }}>
          💡 {explanation}
        </div>
      )}

      {/* Mascot */}
      <div className="mascot-container" style={{ marginTop: 16 }}>
        <span className="mascot" aria-hidden="true">🦉</span>
        <div className="speech-bubble">
          {confirmed
            ? selected === correctAnswer
              ? "Brilliant! You got it! 🎉"
              : "Keep trying! You'll get it! 💪"
            : "Think about the multiplication fact…"}
        </div>
      </div>
    </div>
  );
}
