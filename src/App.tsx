import { lazy, Suspense } from "react"
import Nav from "./sections/Nav"
import Hero from "./sections/Hero"
import HowToPlay from "./sections/HowToPlay"
import TheEdge from "./sections/TheEdge"
import Team from "./sections/Team"
import Join from "./sections/Join"
import Footer from "./sections/Footer"
import OceanDepth from "./components/OceanDepth"

const DiveTransition = lazy(() => import("./sections/DiveTransition"))

function OceanDivider() {
  return (
    <div className="ocean-section-divider" aria-hidden="true">
      <span />
      <i />
      <span />
    </div>
  )
}

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <div className="ocean-depth">
          <OceanDepth />
          <div className="ocean-depth-content">
            <Suspense fallback={<div className="h-[100svh] bg-berkeley-deep" aria-hidden="true" />}>
              <DiveTransition />
            </Suspense>
            <HowToPlay />
            <OceanDivider />
            <TheEdge />
            <OceanDivider />
            <Team />
            <OceanDivider />
            <Join />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
