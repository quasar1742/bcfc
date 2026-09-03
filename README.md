# CF@B — Canadian Fish @ Berkeley

Landing page for Canadian Fish @ Berkeley. Six hands. Forty-eight cards. Zero luck.

Architecture inspired by hackmit.org (scroll narrative, staged reveals, hidden admissions-style puzzle, team marquee); skin is quant-firm editorial — Berkeley Blue `#003262`, California Gold `#FDB515`, Fraunces + JetBrains Mono, geometric playing cards with a guilloche card back bearing the maple-leaf-meets-Campanile medallion.

## Stack

- Vite + React 19 + TypeScript (strict)
- Tailwind CSS v4 (design tokens in `src/index.css` `@theme`)
- Motion for React (`motion/react`) — firm springs, zero overshoot
- Radix (`radix-ui`) for dialog + accordion primitives
- No backend. No analytics. All art is inline SVG.

## Develop

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run build:preview  # self-contained single-file dist/index.html
npm run typecheck
```

## Where things live

- `DESIGN.md` — the full design spec and copy rules
- `src/lib/content.ts` — **every word on the page** (edit copy here)
- `src/components/cards.tsx` — the card system (faces, back, medallion, suits)
- `src/components/ui.tsx` — section furniture (kicker, buttons, ticker + hidden leaf)
- `src/puzzle/` — the hidden puzzle (find the maple leaf that doesn't belong; answer: WEST; reward code `LOON-TEN-HEARTS`)
- `src/sections/` — one file per page section

## Placeholders to fill in before launch

- Interest form + Discord URLs (`src/lib/content.ts` → `JOIN.ctas`)
- First game night date/venue (`EVENTS`), officer cards (`TEAM`)
- Once you own a domain, add `<meta property="og:url" .../>` (and absolute og:image URLs) to `index.html`

## Deploy

Any static host. For GitHub Pages: build, push `dist/` (or use an action); for
Netlify/Vercel: framework = Vite, build `npm run build`, publish `dist/`.
