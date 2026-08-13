// src/components/shared/FloatingNumbers.jsx
import React from 'react';
import './FloatingNumbers.css';

const SYMBOLS = ['✖️', '7×8=56', '9×6=54', '4×6=24', '3×7=21', '8×8=64', '5×9=45', '⭐', '6×7=42', '9×9=81', '✨'];

export default function FloatingNumbers() {
  return (
    <div className="floating-symbols-container" aria-hidden="true">
      {SYMBOLS.map((sym, i) => (
        <span
          key={i}
          className="floating-symbol"
          style={{
            left: `${6 + (i * 9.2) % 88}%`,
            animationDelay: `${(i * 1.7) % 15}s`,
            animationDuration: `${16 + (i % 5) * 3}s`,
            fontSize: `${0.9 + (i % 3) * 0.35}rem`,
          }}
        >
          {sym}
        </span>
      ))}
    </div>
  );
}
