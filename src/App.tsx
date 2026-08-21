import Nav from "./sections/Nav"
import Hero from "./sections/Hero"
import HowToPlay from "./sections/HowToPlay"
import TheEdge from "./sections/TheEdge"
import Team from "./sections/Team"
import Join from "./sections/Join"
import Footer from "./sections/Footer"

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HowToPlay />
        <TheEdge />
        <Team />
        <Join />
      </main>
      <Footer />
    </>
  )
}
