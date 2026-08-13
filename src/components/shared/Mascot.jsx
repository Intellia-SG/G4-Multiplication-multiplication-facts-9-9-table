// src/components/shared/Mascot.jsx
import React from 'react';
import './Mascot.css';

export default function Mascot({ mood = 'happy', message, size = 'md' }) {
  const emoji = mood === 'celebrating' ? '🦉🎉' : mood === 'curious' ? '🦉🔍' : mood === 'thinking' ? '🦉💡' : '🦉';

  return (
    <div className={`mascot-wrap mascot-${size}`}>
      <div className="mascot-circle" title="Toby the Multiplication Guide">
        <span className="mascot-emoji">{emoji}</span>
      </div>
      {message && (
        <div className="mascot-speech anim-slide-up">
          <p className="mascot-msg-text">{message}</p>
        </div>
      )}
    </div>
  );
}
