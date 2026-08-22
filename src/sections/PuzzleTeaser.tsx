import { motion, useReducedMotion } from "motion/react"
import { PUZZLE_TEASER } from "../lib/content"
import { reveal, revealStagger, staggerChild, VIEWPORT_ONCE } from "../lib/anim"
import { SectionKicker } from "../components/ui"
import { CardBack } from "../components/cards"

// ---------------------------------------------------------------------------
// Puzzle teaser: a compact aside, not a destination. One paragraph, one
// face-down card idling at ±2°. The real trigger (the maple leaf) lives in
// the ticker strips and the footer; this section only admits the leak exists.
// ---------------------------------------------------------------------------

export default function PuzzleTeaser() {
  const reducedMotion = useReducedMotion()

  return (
    <section
      id="puzzle"
      aria-labelledby="puzzle-heading"
      className="bg-paper py-20 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionKicker
          index={PUZZLE_TEASER.kicker.index}
          title={PUZZLE_TEASER.kicker.title}
        />

        <div className="mt-10 grid grid-cols-1 items-center gap-12 md:mt-12 lg:grid-cols-[1fr_auto]">
          {/* ---- Left: the admission ---- */}
          <motion.div
            variants={revealStagger}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
          >
            <motion.h2
              id="puzzle-heading"
              variants={staggerChild}
              className="font-display text-[clamp(28px,4vw,48px)] font-medium leading-[1.05] tracking-[-0.02em] text-berkeley"
            >
              {PUZZLE_TEASER.heading}
            </motion.h2>
            <motion.p
              variants={staggerChild}
              className="mt-5 max-w-xl font-display text-lg leading-relaxed text-berkeley/75 md:text-xl"
            >
              {PUZZLE_TEASER.body}
            </motion.p>
          </motion.div>

          {/* ---- Right: the face-down card, idling ---- */}
          <motion.div
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            aria-hidden="true"
            className="justify-self-center lg:justify-self-end lg:pr-4"
          >
            <div className="rotate-3">
              <motion.div
                animate={reducedMotion ? undefined : { rotate: [-2, 2] }}
                transition={
                  reducedMotion
                    ? undefined
                    : {
                        duration: 5,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                      }
                }
              >
                <CardBack
                  size={170}
                  className="drop-shadow-[0_18px_32px_rgba(7,31,42,0.22)]"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
