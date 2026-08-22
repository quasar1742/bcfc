import type { ReactNode } from "react"
import { motion } from "motion/react"
import { reveal, VIEWPORT_ONCE } from "../lib/anim"

// ---------------------------------------------------------------------------
// Shared section furniture — keep every section speaking the same language.
// ---------------------------------------------------------------------------

export const NAV_OFFSET = 88

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const offset = window.matchMedia("(max-width: 767px)").matches ? 72 : NAV_OFFSET
  const top = el.getBoundingClientRect().top + window.scrollY - offset
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
      className="grid w-full grid-cols-[minmax(18px,1fr)_auto_minmax(18px,1fr)] items-center gap-4 sm:gap-5"
    >
      <div className={`h-px w-full ${dark ? "bg-gold/25" : "bg-berkeley/15"}`} />
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
      ? "bg-gold font-semibold text-berkeley hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-10px_rgba(231,184,83,0.48)]"
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
