import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
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

  return (
    <section id="join" aria-labelledby="join-heading" className="bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
        <SectionKicker index={JOIN.kicker.index} title={JOIN.kicker.title} />

        {/* ---- The invitation ---- */}
        <motion.div
          variants={revealStagger}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="mt-12 md:mt-14"
        >
          <motion.h2
            variants={staggerChild}
            id="join-heading"
            className="font-display text-[clamp(48px,7vw,96px)] font-medium leading-[0.95] tracking-[-0.03em] text-berkeley"
          >
            {JOIN.heading}
          </motion.h2>

          <motion.p
            variants={staggerChild}
            className="mt-6 max-w-2xl font-display text-xl leading-relaxed text-berkeley/75"
          >
            {JOIN.sub}
          </motion.p>

          <motion.div
            variants={staggerChild}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            {JOIN.ctas.map((cta) => (
              <GoldButton key={cta.label} href={cta.href} variant={cta.variant}>
                {cta.label}
                {cta.variant === "solid" && <span aria-hidden="true">→</span>}
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
          className="mt-20 max-w-2xl"
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
