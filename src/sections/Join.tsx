import { useEffect, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react"
import { Accordion } from "radix-ui"
import { JOIN } from "../lib/content"
import { EASE, revealStagger, staggerChild, VIEWPORT_ONCE } from "../lib/anim"
import { GoldButton, SectionKicker } from "../components/ui"

// ---------------------------------------------------------------------------
// Join: the conversion section. One oversized invitation, three doors in,
// and a mini-FAQ that answers the only four questions anyone actually asks.
// ---------------------------------------------------------------------------

function PlusGlyph({ open }: { open: boolean }) {
  return (
    <motion.span
      aria-hidden="true"
      animate={{ rotate: open ? 45 : 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-gold-deep"
    >
      <svg viewBox="0 0 20 20" width={14} height={14} aria-hidden="true">
        <path
          d="M10 2.5 V17.5 M2.5 10 H17.5"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </svg>
    </motion.span>
  )
}

export default function Join() {
  const [value, setValue] = useState<string>("")
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion() ?? false
  const { scrollYProgress: entryProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  })
  const { scrollYProgress: sectionProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })
  const smoothEntry = useSpring(entryProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.7,
    restDelta: 0.0001,
  })
  const shellScaleX = useTransform(smoothEntry, [0, 0.92], [0.94, 1])
  const shellY = useTransform(smoothEntry, [0, 0.92], [48, 0])
  const shellRadius = useTransform(smoothEntry, [0, 0.92], [24, 0])
  const shellBorder = useTransform(
    smoothEntry,
    [0, 0.92],
    ["rgba(231, 184, 83, 0.15)", "rgba(231, 184, 83, 0)"],
  )

  useMotionValueEvent(sectionProgress, "change", (progress) => {
    const immersive =
      progress > 0.002 && progress < 0.998 && ref.current?.offsetParent != null
    document.documentElement.classList.toggle("join-immersive", immersive)
  })
  useEffect(
    () => () => document.documentElement.classList.remove("join-immersive"),
    [],
  )

  return (
    <section
      ref={ref}
      id="join"
      aria-labelledby="join-heading"
      className="relative isolate min-h-[100svh] overflow-hidden bg-transparent"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 origin-top border bg-paper/95 shadow-[0_28px_90px_-42px_rgba(0,0,0,0.65)] backdrop-blur-md will-change-transform"
        style={reduced
          ? { scaleX: 1, y: 0, borderRadius: 0, borderColor: "transparent" }
          : {
              scaleX: shellScaleX,
              y: shellY,
              borderRadius: shellRadius,
              borderColor: shellBorder,
            }
        }
      />
      <div className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24">
        <SectionKicker index={JOIN.kicker.index} title={JOIN.kicker.title} />

        {/* ---- The invitation ---- */}
        <motion.div
          variants={revealStagger}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="mt-10 sm:mt-12 md:mt-14"
        >
          <motion.h2
            variants={staggerChild}
            id="join-heading"
            className="font-display text-[clamp(42px,7vw,96px)] font-medium leading-[0.98] tracking-[-0.03em] text-berkeley sm:leading-[0.95]"
          >
            {JOIN.heading}
          </motion.h2>

          <motion.p
            variants={staggerChild}
            className="mt-5 max-w-2xl font-display text-lg leading-relaxed text-berkeley/75 sm:mt-6 sm:text-xl"
          >
            {JOIN.sub}
          </motion.p>

          <motion.div
            variants={staggerChild}
            className="mt-8 flex flex-col items-stretch gap-3 min-[400px]:flex-row min-[400px]:flex-wrap min-[400px]:items-center min-[400px]:gap-4 sm:mt-10"
          >
            {JOIN.ctas.map((cta) => (
              <GoldButton key={cta.label} href={cta.href} variant={cta.variant}>
                {cta.label}
              </GoldButton>
            ))}
          </motion.div>
        </motion.div>

        {/* ---- Mini-FAQ ---- */}
        <motion.div
          variants={revealStagger}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="mt-16 max-w-2xl sm:mt-20"
        >
          <Accordion.Root
            type="single"
            collapsible
            value={value}
            onValueChange={setValue}
            className="border-t border-berkeley/10"
          >
            {JOIN.faq.map(({ q, a }) => (
              <Accordion.Item key={q} value={q} asChild>
                <motion.div
                  variants={staggerChild}
                  className="border-b border-berkeley/10"
                >
                  <Accordion.Header asChild>
                    <h3>
                      <Accordion.Trigger className="flex w-full items-center justify-between gap-6 rounded-sm py-5 text-left font-display text-[17px] font-medium tracking-[-0.01em] text-berkeley transition-colors duration-200 hover:text-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-berkeley">
                        <span>{q}</span>
                        <PlusGlyph open={value === q} />
                      </Accordion.Trigger>
                    </h3>
                  </Accordion.Header>
                  <AnimatePresence initial={false}>
                    {value === q && (
                      <Accordion.Content asChild forceMount>
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-xl pb-6 font-display text-[16px] leading-relaxed text-berkeley/75">
                            {a}
                          </p>
                        </motion.div>
                      </Accordion.Content>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Accordion.Item>
            ))}
          </Accordion.Root>

          <motion.p
            variants={staggerChild}
            className="mt-10 font-display text-[12px] font-semibold uppercase tracking-[0.18em] text-fog"
          >
            {JOIN.footnote}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
