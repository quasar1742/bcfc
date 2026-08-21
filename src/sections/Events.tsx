import { Fragment, useEffect, useMemo, useState } from "react"
import { motion } from "motion/react"
import { EVENTS } from "../lib/content"
import { reveal, revealStagger, staggerChild, VIEWPORT_ONCE } from "../lib/anim"
import { SectionKicker } from "../components/ui"

// ---------------------------------------------------------------------------
// Calendar — a live T-minus board and a market-calendar schedule.
// Left: navy countdown card ticking to the first table. Right: mono rows,
// hairline separators, status chips. Nothing moves that doesn't have to.
// ---------------------------------------------------------------------------

const COUNTDOWN_UNITS = ["DAYS", "HRS", "MIN", "SEC"] as const

function useCountdownSeconds(targetIso: string) {
  const targetMs = useMemo(() => new Date(targetIso).getTime(), [targetIso])
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, Math.floor((targetMs - Date.now()) / 1000)),
  )
  useEffect(() => {
    const id = window.setInterval(() => {
      setSecondsLeft(Math.max(0, Math.floor((targetMs - Date.now()) / 1000)))
    }, 1000)
    return () => window.clearInterval(id)
  }, [targetMs])
  return secondsLeft
}

function CountdownCard() {
  const s = useCountdownSeconds(EVENTS.countdownTarget)
  const values = [
    String(Math.floor(s / 86400)).padStart(2, "0"),
    String(Math.floor((s % 86400) / 3600)).padStart(2, "0"),
    String(Math.floor((s % 3600) / 60)).padStart(2, "0"),
    String(s % 60).padStart(2, "0"),
  ]

  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      className="rounded-lg bg-berkeley p-8 text-paper shadow-[0_20px_50px_-30px_rgba(0,29,56,0.3)]"
    >
      <p className="mt-6 font-display text-[12px] font-semibold uppercase tracking-[0.24em] text-gold">
        {EVENTS.countdownLabel}
      </p>

      <div
        role="timer"
        aria-label={EVENTS.countdownLabel}
        className="tabular mt-7 flex items-start justify-between gap-1 sm:gap-2"
      >
        {COUNTDOWN_UNITS.map((unit, i) => (
          <Fragment key={unit}>
            {i > 0 && (
              <span
                aria-hidden="true"
                className="font-mono text-[clamp(34px,4vw,56px)] font-semibold leading-none text-gold/35"
              >
                :
              </span>
            )}
            <div className="flex flex-col items-center gap-2.5">
              <span className="font-mono text-[clamp(34px,4vw,56px)] font-semibold leading-none text-paper">
                {values[i]}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-mist">
                {unit}
              </span>
            </div>
          </Fragment>
        ))}
      </div>

      <p className="mt-8 border-t border-gold/20 pt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-mist">
        {targetCaption(EVENTS.countdownTarget)} · SEATS LIMITED BY TABLE COUNT
      </p>
    </motion.div>
  )
}

// "SEP 10 · 19:00 PT" derived from the target so it can never go stale.
function targetCaption(iso: string) {
  const d = new Date(iso)
  const date = d
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "America/Los_Angeles",
    })
    .toUpperCase()
  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Los_Angeles",
  })
  return `${date} · ${time} PT`
}

function StatusChip({ status }: { status: string }) {
  const confirmed = status === "CONFIRMED"
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] ${
        confirmed
          ? "border-gold-deep/60 text-gold-deep"
          : "border-fog/40 text-fog"
      }`}
    >
      {status}
    </span>
  )
}

export default function Events() {
  return (
    <section
      id="calendar"
      aria-labelledby="calendar-heading"
      className="bg-paper py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionKicker
          index={EVENTS.kicker.index}
          title={EVENTS.kicker.title}
        />

        <motion.h2
          id="calendar-heading"
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          className="mt-6 font-display text-[clamp(32px,4.5vw,64px)] font-medium leading-[0.95] tracking-[-0.02em] text-berkeley"
        >
          {EVENTS.heading}
        </motion.h2>

        <div className="mt-14 grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          {/* ---- Left: T-minus ---- */}
          <CountdownCard />

          {/* ---- Right: the schedule ---- */}
          <div>
            <motion.ul
              variants={revealStagger}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
              className="border-t border-berkeley/10"
            >
              {EVENTS.rows.map((row) => (
                <motion.li
                  key={row.event}
                  variants={staggerChild}
                  className="grid grid-cols-1 gap-1.5 border-b border-berkeley/10 py-5 transition-colors duration-150 hover:bg-paper-soft sm:grid-cols-[1.1fr_1.6fr_1fr_auto] sm:items-baseline sm:gap-4"
                >
                  <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-gold-deep">
                    {row.date}
                  </p>
                  <p className="font-display text-lg font-medium leading-snug text-berkeley">
                    {row.event}
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fog">
                    {row.venue}
                  </p>
                  <p className="mt-1 sm:mt-0">
                    <StatusChip status={row.status} />
                  </p>
                </motion.li>
              ))}
            </motion.ul>

            <motion.p
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT_ONCE}
              className="mt-6 text-right font-display text-[12px] text-fog"
            >
              {EVENTS.smallPrint}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  )
}
