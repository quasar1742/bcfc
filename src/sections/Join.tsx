import { useEffect, useRef, useState, type FormEvent } from "react"
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
  const [formStatus, setFormStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle")
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

  const submitInterest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (formStatus === "sending") return
    setFormStatus("sending")

    const form = event.currentTarget
    try {
      const payload: Record<string, string> = {}
      new FormData(form).forEach((value, key) => {
        payload[key] = String(value)
      })
      payload._url = window.location.href

      const response = await fetch(
        "https://formsubmit.co/ajax/skhapra@berkeley.edu",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      )

      const contentType = response.headers.get("content-type") ?? ""
      const result = contentType.includes("application/json")
        ? ((await response.json()) as {
            success?: boolean | string
          })
        : null

      if (
        !response.ok ||
        result?.success === false ||
        result?.success === "false"
      ) {
        throw new Error("Form submission failed")
      }

      form.reset()
      setFormStatus("success")
    } catch {
      setFormStatus("error")
    }
  }

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

          <motion.form
            variants={staggerChild}
            action="https://formsubmit.co/skhapra@berkeley.edu"
            method="POST"
            onSubmit={submitInterest}
            className="mt-10 max-w-3xl"
          >
            <input
              type="hidden"
              name="_subject"
              value="New CF@B website inquiry"
            />
            <input type="hidden" name="_template" value="table" />
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor="cfab-company">Company</label>
              <input
                id="cfab-company"
                type="text"
                name="_honey"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
              <label className="block">
                <span className="font-display text-[12px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
                  {JOIN.form.nameLabel}
                </span>
                <input
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder={JOIN.form.namePlaceholder}
                  className="mt-2.5 w-full rounded-md border border-berkeley/20 bg-transparent px-4 py-3.5 font-display text-[16px] text-berkeley outline-none transition-colors placeholder:text-fog/55 hover:border-berkeley/35 focus:border-gold-deep focus:ring-2 focus:ring-gold/20"
                />
              </label>
              <label className="block">
                <span className="font-display text-[12px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
                  {JOIN.form.emailLabel}
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder={JOIN.form.emailPlaceholder}
                  className="mt-2.5 w-full rounded-md border border-berkeley/20 bg-transparent px-4 py-3.5 font-display text-[16px] text-berkeley outline-none transition-colors placeholder:text-fog/55 hover:border-berkeley/35 focus:border-gold-deep focus:ring-2 focus:ring-gold/20"
                />
              </label>
            </div>

            <label className="mt-5 block sm:mt-6">
              <span className="font-display text-[12px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
                {JOIN.form.interestLabel}
              </span>
              <select
                name="interest"
                required
                defaultValue=""
                className="mt-2.5 w-full appearance-none rounded-md border border-berkeley/20 bg-transparent px-4 py-3.5 font-display text-[16px] text-berkeley outline-none transition-colors hover:border-berkeley/35 focus:border-gold-deep focus:ring-2 focus:ring-gold/20"
              >
                <option value="" disabled>
                  Select one
                </option>
                {JOIN.form.interestOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-5 block sm:mt-6">
              <span className="font-display text-[12px] font-semibold uppercase tracking-[0.18em] text-gold-deep">
                {JOIN.form.messageLabel}
              </span>
              <textarea
                name="message"
                rows={4}
                required
                placeholder={JOIN.form.messagePlaceholder}
                className="mt-2.5 w-full resize-y rounded-md border border-berkeley/20 bg-transparent px-4 py-3.5 font-display text-[16px] leading-relaxed text-berkeley outline-none transition-colors placeholder:text-fog/55 hover:border-berkeley/35 focus:border-gold-deep focus:ring-2 focus:ring-gold/20"
              />
            </label>

            <div className="mt-6 flex flex-col items-start gap-4 sm:mt-7 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={formStatus === "sending"}
                className="inline-flex min-w-40 items-center justify-center rounded-md bg-gold px-7 py-3.5 font-display text-[15px] font-semibold tracking-[0.01em] text-berkeley transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-10px_rgba(231,184,83,0.48)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-berkeley focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:cursor-wait disabled:opacity-65 disabled:hover:translate-y-0"
              >
                {formStatus === "sending"
                  ? JOIN.form.sending
                  : JOIN.form.submit}
              </button>
              <p
                role="status"
                aria-live="polite"
                className={`font-display text-[14px] leading-relaxed ${
                  formStatus === "error" ? "text-maple" : "text-fog"
                }`}
              >
                {formStatus === "success"
                  ? JOIN.form.success
                  : formStatus === "error"
                    ? JOIN.form.error
                    : ""}
              </p>
            </div>
          </motion.form>

          <motion.div variants={staggerChild} className="mt-8">
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-fog">
              {JOIN.form.alternatives}
            </p>
            <div className="mt-3 flex flex-col items-stretch gap-3 min-[400px]:flex-row min-[400px]:flex-wrap min-[400px]:items-center">
              {JOIN.ctas.slice(1).map((cta) => (
                <GoldButton key={cta.label} href={cta.href} variant={cta.variant}>
                  {cta.label}
                </GoldButton>
              ))}
            </div>
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
