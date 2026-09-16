/* ============================================================
   HeroMesh — faint "service mesh" of SVG traces behind the hero
   with light pulses traveling along the paths (packets moving
   through a pipeline). Uses the .pipeline-flow dash animation.
   Purely decorative; hidden from reduced-motion users via CSS.
   ============================================================ */

// A handful of node coordinates on a 1200x600 viewBox.
const NODES = [
  { x: 120, y: 120 }, { x: 340, y: 80 }, { x: 560, y: 180 },
  { x: 300, y: 320 }, { x: 620, y: 400 }, { x: 880, y: 120 },
  { x: 1040, y: 300 }, { x: 820, y: 460 }, { x: 180, y: 480 },
  { x: 1100, y: 520 },
];

// Edges connecting nodes (service-to-service links).
const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 5], [5, 6], [3, 4], [4, 7],
  [1, 3], [2, 4], [6, 9], [7, 9], [0, 8], [8, 3], [4, 6],
];

export default function HeroMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <svg
        className="w-full h-full opacity-[0.5]"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="meshGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <radialGradient id="meshNode" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
          </radialGradient>
        </defs>

        {/* Base faint edges */}
        {EDGES.map(([a, b], i) => (
          <line
            key={`base-${i}`}
            x1={NODES[a].x} y1={NODES[a].y}
            x2={NODES[b].x} y2={NODES[b].y}
            stroke="url(#meshGrad)"
            strokeWidth="1"
            strokeOpacity="0.12"
          />
        ))}

        {/* Animated packet pulses traveling along the same edges */}
        {EDGES.map(([a, b], i) => (
          <line
            key={`flow-${i}`}
            x1={NODES[a].x} y1={NODES[a].y}
            x2={NODES[b].x} y2={NODES[b].y}
            stroke="url(#meshGrad)"
            strokeWidth="1.5"
            strokeOpacity="0.5"
            className="pipeline-flow"
            style={{ animationDuration: `${2 + (i % 4) * 0.6}s`, animationDelay: `${(i % 5) * 0.35}s` }}
          />
        ))}

        {/* Nodes */}
        {NODES.map((n, i) => (
          <g key={`node-${i}`}>
            <circle cx={n.x} cy={n.y} r="10" fill="url(#meshNode)" opacity="0.25" />
            <circle cx={n.x} cy={n.y} r="3" fill="url(#meshGrad)" opacity="0.6" />
          </g>
        ))}
      </svg>
    </div>
  );
}
