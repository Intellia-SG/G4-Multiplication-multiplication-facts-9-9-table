// src/features/simulate/SimulatePhase.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EqualGroupsBuilderSim from './simulations/EqualGroupsBuilder.jsx';
import FlipTheFactorSim from './simulations/FlipTheFactor.jsx';
import MultiplicationSentenceSim from './simulations/MultiplicationSentence.jsx';
import Button from '../../components/Button.jsx';
import { simulationStationNarration } from '../../utils/narration.js';

const STATIONS = [
  { id: 0, icon: '🧺', title: 'Equal Groups Builder', subtitle: 'Add equal groups, then find the total', Component: EqualGroupsBuilderSim },
  { id: 1, icon: '🔁', title: 'Flip the Factor',       subtitle: 'Find the missing number',              Component: FlipTheFactorSim },
  { id: 2, icon: '✏️', title: 'Multiplication Sentence', subtitle: 'Fill in the blank',                  Component: MultiplicationSentenceSim },
];

// NOTE: font sizes on this screen are intentionally larger than the Story
// phase (per module spec) — Simulate & Play are the two phases where text
// and touch targets are bumped up for readability and easier tapping.
function StarRow({ score }) {
  const stars = score >= 3 ? 3 : score >= 2 ? 2 : score >= 1 ? 1 : 0;
  return (
    <div className="star-rating" style={{ fontSize: '1.5rem', margin: '4px 0' }}>
      {[0, 1, 2].map(i => <span key={i} className={i < stars ? 'star-filled' : 'star-empty'}>⭐</span>)}
    </div>
  );
}

export default function SimulatePhase({ onComplete, playNarration }) {
  const [activeStation, setActiveStation] = useState(0);
  const [stationScores, setStationScores] = useState({});
  const [completed, setCompleted] = useState(new Set());
  const [showDone, setShowDone] = useState(false);
  const narrationFiredRef = React.useRef(new Set());

  useEffect(() => {
    if (!narrationFiredRef.current.has(activeStation)) {
      narrationFiredRef.current.add(activeStation);
      const segs = simulationStationNarration(activeStation);
      if (segs.length) playNarration?.(segs);
    }
  }, [activeStation, playNarration]);

  const handleStationComplete = (score) => {
    const next = new Set(completed).add(activeStation);
    setStationScores(prev => ({ ...prev, [activeStation]: score }));
    setCompleted(next);
    if (next.size >= STATIONS.length) { setShowDone(true); return; }
    const nextStation = STATIONS.find(s => !next.has(s.id));
    if (nextStation) setActiveStation(nextStation.id);
  };

  if (showDone) {
    const totalScore = Object.values(stationScores).reduce((a, b) => a + b, 0);
    return (
      <div className="simulate-screen">
        <motion.div
          className="simulate-card glass-card sim-complete-card"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div style={{ fontSize: '2.9rem', marginBottom: 8, textAlign: 'center' }}>🏆</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', marginBottom: 4, textAlign: 'center' }}>All Stations Complete!</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 16, textAlign: 'center', fontSize: '1.05rem' }}>Total: {totalScore} / 9</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18, width: '100%' }}>
            {STATIONS.map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem' }}>{s.icon} {s.title}</span>
                <StarRow score={stationScores[s.id] ?? 0} />
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Button variant="primary" size="lg" onClick={onComplete}>Play! 🎮</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const station = STATIONS[activeStation];
  const StationComponent = station.Component;

  return (
    <div className="simulate-screen">
      {/* Tab bar — compact, won't overlap journey bar */}
      <div className="station-selector">
        {STATIONS.map(s => (
          <button
            key={s.id}
            className={`station-tab ${activeStation === s.id ? 'active' : ''}`}
            onClick={() => setActiveStation(s.id)}
          >
            <span className="station-tab-icon">{s.icon}</span>
            <span className="station-tab-label">{s.title}</span>
            {completed.has(s.id) && <span style={{ fontSize: '0.75rem', color: 'var(--green)' }}>✓</span>}
          </button>
        ))}
      </div>

      {/* Game card — scrollable internally if needed */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStation}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          className="simulate-card glass-card"
        >
          <div style={{ marginBottom: 12, flexShrink: 0 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, marginBottom: 2 }}>
              {station.icon} {station.title}
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>{station.subtitle}</p>
          </div>

          {completed.has(activeStation) ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <StarRow score={stationScores[activeStation] ?? 0} />
              <p style={{ color: 'var(--green)', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 10, fontSize: '1.05rem' }}>Station Complete!</p>
              <Button variant="outline" size="sm" onClick={() => {
                setCompleted(prev => { const s = new Set(prev); s.delete(activeStation); return s; });
              }}>Retry</Button>
            </div>
          ) : (
            /* flex: 1 + minHeight: 0 lets the station component fill the remaining card space */
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              <StationComponent onComplete={handleStationComplete} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
