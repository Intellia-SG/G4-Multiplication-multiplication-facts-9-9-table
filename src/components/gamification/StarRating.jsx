// src/components/gamification/StarRating.jsx
import React from 'react';

export default function StarRating({ stars = 0, maxStars = 3, size = 'md' }) {
  const fontSize = size === 'sm' ? '1rem' : size === 'lg' ? '1.8rem' : '1.35rem';

  return (
    <div style={{ display: 'inline-flex', gap: '3px', fontSize, alignItems: 'center' }} aria-label={`${stars} out of ${maxStars} stars`}>
      {[...Array(maxStars)].map((_, i) => (
        <span
          key={i}
          style={{
            color: i < stars ? '#fbb03b' : 'rgba(255,255,255,0.18)',
            filter: i < stars ? 'drop-shadow(0 0 4px rgba(251,176,59,0.6))' : 'none',
            transition: 'all 0.2s ease',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
