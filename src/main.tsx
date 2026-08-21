import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { MotionGlobalConfig } from "motion/react"
import "./index.css"
import App from "./App"
import OGCard from "./OGCard"

const params = new URLSearchParams(window.location.search)
const isOgMode = params.has("og")

// QA/static mode (?static): finish all animations instantly so headless or
// occluded-window screenshots capture final layout. Also used for the OG shot.
if (params.has("static") || isOgMode) {
  MotionGlobalConfig.skipAnimations = true
  document.documentElement.classList.add("qa-static")
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>{isOgMode ? <OGCard /> : <App />}</StrictMode>,
)
