interface RoofSvg1SlopeProps {
  className?: string;
}

export default function RoofSvg1Slope({ className }: RoofSvg1SlopeProps) {
  return (
    <svg viewBox="0 0 400 350" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* House body */}
      <polygon
        points="80,280 320,280 320,140 80,200"
        fill="#e8e8e8"
        stroke="#555"
        strokeWidth="2"
      />
      {/* Front wall */}
      <polygon
        points="80,200 80,280 30,310 30,220"
        fill="#d4d4d4"
        stroke="#555"
        strokeWidth="2"
      />
      {/* Bottom */}
      <polygon
        points="80,280 320,280 270,310 30,310"
        fill="#c0c0c0"
        stroke="#555"
        strokeWidth="2"
      />
      {/* Roof slope */}
      <polygon
        points="60,190 340,120 300,95 20,165"
        fill="#a52a2a"
        stroke="#6b1a1a"
        strokeWidth="2"
      />
      {/* Roof front edge */}
      <polygon
        points="20,165 60,190 30,220 -10,192"
        fill="#8b2020"
        stroke="#6b1a1a"
        strokeWidth="2"
      />

      {/* Dimension A - Wall height (right side) */}
      <line x1="345" y1="140" x2="345" y2="280" stroke="#2563eb" strokeWidth="2" markerStart="url(#arrowUp)" markerEnd="url(#arrowDown)" />
      <rect x="350" y="195" width="36" height="28" rx="4" fill="white" stroke="#2563eb" strokeWidth="1.5" />
      <text x="368" y="214" textAnchor="middle" fill="#2563eb" fontWeight="bold" fontSize="18">A</text>

      {/* Dimension B - Roof width (top horizontal) */}
      <line x1="60" y1="85" x2="340" y2="85" stroke="#2563eb" strokeWidth="2" markerStart="url(#arrowLeft)" markerEnd="url(#arrowRight)" />
      <rect x="180" y="71" width="36" height="28" rx="4" fill="white" stroke="#2563eb" strokeWidth="1.5" />
      <text x="198" y="90" textAnchor="middle" fill="#2563eb" fontWeight="bold" fontSize="18">B</text>

      {/* Dimension C - Roof slope height (diagonal) */}
      <line x1="15" y1="170" x2="55" y2="105" stroke="#2563eb" strokeWidth="2" markerStart="url(#arrowDown)" markerEnd="url(#arrowUp)" />
      <rect x="5" y="122" width="36" height="28" rx="4" fill="white" stroke="#2563eb" strokeWidth="1.5" />
      <text x="23" y="141" textAnchor="middle" fill="#2563eb" fontWeight="bold" fontSize="18">C</text>

      {/* Arrow markers */}
      <defs>
        <marker id="arrowUp" markerWidth="8" markerHeight="8" refX="4" refY="8" orient="auto">
          <path d="M0,8 L4,0 L8,8" fill="#2563eb" />
        </marker>
        <marker id="arrowDown" markerWidth="8" markerHeight="8" refX="4" refY="0" orient="auto">
          <path d="M0,0 L4,8 L8,0" fill="#2563eb" />
        </marker>
        <marker id="arrowLeft" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
          <path d="M8,0 L0,4 L8,8" fill="#2563eb" />
        </marker>
        <marker id="arrowRight" markerWidth="8" markerHeight="8" refX="0" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8" fill="#2563eb" />
        </marker>
      </defs>
    </svg>
  );
}
