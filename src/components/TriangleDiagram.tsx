"use client";
import type { TrineResult } from "@/lib/compute";

const MBTI_COLOR  = "#8B93E8";
const ASTRO_COLOR = "#B98FE8";
const NUM_COLOR   = "#E592AE";

// Triangle vertices
const TOP   = { x: 260, y: 30  };
const LEFT  = { x: 40,  y: 390 };
const RIGHT = { x: 480, y: 390 };

// Centroid
const CENTER = {
  x: (TOP.x + LEFT.x + RIGHT.x) / 3,
  y: (TOP.y + LEFT.y + RIGHT.y) / 3,
};

interface Props {
  result: TrineResult;
}

export function TriangleDiagram({ result }: Props) {
  const { mbti, astrology, numerology, archetype } = result;

  // Split "The Radiant Explorer" → prefix="The", line1="Radiant", line2="Explorer"
  const words = archetype.split(" ");
  const prefix = words[0];
  const nameWords = words.slice(1);
  const mid = Math.ceil(nameWords.length / 2);
  const nameLine1 = nameWords.slice(0, mid).join(" ");
  const nameLine2 = nameWords.slice(mid).join(" ");

  const points = `${TOP.x},${TOP.y} ${LEFT.x},${LEFT.y} ${RIGHT.x},${RIGHT.y}`;

  return (
    <div style={{ width: "100%", maxWidth: 540, margin: "0 auto" }}>
      <svg
        viewBox="0 0 520 440"
        style={{ width: "100%", height: "auto", overflow: "visible" }}
        aria-label="Trine convergence diagram"
      >
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
            <stop offset="0%" stopColor={ASTRO_COLOR} stopOpacity="0.18" />
            <stop offset="100%" stopColor={ASTRO_COLOR} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={ASTRO_COLOR} stopOpacity="0.40" />
            <stop offset="50%"  stopColor={MBTI_COLOR}  stopOpacity="0.14" />
            <stop offset="100%" stopColor={NUM_COLOR}   stopOpacity="0" />
          </radialGradient>
          <filter id="softBlur">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        {/* Triangle fill */}
        <polygon
          points={points}
          fill="url(#innerGlow)"
          stroke="var(--border)"
          strokeWidth="1.5"
        />

        {/* Medians — dashed lines to centroid */}
        {[TOP, LEFT, RIGHT].map((v, i) => (
          <line
            key={i}
            x1={v.x} y1={v.y}
            x2={CENTER.x} y2={CENTER.y}
            stroke="var(--border-light)"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {/* ── Center: Archetype ────────────────────────────── */}
        {/* Soft outer glow */}
        <circle cx={CENTER.x} cy={CENTER.y} r={80} fill="url(#centerGlow)" filter="url(#softBlur)" />
        {/* Ring */}
        <circle cx={CENTER.x} cy={CENTER.y} r={46} fill={ASTRO_COLOR} fillOpacity={0.06} />
        <circle cx={CENTER.x} cy={CENTER.y} r={46} fill="none" stroke={ASTRO_COLOR} strokeWidth="0.75" strokeOpacity={0.35} />
        {/* Inner ring */}
        <circle cx={CENTER.x} cy={CENTER.y} r={4} fill={ASTRO_COLOR} fillOpacity={0.7} />

        {/* "THE" prefix */}
        <text
          x={CENTER.x} y={CENTER.y - 26}
          textAnchor="middle"
          fontSize={8}
          fontFamily="'IBM Plex Mono', monospace"
          letterSpacing="0.18em"
          fill={ASTRO_COLOR}
          fillOpacity={0.75}
        >
          {prefix.toUpperCase()}
        </text>
        {/* Archetype name line 1 */}
        <text
          x={CENTER.x} y={CENTER.y - 8}
          textAnchor="middle"
          fontSize={13}
          fontFamily="Space Grotesk, var(--font-hanken), sans-serif"
          fontWeight={600}
          fill="var(--ink)"
          letterSpacing="0.04em"
        >
          {nameLine1.toUpperCase()}
        </text>
        {/* Archetype name line 2 */}
        {nameLine2 && (
          <text
            x={CENTER.x} y={CENTER.y + 12}
            textAnchor="middle"
            fontSize={13}
            fontFamily="Space Grotesk, var(--font-hanken), sans-serif"
            fontWeight={600}
            fill="var(--ink)"
            letterSpacing="0.04em"
          >
            {nameLine2.toUpperCase()}
          </text>
        )}

        {/* ── MBTI vertex — top ───────────────────────────── */}
        <g filter="url(#glow-mbti)">
          <circle cx={TOP.x} cy={TOP.y} r={28} fill={MBTI_COLOR} fillOpacity={0.12} />
          <circle cx={TOP.x} cy={TOP.y} r={14} fill={MBTI_COLOR} />
        </g>
        <text x={TOP.x} y={TOP.y - 22} textAnchor="middle" fontSize={18} fontFamily="Space Grotesk, var(--font-hanken), sans-serif" fontWeight={600} fill={MBTI_COLOR}>{mbti.type}</text>
        <text x={TOP.x} y={TOP.y - 6}  textAnchor="middle" fontSize={9}  fontFamily="'IBM Plex Mono', monospace" fill="var(--faint)" letterSpacing="0.1em">MYERS–BRIGGS</text>

        {/* ── Astrology vertex — right ─────────────────────── */}
        <g filter="url(#glow-astro)">
          <circle cx={RIGHT.x} cy={RIGHT.y} r={28} fill={ASTRO_COLOR} fillOpacity={0.12} />
          <circle cx={RIGHT.x} cy={RIGHT.y} r={14} fill={ASTRO_COLOR} />
        </g>
        <text x={RIGHT.x + 20} y={RIGHT.y - 12} textAnchor="start" fontSize={20} fontFamily="serif"                                                       fill={ASTRO_COLOR}>{astrology.symbol}</text>
        <text x={RIGHT.x + 20} y={RIGHT.y + 6}  textAnchor="start" fontSize={14} fontFamily="Space Grotesk, var(--font-hanken), sans-serif" fontWeight={600} fill={ASTRO_COLOR}>{astrology.sunSign}</text>
        <text x={RIGHT.x + 20} y={RIGHT.y + 20} textAnchor="start" fontSize={9}  fontFamily="'IBM Plex Mono', monospace" fill="var(--faint)" letterSpacing="0.1em">SUN SIGN</text>

        {/* ── Numerology vertex — left ─────────────────────── */}
        <g filter="url(#glow-num)">
          <circle cx={LEFT.x} cy={LEFT.y} r={28} fill={NUM_COLOR} fillOpacity={0.12} />
          <circle cx={LEFT.x} cy={LEFT.y} r={14} fill={NUM_COLOR} />
        </g>
        <text x={LEFT.x - 20} y={LEFT.y - 12} textAnchor="end" fontSize={22} fontFamily="Space Grotesk, var(--font-hanken), sans-serif" fontWeight={700} fill={NUM_COLOR}>{numerology.lifePath}</text>
        <text x={LEFT.x - 20} y={LEFT.y + 6}  textAnchor="end" fontSize={9}  fontFamily="'IBM Plex Mono', monospace" fill="var(--faint)" letterSpacing="0.1em">LIFE PATH</text>
        <text x={LEFT.x - 20} y={LEFT.y + 20} textAnchor="end" fontSize={9}  fontFamily="'IBM Plex Mono', monospace" fill="var(--faint)" letterSpacing="0.1em">NUMEROLOGY</text>
      </svg>
    </div>
  );
}
