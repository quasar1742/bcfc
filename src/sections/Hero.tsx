import { useRef, type CSSProperties, type PointerEvent } from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react"
import { GoldButton } from "../components/ui"
import UnderwaterScene from "../hero/UnderwaterScene"
import { EASE } from "../lib/anim"
import { HERO, SPONSORS } from "../lib/content"

type OceanHeroStyle = CSSProperties & {
  "--ocean-shift-x": string
  "--ocean-shift-y": string
}

export default function Hero() {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const sceneY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reducedMotion ? 0 : 130],
  )
  const copyY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, reducedMotion ? 0 : -34],
  )
  const copyOpacity = useTransform(scrollYProgress, [0, 0.76, 1], [1, 1, 0])

  const moveWater = (event: PointerEvent<HTMLElement>) => {
    if (reducedMotion) return
    const box = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - box.left) / box.width - 0.5
    const y = (event.clientY - box.top) / box.height - 0.5
    event.currentTarget.style.setProperty("--ocean-shift-x", `${x * -18}px`)
    event.currentTarget.style.setProperty("--ocean-shift-y", `${y * -12}px`)
  }

  const stillWater = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--ocean-shift-x", "0px")
    event.currentTarget.style.setProperty("--ocean-shift-y", "0px")
  }

  const heroStyle: OceanHeroStyle = {
    "--ocean-shift-x": "0px",
    "--ocean-shift-y": "0px",
  }

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-labelledby="hero-title"
      className="ocean-hero"
      style={heroStyle}
      onPointerMove={moveWater}
      onPointerLeave={stillWater}
    >
      <motion.div className="absolute inset-0" style={{ y: sceneY }}>
        <UnderwaterScene />
      </motion.div>

      <motion.div
        className="ocean-hero-content"
        style={{ y: copyY, opacity: copyOpacity }}
      >
        <h1 id="hero-title" className="ocean-title">
          {HERO.titleLines.map((line, index) => (
            <span
              key={line}
              className="-mx-[0.045em] block overflow-hidden px-[0.045em] pb-[0.04em]"
            >
              <motion.span
                className={`block ${index === HERO.titleLines.length - 1 ? "ocean-title-accent" : ""}`}
                initial={{ y: "108%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.86,
                  ease: EASE,
                  delay: 0.22 + index * 0.11,
                }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.68, ease: EASE, delay: 0.58 }}
          className="ocean-tagline"
        >
          {HERO.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, ease: EASE, delay: 0.74 }}
          className="ocean-subtitle"
        >
          {HERO.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, ease: EASE, delay: 0.9 }}
          className="ocean-actions"
        >
          <GoldButton targetId={HERO.ctaPrimary.id} variant="solid" dark>
            {HERO.ctaPrimary.label}
          </GoldButton>
          <GoldButton targetId={HERO.ctaSecondary.id} variant="ghost" dark>
            {HERO.ctaSecondary.label}
          </GoldButton>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.62, ease: EASE, delay: 1.04 }}
          className="ocean-hero-sponsor"
          aria-label={`${SPONSORS.janeStreet.name}, BCFC premiere sponsor`}
        >
          <span>{HERO.sponsorLabel}</span>
          <a
            href={SPONSORS.janeStreet.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Visit ${SPONSORS.janeStreet.name}`}
          >
            <img
              src={SPONSORS.janeStreet.logo}
              alt={SPONSORS.janeStreet.name}
            />
          </a>
        </motion.aside>
      </motion.div>

      <div className="ocean-hero-handoff" aria-hidden="true" />

      <motion.a
        href="#dive"
        className="ocean-dive-cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.25 }}
        onClick={(event) => {
          event.preventDefault()
          document.getElementById("dive")?.scrollIntoView({
            behavior: reducedMotion ? "auto" : "smooth",
          })
        }}
      >
        <span>{HERO.diveCue}</span>
        <i aria-hidden="true">↓</i>
      </motion.a>
    </section>
  )
}
