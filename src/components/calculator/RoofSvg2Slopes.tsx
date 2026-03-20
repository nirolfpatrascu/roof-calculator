interface RoofSvg2SlopesProps {
  className?: string;
}

export default function RoofSvg2Slopes({ className }: RoofSvg2SlopesProps) {
  return (
    <svg viewBox="0 0 440 360" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* House body - front wall */}
      <polygon
        points="80,260 80,310 30,340 30,280"
        fill="#d4d4d4"
        stroke="#555"
        strokeWidth="2"
      />
      {/* House body - side wall */}
      <polygon
        points="80,260 340,260 340,310 80,310"
        fill="#e8e8e8"
        stroke="#555"
        strokeWidth="2"
      />
      {/* Bottom */}
      <polygon
        points="80,310 340,310 290,340 30,340"
        fill="#c0c0c0"
        stroke="#555"
        strokeWidth="2"
      />

      {/* Front gable triangle */}
      <polygon
        points="80,260 30,280 55,180"
        fill="#ccc"
        stroke="#555"
        strokeWidth="2"
      />

      {/* Left roof slope */}
      <polygon
        points="55,180 20,195 260,130 300,115"
        fill="#8b2020"
        stroke="#6b1a1a"
        strokeWidth="2"
      />
      {/* Right roof slope */}
      <polygon
        points="300,115 340,260 80,260 55,180"
        fill="#a52a2a"
        stroke="#6b1a1a"
        strokeWidth="2"
      />
      {/* Ridge line */}
      <line x1="55" y1="180" x2="300" y2="115" stroke="#4a1010" strokeWidth="3" />

      {/* Right roof slope (back) */}
      <polygon
        points="300,115 260,130 340,260"
        fill="#c44040"
        stroke="#6b1a1a"
        strokeWidth="1"
        opacity="0.6"
      />

      {/* Dimension A - Wall height (right side) */}
      <line x1="365" y1="260" x2="365" y2="310" stroke="#2563eb" strokeWidth="2" markerStart="url(#arrowUp2)" markerEnd="url(#arrowDown2)" />
      <rect x="372" y="270" width="36" height="28" rx="4" fill="white" stroke="#2563eb" strokeWidth="1.5" />
      <text x="390" y="289" textAnchor="middle" fill="#2563eb" fontWeight="bold" fontSize="18">A</text>

      {/* Dimension B - Roof width (top horizontal) */}
      <line x1="55" y1="100" x2="300" y2="100" stroke="#2563eb" strokeWidth="2" markerStart="url(#arrowLeft2)" markerEnd="url(#arrowRight2)" />
      <rect x="157" y="86" width="36" height="28" rx="4" fill="white" stroke="#2563eb" strokeWidth="1.5" />
      <text x="175" y="105" textAnchor="middle" fill="#2563eb" fontWeight="bold" fontSize="18">B</text>

      {/* Dimension C - Left slope (front left) */}
      <line x1="15" y1="195" x2="45" y2="130" stroke="#2563eb" strokeWidth="2" markerStart="url(#arrowDown2)" markerEnd="url(#arrowUp2)" />
      <rect x="0" y="147" width="36" height="28" rx="4" fill="white" stroke="#2563eb" strokeWidth="1.5" />
      <text x="18" y="166" textAnchor="middle" fill="#2563eb" fontWeight="bold" fontSize="18">C</text>

      {/* Dimension D - Right slope (front right) */}
      <line x1="42" y1="250" x2="42" y2="190" stroke="#dc2626" strokeWidth="2" markerStart="url(#arrowDownRed)" markerEnd="url(#arrowUpRed)" />
      <rect x="2" y="210" width="36" height="28" rx="4" fill="white" stroke="#dc2626" strokeWidth="1.5" />
      <text x="20" y="229" textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="18">D</text>

      {/* Arrow markers */}
      <defs>
        <marker id="arrowUp2" markerWidth="8" markerHeight="8" refX="4" refY="8" orient="auto">
          <path d="M0,8 L4,0 L8,8" fill="#2563eb" />
        </marker>
        <marker id="arrowDown2" markerWidth="8" markerHeight="8" refX="4" refY="0" orient="auto">
          <path d="M0,0 L4,8 L8,0" fill="#2563eb" />
        </marker>
        <marker id="arrowLeft2" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
          <path d="M8,0 L0,4 L8,8" fill="#2563eb" />
        </marker>
        <marker id="arrowRight2" markerWidth="8" markerHeight="8" refX="0" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8" fill="#2563eb" />
        </marker>
        <marker id="arrowUpRed" markerWidth="8" markerHeight="8" refX="4" refY="8" orient="auto">
          <path d="M0,8 L4,0 L8,8" fill="#dc2626" />
        </marker>
        <marker id="arrowDownRed" markerWidth="8" markerHeight="8" refX="4" refY="0" orient="auto">
          <path d="M0,0 L4,8 L8,0" fill="#dc2626" />
        </marker>
      </defs>
    </svg>
  );
}
