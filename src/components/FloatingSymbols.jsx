import React, { useMemo } from 'react';

export const FLOAT_ITEMS = [
  '×', '=', '2', '3', '4', '5', '6', '7', '8', '9', '56', '81',
  '⭐', '🪑', '🎸', '🤖', '🚀', '🦉',
];

/**
 * Decorative floating multiplication-themed symbols drifting up the background.
 * Purely visual — aria-hidden, respects prefers-reduced-motion via CSS.
 */
export default function FloatingSymbols({ count = 16 }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const symbol = FLOAT_ITEMS[i % FLOAT_ITEMS.length];
        return {
          symbol,
          left: Math.random() * 100,
          delay: Math.random() * 20,
          duration: 16 + Math.random() * 10,
        };
      }),
    [count]
  );

  return (
    <div className="floating-numbers" aria-hidden="true">
      {items.map((item, idx) => (
        <span
          key={idx}
          className="floating-number"
          style={{
            left: `${item.left}%`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
          }}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  );
}
