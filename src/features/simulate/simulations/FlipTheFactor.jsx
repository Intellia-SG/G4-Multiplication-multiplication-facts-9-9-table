// src/features/simulate/simulations/FlipTheFactor.jsx
//
// Learning goal: multiplication facts can be FLIPPED and EXTENDED.
// Three-phase flow per round:
//   1. KNOW IT   — display the multiplication fact clearly
//   2. FLIP IT   — show a related challenge with a blank + 4 option buttons
//   3. FAMILY    — reveal the related facts after answering
//
// Rounds rotate through three skills: commutative order, doubling a known
// fact, and the related division fact — all tied back to the same
// A × B = C multiplication fact. Large, clear text cards and big tap
// targets throughout (Simulate phase font sizes are intentionally larger).

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../../components/Button.jsx';
import { sounds } from '../../../utils/audio.js';
import { genFactPair, generateDistractors, pick } from '../../../core/questions/questionBank.js';

const ROUNDS = 3;

// Each round rotates the "which flip to ask" pattern:
//   0 → commutative:      B × A = ?     (order doesn't matter)
//   1 → double:            2A × B = ?    (doubling a known fact)
//   2 → relatedDivision:   C ÷ A = ?     (the inverse fact)
const PATTERNS = ['commutative', 'double', 'relatedDivision'];
const SMALL_FACTORS = [2, 3, 4]; // keeps the doubled factor within the ×9 scope

function genRound(roundIdx) {
  const pattern = PATTERNS[roundIdx % PATTERNS.length];

  if (pattern === 'double') {
    const A = pick(SMALL_FACTORS);
    const B = genFactPair(1).factorB;
    const C = A * B;
    const doubledA = A * 2;
    const answer = doubledA * B;
    return {
      A, B, C, pattern, doubledA,
      question: `${doubledA} × ${B} = ?`,
      answer, options: generateDistractors(answer, 1, 90),
    };
  }

  const { factorA: A, factorB: B, product: C } = genFactPair(1);
  if (pattern === 'commutative') {
    return { A, B, C, pattern, question: `${B} × ${A} = ?`, answer: C, options: generateDistractors(C, 1, 90) };
  }
  // relatedDivision
  return { A, B, C, pattern, question: `${C} ÷ ${A} = ?`, answer: B, options: generateDistractors(B, 1, 9) };
}

// ── Visual helpers ──────────────────────────────────────────────────────────

function MultFactCard({ A, B, C }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(74,144,217,0.22), rgba(124,92,191,0.22))',
      border: '2px solid rgba(74,144,217,0.45)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 22px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)',
        fontFamily: 'var(--font-display)', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
        ✖️  Multiplication Fact
      </div>
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: '2.5rem', letterSpacing: '0.05em', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
      }}>
        <span style={{ color: '#4A90D9' }}>{A}</span>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.6rem' }}>×</span>
        <span style={{ color: '#FF8A50' }}>{B}</span>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.6rem' }}>=</span>
        <span style={{ color: 'var(--gold)' }}>{C}</span>
      </div>
      <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.45)',
        marginTop: 8, fontStyle: 'italic' }}>
        {A} groups of {B} = {C} total
      </div>
    </div>
  );
}

function FactFamilyReveal({ A, B, C, pattern, doubledA }) {
  if (pattern === 'double') {
    const doubledC = doubledA * (C / A);
    const B2 = C / A;
    return (
      <div style={{
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 'var(--radius-md)', padding: '14px 18px',
      }}>
        <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)',
          fontFamily: 'var(--font-display)', fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
          🧩 Doubling Pattern
        </div>
        {[
          { txt: `${A} × ${B2} = ${C}`, highlight: false },
          { txt: `${doubledA} × ${B2} = ${doubledC}`, highlight: true },
        ].map((f, i) => (
          <div key={i} style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: '1.2rem', padding: '5px 0',
            color: f.highlight ? 'var(--gold)' : 'rgba(255,255,255,0.75)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>{f.txt}</span>
            {f.highlight && <span style={{ fontSize: '0.95rem' }}>✓</span>}
          </div>
        ))}
      </div>
    );
  }

  const facts = [
    { txt: `${A} × ${B} = ${C}`, highlight: false },
    { txt: `${B} × ${A} = ${C}`, highlight: pattern === 'commutative' },
    { txt: `${C} ÷ ${A} = ${B}`, highlight: pattern === 'relatedDivision' },
    { txt: `${C} ÷ ${B} = ${A}`, highlight: false },
  ];
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 'var(--radius-md)',
      padding: '14px 18px',
    }}>
      <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)',
        fontFamily: 'var(--font-display)', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
        🧩 Complete Fact Family
      </div>
      {facts.map((f, i) => (
        <div key={i} style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: '1.2rem', padding: '5px 0',
          color: f.highlight ? 'var(--gold)' : 'rgba(255,255,255,0.75)',
          borderBottom: i < facts.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span>{f.txt}</span>
          {f.highlight && <span style={{ fontSize: '0.95rem' }}>✓</span>}
        </div>
      ))}
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────

export default function FlipTheFactor({ onComplete }) {
  const [round, setRound]         = useState(0);
  const [setup, setSetup]         = useState(null);
  const [step, setStep]           = useState('know');  // 'know' | 'flip' | 'family'
  const [selected, setSelected]   = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore]         = useState(0);

  const newRound = (idx) => {
    setSetup(genRound(idx));
    setStep('know');
    setSelected(null);
    setConfirmed(false);
  };

  useEffect(() => { newRound(0); }, []);
  if (!setup) return null;

  const isCorrect = selected === setup.answer;

  const handleConfirm = () => {
    if (!selected || confirmed) return;
    setConfirmed(true);
    if (isCorrect) { sounds.correct(); setScore(s => s + 1); } else { sounds.wrong(); }
  };

  const handleNext = () => {
    const next = round + 1;
    if (next >= ROUNDS) { onComplete?.(score); return; }
    setRound(next);
    newRound(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 10 }}>

      {/* ── Round header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
        fontSize: '0.9rem', color: 'var(--color-text-muted)',
        fontFamily: 'var(--font-display)', fontWeight: 700, flexShrink: 0 }}>
        <span>Round {round + 1} / {ROUNDS}</span>
        <span>Score: {score} / {round}</span>
      </div>

      {/* ── STEP 1: KNOW IT ── */}
      {step === 'know' && (
        <AnimatePresence mode="wait">
          <motion.div key="know" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ textAlign: 'center', fontFamily: 'var(--font-display)',
              fontWeight: 700, fontSize: '1.02rem', color: 'rgba(255,255,255,0.65)' }}>
              🦉 First, learn this fact:
            </div>
            <MultFactCard A={setup.A} B={setup.B} C={setup.C} />
            <div style={{
              background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)',
              padding: '12px 16px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.5)',
              fontFamily: 'var(--font-display)', fontWeight: 600, textAlign: 'center',
            }}>
              Remember this fact — you can flip it or use it to find a new one!
            </div>
            <Button variant="primary" size="sm" onClick={() => setStep('flip')}
              style={{ width: '100%' }}>
              Got it! Now flip it 🔁
            </Button>
          </motion.div>
        </AnimatePresence>
      )}

      {/* ── STEP 2: FLIP IT ── */}
      {step === 'flip' && (
        <AnimatePresence mode="wait">
          <motion.div key="flip" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* Mult fact reference — smaller */}
            <div style={{
              background: 'rgba(74,144,217,0.1)', border: '1px solid rgba(74,144,217,0.25)',
              borderRadius: 'var(--radius-md)', padding: '9px 16px',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.02rem',
              color: 'rgba(255,255,255,0.55)', textAlign: 'center',
            }}>
              ✖️ You know: {setup.A} × {setup.B} = {setup.C}
            </div>

            {/* Arrow */}
            <div style={{ textAlign: 'center', fontSize: '1.35rem' }}>🔁 Now flip it!</div>

            {/* Challenge — large */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,138,80,0.18), rgba(255,193,7,0.14))',
              border: '2px solid rgba(255,138,80,0.45)',
              borderRadius: 'var(--radius-lg)', padding: '18px 22px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)',
                fontFamily: 'var(--font-display)', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                {setup.pattern === 'relatedDivision' ? '➗  Related Fact' : '✖️  Related Fact'}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.3rem',
                color: '#fff', letterSpacing: '0.04em',
              }}>
                {setup.question}
              </div>
            </div>

            {/* Option buttons — large tap targets */}
            <div className="options-grid">
              {setup.options.map(opt => (
                <button
                  key={opt}
                  className={`option-btn${
                    confirmed
                      ? opt === setup.answer ? ' correct' : opt === selected ? ' wrong' : ' disabled'
                      : selected === opt ? ' selected' : ''
                  }`}
                  onClick={() => { if (!confirmed) setSelected(opt); }}
                  disabled={confirmed}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* Confirm / result */}
            {!confirmed && (
              <Button variant="primary" size="sm" onClick={handleConfirm}
                disabled={!selected} style={{ width: '100%' }}>
                Check ✓
              </Button>
            )}

            {confirmed && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{
                  padding: '11px 16px', borderRadius: 'var(--radius-md)', marginBottom: 8,
                  background: isCorrect ? 'rgba(0,230,118,0.12)' : 'rgba(255,82,82,0.12)',
                  border: `1.5px solid ${isCorrect ? 'rgba(0,230,118,0.4)' : 'rgba(255,82,82,0.4)'}`,
                  fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: '1.02rem', textAlign: 'center',
                }}>
                  {isCorrect ? `🎉 Correct! ${setup.question.replace('?', setup.answer)}` : `❌ Answer: ${setup.answer}`}
                </div>
                <Button variant="outline" size="sm" onClick={() => setStep('family')}
                  style={{ width: '100%' }}>
                  See the related facts 🧩
                </Button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* ── STEP 3: FAMILY REVEAL ── */}
      {step === 'family' && (
        <AnimatePresence mode="wait">
          <motion.div key="family" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ textAlign: 'center', fontFamily: 'var(--font-display)',
              fontWeight: 700, fontSize: '1.02rem', color: 'rgba(255,255,255,0.65)' }}>
              🦉 One multiplication fact → many related facts!
            </div>
            <FactFamilyReveal A={setup.A} B={setup.B} C={setup.C} pattern={setup.pattern} doubledA={setup.doubledA} />
            <Button variant="primary" size="sm" onClick={handleNext} style={{ width: '100%' }}>
              {round + 1 >= ROUNDS ? 'Finish ⭐' : 'Next Round →'}
            </Button>
          </motion.div>
        </AnimatePresence>
      )}

    </div>
  );
}
