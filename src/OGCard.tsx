import { CardBack, Medallion, PlayingCard } from "./components/cards"

// Renders at exactly 1200x630 for the og:image screenshot (visit /?og).
export default function OGCard() {
  const fan = [
    { rank: "9", suit: "hearts" as const, r: -24 },
    { rank: "J", suit: "spades" as const, r: -8 },
    { rank: "Q", suit: "clubs" as const, r: 8 },
    { rank: "A", suit: "diamonds" as const, r: 24 },
  ]
  return (
    <div
      className="relative overflow-hidden bg-berkeley"
      style={{ width: 1200, height: 630 }}
    >
      <div className="absolute -right-40 -top-64 opacity-[0.08]">
        <Medallion size={900} ring={false} />
      </div>
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gold" />

      <div className="relative flex h-full items-center justify-between px-20">
        <div className="max-w-[640px]">
          <p className="font-display text-[16px] font-semibold uppercase tracking-[0.3em] text-gold">
            BERKELEY CANADIAN FISH CLUB · EST. 2026
          </p>
          <h1 className="mt-7 font-display text-[84px] font-medium leading-[0.98] tracking-[-0.02em] text-paper">
            Six hands.
            <br />
            Forty-eight cards.
            <br />
            <span className="font-semibold text-gold">Zero luck.</span>
          </h1>
          <p className="mt-8 font-mono text-[14px] uppercase tracking-[0.26em] text-mist">
            48 CARDS ◆ 8 BOOKS ◆ 6 SEATS ◆ 0 LUCK
          </p>
        </div>

        <div className="relative mr-10 h-[420px] w-[360px]">
          <div
            className="absolute left-1/2 top-1/2"
            style={{
              transform: "translate(-50%, -50%) rotate(9deg)",
            }}
          >
            <CardBack size={230} />
          </div>
          {fan.map((c, i) => (
            <div
              key={c.rank}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(-50%, -50%) rotate(${c.r}deg) translateY(-26px)`,
                transformOrigin: "50% 140%",
                zIndex: i + 1,
              }}
            >
              <PlayingCard
                rank={c.rank}
                suit={c.suit}
                size={150}
                className="drop-shadow-[0_20px_30px_rgba(0,0,0,0.45)]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
