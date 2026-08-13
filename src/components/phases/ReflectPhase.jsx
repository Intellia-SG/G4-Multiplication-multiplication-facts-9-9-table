// src/components/phases/ReflectPhase.jsx
import React, { useState, useEffect, useRef } from 'react';
import './ReflectPhase.css';
import Mascot from '../shared/Mascot.jsx';
import { BADGES } from '../../utils/badgeEngine.js';
import { calcStars } from '../../utils/scoring.js';
import { useAudio } from '../../hooks/useAudio.js';
import { reflectNarration, reflectCompleteNarration } from '../../utils/narration.js';
import { generateSessionQuestions } from '../../utils/shuffle.js';
import questionBank from '../../data/questionBank.js';

const THEMED_SCENARIO_CARDS = [
  {
    id: 'pencil_factory',
    themeIcon: '✏️',
    themeName: 'Pencil Factory Packing Station',
    scenario: 'The factory supervisor is packing 6 large wooden crates. Each crate holds exactly 8 boxes of pencils.',
    question: 'Which multiplication equation gives the total boxes of pencils packed?',
    options: [
      '6 crates × 8 boxes = 48 boxes in total',
      '6 + 8 = 14 boxes',
      '8 - 6 = 2 boxes',
    ],
    correct: 0,
    takeaway: 'Equal groups (6 groups of 8) means 6 × 8 = 48!',
  },
  {
    id: 'apple_orchard',
    themeIcon: '🍎',
    themeName: 'Apple Orchard Harvest',
    scenario: 'Farmer Jack gathered 7 baskets with 9 crisp honeycrisp apples in each basket (7 × 9 = 63).',
    question: 'If Farmer Jack reorganizes them into 9 baskets with 7 apples each, what happens to the total?',
    options: [
      'The total stays 63 apples because 7 × 9 = 9 × 7 (Commutative Property)',
      'The total doubles to 126 apples',
      'The total decreases to 56 apples',
    ],
    correct: 0,
    takeaway: 'Commutative Property: flipping factor order (7×9 ↔ 9×7) keeps the product 63!',
  },
  {
    id: 'space_satellite',
    themeIcon: '🚀',
    themeName: 'Space Station Solar Array',
    scenario: 'A lunar space satellite has 54 high-power solar cells arranged in 6 equal rows.',
    question: 'Which related fact family pair reveals how many solar cells are in each column?',
    options: [
      '54 ÷ 6 = 9 cells in each column (since 6 × 9 = 54)',
      '54 - 6 = 48 cells',
      '54 + 6 = 60 cells',
    ],
    correct: 0,
    takeaway: 'Division and multiplication are opposites: 6 × 9 = 54 means 54 ÷ 6 = 9!',
  },
];

export default function ReflectPhase({ state, dispatch }) {
  const [answers, setAnswers]     = useState({});
  const [journal, setJournal]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { narrate, stopAll, sounds } = useAudio(state?.audioEnabled);
  const narrated = useRef(false);

  const totalCorrect = state?.districtCorrect?.reduce((s, c) => s + (c || 0), 0) || 0;
  const totalStars   = state?.districtScores?.reduce((s, sc) => {
    if (sc === null || sc === undefined) return s;
    return s + calcStars(sc);
  }, 0) || 0;

  useEffect(() => {
    if (!narrated.current) {
      narrated.current = true;
      narrate(reflectNarration());
    }
    dispatch({ type: 'COMPLETE_PHASE', payload: 'reflect' });
    return () => stopAll();
  }, [dispatch, narrate, stopAll]);

  function handleSelectOption(cardIdx, optIdx) {
    sounds.click();
    setAnswers(prev => ({ ...prev, [cardIdx]: optIdx }));
  }

  function handleSubmit() {
    setSubmitted(true);
    stopAll();
    sounds.badge();
    narrate(reflectCompleteNarration());
  }

  function playAgain() {
    dispatch({ type: 'RESET_SESSION' });
    dispatch({ type: 'LOAD_QUESTIONS', payload: generateSessionQuestions(questionBank) });
    dispatch({ type: 'SET_PHASE', payload: 'intro' });
  }

  const earnedBadges = BADGES.filter(b => (state?.badges || []).includes(b.id));

  if (submitted) {
    return (
      <div className="reflect-wrap">
        <div className="trophy-card glass-card anim-bounce-in">
          <div className="trophy-icon">🏆</div>
          <h1 className="trophy-title headline">You're a Multiplication Grand Master!</h1>
          <p className="trophy-sub subheadline" style={{ color: 'var(--gold)' }}>
            Multiplication Facts 9×9 Quest Complete ✅
          </p>

          {/* Stats Breakdown */}
          <div className="trophy-stats">
            <div className="trophy-stat">
              <span className="stat-value number-display">{totalCorrect}</span>
              <span className="stat-label label-text">/ 100 Questions</span>
            </div>
            <div className="trophy-stat">
              <span className="stat-value number-display">{state?.xp || 0}</span>
              <span className="stat-label label-text">XP Earned ⭐</span>
            </div>
            <div className="trophy-stat">
              <span className="stat-value number-display">{state?.maxStreak || 0}</span>
              <span className="stat-label label-text">Best Streak 🔥</span>
            </div>
          </div>

          {/* Stars */}
          <div className="trophy-stars">
            {[...Array(Math.min(Math.max(totalStars, 3), 30))].map((_, i) => (
              <span key={i} style={{ fontSize: '1.2rem', animationDelay: `${i * 0.05}s` }} className="anim-bounce-in">
                ⭐
              </span>
            ))}
          </div>

          {/* Badges */}
          {earnedBadges.length > 0 && (
            <div className="trophy-badges">
              <p className="label-text" style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '6px' }}>
                Badges Unlocked
              </p>
              <div className="badge-list">
                {earnedBadges.map(b => (
                  <div key={b.id} className="badge-pill">
                    <span style={{ fontSize: '1.2rem' }}>{b.icon}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: 800 }}>{b.label}</span>
                      <span className="badge-desc label-text">{b.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="trophy-actions">
            <button className="btn-primary trophy-cta" onClick={playAgain}>
              🔄 Play Again
            </button>
            <button className="btn-outline" onClick={() => dispatch({ type: 'SET_PHASE', payload: 'intro' })}>
              🏠 Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reflect-wrap">
      <div className="reflect-card glass-card anim-slide-up">
        <div className="reflect-header">
          <span className="reflect-badge">📓 Real-World Reflection & Scorecard</span>
          <h2 className="reflect-title subheadline">Reflect on Real-World Multiplication Scenarios</h2>
        </div>

        <Mascot mood="curious" message="Check your mastery with these themed real-world story scenarios!" size="sm" />

        {/* Themed Scenario Cards */}
        <div className="reflect-quiz-container">
          {THEMED_SCENARIO_CARDS.map((card, cIdx) => {
            const isSelected = answers[cIdx] !== undefined;
            const isCorrect = answers[cIdx] === card.correct;
            return (
              <div key={card.id} className="reflect-scenario-card">
                <div className="scenario-card-header">
                  <span className="scenario-theme-icon">{card.themeIcon}</span>
                  <span className="scenario-theme-title">{card.themeName}</span>
                </div>

                <p className="scenario-text">{card.scenario}</p>
                <p className="reflect-q-text">{card.question}</p>

                <div className="reflect-opt-row">
                  {card.options.map((opt, oIdx) => {
                    const selectedThis = answers[cIdx] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        className={`reflect-opt-btn ${selectedThis ? (isCorrect ? 'selected' : 'wrong-selected') : ''}`}
                        onClick={() => handleSelectOption(cIdx, oIdx)}
                      >
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {isSelected && (
                  <div className="scenario-takeaway anim-fade-in">
                    💡 <strong>Takeaway:</strong> {card.takeaway}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Journal Entry */}
        <div className="reflect-journal">
          <label className="reflect-label body-text" htmlFor="journal-input">
            Write one multiplication rule or strategy you feel most confident with:
          </label>
          <textarea
            id="journal-input"
            className="reflect-textarea"
            placeholder="e.g. 6 × 8 = 48 pencils in the factory, and 54 ÷ 6 = 9 on the solar array!"
            value={journal}
            onChange={e => setJournal(e.target.value)}
            rows={2}
            aria-label="Learning journal entry"
          />

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
            <span style={{ fontSize: '0.8rem', color: '#a0a0b8', alignSelf: 'center' }}>Quick insert:</span>
            {[
              '6 × 8 = 48 (Pencil Factory Packing)',
              '7 × 9 = 9 × 7 = 63 (Commutative Property)',
              '54 ÷ 6 = 9 (Fact Family Inverses)',
            ].map(ex => (
              <button
                key={ex}
                type="button"
                onClick={() => setJournal(ex)}
                className="quick-insert-btn"
              >
                ✨ {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Performance Snapshot */}
        <div className="reflect-stats">
          <div className="reflect-stat-pill">⭐ {state?.xp || 0} XP Earned</div>
          <div className="reflect-stat-pill">✅ {totalCorrect}/100 Correct</div>
          <div className="reflect-stat-pill">🔥 Best Streak: {state?.maxStreak || 0}</div>
        </div>

        <div className="reflect-actions">
          <button className="btn-primary" onClick={handleSubmit}>
            🌟 Submit Reflection & View Trophy Scorecard!
          </button>
        </div>
      </div>
    </div>
  );
}
