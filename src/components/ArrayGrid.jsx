// src/components/ArrayGrid.jsx
export default function ArrayGrid({ groups, size, itemEmoji = '🍎', compact = false }) {
  return (
    <div className={`array-grid${compact ? ' compact' : ''}`} role="img"
      aria-label={`Array: ${groups} rows of ${size} ${itemEmoji}`}>
      {Array.from({ length: groups }).map((_, r) => (
        <div key={r} className="array-row">
          {Array.from({ length: size }).map((_, c) => (
            <span key={c} className="array-item">{itemEmoji}</span>
          ))}
        </div>
      ))}
    </div>
  );
}
