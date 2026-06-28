"use client";
import type { TrineResult, Convergence } from "@/lib/compute";

const MBTI_COLOR  = "#6E78C9";
const ASTRO_COLOR = "#9A6FD0";
const NUM_COLOR   = "#C77399";
const OVERLAP_COLOR = "#574F47";

function nodeColor(systems: Convergence["systems"]): string {
  if (systems.includes("mbti") && systems.includes("astro") && systems.includes("num")) return OVERLAP_COLOR;
  if (systems.includes("mbti") && systems.includes("astro")) return "#8774CC";
  if (systems.includes("mbti") && systems.includes("num")) return "#9A73B0";
  if (systems.includes("astro") && systems.includes("num")) return "#B87099";
  return OVERLAP_COLOR;
}

// Triangle vertices
const TOP   = { x: 260, y: 30  };
const LEFT  = { x: 40,  y: 390 };
const RIGHT = { x: 480, y: 390 };

// Centroid
const CENTER = {
  x: (TOP.x + LEFT.x + RIGHT.x) / 3,
  y: (TOP.y + LEFT.y + RIGHT.y) / 3,
};

// Midpoints of edges
function midpoint(a: {x:number;y:number}, b: {x:number;y:number}) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

// Map convergence to position
function convergencePos(c: Convergence, index: number) {
  const { systems } = c;
  const all3 = systems.includes("mbti") && systems.includes("astro") && systems.includes("num");
  if (all3) return CENTER;
  const hasMbti  = systems.includes("mbti");
  const hasAstro = systems.includes("astro");
  const hasNum   = systems.includes("num");
  if (hasMbti && hasAstro) return midpoint(TOP, RIGHT);
  if (hasMbti && hasNum)   return midpoint(TOP, LEFT);
  if (hasAstro && hasNum)  return midpoint(LEFT, RIGHT);
  // Single system – orbit center
  const angle = (index / 3) * Math.PI * 2;
  return { x: CENTER.x + Math.cos(angle) * 50, y: CENTER.y + Math.sin(angle) * 50 };
}

interface Props {
  result: TrineResult;
}

export function TriangleDiagram({ result }: Props) {
  const { mbti, astrology, numerology, convergences } = result;

  const points = `${TOP.x},${TOP.y} ${LEFT.x},${LEFT.y} ${RIGHT.x},${RIGHT.y}`;

  return (
    <div style={{ width: "100%", maxWidth: 540, margin: "0 auto" }}>
      <svg
        viewBox="0 0 520 440"
        style={{ width: "100%", height: "auto", overflow: "visible" }}
        aria-label="Trine convergence diagram"
      >
        {/* Glow defs */}
        <defs>
          <filter id="glow-mbti">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-astro">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-num">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9A6FD0" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#9A6FD0" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Triangle fill */}
        <polygon
          points={points}
          fill="url(#innerGlow)"
          stroke="#E2DCD3"
          strokeWidth="1.5"
        />

        {/* Medians — subtle lines to centroid */}
        {[TOP, LEFT, RIGHT].map((v, i) => (
          <line
            key={i}
            x1={v.x} y1={v.y}
            x2={CENTER.x} y2={CENTER.y}
            stroke="#ECE7E0"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {/* Convergence nodes */}
        {convergences.map((c, i) => {
          const pos = convergencePos(c, i);
          const col = nodeColor(c.systems);
          return (
            <g key={c.title}>
              {/* Outer ring */}
              <circle cx={pos.x} cy={pos.y} r={22} fill={col} fillOpacity={0.12} />
              {/* Inner dot */}
              <circle cx={pos.x} cy={pos.y} r={8} fill={col} />
              {/* Pulse ring */}
              <circle cx={pos.x} cy={pos.y} r={14} fill="none" stroke={col} strokeWidth="1.5" strokeOpacity={0.5} />
              {/* Label */}
              <text
                x={pos.x}
                y={pos.y + 32}
                textAnchor="middle"
                fontSize={10}
                fontFamily="'IBM Plex Mono', monospace"
                fill={OVERLAP_COLOR}
                letterSpacing="0.06em"
              >
                {c.title.toUpperCase().slice(0, 20)}
              </text>
            </g>
          );
        })}

        {/* MBTI vertex — top */}
        <g filter="url(#glow-mbti)">
          <circle cx={TOP.x} cy={TOP.y} r={28} fill={MBTI_COLOR} fillOpacity={0.12} />
          <circle cx={TOP.x} cy={TOP.y} r={14} fill={MBTI_COLOR} />
        </g>
        <text x={TOP.x} y={TOP.y - 22} textAnchor="middle" fontSize={18} fontFamily="Space Grotesk, var(--font-hanken), sans-serif" fontWeight={600} fill={MBTI_COLOR}>{mbti.type}</text>
        <text x={TOP.x} y={TOP.y - 6} textAnchor="middle" fontSize={9} fontFamily="'IBM Plex Mono', monospace" fill="#9A938B" letterSpacing="0.1em">MYERS–BRIGGS</text>

        {/* Astrology vertex — right */}
        <g filter="url(#glow-astro)">
          <circle cx={RIGHT.x} cy={RIGHT.y} r={28} fill={ASTRO_COLOR} fillOpacity={0.12} />
          <circle cx={RIGHT.x} cy={RIGHT.y} r={14} fill={ASTRO_COLOR} />
        </g>
        <text x={RIGHT.x + 20} y={RIGHT.y - 12} textAnchor="start" fontSize={20} fontFamily="serif" fill={ASTRO_COLOR}>{astrology.symbol}</text>
        <text x={RIGHT.x + 20} y={RIGHT.y + 6} textAnchor="start" fontSize={14} fontFamily="Space Grotesk, var(--font-hanken), sans-serif" fontWeight={600} fill={ASTRO_COLOR}>{astrology.sunSign}</text>
        <text x={RIGHT.x + 20} y={RIGHT.y + 20} textAnchor="start" fontSize={9} fontFamily="'IBM Plex Mono', monospace" fill="#9A938B" letterSpacing="0.1em">SUN SIGN</text>

        {/* Numerology vertex — left */}
        <g filter="url(#glow-num)">
          <circle cx={LEFT.x} cy={LEFT.y} r={28} fill={NUM_COLOR} fillOpacity={0.12} />
          <circle cx={LEFT.x} cy={LEFT.y} r={14} fill={NUM_COLOR} />
        </g>
        <text x={LEFT.x - 20} y={LEFT.y - 12} textAnchor="end" fontSize={22} fontFamily="Space Grotesk, var(--font-hanken), sans-serif" fontWeight={700} fill={NUM_COLOR}>{numerology.lifePath}</text>
        <text x={LEFT.x - 20} y={LEFT.y + 6} textAnchor="end" fontSize={9} fontFamily="'IBM Plex Mono', monospace" fill="#9A938B" letterSpacing="0.1em">LIFE PATH</text>
        <text x={LEFT.x - 20} y={LEFT.y + 20} textAnchor="end" fontSize={9} fontFamily="'IBM Plex Mono', monospace" fill="#9A938B" letterSpacing="0.1em">NUMEROLOGY</text>
      </svg>
    </div>
  );
}
