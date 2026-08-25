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
  sponsorLabel: "PREMIERE SPONSOR",
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

export const SPONSORS = {
  janeStreet: {
    name: "Jane Street",
    href: "https://www.janestreet.com/",
    logo: "/jane-street-logo.svg",
  },
  traderJoes: {
    name: "Trader Joe's",
    href: "https://www.traderjoes.com/home",
    logo: "/trader-joes-logo.svg",
  },
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
  kicker: { index: "02", title: "WHAT TO EXPECT" },
  heading: "Come learn Canadian Fish.",
  intro:
    "Canadian Fish is easiest to learn by playing. We will start with a short rules explanation, play a practice hand together, and then form tables for full games.",
  theses: [
    {
      kicker: "BEGINNERS ARE WELCOME",
      body: "You do not need to know the rules before coming. We will explain how asking, collecting books, and declaring work before the first game begins.",
    },
    {
      kicker: "SIX PLAYERS PER TABLE",
      body: "Canadian Fish is a team card game for six people. Once everyone understands the basics, we will divide into tables and rotate seats as needed.",
    },
    {
      kicker: "NOTHING TO BRING",
      body: "We will provide the cards and teach the game. Just bring yourself and enough time to stay for a practice hand or a full game.",
    },
    {
      kicker: "A NEW CLUB",
      body: "BCFC is still getting started. Meeting times, rooms, and future events will be shared once they are confirmed, and early members can help shape how the club runs.",
    },
  ],
  pullQuote:
    "No experience is required. We will teach the rules before we start.",
  pullQuoteAttribution: "NEW PLAYERS ARE WELCOME",
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
  kicker: { index: "03", title: "GET INVOLVED" },
  heading: "Help us build the club.",
  sub: "We are looking for students who want to play regularly and people who can help organize meetings. Flip the cards to see where help is needed.",
  cards: [
    {
      rank: "A",
      suit: "spades" as Suit,
      role: "CLUB ORGANIZER",
      note: "Coordinates BCFC and plans the club's first semester.",
      open: false,
    },
    {
      rank: "K",
      suit: "spades" as Suit,
      role: "MEETING PLANNER",
      note: "Helps schedule meetings, reserve rooms, and set up tables.",
      open: true,
    },
    {
      rank: "Q",
      suit: "diamonds" as Suit,
      role: "TREASURER",
      note: "Helps manage club expenses, supplies, and reimbursements.",
      open: true,
    },
    {
      rank: "J",
      suit: "clubs" as Suit,
      role: "RULES TEACHER",
      note: "Helps introduce new players and answer questions during games.",
      open: true,
    },
    {
      rank: "10",
      suit: "hearts" as Suit,
      role: "OUTREACH",
      note: "Shares meeting information and welcomes interested students.",
      open: true,
    },
    {
      rank: "9",
      suit: "diamonds" as Suit,
      role: "MEMBER VOLUNTEER",
      note: "Helps with setup, teaching, or events whenever available.",
      open: true,
    },
  ],
  openLabel: "LOOKING FOR HELP",
  claimedLabel: "CURRENT ROLE",
} as const

export const JOIN = {
  kicker: { index: "04", title: "STAY UPDATED" },
  heading: "Get meeting updates.",
  sub: "Leave your contact information and we will email you when the first learn-to-play session has a confirmed date and room.",
  form: {
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "you@berkeley.edu",
    interestLabel: "I'm interested in",
    interestOptions: [
      "Learning Canadian Fish",
      "Attending regular games",
      "Helping organize the club",
      "Teaching new players",
      "Other",
    ],
    messageLabel: "Message",
    messagePlaceholder: "Tell us what you are interested in or ask a question.",
    submit: "Sign up for updates",
    sending: "Sending…",
    success: "Thanks. We will email you when the next meeting is confirmed.",
    error: "We could not submit the form. Please try again or email us directly.",
    alternatives: "Questions? Contact us directly",
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
      q: "Do I need to know how to play?",
      a: "No. New players are welcome, and we will explain the rules before games begin. You can learn with an open practice hand before joining a full game.",
    },
    {
      q: "When and where will meetings happen?",
      a: "We are still confirming the schedule and campus room. Sign up above and we will send the details as soon as they are finalized.",
    },
    {
      q: "Who can join?",
      a: "The club is being organized for UC Berkeley students. No particular major, background, or card-game experience is required.",
    },
    {
      q: "How much does it cost?",
      a: "We do not currently charge membership dues. If an event ever has a cost, we will share that information before registration.",
    },
  ],
  footnote: "No experience required. All UC Berkeley majors are welcome.",
} as const

export const FOOTER = {
  blurb: "Berkeley Canadian Fish Club · est. 2026 · Berkeley, CA",
  navHeading: "INDEX",
  sponsorHeading: "PREMIERE SPONSORS",
  copyright: "© 2026 BCFC · GO BEARS",
} as const
