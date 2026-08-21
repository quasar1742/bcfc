import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { PerformanceMonitor } from "@react-three/drei"
import { useReducedMotion } from "motion/react"
import { CardFan } from "../components/cards"
import type { Suit } from "../lib/content"
import { supportsWebgl } from "../lib/webgl"
import {
  CARD_H,
  CARD_W,
  GOLD,
  NAVY_DEEP,
  drawBack,
  drawFace,
  makeCardBodyGeometry,
  toTexture,
} from "./cardTextures"

// ---------------------------------------------------------------------------
// Hero card well: five cards floating in navy, pointer-tracked tilt, firm
// entrance, zero overshoot. SVG fan fallback without WebGL.
// ---------------------------------------------------------------------------

type CardSpec = {
  rank?: string
  suit?: Suit
  faceUp: boolean
  pos: [number, number, number]
  rz: number
}

const SPECS: CardSpec[] = [
  { rank: "A", suit: "spades", faceUp: true, pos: [-2.3, -0.5, 0.35], rz: 0.3 },
  { faceUp: false, pos: [-1.15, -0.02, -0.3], rz: 0.14 },
  { rank: "9", suit: "hearts", faceUp: true, pos: [0, 0.22, 0.15], rz: 0 },
  { faceUp: false, pos: [1.15, -0.02, -0.4], rz: -0.14 },
  { rank: "K", suit: "clubs", faceUp: true, pos: [2.3, -0.5, 0.4], rz: -0.3 },
]

function useCardTextures() {
  return useMemo(() => {
    const back = toTexture(drawBack())
    const faces = new Map<string, THREE.CanvasTexture>()
    for (const s of SPECS) {
      if (s.faceUp && s.rank && s.suit) {
        faces.set(`${s.rank}${s.suit}`, toTexture(drawFace(s.rank, s.suit)))
      }
    }
    return { back, faces }
  }, [])
}

function Card({
  spec,
  index,
  back,
  face,
  animated,
}: {
  spec: CardSpec
  index: number
  back: THREE.Texture
  face: THREE.Texture | undefined
  animated: boolean
}) {
  const group = useRef<THREE.Group>(null)
  const progress = useRef(animated ? 0 : 1)
  const delay = 0.15 + index * 0.09
  const bodyGeometry = useMemo(makeCardBodyGeometry, [])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime

    if (progress.current < 1) {
      progress.current = Math.min(
        1,
        progress.current + (t > delay ? delta / 0.9 : 0),
      )
    }
    const p = progress.current
    const ease = 1 - Math.pow(1 - p, 3)

    const floatY = animated ? Math.sin(t * 0.8 + index * 1.7) * 0.06 : 0
    const floatR = animated ? Math.sin(t * 0.6 + index * 2.3) * 0.012 : 0

    g.position.x = spec.pos[0]
    g.position.y =
      THREE.MathUtils.lerp(spec.pos[1] - 2.4, spec.pos[1], ease) + floatY
    g.position.z = spec.pos[2]
    g.rotation.z = THREE.MathUtils.lerp(spec.rz * 3, spec.rz, ease) + floatR
    for (const m of g.children as THREE.Mesh[]) {
      const mat = m.material as THREE.MeshStandardMaterial
      if ("opacity" in mat) {
        mat.transparent = true
        mat.opacity = ease
      }
    }
  })

  const frontMap = spec.faceUp && face ? face : back

  return (
    <group ref={group}>
      <mesh geometry={bodyGeometry} position={[0, 0, -0.01]}>
        <meshStandardMaterial color={NAVY_DEEP} metalness={0.35} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[CARD_W, CARD_H]} />
        <meshStandardMaterial
          map={frontMap}
          transparent
          alphaTest={0.4}
          roughness={0.45}
          metalness={0.05}
        />
      </mesh>
      <mesh position={[0, 0, -0.032]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[CARD_W, CARD_H]} />
        <meshStandardMaterial
          map={back}
          transparent
          alphaTest={0.4}
          roughness={0.45}
          metalness={0.05}
        />
      </mesh>
    </group>
  )
}

function Scene({ animated }: { animated: boolean }) {
  const { back, faces } = useCardTextures()
  const rig = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    const g = rig.current
    if (!g || !animated) return
    const damp = Math.min(1, delta * 2.6)
    g.rotation.y += (state.pointer.x * 0.16 - g.rotation.y) * damp
    g.rotation.x += (-state.pointer.y * 0.1 - g.rotation.x) * damp
  })

  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 5, 6]} intensity={1.7} />
      <pointLight position={[-5, -3, 4]} color={GOLD} intensity={36} distance={14} />
      <group ref={rig}>
        {SPECS.map((spec, i) => (
          <Card
            key={i}
            spec={spec}
            index={i}
            back={back}
            face={
              spec.rank && spec.suit
                ? faces.get(`${spec.rank}${spec.suit}`)
                : undefined
            }
            animated={animated}
          />
        ))}
      </group>
    </>
  )
}

// With frameloop="never", draw manual frames after mount so hidden-tab QA and
// reduced-motion users still get the final pose.
export function StaticFrame() {
  const advance = useThree((state) => state.advance)
  useEffect(() => {
    advance(0)
    advance(0.016)
    const id = window.setInterval(() => advance(0.016), 800)
    return () => window.clearInterval(id)
  }, [advance])
  return null
}

export function useFontsReady(): boolean {
  const [ready, setReady] = useState(
    () => typeof document !== "undefined" && document.fonts.status === "loaded",
  )
  useEffect(() => {
    if (ready) return
    let done = false
    const finish = () => {
      if (!done) {
        done = true
        setReady(true)
      }
    }
    document.fonts.ready.then(finish)
    const id = window.setTimeout(finish, 1500)
    return () => window.clearTimeout(id)
  }, [ready])
  return ready
}

export default function CardScene() {
  const reducedMotion = useReducedMotion()
  const ready = useFontsReady()
  const webgl = useMemo(supportsWebgl, [])
  const isStatic = useMemo(
    () => document.documentElement.classList.contains("qa-static"),
    [],
  )
  const animated = !reducedMotion && !isStatic

  // Supersample past native while frame rate holds; degrade on real drops.
  const maxDpr = useMemo(
    () => Math.min((window.devicePixelRatio || 1.5) * 1.25, 3),
    [],
  )
  const [dpr, setDpr] = useState(maxDpr)

  // Only run the render loop while the hero is actually on screen.
  const wrapRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [webgl, ready])

  if (!webgl) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <CardFan
          cards={[
            { rank: "A", suit: "spades" },
            { rank: "9", suit: "hearts" },
            { rank: "K", suit: "clubs" },
          ]}
          size={140}
          spread={30}
        />
      </div>
    )
  }

  if (!ready) return null

  const running = animated && inView

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <Canvas
        camera={{ position: [0, -0.15, 10.6], fov: 30 }}
        dpr={isStatic ? 1.5 : dpr}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: isStatic,
        }}
        frameloop={running ? "always" : "never"}
        aria-hidden="true"
        className="!absolute !inset-0"
      >
        <PerformanceMonitor
          onDecline={() =>
            setDpr((d) => Math.max(1.4, d - 0.55))
          }
          onIncline={() => setDpr(maxDpr)}
        >
          <Scene animated={animated} />
        </PerformanceMonitor>
        {!animated && <StaticFrame />}
      </Canvas>
    </div>
  )
}
