import { useState, type CSSProperties } from "react"
import { motion, useReducedMotion } from "motion/react"
import { TEAM } from "../lib/content"
import {
  reveal,
  revealStagger,
  staggerChild,
  SPRING_FIRM,
  VIEWPORT_ONCE,
} from "../lib/anim"
import { SectionKicker } from "../components/ui"
import { CardBack, SuitGlyph } from "../components/cards"

// ---------------------------------------------------------------------------
// The Table — the founding six as a two-row card marquee (the HackMIT steal).
// Face-down backs drift past; hover or focus flips a card to reveal the seat.
// Firm spring, no bounce. Reduced motion: static rows, horizontal scroll.
// ---------------------------------------------------------------------------

type TeamCard = (typeof TEAM.cards)[number]

// Each run repeats its three cards enough times that a single run is wider
// than the widest supported viewport — the -50% loop is only seamless when
// one run covers the screen. 21 tiles ≈ 4242px, clear of 4K (3840px).
const RUN_REPEATS = 7

function FlipCard({
  card,
  decorative = false,
  instant = false,
}: {
  card: TeamCard
  decorative?: boolean
  instant?: boolean
}) {
  const [flipped, setFlipped] = useState(false)
  const red = card.suit === "hearts" || card.suit === "diamonds"

  if (decorative) {
    // Marquee filler and aria-hidden clones: hover flip only, no semantics.
    return (
      <div
        className="flip-scene mx-4 w-[170px] shrink-0"
        aria-hidden="true"
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
      >
        <FlipInner card={card} flipped={flipped} instant={instant} red={red} />
      </div>
    )
  }

  return (
    <button
      type="button"
      className="flip-scene mx-4 w-[170px] shrink-0 cursor-default rounded-[14px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-berkeley"
      aria-label={`${card.role}, ${card.rank} of ${card.suit}`}
      aria-pressed={flipped}
      onClick={() => setFlipped((f) => !f)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onFocus={() => setFlipped(true)}
      onBlur={() => setFlipped(false)}
    >
      <FlipInner card={card} flipped={flipped} instant={instant} red={red} />
    </button>
  )
}

function FlipInner({
  card,
  flipped,
  instant,
  red,
}: {
  card: TeamCard
  flipped: boolean
  instant: boolean
  red: boolean
}) {
  return (
    <motion.div
      className="flip-inner relative aspect-[250/350]"
      animate={{ rotateY: flipped ? 180 : 0 }}
      transition={instant ? { duration: 0 } : SPRING_FIRM}
    >
      {/* front — face down */}
      <div className="flip-face absolute inset-0" aria-hidden="true">
        <CardBack size={170} />
      </div>

      {/* back — the seat card */}
      <div
        className="flip-face absolute inset-0 flex flex-col justify-between rounded-[14px] border border-gold/40 bg-card p-4 text-berkeley"
        style={{ transform: "rotateY(180deg)" }}
      >
        <div className="flex items-center justify-between">
          <span
            className={`font-mono text-[22px] font-semibold leading-none ${
              red ? "text-maple" : "text-berkeley"
            }`}
          >
            {card.rank}
          </span>
          <SuitGlyph suit={card.suit} size={20} />
        </div>

        <div>
          <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.2em] text-berkeley">
            {card.role}
          </p>
          <p className="mt-2 font-display text-[13px] leading-snug text-fog">
            {card.note}
          </p>
        </div>

        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-gold-deep">
          {card.open ? TEAM.openLabel : TEAM.claimedLabel}
        </p>
      </div>
    </motion.div>
  )
}

function MarqueeRow({
  cards,
  duration,
  reverse = false,
  reduced,
}: {
  cards: readonly TeamCard[]
  duration: string
  reverse?: boolean
  reduced: boolean
}) {
  // Pause the CSS animation while any card in the row holds keyboard focus
  // (hover pause is handled in CSS).
  const [focusPaused, setFocusPaused] = useState(false)

  if (reduced) {
    // Static fallback: the unique cards, horizontally scrollable.
    return (
      <div className="marquee-row overflow-x-auto">
        <div className="flex w-max items-center px-6 py-2 md:px-10">
          {cards.map((card) => (
            <FlipCard key={card.role} card={card} instant />
          ))}
        </div>
      </div>
    )
  }

  const run: TeamCard[] = []
  for (let r = 0; r < RUN_REPEATS; r++) run.push(...cards)

  const renderRun = (hidden: boolean) => (
    <div className="flex items-center py-2" aria-hidden={hidden || undefined}>
      {run.map((card, i) => (
        <FlipCard
          key={`${card.role}-${i}`}
          card={card}
          decorative={hidden || i >= cards.length}
        />
      ))}
    </div>
  )

  return (
    <div
      className="marquee-row overflow-hidden"
      onFocus={() => setFocusPaused(true)}
      onBlur={() => setFocusPaused(false)}
    >
      <div
        className={`marquee-track ${reverse ? "marquee-track--reverse" : ""}`}
        style={
          {
            "--marquee-duration": duration,
            ...(focusPaused ? { animationPlayState: "paused" } : null),
          } as CSSProperties
        }
      >
        {renderRun(false)}
        {renderRun(true)}
      </div>
    </div>
  )
}

export default function Team() {
  const reducedMotion = useReducedMotion()
  const rowOne = TEAM.cards.slice(0, 3)
  const rowTwo = TEAM.cards.slice(3)

  return (
    <section
      id="table"
      aria-labelledby="table-heading"
      className="relative overflow-hidden bg-berkeley py-24 text-paper md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionKicker index={TEAM.kicker.index} title={TEAM.kicker.title} dark />

        <motion.div
          variants={revealStagger}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="mt-10"
        >
          <motion.h2
            id="table-heading"
            variants={staggerChild}
            className="max-w-3xl font-display text-[clamp(32px,4.5vw,64px)] font-medium leading-[1.02] tracking-[-0.02em] text-paper"
          >
            {TEAM.heading}
          </motion.h2>
          <motion.p
            variants={staggerChild}
            className="mt-5 max-w-xl font-display text-lg leading-relaxed text-mist md:text-xl"
          >
            {TEAM.sub}
          </motion.p>
        </motion.div>
      </div>

      {/* Full-bleed marquee — the section itself is already full width. */}
      <div className="mt-16 w-full">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="relative"
        >
          {!reducedMotion && (
            <>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-berkeley to-transparent md:w-24"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-berkeley to-transparent md:w-24"
              />
            </>
          )}

          <div className="space-y-6">
            <MarqueeRow
              cards={rowOne}
              duration="122s"
              reduced={!!reducedMotion}
            />
            <MarqueeRow
              cards={rowTwo}
              duration="150s"
              reverse
              reduced={!!reducedMotion}
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
