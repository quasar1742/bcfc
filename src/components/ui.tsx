import type { CSSProperties, ReactNode } from "react"
import { motion } from "motion/react"
import { reveal, VIEWPORT_ONCE } from "../lib/anim"
import { usePuzzle } from "../puzzle/PuzzleProvider"
import { MAPLE_LEAF_PATH } from "./cards"

// ---------------------------------------------------------------------------
// Shared section furniture — keep every section speaking the same language.
// ---------------------------------------------------------------------------

export const NAV_OFFSET = 88

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" })
}

export function Hairline({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={`h-px w-full ${dark ? "bg-gold/25" : "bg-berkeley/15"}`}
      aria-hidden="true"
    />
  )
}

// `02 / THE GAME` — hairline · mono label · hairline
export function SectionKicker({
  index,
  title,
  dark = false,
}: {
  index: string
  title: string
  dark?: boolean
}) {
  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      className="flex items-center gap-5"
    >
      <p
        className={`shrink-0 font-display text-[12px] font-semibold uppercase tracking-[0.24em] ${
          dark ? "text-gold" : "text-gold-deep"
        }`}
      >
        {index} / {title}
      </p>
      <div className={`h-px w-full ${dark ? "bg-gold/25" : "bg-berkeley/15"}`} />
    </motion.div>
  )
}

export function GoldButton({
  children,
  href,
  targetId,
  variant = "solid",
  dark = false,
  className = "",
}: {
  children: ReactNode
  href?: string
  targetId?: string
  variant?: "solid" | "ghost"
  dark?: boolean
  className?: string
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md px-7 py-3.5 font-display text-[15px] font-semibold tracking-[0.01em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
    (dark
      ? "focus-visible:ring-gold focus-visible:ring-offset-berkeley "
      : "focus-visible:ring-berkeley focus-visible:ring-offset-paper ")
  const styles =
    variant === "solid"
      ? "bg-gold font-semibold text-berkeley hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-10px_rgba(253,181,21,0.55)]"
      : dark
        ? "border border-gold/50 text-gold hover:border-gold hover:bg-gold/10"
        : "border border-berkeley/30 text-berkeley hover:border-berkeley hover:bg-berkeley/5"

  if (targetId) {
    return (
      <a
        href={`#${targetId}`}
        onClick={(e) => {
          e.preventDefault()
          scrollToId(targetId)
        }}
        className={`${base} ${styles} ${className}`}
      >
        {children}
      </a>
    )
  }
  const isPlaceholder = !href || href === "#"
  return (
    <a
      href={href ?? "#"}
      onClick={isPlaceholder ? (e) => e.preventDefault() : undefined}
      aria-disabled={isPlaceholder || undefined}
      title={isPlaceholder ? "Link coming soon" : undefined}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </a>
  )
}

// The hidden puzzle trigger, disguised as ticker punctuation.
function LeafTrigger({ size = 14 }: { size?: number }) {
  const { open } = usePuzzle()
  return (
    <button
      type="button"
      onClick={open}
      aria-label="A maple leaf that doesn't belong"
      className="group inline-flex cursor-pointer items-center justify-center rounded-sm p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      <svg
        viewBox="-11 -11 22 24"
        width={size}
        height={size * 1.1}
        aria-hidden="true"
        className="opacity-70 transition-opacity duration-200 group-hover:opacity-100"
      >
        <path d={MAPLE_LEAF_PATH} fill="var(--color-gold)" />
        <path d="M-0.6 8 H0.6 L0.9 10.5 H-0.9 Z" fill="var(--color-gold)" />
      </svg>
    </button>
  )
}

// Infinite navy marquee strip. Content is rendered twice for a seamless loop;
// the second copy is aria-hidden. `withLeaf` swaps one ◆ for the leaf trigger.
export function Ticker({
  items,
  withLeaf = false,
  duration = 138,
}: {
  items: readonly string[]
  withLeaf?: boolean
  duration?: number
}) {
  const leafIndex = withLeaf ? items.length - 2 : -1
  // One run must be wider than the widest supported viewport for the -50%
  // loop to stay seamless — repeat the item list 3x per run (~5000px).
  const run = [...items, ...items, ...items]

  const renderRun = (hidden: boolean) => (
    <div
      className="flex items-center"
      aria-hidden={hidden || undefined}
    >
      {run.map((item, i) => (
        <div key={`${item}-${i}`} className="flex items-center">
          <span className="whitespace-nowrap px-6 font-mono text-[12px] uppercase tracking-[0.26em] text-gold/90 md:px-8">
            {item}
          </span>
          {i === leafIndex ? (
            hidden ? (
              // Same box as the interactive leaf so both runs match width.
              <span className="inline-flex items-center justify-center p-1.5">
                <svg
                  viewBox="-11 -11 22 24"
                  width={14}
                  height={15.4}
                  aria-hidden="true"
                  className="opacity-70"
                >
                  <path d={MAPLE_LEAF_PATH} fill="var(--color-gold)" />
                  <path
                    d="M-0.6 8 H0.6 L0.9 10.5 H-0.9 Z"
                    fill="var(--color-gold)"
                  />
                </svg>
              </span>
            ) : (
              <LeafTrigger />
            )
          ) : (
            <span className="text-[9px] text-gold/40" aria-hidden="true">
              ◆
            </span>
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div className="relative overflow-hidden border-y border-gold/20 bg-berkeley py-4">
      <div
        className="ticker-track"
        style={{ "--ticker-duration": `${duration}s` } as CSSProperties}
      >
        {renderRun(false)}
        {renderRun(true)}
      </div>
    </div>
  )
}
