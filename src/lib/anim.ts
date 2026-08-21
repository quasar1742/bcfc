import type { Transition, Variants } from "motion/react"

// Trading-floor motion language: firm, decisive, zero overshoot.
export const EASE = [0.22, 1, 0.36, 1] as const

export const SPRING_FIRM: Transition = {
  type: "spring",
  bounce: 0,
  visualDuration: 0.5,
}

export const reveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
}

export const revealStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
}

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
}

export const VIEWPORT_ONCE = { once: true, margin: "-80px" } as const
