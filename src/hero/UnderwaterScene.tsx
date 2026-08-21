import type { CSSProperties } from "react"
import { SuitGlyph } from "../components/cards"
import type { Suit } from "../lib/content"
import damselfishMascot from "../assets/damselfish-mascot.webp"
import oskiScubaFlat from "../assets/oski-scuba-flat.webp"

type FishSpec = {
  rank: string
  suit: Suit
  top: string
  size: string
  duration: string
  delay: string
  staticX: string
  reverse?: boolean
  quiet?: boolean
}

type FishStyle = CSSProperties & {
  "--fish-top": string
  "--fish-size": string
  "--fish-duration": string
  "--fish-delay": string
  "--fish-static-x": string
}

const FISH: FishSpec[] = [
  {
    rank: "9",
    suit: "spades",
    top: "18%",
    size: "clamp(118px, 13vw, 210px)",
    duration: "27s",
    delay: "-17s",
    staticX: "8%",
  },
  {
    rank: "8",
    suit: "clubs",
    top: "34%",
    size: "clamp(88px, 9vw, 150px)",
    duration: "23s",
    delay: "-4s",
    staticX: "78%",
    reverse: true,
  },
  {
    rank: "Q",
    suit: "hearts",
    top: "58%",
    size: "clamp(92px, 10vw, 165px)",
    duration: "31s",
    delay: "-25s",
    staticX: "4%",
    reverse: true,
  },
  {
    rank: "A",
    suit: "diamonds",
    top: "72%",
    size: "clamp(74px, 8vw, 132px)",
    duration: "25s",
    delay: "-12s",
    staticX: "67%",
  },
  {
    rank: "10",
    suit: "clubs",
    top: "8%",
    size: "clamp(66px, 7vw, 116px)",
    duration: "36s",
    delay: "-8s",
    staticX: "62%",
    reverse: true,
    quiet: true,
  },
  {
    rank: "K",
    suit: "spades",
    top: "47%",
    size: "clamp(62px, 6vw, 102px)",
    duration: "39s",
    delay: "-31s",
    staticX: "88%",
    quiet: true,
  },
]

type BubbleStyle = CSSProperties & {
  "--bubble-left": string
  "--bubble-size": string
  "--bubble-duration": string
  "--bubble-delay": string
  "--bubble-static-y": string
}

const BUBBLES = Array.from({ length: 26 }, (_, i) => ({
  left: `${4 + ((i * 29) % 93)}%`,
  size: `${5 + (i % 5) * 4}px`,
  duration: `${12 + (i % 6) * 3}s`,
  delay: `${-(i * 2.7)}s`,
  staticY: `${8 + ((i * 17) % 76)}%`,
}))

const DISTANT_FISH = Array.from({ length: 9 }, (_, i) => ({
  left: `${7 + ((i * 19) % 84)}%`,
  top: `${18 + ((i * 23) % 55)}%`,
  size: `${14 + (i % 4) * 5}px`,
  delay: `${-(i * 1.8)}s`,
}))

const PLANKTON = Array.from({ length: 34 }, (_, i) => ({
  left: `${2 + ((i * 37) % 96)}%`,
  top: `${12 + ((i * 29) % 76)}%`,
  size: `${1 + (i % 3)}px`,
  delay: `${-(i * 0.6)}s`,
}))

function Fish({ spec, index }: { spec: FishSpec; index: number }) {
  const style: FishStyle = {
    "--fish-top": spec.top,
    "--fish-size": spec.size,
    "--fish-duration": spec.duration,
    "--fish-delay": spec.delay,
    "--fish-static-x": spec.staticX,
  }
  const warmSuit = spec.suit === "hearts" || spec.suit === "diamonds"

  return (
    <div
      className={`ocean-fish-track ${spec.reverse ? "ocean-fish-track--reverse" : ""} ${spec.quiet ? "ocean-fish-track--quiet" : ""}`}
      style={style}
      aria-hidden="true"
    >
      <div className={`ocean-fish-bob ocean-fish-bob--${(index % 3) + 1}`}>
        <div className={spec.reverse ? "ocean-fish-facing-left" : undefined}>
          <img
            src={damselfishMascot}
            alt=""
            className="ocean-fish-image"
            draggable={false}
          />
        </div>
        <span className="fish-token">
          <span>{spec.rank}</span>
          <SuitGlyph
            suit={spec.suit}
            size={13}
            color={warmSuit ? "#ffb0a4" : "#fff2bd"}
          />
        </span>
      </div>
    </div>
  )
}

function OceanDetails() {
  return (
    <div className="ocean-details">
      <div className="ocean-plankton">
        {PLANKTON.map((mote, i) => (
          <span
            key={i}
            style={{
              left: mote.left,
              top: mote.top,
              width: mote.size,
              height: mote.size,
              animationDelay: mote.delay,
            }}
          />
        ))}
      </div>

      <div className="ocean-distant-school">
        {DISTANT_FISH.map((fish, i) => (
          <svg
            key={i}
            viewBox="0 0 42 22"
            style={{
              left: fish.left,
              top: fish.top,
              width: fish.size,
              animationDelay: fish.delay,
            }}
          >
            <path d="M12 11 1 3v16Zm-1 0C18 2 31 2 40 11c-9 9-22 9-29 0Z" />
          </svg>
        ))}
      </div>

      <svg className="ocean-jelly ocean-jelly--one" viewBox="0 0 110 150">
        <path d="M14 65C14 25 32 9 55 9s41 16 41 56Z" fill="#d8b3ef" />
        <path d="M14 65c9 13 18 13 27 0 9 13 18 13 27 0 9 13 18 13 28 0" fill="none" stroke="#f8d6ff" strokeWidth="6" strokeLinecap="round" />
        <path d="M31 76c-9 24 11 39 0 66M53 76c11 24-10 42 1 67M77 76c-11 22 8 39-3 62" fill="none" stroke="#d8b3ef" strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="41" cy="45" rx="4" ry="7" fill="#806fcd" />
        <ellipse cx="68" cy="45" rx="4" ry="7" fill="#806fcd" />
      </svg>

      <svg className="ocean-jelly ocean-jelly--two" viewBox="0 0 110 150">
        <path d="M14 65C14 25 32 9 55 9s41 16 41 56Z" fill="#75d7de" />
        <path d="M14 65c9 13 18 13 27 0 9 13 18 13 27 0 9 13 18 13 28 0" fill="none" stroke="#d9fff4" strokeWidth="6" strokeLinecap="round" />
        <path d="M31 76c-9 24 11 39 0 66M53 76c11 24-10 42 1 67M77 76c-11 22 8 39-3 62" fill="none" stroke="#75d7de" strokeWidth="6" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function Reef() {
  return (
    <svg
      className="ocean-reef"
      viewBox="0 0 1600 420"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <path
        d="M0 345C157 306 251 337 371 323c143-18 188-72 350-52 133 16 186 75 319 66 148-10 210-86 361-71 74 7 133 37 199 51v103H0Z"
        fill="#032b47"
      />
      <path
        d="M0 379c186-34 327 23 494-7 167-30 248-66 415-24 133 34 280-6 372-28 124-30 221 10 319 38v62H0Z"
        fill="#001d38"
      />

      <g opacity=".5">
        <path d="M0 325c70-58 118-52 167 0 43-82 107-92 177-2 49-59 103-55 153 7Z" fill="#174e69" />
        <path d="M1115 326c52-67 105-69 157-4 50-88 116-89 181 0 43-46 91-45 147 8Z" fill="#17516c" />
      </g>

      <g className="reef-sway reef-sway--four" fill="none" strokeLinecap="round">
        <path d="M356 380c-4-68 29-91 8-148" stroke="#39b59c" strokeWidth="13" />
        <path d="M380 384c18-55-10-82 20-126" stroke="#76cfa1" strokeWidth="11" />
        <path d="M1196 388c-15-63 23-87 4-139" stroke="#39b59c" strokeWidth="13" />
        <path d="M1221 388c23-50-3-78 20-111" stroke="#76cfa1" strokeWidth="10" />
      </g>

      <g className="reef-sway reef-sway--one" fill="none" strokeLinecap="round">
        <path d="M95 365c-27-72 33-99 4-174-19-48 6-95 31-127" stroke="#45c3a9" strokeWidth="23" />
        <path d="M122 371c32-64-13-101 30-160 23-31 25-70 13-101" stroke="#83d6a5" strokeWidth="18" />
        <path d="M76 374c-23-55 12-88-19-130-22-30-17-62-4-92" stroke="#22a896" strokeWidth="15" />
      </g>
      <g className="reef-sway reef-sway--two" fill="none" strokeLinecap="round">
        <path d="M1465 363c-37-84 29-113-8-194-16-34-3-77 23-111" stroke="#4fc6a9" strokeWidth="24" />
        <path d="M1510 372c30-61-20-95 18-151 25-36 17-74 3-100" stroke="#92d8a5" strokeWidth="18" />
        <path d="M1418 373c-5-63 36-91 12-145-16-36 5-68 27-88" stroke="#1ca08e" strokeWidth="15" />
      </g>

      <g transform="translate(255 285)">
        <path d="M-105 94c3-85 28-127 75-127 38 0 40 46 65 47 28 1 40-55 78-42 40 14 28 76 55 81 30 5 44-37 81-12 18 12 22 31 20 53Z" fill="#ff7f6d" />
        <path d="M-58 95c5-52 20-77 44-77 22 0 20 40 39 42 22 2 28-50 58-39 27 10 20 55 45 58 18 2 27-14 45-8l14 24Z" fill="#fdb515" opacity=".88" />
      </g>
      <g transform="translate(1236 314)">
        <path d="M-145 66c21-59 59-89 108-88 43 1 56 34 88 38 42 5 59-25 99-12 28 9 48 29 58 62Z" fill="#806fcd" />
        <path d="M-70 62c10-35 29-58 57-61 24-3 35 20 54 17 23-4 30-33 56-25 25 8 30 39 53 45 15 4 29 2 41 4l17 24Z" fill="#5ec5dc" />
      </g>

      <g fill="#315f78">
        <ellipse cx="475" cy="355" rx="122" ry="59" />
        <ellipse cx="589" cy="369" rx="88" ry="47" />
        <ellipse cx="1032" cy="375" rx="147" ry="50" />
      </g>
      <g fill="#4f7890">
        <ellipse cx="455" cy="345" rx="67" ry="30" />
        <ellipse cx="1004" cy="365" rx="83" ry="27" />
      </g>

      <g className="reef-fan" transform="translate(622 343)" fill="none" stroke="#ff8c7d" strokeWidth="7" strokeLinecap="round">
        <path d="M0 42C-6 3-32-3-48-31M1 42C7 4 35-5 54-35M0 40c-25-20-39-11-65-16M2 39c24-22 48-12 70-27M0 38C-8 7 7-10 2-45" />
        <path d="M-29 7c15 1 25 7 31 20M32 3C18 7 9 16 3 29" opacity=".75" />
      </g>

      <g className="reef-fan reef-fan--gold" transform="translate(1352 351)" fill="none" stroke="#f4cd59" strokeWidth="6" strokeLinecap="round">
        <path d="M0 35C-8 4-31 1-45-24M1 35C8 5 32 0 48-27M0 34c-21-15-35-9-55-12M2 33c22-18 39-10 58-22" />
      </g>

      <g fill="#68c9bd" opacity=".9">
        <path d="M875 390c-8-33-35-31-38-63 25 4 38 19 39 40 8-28 25-42 49-43-3 29-21 43-49 66Z" />
        <path d="M1090 395c-3-29-24-34-23-59 22 5 30 18 27 36 11-23 26-31 45-28-8 24-25 34-49 51Z" />
      </g>

      <g transform="translate(930 365)">
        <path d="m0-25 8 16 18 3-13 13 3 19L0 17l-16 9 3-19-13-13 18-3Z" fill="#f6c64e" />
        <circle cx="0" cy="1" r="5" fill="#e58b58" />
      </g>

      <g transform="translate(705 384)" fill="none" stroke="#fff0bd" strokeWidth="4">
        <path d="M-27 5c9-27 46-27 55 0Z" fill="#d98da8" />
        <path d="M-15 4c4-12 9-18 15-23M0 4c3-13 8-20 14-25M13 4c2-8 6-14 11-18" />
      </g>

      <g fill="#8bb2b5" opacity=".75">
        {Array.from({ length: 18 }, (_, i) => (
          <circle key={i} cx={70 + ((i * 83) % 1450)} cy={382 + (i % 4) * 7} r={3 + (i % 3)} />
        ))}
      </g>

      <g className="reef-sway reef-sway--three" fill="none" stroke="#f1cf5b" strokeLinecap="round" strokeWidth="11">
        <path d="M760 383c-8-43 14-65 5-100" />
        <path d="M790 388c10-52-18-70-5-114" />
        <path d="M820 389c-6-40 23-53 18-92" />
      </g>
      <g fill="#fff2bd" opacity=".8">
        <circle cx="764" cy="276" r="7" />
        <circle cx="785" cy="265" r="6" />
        <circle cx="839" cy="289" r="7" />
      </g>

      <path
        d="M0 396C154 387 296 406 448 398c164-9 297 10 452 0 163-11 306 9 451 0 90-6 171-5 249 0v22H0Z"
        fill="#00192f"
      />
      <path
        d="M0 396C154 387 296 406 448 398c164-9 297 10 452 0 163-11 306 9 451 0 90-6 171-5 249 0"
        fill="none"
        stroke="#174a62"
        strokeWidth="3"
        opacity=".72"
      />
    </svg>
  )
}

export default function UnderwaterScene() {
  return (
    <div className="ocean-scene" aria-hidden="true">
      <div className="ocean-surface" />
      <div className="ocean-rays" />
      <div className="ocean-caustics" />
      <div className="ocean-depth-glow" />
      <OceanDetails />

      <div className="ocean-bubbles">
        {BUBBLES.map((bubble, i) => {
          const style: BubbleStyle = {
            "--bubble-left": bubble.left,
            "--bubble-size": bubble.size,
            "--bubble-duration": bubble.duration,
            "--bubble-delay": bubble.delay,
            "--bubble-static-y": bubble.staticY,
          }
          return <span key={i} className="ocean-bubble" style={style} />
        })}
      </div>

      <div className="ocean-midground">
        {FISH.map((fish, i) => (
          <Fish key={`${fish.rank}-${fish.suit}`} spec={fish} index={i} />
        ))}
      </div>

      <div className="ocean-oski">
        <img src={oskiScubaFlat} alt="" draggable={false} />
      </div>

      <Reef />
      <div className="ocean-vignette" />
    </div>
  )
}
