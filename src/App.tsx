import { PuzzleProvider } from "./puzzle/PuzzleProvider"
import { Ticker } from "./components/ui"
import { TICKER_ITEMS, TICKER_ITEMS_ALT } from "./lib/content"
import Nav from "./sections/Nav"
import Hero from "./sections/Hero"
import HowToPlay from "./sections/HowToPlay"
import TheEdge from "./sections/TheEdge"
import PuzzleTeaser from "./sections/PuzzleTeaser"
import Events from "./sections/Events"
import Team from "./sections/Team"
import Join from "./sections/Join"
import Footer from "./sections/Footer"

export default function App() {
  return (
    <PuzzleProvider>
      <Nav />
      <main>
        <Hero />
        <Ticker items={TICKER_ITEMS} withLeaf />
        <HowToPlay />
        <TheEdge />
        <PuzzleTeaser />
        <Events />
        <Ticker items={TICKER_ITEMS_ALT} duration={156} />
        <Team />
        <Join />
      </main>
      <Footer />
    </PuzzleProvider>
  )
}
