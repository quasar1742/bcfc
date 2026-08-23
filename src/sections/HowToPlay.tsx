import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from "react"
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react"
import { HOW_TO_PLAY, type Suit } from "../lib/content"
import { supportsWebgl } from "../lib/webgl"
import {
  EASE,
  SPRING_FIRM,
  revealStagger,
  staggerChild,
  VIEWPORT_ONCE,
  VIEWPORT_REPLAY,
} from "../lib/anim"
import { CardBack, PlayingCard, SUIT_CHAR } from "../components/cards"

// ---------------------------------------------------------------------------
// The Game — four steps, four small animated diagrams. Each diagram is a
// self-contained illustration built from the shared card primitives; all of
// them are decorative (the body copy carries the meaning), so the diagram
// wells are aria-hidden.
// ---------------------------------------------------------------------------

const CARD_RATIO = 1.4 // shared card geometry: height = width × 350/250

const DECK_SLOTS = Array.from({ length: 8 }, (_, i) => i)
const GHOST_EIGHTS = [0, 1, 2, 3]
const DECLARE_RANKS = ["9", "10", "J", "Q", "K", "A"] as const

const dealRow: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const dealChild: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
}

// The ask loop runs every element off one shared clock so the sequence stays
// in phase across repeats. Everything fades out before the long pause.
const ASK_D = 3.4
const ASK_REPEAT = { repeat: Infinity, repeatDelay: 2.5 } as const

// A face-down card that flips to a face once in view.
function FlipCard({
  rank,
  suit,
  size,
  delay,
  reduced,
}: {
  rank: string
  suit: Suit
  size: number
  delay: number
  reduced: boolean
}) {
  return (
    <div
      className="flip-scene"
      style={{ width: size, height: size * CARD_RATIO }}
    >
      <motion.div
        className="flip-inner relative h-full w-full"
        initial={{ rotateY: reduced ? 180 : 0 }}
        whileInView={reduced ? undefined : { rotateY: 180 }}
        viewport={VIEWPORT_REPLAY}
        transition={{ duration: 0.55, ease: EASE, delay }}
      >
        <div className="flip-face absolute inset-0">
          <CardBack size={size} />
        </div>
        <div
          className="flip-face absolute inset-0"
          style={{ transform: "rotateY(180deg)" }}
        >
          <PlayingCard rank={rank} suit={suit} size={size} />
        </div>
      </motion.div>
    </div>
  )
}

// 01 — THE DECK: eight backs deal in, one flips to the 9♥, the four 8s leave.
function DeckDiagram({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex scale-[0.8] flex-col items-center gap-3 lg:scale-100">
      <motion.div
        className="flex items-end gap-1"
        variants={dealRow}
        initial={reduced ? "visible" : "hidden"}
        whileInView="visible"
        viewport={VIEWPORT_REPLAY}
      >
        {DECK_SLOTS.map((slot) => (
          <motion.div key={slot} variants={dealChild}>
            {slot === 3 ? (
              <FlipCard
                rank="9"
                suit="hearts"
                size={34}
                delay={1.05}
                reduced={reduced}
              />
            ) : (
              <CardBack size={34} />
            )}
          </motion.div>
        ))}
      </motion.div>
      <div className="flex gap-2">
        {GHOST_EIGHTS.map((i) => (
          <motion.div
            key={i}
            className="flex h-9 w-[26px] items-center justify-center rounded-[4px] border border-dashed border-berkeley/30 font-mono text-[10px] text-berkeley/45"
            initial={{ opacity: 0, y: 8 }}
            whileInView={
              reduced
                ? undefined
                : { opacity: [0, 1, 1, 0], y: [8, 0, 0, 16] }
            }
            viewport={VIEWPORT_REPLAY}
            transition={{
              duration: 2.4,
              times: [0, 0.2, 0.62, 1],
              ease: EASE,
              delay: 0.3 + i * 0.06,
            }}
          >
            8
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// 02 — THE ASK: gold arrow draws YOU → EAST, the card comes back with HIT.
function AskDiagram({ reduced }: { reduced: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col items-center gap-1.5">
        <CardBack size={38} />
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-fog">
          You
        </span>
      </div>

      <div className="relative h-16 w-[120px]">
        <motion.p
          className="absolute inset-x-0 top-0 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-gold-deep"
          initial={{ opacity: reduced ? 1 : 0 }}
          whileInView={reduced ? undefined : { opacity: [0, 0, 1, 1, 0] }}
          viewport={VIEWPORT_REPLAY}
          transition={{
            duration: ASK_D,
            times: [0, 0.24, 0.32, 0.9, 1],
            ...ASK_REPEAT,
          }}
        >
          ASK: 9{SUIT_CHAR.hearts}
        </motion.p>

        <svg
          viewBox="0 0 120 24"
          className="absolute left-0 top-1/2 h-6 w-full -translate-y-1/2"
        >
          <motion.path
            d="M4 12 H 104"
            fill="none"
            stroke="var(--color-gold-deep)"
            strokeWidth={1.5}
            strokeLinecap="round"
            initial={{ pathLength: reduced ? 1 : 0, opacity: 1 }}
            whileInView={
              reduced ? undefined : { pathLength: [0, 1, 1], opacity: [1, 1, 0] }
            }
            viewport={VIEWPORT_REPLAY}
            transition={{
              pathLength: {
                duration: ASK_D,
                times: [0, 0.22, 1],
                ease: EASE,
                ...ASK_REPEAT,
              },
              opacity: { duration: ASK_D, times: [0, 0.92, 1], ...ASK_REPEAT },
            }}
          />
          <motion.path
            d="M98 6.5 L106 12 L98 17.5"
            fill="none"
            stroke="var(--color-gold-deep)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ opacity: reduced ? 1 : 0 }}
            whileInView={reduced ? undefined : { opacity: [0, 0, 1, 1, 0] }}
            viewport={VIEWPORT_REPLAY}
            transition={{
              duration: ASK_D,
              times: [0, 0.2, 0.27, 0.9, 1],
              ...ASK_REPEAT,
            }}
          />
        </svg>

        <motion.div
          className="absolute left-1 rounded-[3px] bg-gold px-1.5 py-[2px] font-mono text-[9px] font-semibold tracking-[0.12em] text-berkeley shadow-sm"
          style={{ top: "50%", y: "-50%" }}
          initial={{ x: reduced ? 0 : 74, opacity: reduced ? 1 : 0 }}
          whileInView={
            reduced
              ? undefined
              : { x: [74, 74, 0, 0], opacity: [0, 0, 1, 1, 0] }
          }
          viewport={VIEWPORT_REPLAY}
          transition={{
            x: {
              duration: ASK_D,
              times: [0, 0.5, 0.78, 1],
              ease: EASE,
              ...ASK_REPEAT,
            },
            opacity: {
              duration: ASK_D,
              times: [0, 0.47, 0.54, 0.9, 1],
              ...ASK_REPEAT,
            },
          }}
        >
          HIT
        </motion.div>
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <CardBack size={38} />
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-fog">
          East
        </span>
      </div>
    </div>
  )
}

// 03 — THE LEAK: one ask, three inferences. Sonar rings off the ten of clubs.
const LEAK_NOTES = [
  { text: `HOLDS HIGH ${SUIT_CHAR.clubs}`, pos: "left-[6%] top-[14%] sm:left-[12%]", delay: 0.35 },
  { text: "NOT THE 10", pos: "right-[6%] top-[42%] sm:right-[10%]", delay: 0.6 },
  { text: "SIGNAL?", pos: "bottom-[12%] left-[14%] sm:left-[22%]", delay: 0.85 },
]

function LeakDiagram({ reduced }: { reduced: boolean }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <svg
        viewBox="-75 -75 150 150"
        className="absolute h-[150px] w-[150px]"
      >
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            r={64}
            fill="none"
            stroke="var(--color-gold-deep)"
            strokeWidth={1}
            initial={
              reduced
                ? { scale: 0.45 + i * 0.22, opacity: 0.2 }
                : { scale: 0.3, opacity: 0 }
            }
            whileInView={
              reduced ? undefined : { scale: [0.3, 1], opacity: [0, 0.4, 0] }
            }
            viewport={VIEWPORT_REPLAY}
            transition={{
              scale: { duration: 3, ease: "easeOut", repeat: Infinity, delay: i },
              opacity: {
                duration: 3,
                times: [0, 0.18, 1],
                repeat: Infinity,
                delay: i,
              },
            }}
          />
        ))}
      </svg>
      <PlayingCard
        rank="10"
        suit="clubs"
        size={48}
        className="relative drop-shadow-[0_10px_18px_rgba(0,34,63,0.15)]"
      />
      {LEAK_NOTES.map((note) => (
        <motion.p
          key={note.text}
          className={`absolute font-mono text-[9px] uppercase tracking-[0.16em] text-fog ${note.pos}`}
          initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={VIEWPORT_REPLAY}
          transition={{ duration: 0.5, ease: EASE, delay: note.delay }}
        >
          {note.text}
        </motion.p>
      ))}
    </div>
  )
}

// 04 — THE DECLARE: six backs fan out, flip to the high hearts, stamp lands.
function DeclareDiagram({ reduced }: { reduced: boolean }) {
  return (
    <div className="relative h-[104px] w-[220px]">
      {DECLARE_RANKS.map((rank, i) => (
        <div
          key={rank}
          className="absolute left-1/2 top-2 -ml-[15px]"
          style={{
            transform: `rotate(${-35 + i * 14}deg)`,
            transformOrigin: "50% 340%",
          }}
        >
          <FlipCard
            rank={rank}
            suit="hearts"
            size={30}
            delay={0.2 + i * 0.12}
            reduced={reduced}
          />
        </div>
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="rounded-md border-2 border-gold bg-card/85 px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-deep shadow-sm"
          initial={
            reduced
              ? { opacity: 1, scale: 1, rotate: -8 }
              : { opacity: 0, scale: 1.5, rotate: -8 }
          }
          whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
          viewport={VIEWPORT_REPLAY}
          transition={{ ...SPRING_FIRM, delay: reduced ? 0 : 1.35 }}
        >
          BOOK +1
        </motion.div>
      </div>
    </div>
  )
}

const DIAGRAMS = {
  deck: DeckDiagram,
  ask: AskDiagram,
  leak: LeakDiagram,
  declare: DeclareDiagram,
} satisfies Record<
  (typeof HOW_TO_PLAY.steps)[number]["diagram"],
  ComponentType<{ reduced: boolean }>
>

// three.js stays out of the main bundle.
const StepScene = lazy(() => import("../three/StepScene"))

const STEP_COUNT = HOW_TO_PLAY.steps.length

// Desktop scrollytelling: pinned stage, scroll-scrubbed 3D cards (the GSAP
// ScrollTrigger pin+scrub pattern, driven natively into three.js).
function ScrollySteps() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress: rawScrollProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  // Trackpads and high-resolution wheels can emit very large, uneven deltas.
  // First limit how quickly the animation target may advance, then run that
  // bounded value through a spring. Large jumps catch up promptly; small
  // oscillations are filtered instead of making the diorama twitch.
  const targetProgress = useRef(rawScrollProgress.get())
  const cappedProgress = useMotionValue(rawScrollProgress.get())
  useMotionValueEvent(rawScrollProgress, "change", (value) => {
    targetProgress.current = value
  })
  useAnimationFrame((_time, delta) => {
    const current = cappedProgress.get()
    const distance = targetProgress.current - current
    if (Math.abs(distance) < 0.0001) return
    const seconds = Math.min(delta, 64) / 1000
    const maxRate = 0.55 + Math.min(1.35, Math.abs(distance) * 2.7)
    const step = Math.min(Math.abs(distance), maxRate * seconds)
    cappedProgress.set(current + Math.sign(distance) * step)
  })
  const smoothProgress = useSpring(cappedProgress, {
    stiffness: 115,
    damping: 30,
    mass: 0.75,
    restDelta: 0.0001,
    restSpeed: 0.0001,
  })

  // The dive now hands directly to the deck. The four dioramas own the full
  // scroll range, with only a short settle zone after the final declaration.
  const sceneProgress = useTransform(smoothProgress, [0, 0.9], [0, 1])
  const stepCopyOpacity = useTransform(
    smoothProgress,
    [0, 0.94, 0.985],
    [1, 1, 0],
  )

  // Discrete step switching: exactly one text panel exists at a time, and
  // AnimatePresence waits for the old one to clear before the next enters.
  const [active, setActive] = useState(0)
  useMotionValueEvent(sceneProgress, "change", (v) => {
    const idx = Math.min(STEP_COUNT - 1, Math.max(0, Math.floor(v * STEP_COUNT)))
    setActive((current) => {
      if (idx === current) return current
      const boundary = idx > current ? (current + 1) / STEP_COUNT : current / STEP_COUNT
      const clearedBoundary = idx > current ? v > boundary + 0.012 : v < boundary - 0.012
      return clearedBoundary ? idx : current
    })
  })
  useMotionValueEvent(rawScrollProgress, "change", (v) => {
    // Fade the fixed chrome away while the stage is pinned (desktop only —
    // offsetParent is null when this branch is display:none).
    const pinned = v > 0.002 && v < 0.998 && ref.current?.offsetParent != null
    document.documentElement.classList.toggle("stage-immersive", pinned)
  })
  useEffect(
    () => () => document.documentElement.classList.remove("stage-immersive"),
    [],
  )
  const step = HOW_TO_PLAY.steps[active]

  // The ask diorama drives this: the copy leans away as the card flies in.
  const askShift = useMotionValue(0)
  const dodgeX = useTransform(askShift, [0, 1], [0, -16])
  const dodgeRotate = useTransform(askShift, [0, 1], [0, -0.8])

  return (
    <div ref={ref} className="relative -mt-[50vh] h-[500vh]" aria-hidden="true">
      {/* Full-bleed immersive stage: the whole viewport goes navy while
          pinned; the 3D scene fills it and the step text rides on top. */}
      <div className="sticky top-0 h-screen overflow-hidden bg-[#071f2a]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 80% at 72% 10%, rgba(231,184,83,0.1) 0%, rgba(18,55,71,0) 46%), radial-gradient(120% 100% at 25% 110%, rgba(7,31,42,0.92) 0%, rgba(18,55,71,0) 55%)",
          }}
        />
        <div className="game-scene-layer absolute inset-0">
          <Suspense fallback={null}>
            <StepScene progress={sceneProgress} askShift={askShift} />
          </Suspense>
        </div>

        {/* text overlay */}
        <motion.div
          style={{ opacity: stepCopyOpacity }}
          className="game-step-layer pointer-events-none relative z-10 mx-auto flex h-full w-full max-w-[1500px] items-center px-6 md:px-10"
        >
          <motion.div
            style={{ x: dodgeX, rotate: dodgeRotate }}
            className="relative min-h-[420px] w-full max-w-[400px] xl:max-w-md"
          >
            {/* progress rail */}
            <div className="absolute -left-8 top-1/2 h-[240px] w-px -translate-y-1/2 bg-white/15">
              <motion.div
                className="h-full w-px origin-top bg-gold"
                style={{ scaleY: sceneProgress }}
              />
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step.index}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -26 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="absolute inset-0 flex flex-col items-start justify-center"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-2 top-1/2 -translate-y-1/2 font-display text-[150px] font-bold leading-none text-paper/[0.06]"
                >
                  {step.index}
                </span>
                <p className="w-fit font-display text-[12px] font-semibold uppercase tracking-[0.2em] text-gold">
                  {step.index} / {step.title}
                </p>
                <h3 className="mt-3 w-fit font-display text-3xl font-medium tracking-[-0.01em] text-paper md:text-4xl">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-md font-display text-[16px] leading-[1.9] text-paper/90">
                  {step.body}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* step counter, bottom right */}
        <motion.div
          style={{
            opacity: stepCopyOpacity,
            right: "max(40px, calc((100vw - 1500px) / 2 + 40px))",
          }}
          className="game-counter-layer pointer-events-none absolute bottom-8 z-10 font-display text-[12px] font-semibold uppercase tracking-[0.24em] text-mist/80"
        >
          {step.index} / 0{STEP_COUNT}
        </motion.div>
      </div>
    </div>
  )
}

// Screen-reader alternative to the visual scrollytelling.
function StepsSrList() {
  return (
    <div className="sr-only">
      <h2>{HOW_TO_PLAY.heading}</h2>
      <p>{HOW_TO_PLAY.intro}</p>
      <ol>
        {HOW_TO_PLAY.steps.map((step) => (
          <li key={step.index}>
            {step.title}. {step.body}
          </li>
        ))}
      </ol>
    </div>
  )
}

function useDesktopScene() {
  const [desktop, setDesktop] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(min-width: 1024px)").matches,
  )

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)")
    const update = () => setDesktop(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  return desktop
}

// The four step cards as a static grid (small screens, reduced motion, or
// no WebGL).
function StepsGrid({ reduced }: { reduced: boolean }) {
  return (
    <motion.div
      variants={revealStagger}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      className="mt-10 grid gap-5 sm:mt-14 sm:gap-6 md:grid-cols-2"
    >
      {HOW_TO_PLAY.steps.map((step) => {
        const Diagram = DIAGRAMS[step.diagram]
        return (
          <motion.article
            key={step.index}
            variants={staggerChild}
            className="flex min-w-0 w-full flex-col rounded-lg border border-berkeley/10 bg-card p-5 transition-colors duration-200 hover:border-gold-deep/40 sm:p-7 md:p-8"
          >
            <p className="font-display text-[12px] font-semibold uppercase tracking-[0.2em] text-gold-deep">
              {step.index} / {step.title}
            </p>
            <h3 className="mt-4 font-display text-2xl font-medium text-berkeley">
              {step.title}
            </h3>
            <p className="mt-3 font-display text-[15px] leading-relaxed text-berkeley/75">
              {step.body}
            </p>
            <div className="mt-auto pt-6">
              <div
                className="flex h-[150px] min-w-0 items-center justify-center overflow-hidden rounded-lg bg-paper-soft"
                aria-hidden="true"
              >
                <Diagram reduced={reduced} />
              </div>
            </div>
          </motion.article>
        )
      })}
    </motion.div>
  )
}

export default function HowToPlay() {
  const reduced = useReducedMotion() ?? false
  const webgl = useMemo(supportsWebgl, [])
  const desktop = useDesktopScene()
  const scrolly = desktop && !reduced && webgl

  return (
    <section id="game" aria-label={HOW_TO_PLAY.heading} className="bg-transparent">
      {scrolly ? (
        <>
          <ScrollySteps />
          <StepsSrList />
        </>
      ) : (
        <div className="mx-auto -mt-[50svh] max-w-6xl px-5 pb-20 pt-6 sm:px-6 sm:pb-24 sm:pt-10 md:px-10 md:pb-32 md:pt-14">
          <StepsGrid reduced={reduced} />
        </div>
      )}
    </section>
  )
}
