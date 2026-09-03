# CF@B — Canadian Fish @ Berkeley: Design Spec

Single-page landing site. **Architecture stolen from hackmit.org 2026** (scroll narrative, staged reveals, interlocking sections, easter-egg puzzle, team marquee, living footer). **Skin: quant-firm editorial** — 85% Jane Street/Citadel precision, 15% Canadian absurdism (absurdism lives in small details, never the surface).

## 1. Brand

- **Name:** Canadian Fish @ Berkeley (CF@B). The game: Canadian Fish / Literature — 6 players, 2 teams of 3, 48 cards (8s removed), eight "books" (half-suits) of six, ask-and-deduce, declare to win.
- **Voice:** confident, precise, dry. Short declarative sentences. Mono for anything data-flavored. The jokes are deadpan and rare. Never exclamation marks except in a joke.
- **Positioning:** the training ground for Berkeley's future quants — but never claim affiliation with any firm. Footer disclaimer: "Not affiliated with any trading firm. Yet."

## 2. Design tokens (Tailwind v4 theme — already configured in `src/index.css`)

Colors (use these utility names):
- `berkeley` #003262 — primary navy. Text on paper, dark section backgrounds.
- `berkeley-deep` #00223F — darker navy for footer/depth layers.
- `gold` #FDB515 — California Gold. CTAs, foil strokes, accents ON NAVY.
- `gold-deep` #B07E0A — darker gold for accents/small text ON PAPER (contrast-safe).
- `paper` #FAF6ED — warm off-white page background.
- `paper-soft` #F1EADC — slightly deeper paper for cards/wells on paper.
- `maple` #A8322A — restrained maple red. Hearts/diamonds suits, rare accents.
- `fog` #5B6E85 — muted slate for secondary text on paper.
- `mist` #9FB1C4 — secondary text on navy.
- Hairlines: `border-berkeley/15` on paper, `border-gold/25` on navy.

Type:
- `font-display` = Fraunces (variable; serif). Headlines, pull quotes. Use `font-medium`→`font-semibold`, tight leading (`leading-[0.95]`), optical kerning. Italic for emphasis words.
- `font-mono` = JetBrains Mono. ALL eyebrows, labels, stats, buttons, nav links, table data. Usually `text-[11px]`–`text-sm`, `tracking-[0.18em]`, `uppercase`.
- Body: Fraunces 400 at `text-lg`/`text-xl`, `leading-relaxed`, color `berkeley/80` on paper, `mist` on navy.
- Fluid display sizes with clamp, e.g. hero `text-[clamp(44px,7vw,110px)]`, section titles `text-[clamp(32px,4.5vw,64px)]`.

Section furniture (MUST be consistent — this is the quant look):
- Every section starts with a mono kicker row: `<SectionKicker index="02" title="THE GAME" />` — hairline rule + `02 / THE GAME` in mono caps + hairline.
- Sections alternate paper/navy: Hero (paper) → Ticker strip (navy) → The Game (paper) → The Edge (navy) → Puzzle teaser (paper, compact) → Calendar (paper with navy table card) → Ticker strip → The Table/team (navy) → Join (paper) → Footer (berkeley-deep).
- Max content width `max-w-6xl mx-auto px-6 md:px-10`. Generous vertical padding `py-24 md:py-32`.
- Selection color: gold. Focus rings: `focus-visible:ring-2 ring-gold`.

## 3. Motion rules (Motion for React — `import { motion } from "motion/react"`)

- **No overshoot.** This is a trading-floor aesthetic: springs with `bounce: 0`, or ease `[0.22, 1, 0.36, 1]`. Durations 0.5–0.9s. The ONLY bouncy thing on the whole page is the puzzle-solve card flip.
- Standard reveal: `initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}`. Stagger children 0.06–0.09s. Use the shared `reveal`/`revealStagger` variants from `src/lib/anim.ts`.
- Scroll-linked: `useScroll` + `useTransform`; pass to `style`. Only transform/opacity/filter/clipPath (GPU-friendly).
- Respect reduced motion: use `useReducedMotion()` from motion/react for big effects; CSS marquees get `motion-reduce:animation-none` handling via the `prefersReducedMotion` guard already in shared components.
- Hovers: 150–200ms, small (scale 1.02, y -2). Cards may tilt ≤3°.

## 4. Shared primitives (already built — import, do not re-implement)

From `src/components/cards.tsx`:
- `<PlayingCard rank="9" suit="hearts" size={n} label?="HIGH HEARTS · BOOK 06" faceDown?/>` — geometric modern card face SVG. `suit`: "spades" | "hearts" | "clubs" | "diamonds". Width `n` px (height auto 1.4×). `faceDown` renders the CardBack.
- `<CardBack size={n} leaf?=boolean />` — navy card back with gold guilloche + maple-Campanile medallion. `leaf` adds nothing extra (the medallion contains the leaf); decorative.
- `<SuitGlyph suit size className>` — bare suit path.
- `<CardFan cards=[{rank,suit}] size spread?>` — arced fan of cards.

From `src/components/ui.tsx`:
- `<SectionKicker index="03" title="THE EDGE" dark?/>` — the mono kicker row.
- `<GoldButton href children variant?="solid"|"ghost" dark?/>` — CTA. Solid = gold bg, berkeley text, mono caps; ghost = hairline border.
- `<Ticker items={string[]} dark? withLeaf?/>` — infinite CSS marquee divider strip (navy). `withLeaf` inserts the hidden puzzle-trigger maple leaf as one separator (calls `usePuzzle().open()` on click). Separators are ◆.
- `<Hairline dark?/>`.

From `src/lib/anim.ts`: `reveal`, `revealStagger`, `staggerChild`, `EASE` (the standard cubic-bezier), `SPRING_FIRM`.
From `src/lib/content.ts`: ALL copy as exported constants — never hardcode copy in components; import it.
From `src/puzzle/PuzzleProvider.tsx`: `usePuzzle()` → `{ open() }`; `<PuzzleModal/>` is mounted in App. The hidden maple leaf trigger lives in Ticker (`withLeaf`) and Footer.

## 5. Sections & copy (full deck in `src/lib/content.ts` — this is the source of truth)

Anchors/nav: `game` (THE GAME), `edge` (THE EDGE), `calendar` (CALENDAR), `table` (THE TABLE), `join` (JOIN — gold button).

### 5.1 Nav (`src/sections/Nav.tsx`)
Fixed top, z-50. Paper/95 backdrop-blur when scrolled (transparent at top). Left: monogram "CF@B" in Fraunces semibold + tiny gold SuitGlyph spade. Right: mono links + gold JOIN button. Gold 2px scroll-progress hairline across the very top (`useScroll` + `scaleX`, transformOrigin left). Smooth-scroll to anchors with −88px offset (shared `scrollToId` in ui.tsx). Mobile: links collapse to a minimal menu button → full-screen navy overlay with big Fraunces links (AnimatePresence).

### 5.2 Hero (`src/sections/Hero.tsx`) — built by hand (reference implementation)
Two-column on desktop: left = eyebrow, H1 "Six hands. Forty-eight cards. *Zero luck.*", sub, CTAs. Right = card fan + ask-log + possibility grid. Entrance: headline lines clip-reveal upward staggered; cards deal in one-by-one with firm spring; ask-log lines type on an interval loop; grid cells tick. Stat strip along bottom: `48 CARDS — 8 BOOKS — 6 SEATS — 0 LUCK` (mono, hairline above).

### 5.3 The Game (`src/sections/HowToPlay.tsx`) — "The game, in sixty seconds."
4 numbered step cards (grid 2×2 desktop, stacked mobile), each: mono index (`01 / THE DECK`), Fraunces subhead, body, and a small ANIMATED SVG diagram. Diagrams (whileInView, use shared card/suit components at small size):
1. THE DECK — 48 cards split into books: row of 8 mini face-down cards, one flips revealing "9–A ♥"; the four 8s slide away and fade ("the 8s are removed").
2. THE ASK — three mini cards + an animated gold arrow from YOU to EAST with mono label "ASK: 9♥" → returns "HIT" (arrow reverses with card) then "MISS" variant (turn marker slides).
3. THE LEAK — a card with sonar/ripple rings emanating (information leaking); mono annotations fade in around it: "HOLDS LOW ♣", "NOT THE 10", "TEAM SIGNAL?".
4. THE DECLARE — six mini cards flip face-up in sequence around a table dot; gold "BOOK +1" stamp settles (the one allowed satisfying thunk).
Closer line under grid, centered Fraunces italic: "That's the whole game. Mastery takes a semester. We'll get you there."

### 5.4 The Edge (`src/sections/TheEdge.tsx`) — navy section, "Why card people make good quants."
Editorial: big Fraunces statement, then 4 theses in a 2×2 grid — mono kicker + body (copy in content.ts): BAYESIAN BY REFLEX / SIGNAL DESIGN / THE PRICE OF CONVICTION / MEMORY UNDER FIRE. Gold foil line-art background flourish: a large faint guilloche/`CardBack` medallion, low opacity, scroll-parallaxed. Pull quote at bottom, Fraunces italic large, gold: "Poker taught a generation to price risk. Fish teaches you to price information." — attribution mono: "— OVERHEARD AT TABLE ONE (PROBABLY)".

### 5.5 Puzzle teaser (`src/sections/PuzzleTeaser.tsx`) — paper, compact (not full height).
Kicker `04 / PROOF OF TABLE SENSE`. One paragraph: "Somewhere on this page there is a maple leaf that doesn't belong. Find it, answer what follows, and your seat at the first table is reserved ahead of the line. We won't say more. That would be a leak." Right side: a face-down card (CardBack) that slowly rotates ±2° (idle float). NO trigger here — the real trigger is the leaf in the Ticker strips + footer. `PuzzleModal` (already built) contains the deduction quiz and reward.

### 5.6 Calendar (`src/sections/Events.tsx`) — "The calendar."
Left: countdown to first table (target in content.ts: 2026-09-10T19:00 PT) — mono, big tabular numerals, labeled `T-MINUS / DD : HH : MM : SS` live-ticking, in a navy card with gold hairlines. Right/below: schedule as a market-calendar table (mono rows, hairline separators, hover row highlight): date · event · venue · status chips (`CONFIRMED`/`TBD` — gold-deep chip outline). Rows in content.ts. Small print: "Times are estimates. Unlike our declares."

### 5.7 The Table (`src/sections/Team.tsx`) — navy, team marquee (HackMIT steal).
Kicker `06 / THE FOUNDING TABLE`. Intro line: "Six founding seats. Most of them still warm. Flip a card, claim a chair." Marquee (two rows opposite directions, CSS animation, pause on hover, reduced-motion static): items are playing-card tiles — face-down CardBacks that 3D-flip on hover to reveal role cards (rank+suit + role in mono + one-liner). Cards in content.ts (PRESIDENT A♠ … plus one card "YOU? · open seat"). Use `rotateY` flip with perspective; firm spring, no bounce.

### 5.8 Join (`src/sections/Join.tsx`) — paper, the conversion section.
Huge Fraunces: "Take a seat." Sub: "The interest form takes forty seconds. The habit lasts a career." Buttons: GoldButton solid "INTEREST FORM" (href `#` placeholder), ghost "JOIN THE DISCORD" (`#`), ghost "EMAIL US" (`mailto:canadianfish@berkeley.edu` placeholder). Then mini-FAQ: 4 items, Radix Accordion (from `radix-ui`) with Motion height animation, mono question row + Fraunces answer (copy in content.ts). Footnote mono small, fog: "No experience required. Canadians welcome. Everyone else tolerated warmly."

### 5.9 Footer (`src/sections/Footer.tsx`) — berkeley-deep.
Top hairline gold. Grid: monogram + "Canadian Fish @ Berkeley — est. 2026 · Berkeley, CA"; nav links column (mono); sponsor column. A small SVG fish (line art, gold) swims across the footer slowly on a loop (Motion animate x + gentle y sine; reduced-motion hides it). Bottom row mono: "© 2026 CF@B · GO BEARS" + the Berkeley coordinates.

## 6. Puzzle spec (already implemented in `src/puzzle/`)

Trigger: clicking any hidden maple leaf (Ticker separator or footer). Modal (navy card, gold frame): "PROOF OF TABLE SENSE — You found the leak." Deduction problem (solvable, self-contained): You are South, holding 9♥ J♥ Q♥ (high hearts book: 9,10,J,Q,K,A — so 10♥, K♥, A♥ are spread among North, East, West, each holding exactly one — the problem states each opponent has asked in high hearts, proving each holds at least one). Asks so far: EAST asked NORTH for the 10♥ — miss. WEST asked EAST for the A♥ — miss. NORTH asked WEST for the K♥ — miss. Q: "Who holds the ten of hearts?" Options N/E/W. (Answer: WEST — North can't hold 10 (was asked, missed) or K (asked for it) → A; East asked for 10 so lacks it, missed A → K; West holds 10.) Wrong: firm shake + "That declare just cost your team a book. Run it again." Correct: card flip + gold stamp "DECLARED ✓" + reward text: "West holds the ten. You have table sense. Screenshot this and show us at your first table — you skip the wait-list. Code: LOON-TEN-HEARTS." + tiny "sorry about the difficulty. — mgmt"

## 7. File contract

- One section per file in `src/sections/`. Default-export the component. Import copy from `src/lib/content.ts`, primitives from `src/components/`, variants from `src/lib/anim.ts`.
- TypeScript strict. No `any`. No new npm deps. No external images/fonts (fonts come from index.html Google Fonts link; all art is inline SVG).
- Accessibility: semantic landmarks (`<nav>`, `<section aria-labelledby>`), alt/aria on decorative SVG (`aria-hidden`), keyboard operable (accordion, modal focus trap via Radix Dialog, marquee content duplicated with `aria-hidden` on clones).
- Every section must look intentional at 375px, 768px, 1280px, 1536px.
