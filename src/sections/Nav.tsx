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
import { NAV } from "../lib/content"
import { EASE } from "../lib/anim"
import { GoldButton, scrollToId } from "../components/ui"
import { SuitGlyph } from "../components/cards"
import BrandLogo, { ProgressFishMark } from "../components/BrandLogo"

// ---------------------------------------------------------------------------
// Nav — fixed top chrome. Swimming-fish scroll progress, BCFC monogram,
// mono anchor links + gold JOIN on desktop, full-screen navy overlay on
// mobile. Transparent at rest; paper glass once the page moves.
// ---------------------------------------------------------------------------

const OVERLAY_SUITS = ["spades", "hearts", "clubs", "diamonds"] as const

export default function Nav() {
  const reducedMotion = useReducedMotion()
  const { scrollY, scrollYProgress } = useScroll()
  const swimmingProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 28,
    mass: 0.32,
    restDelta: 0.0001,
  })
  const fishTravelProgress = reducedMotion ? scrollYProgress : swimmingProgress
  const fishLeft = useTransform(
    fishTravelProgress,
    [0, 1],
    ["0%", "100%"],
  )
  const fishOpacity = useTransform(
    fishTravelProgress,
    [0, 0.065, 0.105],
    [0, 0, 1],
  )
  const fishCurrentY = useTransform(
    fishTravelProgress,
    [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
    [0, -1.25, 0, 1.25, 0, -1.25, 0, 1.25, 0],
  )
  const fishCurrentPitch = useTransform(
    fishTravelProgress,
    [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
    [-1.5, 0, 1.5, 0, -1.5, 0, 1.5, 0, -1.5],
  )
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24)
  })

  // Lock body scroll while the overlay is open.
  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [menuOpen])

  // Esc dismisses; Tab cycles inside the overlay; focus moves in on open
  // and returns to the MENU button on close.
  useEffect(() => {
    if (!menuOpen) return
    closeButtonRef.current?.focus()
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false)
        return
      }
      if (e.key !== "Tab") return
      const root = overlayRef.current
      if (!root) return
      const focusables = Array.from(root.querySelectorAll<HTMLElement>("button"))
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (!first || !last) return
      const active = document.activeElement
      if (!root.contains(active)) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      menuButtonRef.current?.focus()
    }
  }, [menuOpen])

  // If the viewport crosses into desktop while the overlay is open, close it
  // so the body-scroll lock can't strand a hidden overlay.
  useEffect(() => {
    if (!menuOpen) return
    const mq = window.matchMedia("(min-width: 768px)")
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false)
    }
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [menuOpen])

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" })
  }

  // Close first so the scroll lock releases, then run the smooth scroll.
  const goFromOverlay = (id: string) => {
    setMenuOpen(false)
    window.setTimeout(() => scrollToId(id), 80)
  }

  return (
    <>
      {/* ---- A small fish follows a living current across the full page ---- */}
      <motion.div
        className="scroll-fish-progress pointer-events-none fixed inset-x-0 top-0 z-[60] h-6 overflow-hidden"
        aria-hidden="true"
        style={{ opacity: fishOpacity }}
      >
        <svg
          className="scroll-stream-water absolute inset-x-0 top-0.5 h-5 w-full"
          viewBox="0 0 1000 20"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="scroll-stream-gradient" x1="0" x2="1">
              <stop offset="0" stopColor="#73b9b3" stopOpacity="0" />
              <stop offset="0.08" stopColor="#73b9b3" stopOpacity="0.16" />
              <stop offset="0.5" stopColor="#8bc8c2" stopOpacity="0.25" />
              <stop offset="0.92" stopColor="#73b9b3" stopOpacity="0.16" />
              <stop offset="1" stopColor="#73b9b3" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            className="scroll-stream-ribbon"
            vectorEffect="non-scaling-stroke"
            d="M-20 10 C30 7.5 70 7.5 120 10 S210 12.5 260 10 S350 7.5 400 10 S490 12.5 540 10 S630 7.5 680 10 S770 12.5 820 10 S930 7.5 1020 10"
          />
          <path
            className="scroll-stream-current scroll-stream-current--near"
            vectorEffect="non-scaling-stroke"
            d="M-20 9 C30 6.5 70 6.5 120 9 S210 11.5 260 9 S350 6.5 400 9 S490 11.5 540 9 S630 6.5 680 9 S770 11.5 820 9 S930 6.5 1020 9"
          />
          <path
            className="scroll-stream-current scroll-stream-current--far"
            vectorEffect="non-scaling-stroke"
            d="M-20 12 C30 9.5 70 9.5 120 12 S210 14.5 260 12 S350 9.5 400 12 S490 14.5 540 12 S630 9.5 680 12 S770 14.5 820 12 S930 9.5 1020 12"
          />
        </svg>

        <div className="absolute top-0.5 right-10 left-1 h-5">
          <motion.div
            className="scroll-fish absolute top-0 flex h-5 w-8 items-center justify-center"
            style={{
              left: fishLeft,
              y: reducedMotion ? 0 : fishCurrentY,
              rotate: reducedMotion ? 0 : fishCurrentPitch,
            }}
          >
            <span className="scroll-fish-wake" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <ProgressFishMark className="scroll-fish-mark h-4 w-8 text-gold" />
          </motion.div>
        </div>
      </motion.div>

      {/* ---- Fixed nav bar ---- */}
      <motion.nav
        aria-label="Primary"
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
        className={`site-chrome fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
          scrolled
            ? "border-mist/10 bg-berkeley-deep/88 backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6 md:px-10">
          {/* Monogram — back to top */}
          <button
            type="button"
            onClick={scrollTop}
            aria-label="Berkeley Canadian Fish Club, back to top"
            className={`group flex items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              scrolled
                ? "focus-visible:ring-gold focus-visible:ring-offset-berkeley-deep"
                : "focus-visible:ring-gold focus-visible:ring-offset-berkeley"
            }`}
          >
            <BrandLogo className="text-paper" />
          </button>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV.links.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToId(link.id)}
                className={`rounded-sm py-1 font-display text-[15px] font-medium tracking-[-0.01em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 ${
                  scrolled
                    ? "text-paper/70 hover:text-paper focus-visible:ring-gold"
                    : "text-paper/80 hover:text-paper focus-visible:ring-gold"
                }`}
              >
                {link.label}
              </button>
            ))}
            <GoldButton
              targetId={NAV.cta.id}
              variant="solid"
              dark
              className="px-5! py-2!"
            >
              {NAV.cta.label}
            </GoldButton>
          </div>

          {/* Mobile menu button */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="bcfc-mobile-menu"
            className={`rounded-sm py-1 font-display text-[15px] font-medium tracking-[-0.01em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 md:hidden ${
              scrolled
                ? "text-paper hover:text-gold focus-visible:ring-gold"
                : "text-paper hover:text-gold focus-visible:ring-gold"
            }`}
          >
            Menu
          </button>
        </div>
      </motion.nav>

      {/* ---- Mobile overlay ---- */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={overlayRef}
            id="bcfc-mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-0 z-[70] flex flex-col bg-berkeley md:hidden"
          >
            {/* Overlay chrome row */}
            <div className="flex h-[72px] shrink-0 items-center justify-between px-6">
              <BrandLogo className="text-paper" />
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-sm py-1 font-display text-[14px] font-medium tracking-[0.01em] text-mist transition-colors duration-200 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                Close
              </button>
            </div>

            {/* Big display links */}
            <nav aria-label="Sections" className="flex flex-1 flex-col justify-center px-6">
              <ul className="space-y-1.5">
                {NAV.links.map((link, i) => (
                  <li key={link.id} className="overflow-hidden">
                    <motion.button
                      type="button"
                      onClick={() => goFromOverlay(link.id)}
                      initial={
                        reducedMotion ? { opacity: 0 } : { y: "110%", opacity: 1 }
                      }
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        duration: 0.55,
                        ease: EASE,
                        delay: 0.1 + i * 0.06,
                      }}
                      className="group flex w-full items-baseline gap-4 rounded-sm py-1.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    >
                      <span
                        className="font-display text-[12px] font-semibold tracking-[0.2em] text-gold/70"
                        aria-hidden="true"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-4xl font-medium leading-tight tracking-[-0.02em] text-paper transition-colors duration-200 group-hover:text-gold">
                        {link.label}
                      </span>
                    </motion.button>
                  </li>
                ))}
                <li className="overflow-hidden">
                  <motion.button
                    type="button"
                    onClick={() => goFromOverlay(NAV.cta.id)}
                    initial={
                      reducedMotion ? { opacity: 0 } : { y: "110%", opacity: 1 }
                    }
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: 0.55,
                      ease: EASE,
                      delay: 0.1 + NAV.links.length * 0.06,
                    }}
                    className="group flex w-full items-baseline gap-4 rounded-sm py-1.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <span
                      className="font-display text-[12px] font-semibold tracking-[0.2em] text-gold/70"
                      aria-hidden="true"
                    >
                      {String(NAV.links.length + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-4xl font-medium leading-tight tracking-[-0.02em] text-gold transition-opacity duration-200 group-hover:opacity-80">
                      {NAV.cta.label}
                    </span>
                  </motion.button>
                </li>
              </ul>
            </nav>

            {/* Bottom furniture */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.35 }}
              className="shrink-0 px-6 pb-8"
            >
              <div className="h-px w-full bg-gold/25" aria-hidden="true" />
              <div className="mt-5 flex items-center justify-between">
                <BrandLogo className="text-mist/70" markOnly />
                <span className="flex items-center gap-3" aria-hidden="true">
                  {OVERLAY_SUITS.map((suit) => (
                    <SuitGlyph
                      key={suit}
                      suit={suit}
                      size={11}
                      color="var(--color-gold)"
                      className="opacity-50"
                    />
                  ))}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
