// ---------------------------------------------------------------------------
// BCFC copy deck — the single source of truth for every word on the page.
// Voice: 85% trading-floor precision, 15% Canadian absurdism (in the details).
// ---------------------------------------------------------------------------

export type Suit = "spades" | "hearts" | "clubs" | "diamonds"

export const NAV = {
  monogram: "BERKELEY CFC",
  links: [
    { label: "The Game", id: "game" },
    { label: "The Edge", id: "edge" },
    { label: "The Table", id: "table" },
  ],
  cta: { label: "Join", id: "join" },
} as const

export const HERO = {
  titleLines: ["Berkeley", "Canadian Fish Club"],
  tagline: "A deduction card game for six players.",
  sub: "Every question gives the table information. We're starting weekly Canadian Fish games at Berkeley, with beginner tables and tournaments.",
  ctaPrimary: { label: "Take a seat", id: "join" },
  ctaSecondary: { label: "Learn the game", id: "dive" },
  diveCue: "Scroll to dive",
  askLog: [
    "03:41.202  N → E   ASK 9♥ ......... HIT",
    "03:44.847  N → E   ASK A♥ ......... MISS",
    "03:52.114  E → S   ASK J♠ ......... HIT",
    "03:55.630  E → S   ASK Q♠ ......... MISS",
    "04:01.008  S → W   ASK 4♦ ......... HIT",
    "04:06.442  S → W   ASK 7♦ ......... HIT",
    "04:11.985  S → N   ASK 2♦ ......... MISS",
    "04:19.310  TEAM S  DECLARE LOW ♦ .. +1 BOOK",
    "04:24.551  W → N   ASK K♣ ......... HIT",
    "04:31.076  W → N   ASK 10♣ ........ MISS",
  ],
  gridLabel: "POSITION MATRIX · BOOKS × SEATS",
  fan: [
    { rank: "9", suit: "hearts" },
    { rank: "10", suit: "hearts" },
    { rank: "J", suit: "hearts" },
    { rank: "Q", suit: "hearts" },
    { rank: "K", suit: "hearts" },
    { rank: "A", suit: "hearts" },
  ] as { rank: string; suit: Suit }[],
} as const

export const HOW_TO_PLAY = {
  kicker: { index: "01", title: "THE GAME" },
  heading: "The game, in sixty seconds.",
  intro:
    "Also known as Literature. Two teams of three, no board, no chips, no luck of the draw that matters. Just forty-eight cards and what you can infer about where they sit.",
  steps: [
    {
      index: "01",
      title: "The deck",
      body: "Pull the four 8s from a standard deck. Forty-eight cards remain, split into eight books of six: low 2 to 7 and high 9 to A, in every suit. Two teams of three, seated alternately. Your teammates' hands are as hidden from you as your opponents'.",
      diagram: "deck",
    },
    {
      index: "02",
      title: "The ask",
      body: "On your turn, ask one specific opponent for one specific card. Two rules: you must hold a card from that book, and you can't ask for a card you already hold. Hit: you take the card and ask again. Miss: the turn passes to the player you asked.",
      diagram: "ask",
    },
    {
      index: "03",
      title: "The leak",
      body: "Here's the game: every ask is public. Ask for the ten of clubs and all five other players learn two things: you hold high clubs, and you don't hold the ten. Signal to your teammates. Bleed nothing to the table. The card you don't ask for says as much as the one you do.",
      diagram: "leak",
    },
    {
      index: "04",
      title: "The declare",
      body: "When you believe your team holds a complete book, declare: name where all six cards sit. Call it right and the book is yours. Call it wrong and it goes to the other team. Five books takes the game. Declare on conviction, never on hope.",
      diagram: "declare",
    },
  ],
} as const

export const THE_EDGE = {
  kicker: { index: "02", title: "THE EDGE" },
  heading: "Why card people make good quants.",
  intro:
    "Nobody at a trading desk will ask about your GPA at the table. They will notice, within three hands, whether you can hold a posterior in your head.",
  theses: [
    {
      kicker: "BAYESIAN BY REFLEX",
      body: "Every ask updates the table. Track forty-eight cards across six hands for one evening, and priors stop being a lecture topic and start being a reflex.",
    },
    {
      kicker: "SIGNAL DESIGN",
      body: "You can't talk to your teammates. You can only ask questions the whole table hears. Being legible to your team while staying opaque to your opponents is a full course in information design.",
    },
    {
      kicker: "THE PRICE OF CONVICTION",
      body: "Declare at eighty percent, or wait a round and leak more? Every declare is a priced bet on your own inference. You'll learn what conviction costs, and that hesitation usually costs more.",
    },
    {
      kicker: "MEMORY UNDER FIRE",
      body: "No notes. No apps. Six hands, every ask, every miss, every implication, all carried in your head while someone tries to read your face. It compounds.",
    },
  ],
  pullQuote:
    "Poker taught a generation to price risk. Fish teaches you to price information.",
  pullQuoteAttribution: "OVERHEARD AT TABLE ONE (PROBABLY)",
} as const

export const PUZZLE_TEASER = {
  kicker: { index: "03", title: "PROOF OF TABLE SENSE" },
  heading: "There is a leak on this page.",
  body: "Somewhere on this page there's a maple leaf that doesn't belong. Find it, answer what follows, and your seat at the first table is reserved ahead of the line. We won't say more. That would be a leak.",
} as const

export const PUZZLE = {
  title: "PROOF OF TABLE SENSE",
  found: "You found the leak.",
  setup:
    "You are South. You hold the 9♥, J♥ and Q♥, three of the six high hearts. The other three (10♥, K♥, A♥) sit with your opponents, North, East and West, and your two teammates hold none. Each opponent has already asked in high hearts, so each holds at least one: three cards, three opponents, exactly one each. The asks so far, every one of them aimed at your side of the table:",
  asks: [
    "NORTH asked you for the A♥. Miss.",
    "EAST asked your teammate for the 10♥. Miss.",
    "WEST asked you for the K♥. Miss.",
    "NORTH asked your other teammate for the K♥. Miss.",
  ],
  question: "Who holds the ace of hearts?",
  options: ["NORTH", "EAST", "WEST"] as const,
  answer: "WEST",
  wrong: "That declare just cost your team a book. Run it again.",
  rewardTitle: "DECLARED ✓",
  rewardBody:
    "West holds the ace. North asked for the ace and the king, so North holds neither: North holds the ten. East asked for the ten, so East holds the king or the ace. West asked for the king, so West holds the ten or the ace. The ten is North's, so West holds the ace, and East is left with the king.",
  rewardPerk:
    "You have table sense. Screenshot this and show us at your first game night — you skip the wait-list.",
  rewardCode: "CODE: LOON-ACE-HEARTS",
  rewardFootnote: "sorry about the difficulty. yours, mgmt",
} as const

export const EVENTS = {
  kicker: { index: "04", title: "CALENDAR" },
  heading: "The calendar.",
  countdownLabel: "FIRST TABLE · T-MINUS",
  // First game night — placeholder until the club confirms.
  countdownTarget: "2026-09-10T19:00:00-07:00",
  rows: [
    {
      date: "SEP 10 · THU 19:00",
      event: "First Table: Learn-to-Play",
      venue: "Moffitt Library (TBD)",
      status: "TBD",
    },
    {
      date: "THU · WEEKLY 19:00",
      event: "Open Tables",
      venue: "Campus (TBD)",
      status: "TBD",
    },
    {
      date: "OCT · DATE TBD",
      event: "BCFC Invitational I · six-seat bracket",
      venue: "TBD",
      status: "TBD",
    },
    {
      date: "NOV · DATE TBD",
      event: "Firm Night · bring questions",
      venue: "TBD",
      status: "TBD",
    },
  ],
  smallPrint: "Times are estimates. Unlike our declares.",
} as const

export const TEAM = {
  kicker: { index: "03", title: "THE FOUNDING TABLE" },
  heading: "Six founding seats. Most of them still warm.",
  sub: "Flip a card, claim a chair. Officer applications open at the first table.",
  cards: [
    {
      rank: "A",
      suit: "spades" as Suit,
      role: "PRESIDENT",
      note: "Declares first. Answers for it.",
      open: false,
    },
    {
      rank: "K",
      suit: "spades" as Suit,
      role: "VICE PRESIDENT",
      note: "Runs the room when the room runs long.",
      open: true,
    },
    {
      rank: "Q",
      suit: "diamonds" as Suit,
      role: "TREASURER",
      note: "Guards a buy-in of exactly $0.",
      open: true,
    },
    {
      rank: "J",
      suit: "clubs" as Suit,
      role: "TOURNAMENT DIRECTOR",
      note: "Seeds the bracket. Suffers the appeals.",
      open: true,
    },
    {
      rank: "10",
      suit: "hearts" as Suit,
      role: "SOCIAL CHAIR",
      note: "Maple syrup budget: under review.",
      open: true,
    },
    {
      rank: "9",
      suit: "diamonds" as Suit,
      role: "YOU?",
      note: "Open seat. Ask us for it — that's the whole game.",
      open: true,
    },
  ],
  openLabel: "OPEN SEAT · APPLY AT TABLE ONE",
  claimedLabel: "SEAT CLAIMED",
} as const

export const JOIN = {
  kicker: { index: "04", title: "JOIN" },
  heading: "Take a seat.",
  sub: "Leave your info and we'll send details for the first game night.",
  form: {
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "you@berkeley.edu",
    interestLabel: "I'm interested in",
    interestOptions: [
      "Learning the game",
      "Weekly open tables",
      "Tournaments",
      "Helping run the club",
      "Something else",
    ],
    messageLabel: "Message",
    messagePlaceholder: "Anything we should know?",
    submit: "Send interest",
    sending: "Sending…",
    success: "You're on the list. We'll be in touch with game-night details.",
    error: "That didn't go through. Try again or email us directly.",
    alternatives: "Or reach us directly",
  },
  ctas: [
    { label: "Interest form", href: "#", variant: "solid" as const },
    { label: "Join the Discord", href: "#", variant: "ghost" as const },
    {
      label: "Email us",
      href: "mailto:canadianfish@berkeley.edu",
      variant: "ghost" as const,
    },
  ],
  faq: [
    {
      q: "Do I need to know the game?",
      a: "No. The first two weeks of the semester are learn-to-play tables. You'll be declaring by October and insufferable about it by November.",
    },
    {
      q: "Do I need to be a quant?",
      a: "You need to like being right for the right reasons. Majors are irrelevant; inference is universal.",
    },
    {
      q: "Are you actually Canadian?",
      a: "Legally, no. Spiritually, on Thursdays.",
    },
    {
      q: "How much does it cost?",
      a: "Nothing. We removed the 8s from the deck, not the money from your pockets.",
    },
  ],
  footnote: "No experience required. Canadians welcome. Everyone else tolerated warmly.",
} as const

export const FOOTER = {
  blurb: "Berkeley Canadian Fish Club · est. 2026 · Berkeley, CA",
  colophon:
    "Set in Hanken Grotesk & JetBrains Mono. Built with React, Motion and three.js. Four 8s were harmed in the making of this club.",
  navHeading: "INDEX",
  colophonHeading: "COLOPHON",
  fineHeading: "FINE PRINT",
  fine: "Not affiliated with any trading firm. Yet.",
  copyright: "© 2026 BCFC · GO BEARS · sorry.",
} as const
