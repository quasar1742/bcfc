import { useId, type CSSProperties } from "react"
import type { Suit } from "../lib/content"

// ---------------------------------------------------------------------------
// BCFC card system — geometric modern playing cards, drawn in SVG.
// Berkeley Blue + California Gold, banknote-guilloche card back with the
// maple-leaf-meets-Campanile medallion.
// ---------------------------------------------------------------------------

export const SUIT_PATHS: Record<Suit, string> = {
  spades:
    "M12 1.6C9.2 6.5 4.4 8.9 4.4 12.7c0 2.4 1.9 3.9 4 3.9 1.3 0 2.4-.6 3-1.4-.3 1.9-1 3.4-2.3 4.7h5.8c-1.3-1.3-2-2.8-2.3-4.7.6.8 1.7 1.4 3 1.4 2.1 0 4-1.5 4-3.9 0-3.8-4.8-6.2-7.6-11.1Z",
  hearts:
    "M12 20.8C6.9 16.6 3.6 13.5 3.6 10c0-2.8 2-4.7 4.4-4.7 1.6 0 3 .8 4 2.2 1-1.4 2.4-2.2 4-2.2 2.4 0 4.4 1.9 4.4 4.7 0 3.5-3.3 6.6-8.4 10.8Z",
  clubs:
    "M12 1.8a3.9 3.9 0 0 0-3.9 3.9c0 .74.2 1.43.57 2.02a3.9 3.9 0 1 0 1.87 6.86c.14 1.77-.5 3.36-1.84 5.02h6.6c-1.34-1.66-1.98-3.25-1.84-5.02a3.9 3.9 0 1 0 1.87-6.86c.36-.6.57-1.28.57-2.02A3.9 3.9 0 0 0 12 1.8Z",
  diamonds: "M12 1.8 18.6 12 12 22.2 5.4 12Z",
}

const SUIT_COLOR: Record<Suit, string> = {
  spades: "var(--color-berkeley)",
  clubs: "var(--color-berkeley)",
  hearts: "var(--color-maple)",
  diamonds: "var(--color-maple)",
}

export const SUIT_CHAR: Record<Suit, string> = {
  spades: "♠",
  hearts: "♥",
  clubs: "♣",
  diamonds: "♦",
}

export function SuitGlyph({
  suit,
  size = 24,
  color,
  className,
  style,
}: {
  suit: Suit
  size?: number
  color?: string
  className?: string
  style?: CSSProperties
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d={SUIT_PATHS[suit]} fill={color ?? SUIT_COLOR[suit]} />
    </svg>
  )
}

// Banknote rosette: two families of rotated ellipses.
function Guilloche({
  cx,
  cy,
  scale = 1,
  opacity = 0.16,
  stroke = "var(--color-gold)",
}: {
  cx: number
  cy: number
  scale?: number
  opacity?: number
  stroke?: string
}) {
  const rings = []
  for (let i = 0; i < 12; i++) {
    rings.push(
      <ellipse
        key={`a${i}`}
        cx={0}
        cy={0}
        rx={88}
        ry={26}
        transform={`rotate(${i * 15})`}
      />,
    )
  }
  for (let i = 0; i < 8; i++) {
    rings.push(
      <ellipse
        key={`b${i}`}
        cx={0}
        cy={0}
        rx={62}
        ry={44}
        transform={`rotate(${i * 22.5 + 11})`}
      />,
    )
  }
  return (
    <g
      transform={`translate(${cx} ${cy}) scale(${scale})`}
      fill="none"
      stroke={stroke}
      strokeWidth={0.8 / scale}
      opacity={opacity}
    >
      {rings}
    </g>
  )
}

// Maple leaf (decorative 11-point) centred on 0,0 in a ~24 unit box.
export const MAPLE_LEAF_PATH =
  "M0 -10.5 L1.7 -7.1 L4 -8.2 L3.4 -5 L6.7 -5.6 L5.3 -2.8 L8.5 -1.6 L6 0.4 L7.9 3 L4.5 3.1 L5 6.5 L2 5 L1.1 8.2 L0 5.8 L-1.1 8.2 L-2 5 L-5 6.5 L-4.5 3.1 L-7.9 3 L-6 0.4 L-8.5 -1.6 L-5.3 -2.8 L-6.7 -5.6 L-3.4 -5 L-4 -8.2 L-1.7 -7.1 Z"

// The Campanile (Sather Tower), simplified to a mark. Centred on 0,0.
function Campanile({ fill = "var(--color-berkeley)" }: { fill?: string }) {
  return (
    <g fill={fill}>
      {/* shaft */}
      <path d="M-2.6 9.5 V-3.6 H2.6 V9.5 Z" />
      {/* spire */}
      <path d="M-3.4 -3.6 L0 -9.8 L3.4 -3.6 Z" />
      {/* belfry openings, knocked out in gold */}
      <rect x={-1.7} y={-2.6} width={1.1} height={3.4} fill="var(--color-gold)" />
      <rect x={0.6} y={-2.6} width={1.1} height={3.4} fill="var(--color-gold)" />
      {/* clock */}
      <circle cx={0} cy={3.2} r={1.5} fill="var(--color-gold)" />
      <circle cx={0} cy={3.2} r={0.5} fill={fill} />
    </g>
  )
}

// The medallion: maple leaf bearing the Campanile — the club's mark.
export function Medallion({
  size = 96,
  ring = true,
}: {
  size?: number
  ring?: boolean
}) {
  return (
    <svg viewBox="-30 -30 60 60" width={size} height={size} aria-hidden="true">
      {ring && (
        <>
          <circle
            r={27}
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth={1}
            opacity={0.9}
          />
          <circle
            r={23.5}
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth={0.5}
            opacity={0.5}
          />
        </>
      )}
      <g transform="scale(1.9)">
        <path d={MAPLE_LEAF_PATH} fill="var(--color-gold)" />
        <path d="M-0.6 8 H0.6 L0.9 12.2 H-0.9 Z" fill="var(--color-gold)" />
      </g>
      <g transform="translate(0 -1.5)">
        <Campanile />
      </g>
    </svg>
  )
}

const CARD_W = 250
const CARD_H = 350

export function PlayingCard({
  rank,
  suit,
  size = 180,
  label,
  faceDown = false,
  className,
  style,
}: {
  rank: string
  suit: Suit
  size?: number
  label?: string
  faceDown?: boolean
  className?: string
  style?: CSSProperties
}) {
  if (faceDown) {
    return <CardBack size={size} className={className} style={style} />
  }
  const color = SUIT_COLOR[suit]
  return (
    <svg
      viewBox={`0 0 ${CARD_W} ${CARD_H}`}
      width={size}
      height={(size * CARD_H) / CARD_W}
      className={className}
      style={style}
      role="img"
      aria-label={`${rank} of ${suit}`}
    >
      <rect
        x={1}
        y={1}
        width={CARD_W - 2}
        height={CARD_H - 2}
        rx={18}
        fill="var(--color-card)"
        stroke="var(--color-berkeley)"
        strokeOpacity={0.22}
        strokeWidth={1.5}
      />
      {/* foil frame */}
      <rect
        x={11}
        y={11}
        width={CARD_W - 22}
        height={CARD_H - 22}
        rx={11}
        fill="none"
        stroke="var(--color-gold-deep)"
        strokeOpacity={0.5}
        strokeWidth={1}
      />
      {/* corner ticks */}
      <g stroke="var(--color-gold-deep)" strokeOpacity={0.8} strokeWidth={1.5}>
        <path d="M11 26 V11 H26" fill="none" />
        <path d={`M${CARD_W - 26} 11 H${CARD_W - 11} V26`} fill="none" />
        <path d={`M11 ${CARD_H - 26} V${CARD_H - 11} H26`} fill="none" />
        <path
          d={`M${CARD_W - 26} ${CARD_H - 11} H${CARD_W - 11} V${CARD_H - 26}`}
          fill="none"
        />
      </g>
      {/* faint rosette behind the pip */}
      <Guilloche
        cx={CARD_W / 2}
        cy={CARD_H / 2}
        scale={0.85}
        opacity={0.1}
        stroke="var(--color-gold-deep)"
      />
      {/* corner indices, mono */}
      <g>
        <text
          x={26}
          y={52}
          fontFamily="var(--font-mono)"
          fontWeight={600}
          fontSize={34}
          fill={color}
        >
          {rank}
        </text>
        <g transform={`translate(26 62)`}>
          <path d={SUIT_PATHS[suit]} fill={color} transform="scale(1.05)" />
        </g>
      </g>
      <g transform={`rotate(180 ${CARD_W / 2} ${CARD_H / 2})`}>
        <text
          x={26}
          y={52}
          fontFamily="var(--font-mono)"
          fontWeight={600}
          fontSize={34}
          fill={color}
        >
          {rank}
        </text>
        <g transform={`translate(26 62)`}>
          <path d={SUIT_PATHS[suit]} fill={color} transform="scale(1.05)" />
        </g>
      </g>
      {/* centre pip */}
      <g
        transform={`translate(${CARD_W / 2 - 45} ${CARD_H / 2 - 45}) scale(3.75)`}
      >
        <path d={SUIT_PATHS[suit]} fill={color} />
      </g>
      {label && (
        <text
          x={CARD_W / 2}
          y={CARD_H - 24}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={10}
          letterSpacing={2}
          fill="var(--color-fog)"
        >
          {label}
        </text>
      )}
    </svg>
  )
}

export function CardBack({
  size = 180,
  className,
  style,
}: {
  size?: number
  className?: string
  style?: CSSProperties
}) {
  const clipId = useId()
  return (
    <svg
      viewBox={`0 0 ${CARD_W} ${CARD_H}`}
      width={size}
      height={(size * CARD_H) / CARD_W}
      className={className}
      style={style}
      aria-hidden="true"
    >
      <rect
        x={1}
        y={1}
        width={CARD_W - 2}
        height={CARD_H - 2}
        rx={18}
        fill="var(--color-berkeley)"
        stroke="var(--color-berkeley-deep)"
        strokeWidth={1.5}
      />
      <rect
        x={11}
        y={11}
        width={CARD_W - 22}
        height={CARD_H - 22}
        rx={11}
        fill="none"
        stroke="var(--color-gold)"
        strokeOpacity={0.55}
        strokeWidth={1}
      />
      <rect
        x={17}
        y={17}
        width={CARD_W - 34}
        height={CARD_H - 34}
        rx={8}
        fill="none"
        stroke="var(--color-gold)"
        strokeOpacity={0.25}
        strokeWidth={0.5}
      />
      <clipPath id={clipId}>
        <rect x={17} y={17} width={CARD_W - 34} height={CARD_H - 34} rx={8} />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <Guilloche cx={CARD_W / 2} cy={CARD_H / 2} scale={1.15} opacity={0.18} />
        <Guilloche cx={CARD_W / 2} cy={-10} scale={0.55} opacity={0.12} />
        <Guilloche cx={CARD_W / 2} cy={CARD_H + 10} scale={0.55} opacity={0.12} />
      </g>
      {/* medallion */}
      <g transform={`translate(${CARD_W / 2} ${CARD_H / 2})`}>
        <circle
          r={52}
          fill="var(--color-berkeley)"
          stroke="var(--color-gold)"
          strokeWidth={1.2}
        />
        <circle
          r={46}
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth={0.5}
          opacity={0.5}
        />
        <g transform="scale(3.6)">
          <path d={MAPLE_LEAF_PATH} fill="var(--color-gold)" />
          <path d="M-0.6 8 H0.6 L0.9 11.6 H-0.9 Z" fill="var(--color-gold)" />
        </g>
        <g transform="translate(0 -3) scale(1.9)">
          <Campanile />
        </g>
      </g>
      <text
        x={CARD_W / 2}
        y={CARD_H / 2 + 78}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={11}
        letterSpacing={3}
        fill="var(--color-gold)"
        opacity={0.85}
      >
        BCFC · MMXXVI
      </text>
    </svg>
  )
}

// Static arc fan of cards (Hero builds its own animated fan).
export function CardFan({
  cards,
  size = 150,
  spread = 32,
  className,
}: {
  cards: readonly { rank: string; suit: Suit }[]
  size?: number
  spread?: number
  className?: string
}) {
  const n = cards.length
  return (
    <div
      className={`relative ${className ?? ""}`}
      style={{ width: size * 2.2, height: size * 1.9 }}
    >
      {cards.map((c, i) => {
        const r = n === 1 ? 0 : -spread / 2 + (spread / (n - 1)) * i
        return (
          <div
            key={`${c.rank}${c.suit}`}
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `translate(-50%, -55%) rotate(${r}deg)`,
              transformOrigin: "50% 130%",
            }}
          >
            <PlayingCard rank={c.rank} suit={c.suit} size={size} />
          </div>
        )
      })}
    </div>
  )
}
