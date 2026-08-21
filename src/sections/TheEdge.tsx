import { useRef } from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react"
import { THE_EDGE } from "../lib/content"
import { reveal, revealStagger, staggerChild, VIEWPORT_ONCE } from "../lib/anim"
import { SectionKicker } from "../components/ui"
import { Medallion } from "../components/cards"

// ---------------------------------------------------------------------------
// The Edge — why card people make good quants. Navy editorial section:
// four theses in a 2×2 grid over a faint parallaxed medallion, closed by
// the pull quote.
// ---------------------------------------------------------------------------

export default function TheEdge() {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const medallionY = useTransform(
    scrollYProgress,
    [0, 1],
    reducedMotion ? [0, 0] : [-40, 40],
  )

  return (
    <section
      ref={sectionRef}
      id="edge"
      aria-labelledby="edge-heading"
      className="relative overflow-hidden bg-berkeley text-paper"
    >
      {/* Faint foil medallion, drifting slower than the scroll. */}
      <motion.div
        style={{ y: medallionY }}
        className="pointer-events-none absolute -right-56 top-24 opacity-[0.05] md:-right-36"
        aria-hidden="true"
      >
        <Medallion size={700} ring={false} />
      </motion.div>

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
        <SectionKicker
          index={THE_EDGE.kicker.index}
          title={THE_EDGE.kicker.title}
          dark
        />

        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
        >
          <h2
            id="edge-heading"
            className="mt-10 font-display text-[clamp(32px,4.5vw,64px)] font-medium leading-[0.98] tracking-[-0.02em] text-paper"
          >
            {THE_EDGE.heading}
          </h2>
          <p className="mt-6 max-w-2xl font-display text-lg leading-relaxed text-mist md:text-xl">
            {THE_EDGE.intro}
          </p>
        </motion.div>

        {/* ---- The four theses ---- */}
        <motion.div
          variants={revealStagger}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="mt-16 grid gap-x-12 gap-y-12 md:grid-cols-2"
        >
          {THE_EDGE.theses.map((thesis, i) => (
            <motion.div key={thesis.kicker} variants={staggerChild}>
              <h3 className="font-display text-[12px] font-semibold uppercase tracking-[0.24em] text-gold">
                <span className="mr-3 text-gold/60" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {thesis.kicker}
              </h3>
              <p className="mt-5 font-display text-[17px] leading-relaxed text-paper/85">
                {thesis.body}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ---- Pull quote ---- */}
        <motion.figure
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="mt-24 max-w-3xl"
        >
          <blockquote className="mt-8 font-display text-[clamp(26px,3.4vw,44px)] font-medium leading-tight tracking-[-0.01em] text-gold">
            {THE_EDGE.pullQuote}
          </blockquote>
          <figcaption className="mt-5 font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-mist">
            {THE_EDGE.pullQuoteAttribution}
          </figcaption>
        </motion.figure>
      </div>
    </section>
  )
}
