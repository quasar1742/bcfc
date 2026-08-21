import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { Dialog } from "radix-ui"
import {
  AnimatePresence,
  motion,
  useAnimate,
  useReducedMotion,
} from "motion/react"
import { PUZZLE } from "../lib/content"
import { EASE } from "../lib/anim"
import { Medallion } from "../components/cards"

// ---------------------------------------------------------------------------
// The hidden admissions puzzle (the HackMIT steal, quant edition).
// Trigger: any hidden maple leaf on the page calls usePuzzle().open().
// ---------------------------------------------------------------------------

const PuzzleContext = createContext<{ open: () => void }>({ open: () => {} })

export function usePuzzle() {
  return useContext(PuzzleContext)
}

export function PuzzleProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const value = useMemo(() => ({ open }), [open])

  return (
    <PuzzleContext.Provider value={value}>
      {children}
      <PuzzleModal isOpen={isOpen} onOpenChange={setIsOpen} />
    </PuzzleContext.Provider>
  )
}

function PuzzleModal({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [solved, setSolved] = useState(false)
  const [wrongTick, setWrongTick] = useState(0)
  const reducedMotion = useReducedMotion()
  const [optionsScope, animateOptions] = useAnimate()

  const guess = (option: string) => {
    if (option === PUZZLE.answer) {
      setSolved(true)
    } else {
      setWrongTick((t) => t + 1)
      // Shake in place — no remount, so keyboard focus stays put.
      if (!reducedMotion && optionsScope.current) {
        animateOptions(
          optionsScope.current,
          { x: [0, -8, 8, -5, 5, 0] },
          { duration: 0.4 },
        )
      }
    }
  }

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next)
    if (!next) {
      // Reset after the exit animation.
      window.setTimeout(() => {
        setSolved(false)
        setWrongTick(0)
      }, 300)
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-[90] bg-berkeley-deep/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </Dialog.Overlay>
            <div className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center p-4">
            <Dialog.Content asChild forceMount>
              <motion.div
                className="pointer-events-auto relative max-h-[88vh] w-[min(92vw,640px)] overflow-y-auto rounded-2xl border border-gold/40 bg-berkeley p-8 text-paper shadow-2xl shadow-black/50 md:p-10"
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <Dialog.Title asChild>
                      <p className="font-display text-[12px] font-semibold uppercase tracking-[0.22em] text-gold">
                        {PUZZLE.title}
                      </p>
                    </Dialog.Title>
                    <p className="mt-2 font-display text-3xl font-medium leading-tight">
                      {PUZZLE.found}
                    </p>
                  </div>
                  <Dialog.Close
                    className="rounded-md p-2 font-mono text-xs uppercase tracking-widest text-mist transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    aria-label="Close"
                  >
                    ESC
                  </Dialog.Close>
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  {!solved ? (
                    <motion.div
                      key="question"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.3 }}
                    >
                      <Dialog.Description asChild>
                        <p className="mt-6 font-display text-base leading-relaxed text-mist">
                          {PUZZLE.setup}
                        </p>
                      </Dialog.Description>
                      <ul className="mt-5 space-y-2 border-l border-gold/30 pl-4 font-mono text-[13px] leading-relaxed text-paper/90">
                        {PUZZLE.asks.map((ask) => (
                          <li key={ask}>{ask}</li>
                        ))}
                      </ul>
                      <p className="mt-6 font-display text-xl font-medium">
                        {PUZZLE.question}
                      </p>
                      <div
                        ref={optionsScope}
                        className="mt-5 flex flex-wrap gap-3"
                      >
                        {PUZZLE.options.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => guess(option)}
                            className="rounded-md border border-gold/50 px-5 py-2.5 font-display text-[15px] font-semibold uppercase tracking-[0.14em] text-gold transition-colors hover:bg-gold hover:text-berkeley focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      <p
                        className="mt-4 min-h-[1.25rem] font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-maple-soft"
                        role="status"
                        aria-live="polite"
                      >
                        {wrongTick > 0 ? PUZZLE.wrong : ""}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="solved"
                      initial={{ opacity: 0, rotateY: reducedMotion ? 0 : -90 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      transition={{
                        type: "spring",
                        bounce: 0.25,
                        visualDuration: 0.6,
                      }}
                      className="mt-6"
                      style={{ transformPerspective: 1200 }}
                      role="status"
                    >
                      <div className="flex items-center gap-4">
                        <Medallion size={64} />
                        <p className="font-display text-2xl font-bold uppercase tracking-[0.2em] text-gold">
                          {PUZZLE.rewardTitle}
                        </p>
                      </div>
                      <p className="mt-5 font-display text-base leading-relaxed text-mist">
                        {PUZZLE.rewardBody}
                      </p>
                      <p className="mt-4 font-display text-lg leading-relaxed text-paper">
                        {PUZZLE.rewardPerk}
                      </p>
                      <p className="mt-5 inline-block rounded-md border border-gold/60 bg-berkeley-deep px-4 py-2 font-mono text-sm tracking-[0.2em] text-gold">
                        {PUZZLE.rewardCode}
                      </p>
                      <p className="mt-6 font-mono text-[11px] lowercase tracking-wide text-mist/70">
                        {PUZZLE.rewardFootnote}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
