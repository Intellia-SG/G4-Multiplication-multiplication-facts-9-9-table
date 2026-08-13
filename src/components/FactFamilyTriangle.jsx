// src/components/FactFamilyTriangle.jsx
// Topic-adapted equivalent of the reference EqualGroupsDiagram.jsx
// Same SVG structure, same prop contract, relabelled for multiplication facts:
// Product (top) = Factor A (bottom-left) × Factor B (bottom-right)

export default function FactFamilyTriangle({ product, factorA, factorB, missing = 'none', animated = false }) {
  const isMissing = (slot) => missing === slot;
  const display = (val, slot) => isMissing(slot) ? '?' : val;
  const fillFor = (slot) => isMissing(slot) ? '#FFF9C4' : (slot === 'product' ? '#4A90D9' : '#FF8A50');
  const strokeFor = (slot) => isMissing(slot) ? '#FFB300' : (slot === 'product' ? '#2E5C8A' : '#E65C00');
  const dashFor = (slot) => isMissing(slot) ? '6 4' : 'none';

  return (
    <svg
      viewBox="0 0 280 230"
      className={`equal-groups-diagram${animated ? ' animated' : ''}`}
      role="img"
      aria-label={`Fact triangle: ${factorA} times ${factorB} equals ${product}`}
    >
      {/* Branch lines */}
      <line x1="140" y1="78" x2="75"  y2="152" stroke="#9B8AC4" strokeWidth="3" />
      <line x1="140" y1="78" x2="205" y2="152" stroke="#9B8AC4" strokeWidth="3" />

      {/* Product — top circle */}
      <circle cx="140" cy="52" r="44" fill={fillFor('product')} stroke={strokeFor('product')}
        strokeWidth="3" strokeDasharray={dashFor('product')} />
      <text x="140" y="59" textAnchor="middle" className="diagram-num">{display(product, 'product')}</text>
      <text x="140" y="18" textAnchor="middle" className="diagram-label">Product</text>

      {/* Factor A — bottom-left */}
      <circle cx="75" cy="178" r="36" fill={fillFor('factorA')} stroke={strokeFor('factorA')}
        strokeWidth="3" strokeDasharray={dashFor('factorA')} />
      <text x="75" y="185" textAnchor="middle" className="diagram-num">{display(factorA, 'factorA')}</text>
      <text x="75" y="224" textAnchor="middle" className="diagram-label">Factor</text>

      {/* Factor B — bottom-right */}
      <circle cx="205" cy="178" r="36" fill={fillFor('factorB')} stroke={strokeFor('factorB')}
        strokeWidth="3" strokeDasharray={dashFor('factorB')} />
      <text x="205" y="185" textAnchor="middle" className="diagram-num">{display(factorB, 'factorB')}</text>
      <text x="205" y="224" textAnchor="middle" className="diagram-label">Factor</text>
    </svg>
  );
}
