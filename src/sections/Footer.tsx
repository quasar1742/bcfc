import { motion, useReducedMotion } from "motion/react"
import { FOOTER, NAV } from "../lib/content"
import { reveal, revealStagger, staggerChild, VIEWPORT_ONCE } from "../lib/anim"
import { scrollToId } from "../components/ui"
import { SuitGlyph } from "../components/cards"

// ---------------------------------------------------------------------------
// Footer — berkeley-deep close. Monogram, index, colophon, fine print; a lone
// gold fish swims the width of it.
// ---------------------------------------------------------------------------

const COORDINATES = "BERKELEY, CALIFORNIA · 37.8719° N, 122.2585° W"

const FOOTER_LINKS = [...NAV.links, NAV.cta]

// Minimal line-art fish, facing right (its direction of travel).
const FISH_BODY =
  "M55 13 C48.5 5.5 37.5 3.2 28.5 6.2 C21.5 8.6 15.5 11.6 11.5 13 C15.5 14.4 21.5 17.4 28.5 19.8 C37.5 22.8 48.5 20.5 55 13 Z"
const FISH_TAIL =
  "M12 13 C7.5 9.2 5 6 3.2 3.6 C4.6 8.4 4.6 17.6 3.2 22.4 C5 20 7.5 16.8 12 13 Z"
const FISH_GILL = "M44.5 8.2 C42.8 11.2 42.8 14.8 44.5 17.8"

function SwimmingFish() {
  const reducedMotion = useReducedMotion()
  if (reducedMotion) return null
  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-10"
      aria-hidden="true"
      animate={{ x: ["-15vw", "115vw"] }}
      transition={{
        duration: 26,
        ease: "linear",
        repeat: Infinity,
        repeatDelay: 6,
      }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 58 26" width={90} height={40} aria-hidden="true">
          <g
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.75}
          >
            <path d={FISH_BODY} />
            <path d={FISH_TAIL} />
            <path d={FISH_GILL} />
          </g>
          <circle cx={48.8} cy={11} r={1.2} fill="var(--color-gold)" />
        </svg>
      </motion.div>
    </motion.div>
  )
}

const HEADING_CLASS =
  "font-display text-[11px] font-semibold uppercase tracking-[0.24em] text-gold"

export default function Footer() {
  return (
    <footer
      aria-labelledby="footer-heading"
      className="relative overflow-hidden border-t border-gold/20 bg-berkeley-deep py-16 text-paper md:py-20"
    >
      <SwimmingFish />

      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        <motion.div
          variants={revealStagger}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]"
        >
          {/* ---- Monogram ---- */}
          <motion.div variants={staggerChild}>
            <h2
              id="footer-heading"
              className="flex items-center gap-2.5 font-display text-2xl font-semibold tracking-[-0.02em] text-paper"
            >
              {NAV.monogram}
              <SuitGlyph suit="spades" size={14} color="var(--color-gold)" />
            </h2>
            <p className="mt-4 max-w-xs font-display text-[13px] leading-relaxed tracking-[0.01em] text-mist">
              {FOOTER.blurb}
            </p>
          </motion.div>

          {/* ---- Index ---- */}
          <motion.nav variants={staggerChild} aria-label="Footer">
            <h3 className={HEADING_CLASS}>{FOOTER.navHeading}</h3>
            <ul className="mt-4 space-y-0.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => scrollToId(link.id)}
                    className="cursor-pointer rounded-sm py-1 font-display text-[14px] font-medium tracking-[0.01em] text-mist transition-colors duration-200 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* ---- Colophon & fine print ---- */}
          <motion.div variants={staggerChild}>
            <h3 className={HEADING_CLASS}>{FOOTER.colophonHeading}</h3>
            <p className="mt-4 font-display text-[13px] leading-relaxed text-mist">
              {FOOTER.colophon}
            </p>
            <h3 className={`mt-8 ${HEADING_CLASS}`}>{FOOTER.fineHeading}</h3>
            <p className="mt-4 font-display text-[13px] leading-relaxed text-mist">
              {FOOTER.fine}
            </p>
          </motion.div>
        </motion.div>

        {/* ---- Bottom row ---- */}
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-gold/15 pt-6"
        >
          <p className="font-mono text-[11px] tracking-[0.18em] text-mist">
            {FOOTER.copyright}
          </p>
          <p className="font-mono text-[11px] tracking-[0.18em] text-mist/70">
            {COORDINATES}
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
