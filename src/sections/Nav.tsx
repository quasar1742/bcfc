import { useEffect, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react"
import { NAV } from "../lib/content"
import { EASE } from "../lib/anim"
import { GoldButton, scrollToId } from "../components/ui"
import { SuitGlyph } from "../components/cards"

// ---------------------------------------------------------------------------
// Nav — fixed top chrome. Gold scroll-progress hairline, BCFC monogram,
// mono anchor links + gold JOIN on desktop, full-screen navy overlay on
// mobile. Transparent at rest; paper glass once the page moves.
// ---------------------------------------------------------------------------

const OVERLAY_SUITS = ["spades", "hearts", "clubs", "diamonds"] as const

export default function Nav() {
  const reducedMotion = useReducedMotion()
  const { scrollY, scrollYProgress } = useScroll()
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
      {/* ---- Gold scroll-progress hairline ---- */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="site-chrome fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gold"
        aria-hidden="true"
      />

      {/* ---- Fixed nav bar ---- */}
      <motion.nav
        aria-label="Primary"
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
        className={`site-chrome fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
          scrolled
            ? "border-berkeley/10 bg-paper/90 backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6 md:px-10">
          {/* Monogram — back to top */}
          <button
            type="button"
            onClick={scrollTop}
            aria-label="Berkeley Canadian Fish Club, back to top"
            className="group flex items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-berkeley focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          >
            <span className="font-display text-xl font-semibold tracking-[-0.01em] text-berkeley">
              {NAV.monogram}
            </span>
            <SuitGlyph
              suit="spades"
              size={14}
              color="var(--color-gold)"
              className="translate-y-px transition-transform duration-200 group-hover:-translate-y-0.5"
            />
          </button>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV.links.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToId(link.id)}
                className="rounded-sm py-1 font-display text-[15px] font-medium tracking-[-0.01em] text-berkeley/70 transition-colors duration-200 hover:text-berkeley focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-berkeley"
              >
                {link.label}
              </button>
            ))}
            <GoldButton
              targetId={NAV.cta.id}
              variant="solid"
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
            className="rounded-sm py-1 font-display text-[15px] font-medium tracking-[-0.01em] text-berkeley transition-colors duration-200 hover:text-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-berkeley md:hidden"
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
              <span className="flex items-center gap-2">
                <span className="font-display text-xl font-semibold tracking-[-0.01em] text-paper">
                  {NAV.monogram}
                </span>
                <SuitGlyph
                  suit="spades"
                  size={14}
                  color="var(--color-gold)"
                  className="translate-y-px"
                />
              </span>
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
                <span className="font-display text-[11px] font-semibold uppercase tracking-[0.26em] text-mist/70">
                  {NAV.monogram}
                </span>
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
