// src/features/simulate/simulations/EqualGroupsBuilder.jsx
//
// Learning goal: experience multiplication as EQUAL GROUPS building up to a total.
// Students tap to add one equal group at a time, watch the running total grow,
// then identify the multiplication sentence for the finished array of groups.
//
// Key visual: emoji items appear inside each new group as it's added so the
// student can literally count the equal groups before selecting the answer.

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/Button.jsx';
import { sounds } from '../../../utils/audio.js';
import { randInt, generateDistractors } from '../../../core/questions/questionBank.js';

const ROUNDS = 3;

// Context objects: item emoji + container emoji + labels
const CONTEXTS = [
  { item: '⭐', container: '📄', itemName: 'stickers',    boxName: 'sheets' },
  { item: '🤖', container: '📦', itemName: 'robot parts', boxName: 'crates' },
  { item: '🧁', container: '🍽️', itemName: 'cupcakes',    boxName: 'trays'  },
  { item: '🔵', container: '👜', itemName: 'marbles',     boxName: 'bags'   },
  { item: '🐚', container: '🫙', itemName: 'seashells',   boxName: 'jars'   },
];

function genRound() {
  const numGroups = randInt(2, 5);
  const groupSize = randInt(2, 6);   // keeps visuals manageable, max 5×6 = 30
  const product = numGroups * groupSize;
  return { numGroups, groupSize, product };
}

export default function EqualGroupsBuilder({ onComplete }) {
  const [round, setRound]         = useState(0);
  const [setup, setSetup]         = useState(null);
  const [ctx, setCtx]             = useState(null);
  const [groups, setGroups]       = useState([]);      // array of item-arrays, one per built group
  const [phase, setPhase]         = useState('building'); // 'building' | 'answering'
  const [selected, setSelected]   = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [options, setOptions]     = useState([]);
  const [score, setScore]         = useState(0);
  const intervalRef = useRef(null);

  const stopAuto = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  const startNewRound = (idx) => {
    stopAuto();
    const s = genRound();
    const c = CONTEXTS[idx % CONTEXTS.length];
    setSetup(s);
    setCtx(c);
    setGroups([]);
    setPhase('building');
    setSelected(null);
    setConfirmed(false);
    setOptions(generateDistractors(s.product, 1, 40));
  };

  useEffect(() => {
    startNewRound(0);
    return stopAuto;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!setup || !ctx) return null;

  const allBuilt = phase === 'answering';
  const isCorrect = selected === setup.product;
  const runningTotal = groups.length * setup.groupSize;

  // Add one new equal group, filled with groupSize items
  const addGroup = () => {
    if (groups.length >= setup.numGroups) return;
    sounds.click();
    const newGroup = Array.from({ length: setup.groupSize }, () => ctx.item);
    setGroups(prev => {
      const next = [...prev, newGroup];
      if (next.length === setup.numGroups) setPhase('answering');
      return next;
    });
  };

  // Auto-build all remaining groups at a steady pace
  const addAllGroups = () => {
    if (groups.length >= setup.numGroups || intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setGroups(prev => {
        if (prev.length >= setup.numGroups) { stopAuto(); return prev; }
        const next = [...prev, Array.from({ length: setup.groupSize }, () => ctx.item)];
        sounds.click();
        if (next.length === setup.numGroups) { stopAuto(); setPhase('answering'); }
        return next;
      });
    }, 450);
  };

  const handleConfirm = () => {
    if (!selected || confirmed) return;
    setConfirmed(true);
    if (isCorrect) { sounds.correct(); setScore(s => s + 1); } else { sounds.wrong(); }
  };

  const handleNext = () => {
    const next = round + 1;
    if (next >= ROUNDS) { onComplete?.(score); return; }
    setRound(next);
    startNewRound(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 8 }}>

      {/* Round header */}
      <div style={{ display: 'flex', justifyContent: 'space-between',
        fontSize: '0.9rem', color: 'var(--color-text-muted)',
        fontFamily: 'var(--font-display)', fontWeight: 700 }}>
        <span>Round {round + 1} / {ROUNDS}</span>
        <span>Score: {score} / {round}</span>
      </div>

      {/* Instruction banner */}
      <div style={{
        background: 'rgba(124,92,191,0.14)', border: '1px solid rgba(124,92,191,0.3)',
        borderRadius: 'var(--radius-md)', padding: '10px 16px',
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.02rem',
        textAlign: 'center',
      }}>
        {allBuilt
          ? `✅ Done! ${setup.numGroups} equal groups built!`
          : `Build ${setup.numGroups} equal ${ctx.boxName}, with ${setup.groupSize} ${ctx.itemName} in each!`}
      </div>

      {/* Running total (hidden once all built) */}
      {!allBuilt && (
        <div style={{
          background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)',
          padding: '10px 14px', textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            🧮 Running total: <span style={{ color: 'var(--gold)', fontSize: '1.15rem' }}>{runningTotal}</span>
          </div>
        </div>
      )}

      {/* Multiplication sentence shown when all built */}
      {allBuilt && (
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(255,193,7,0.10)', border: '1.5px solid rgba(255,193,7,0.35)',
            borderRadius: 'var(--radius-md)', padding: '11px 14px',
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: '1.3rem', textAlign: 'center',
          }}>
          {setup.numGroups} × {setup.groupSize} = ?&nbsp;&nbsp;
          <span style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
            Count all the {ctx.itemName}!
          </span>
        </motion.div>
      )}

      {/* Groups — items shown as emoji inside each container */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        {groups.map((items, i) => (
          <motion.div key={i}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              flex: '1 1 60px',
              background: 'rgba(255,255,255,0.04)',
              border: '2px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 4px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              minHeight: 96,
            }}>
            <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{ctx.container}</span>
            <div style={{ display: 'flex', flexWrap: 'wrap',
              justifyContent: 'center', gap: 2, flex: 1 }}>
              {items.map((emoji, j) => (
                <span key={j} style={{ fontSize: '1rem' }}>{emoji}</span>
              ))}
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: '1.25rem', color: 'var(--gold)' }}>
              {items.length}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              {ctx.boxName.slice(0, -1)} {i + 1}
            </span>
          </motion.div>
        ))}
        {/* Empty slots preview for groups not yet built */}
        {Array.from({ length: Math.max(0, setup.numGroups - groups.length) }).map((_, i) => (
          <div key={`empty-${i}`} style={{
            flex: '1 1 60px', border: '2px dashed rgba(255,255,255,0.12)',
            borderRadius: 'var(--radius-md)', minHeight: 96,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', opacity: 0.3,
          }}>
            {ctx.container}
          </div>
        ))}
      </div>

      {/* Build buttons */}
      {!allBuilt && (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="primary" size="sm" onClick={addGroup}
            disabled={groups.length >= setup.numGroups} style={{ flex: 1 }}>
            Add a Group {ctx.container}
          </Button>
          <Button variant="outline" size="sm" onClick={addAllGroups}
            disabled={groups.length >= setup.numGroups || !!intervalRef.current} style={{ flex: 1 }}>
            Add All Groups →
          </Button>
        </div>
      )}

      {/* Options (shown after all built) */}
      {allBuilt && !confirmed && (
        <>
          <p style={{ textAlign: 'center', fontFamily: 'var(--font-display)',
            fontWeight: 700, fontSize: '1rem', margin: '2px 0' }}>
            How many {ctx.itemName} in total?
          </p>
          <div className="options-grid">
            {options.map(opt => (
              <button key={opt}
                className={`option-btn${selected === opt ? ' selected' : ''}`}
                onClick={() => setSelected(opt)}>
                {opt}
              </button>
            ))}
          </div>
          <Button variant="primary" size="sm" onClick={handleConfirm}
            disabled={!selected} style={{ width: '100%' }}>
            Confirm ✓
          </Button>
        </>
      )}

      {/* Result */}
      {confirmed && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{
            padding: '11px 16px', borderRadius: 'var(--radius-md)', marginBottom: 8,
            background: isCorrect ? 'rgba(0,230,118,0.12)' : 'rgba(255,82,82,0.12)',
            border: `1.5px solid ${isCorrect ? 'rgba(0,230,118,0.4)' : 'rgba(255,82,82,0.4)'}`,
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: '1.02rem', textAlign: 'center',
          }}>
            {isCorrect
              ? `🎉 ${setup.numGroups} × ${setup.groupSize} = ${setup.product}  →  that's the total!`
              : `❌ It's ${setup.product}! Count all the ${ctx.itemName} across every ${ctx.boxName.slice(0,-1)} — ${setup.numGroups} × ${setup.groupSize} = ${setup.product}.`}
          </div>
          <Button variant="primary" size="sm" onClick={handleNext} style={{ width: '100%' }}>
            {round + 1 >= ROUNDS ? 'Finish ⭐' : 'Next Round →'}
          </Button>
        </motion.div>
      )}

    </div>
  );
}
