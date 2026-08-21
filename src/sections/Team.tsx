import { useState } from "react"
import { motion } from "motion/react"
import { TEAM } from "../lib/content"
import {
  revealStagger,
  staggerChild,
  SPRING_FIRM,
  VIEWPORT_ONCE,
} from "../lib/anim"
import { SectionKicker } from "../components/ui"
import { CardBack, SuitGlyph } from "../components/cards"

// ---------------------------------------------------------------------------
// The Table — the founding six as a calm, responsive card grid. Hover, focus,
// or tap flips a card to reveal the seat; nothing moves across the screen.
// ---------------------------------------------------------------------------

type TeamCard = (typeof TEAM.cards)[number]

function FlipCard({
  card,
}: {
  card: TeamCard
}) {
  const [flipped, setFlipped] = useState(false)
  const red = card.suit === "hearts" || card.suit === "diamonds"

  return (
    <button
      type="button"
      className="flip-scene w-full max-w-[170px] cursor-default rounded-[14px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-berkeley"
      aria-label={`${card.role}, ${card.rank} of ${card.suit}`}
      aria-pressed={flipped}
      onClick={() => setFlipped((f) => !f)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onFocus={() => setFlipped(true)}
      onBlur={() => setFlipped(false)}
    >
      <FlipInner card={card} flipped={flipped} red={red} />
    </button>
  )
}

function FlipInner({
  card,
  flipped,
  red,
}: {
  card: TeamCard
  flipped: boolean
  red: boolean
}) {
  return (
    <motion.div
      className="flip-inner relative aspect-[250/350]"
      animate={{ rotateY: flipped ? 180 : 0 }}
      transition={SPRING_FIRM}
    >
      {/* front — face down */}
      <div className="flip-face absolute inset-0" aria-hidden="true">
        <CardBack size={170} className="h-auto w-full" />
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

export default function Team() {
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

      <motion.div
        variants={revealStagger}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        className="mx-auto mt-16 grid max-w-6xl grid-cols-2 justify-items-center gap-4 px-6 sm:grid-cols-3 sm:gap-6 md:px-10 lg:grid-cols-6 lg:gap-5"
      >
        {TEAM.cards.map((card) => (
          <motion.div key={card.role} variants={staggerChild} className="flex w-full justify-center">
            <FlipCard card={card} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
