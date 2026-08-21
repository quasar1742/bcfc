import { lazy, Suspense, useEffect, useRef, useState } from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react"
import { HERO } from "../lib/content"
import { EASE, SPRING_FIRM } from "../lib/anim"
import { GoldButton } from "../components/ui"

// three.js ships in its own chunk so the first paint never waits on it.
const CardScene = lazy(() => import("../three/CardScene"))

// ---------------------------------------------------------------------------
// Hero: Citadel-clean white left column, deep-navy 3D card well on the right
// with a live ask log riding its lower edge and the position matrix below.
// ---------------------------------------------------------------------------

const SEATS = ["1", "2", "3", "4", "5", "6"]
const BOOKS = ["S↑", "S↓", "H↑", "H↓", "C↑", "C↓", "D↑", "D↓"]

type CellState = 0 | 1 | 2 // unknown | eliminated | located

function useMatrix(active: boolean) {
  const [cells, setCells] = useState<CellState[]>(() => {
    const seed = Array.from({ length: 48 }, (_, i) =>
      i % 11 === 0 ? 2 : i % 4 === 0 ? 1 : 0,
    ) as CellState[]
    return seed
  })
  useEffect(() => {
    if (!active) return
    let step = 0
    const id = window.setInterval(() => {
      step += 1
      setCells((prev) => {
        const next = [...prev]
        const a = (step * 17 + 5) % 48
        const b = (step * 29 + 13) % 48
        next[a] = ((next[a] + 1) % 3) as CellState
        if (step % 3 === 0) next[b] = ((next[b] + 2) % 3) as CellState
        return next
      })
    }, 750)
    return () => window.clearInterval(id)
  }, [active])
  return cells
}

function AskLog({ active }: { active: boolean }) {
  const [head, setHead] = useState(4)
  useEffect(() => {
    if (!active) return
    const id = window.setInterval(() => {
      setHead((h) => h + 1)
    }, 2100)
    return () => window.clearInterval(id)
  }, [active])

  const n = HERO.askLog.length
  const visible = Array.from({ length: 4 }, (_, i) => {
    const idx = head - 3 + i
    return { line: HERO.askLog[((idx % n) + n) % n], key: idx }
  })

  return (
    <div className="border-t border-gold/20 bg-berkeley-deep/85 p-4 backdrop-blur-sm md:p-5">
      <div className="flex items-center justify-between pb-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">
          ASK LOG · TABLE 01
        </p>
        <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-mist">
          <motion.span
            className="inline-block h-1.5 w-1.5 rounded-full bg-gold"
            animate={active ? { opacity: [1, 0.25, 1] } : {}}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
          LIVE
        </p>
      </div>
      <div className="space-y-1.5 overflow-hidden">
        {visible.map(({ line, key }) => {
          const isDeclare = line.includes("DECLARE")
          const isMiss = line.includes("MISS")
          return (
            <motion.p
              key={key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className={`whitespace-pre font-mono text-[11px] leading-relaxed tracking-tight ${
                isDeclare
                  ? "font-semibold text-gold"
                  : isMiss
                    ? "text-mist/60"
                    : "text-paper/90"
              }`}
            >
              {line}
            </motion.p>
          )
        })}
      </div>
    </div>
  )
}

function PositionMatrix({ active }: { active: boolean }) {
  const cells = useMatrix(active)
  return (
    <div className="rounded-lg border border-berkeley/10 bg-card p-4 shadow-[0_20px_50px_-32px_rgba(0,34,63,0.4)]">
      <p className="border-b border-berkeley/10 pb-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-gold-deep">
        {HERO.gridLabel}
      </p>
      <div className="mt-3 grid grid-cols-[auto_repeat(6,1fr)] gap-x-2 gap-y-1.5">
        <span />
        {SEATS.map((s) => (
          <span key={s} className="text-center font-mono text-[9px] text-fog/80">
            {s}
          </span>
        ))}
        {BOOKS.map((book, r) => (
          <BookRow key={book} book={book} row={r} cells={cells} />
        ))}
      </div>
    </div>
  )
}

function BookRow({
  book,
  row,
  cells,
}: {
  book: string
  row: number
  cells: CellState[]
}) {
  return (
    <>
      <span className="pr-1 font-mono text-[9px] leading-none text-fog/80">
        {book}
      </span>
      {SEATS.map((_, c) => {
        const state = cells[row * 6 + c]
        return (
          <span
            key={c}
            className="flex h-3.5 items-center justify-center"
            aria-hidden="true"
          >
            {state === 2 ? (
              <motion.span
                layout
                className="h-1.5 w-1.5 rounded-full bg-gold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={SPRING_FIRM}
              />
            ) : state === 1 ? (
              <span className="font-mono text-[9px] leading-none text-berkeley/30">
                ✕
              </span>
            ) : (
              <span className="h-1 w-1 rounded-full bg-berkeley/12" />
            )}
          </span>
        )
      })}
    </>
  )
}

export default function Hero() {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const wellY = useTransform(scrollYProgress, [0, 1], [0, reducedMotion ? 0 : -48])
  const active = !reducedMotion

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label="Berkeley Canadian Fish Club"
      className="relative overflow-hidden bg-paper"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 pb-10 pt-28 md:px-10 md:pt-32 lg:grid-cols-[1fr_0.98fr] lg:gap-12 lg:pb-14">
        {/* ---- Left: the pitch ---- */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            className="flex items-center gap-3 font-display text-[12px] font-semibold uppercase tracking-[0.24em] text-gold-deep"
          >
            {HERO.eyebrow}
          </motion.p>

          <h1 className="mt-6 font-display text-[clamp(38px,9vw,60px)] font-medium leading-[1.02] tracking-[-0.02em] text-berkeley lg:text-[clamp(34px,3.9vw,58px)]">
            {HERO.titleLines.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-0.5">
                <motion.span
                  className={`block ${i === 2 ? "font-semibold text-gold-deep" : ""}`}
                  initial={{ y: "108%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.8,
                    ease: EASE,
                    delay: 0.25 + i * 0.12,
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.75 }}
            className="mt-6 max-w-xl font-display text-[17px] leading-relaxed text-fog md:text-lg"
          >
            {HERO.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.9 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <GoldButton targetId={HERO.ctaPrimary.id} variant="solid">
              {HERO.ctaPrimary.label} <span aria-hidden="true">→</span>
            </GoldButton>
            <GoldButton targetId={HERO.ctaSecondary.id} variant="ghost">
              {HERO.ctaSecondary.label}
            </GoldButton>
          </motion.div>
        </div>

        {/* ---- Right: the 3D card well ---- */}
        <motion.div
          style={{ y: wellY }}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
        >
          <div className="relative overflow-hidden rounded-[24px] bg-berkeley shadow-[0_40px_90px_-40px_rgba(0,29,56,0.65)]">
            {/* subtle depth wash */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 90% at 70% 12%, rgba(253,181,21,0.10) 0%, rgba(0,50,98,0) 46%), radial-gradient(140% 110% at 30% 110%, rgba(0,29,56,0.85) 0%, rgba(0,50,98,0) 55%)",
              }}
            />
            <div className="relative h-[320px] md:h-[360px]">
              <Suspense fallback={null}>
                <CardScene />
              </Suspense>
            </div>
            <AskLog active={active} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 1.0 }}
            className="mt-4"
          >
            <PositionMatrix active={active} />
          </motion.div>
        </motion.div>
      </div>

      {/* ---- Stat strip ---- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.3 }}
        className="mx-auto max-w-6xl px-6 pb-8 md:px-10"
      >
        <div className="grid grid-cols-2 gap-y-3 border-t border-berkeley/10 pt-5 md:grid-cols-4">
          {HERO.stats.map((stat, i) => (
            <p
              key={stat}
              className="font-display text-[13px] font-semibold uppercase tracking-[0.26em] text-berkeley/70"
            >
              <span className="mr-2 text-gold-deep">
                {String(i + 1).padStart(2, "0")}
              </span>
              {stat}
            </p>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
