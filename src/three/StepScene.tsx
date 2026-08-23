import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import * as THREE from "three"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { PerformanceMonitor } from "@react-three/drei"
import type { MotionValue } from "motion/react"
import type { Suit } from "../lib/content"
import {
  CARD_H,
  CARD_W,
  GOLD,
  NAVY_DEEP,
  drawBack,
  drawFace,
  drawLabel,
  makeCardBodyGeometry,
  toTexture,
} from "./cardTextures"
import { StaticFrame } from "./CardScene"

// ---------------------------------------------------------------------------
// "The game, in sixty seconds": one 3D diorama per step, scrubbed by scroll
// (GSAP ScrollTrigger pin+scrub pattern, driven natively). Each diorama acts
// out its step and clears the stage before the next enters.
// Perf: materials are cached once (no per-frame traversal), the render loop
// only runs while the stage is on screen, DPR is capped at 1.5.
// ---------------------------------------------------------------------------

const N = 4
const L = 1 / N

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (t: number) => t * t * (3 - 2 * t)
const lerp = THREE.MathUtils.lerp

function presence(p: number, index: number) {
  const tRaw = (p - index * L) / L
  // The dive hands directly to the first scene, so its stacked deck is fully
  // present at progress zero. Later scenes retain their crossfade entrances.
  const enter = index === 0 ? 1 : smooth(clamp01(tRaw / 0.14))
  const exit = index === N - 1 ? 0 : smooth(clamp01((tRaw - 0.88) / 0.12))
  const t = clamp01((tRaw - 0.14) / 0.74)
  return {
    visible: tRaw > -0.02 && (index === N - 1 || tRaw < 1.06),
    opacity: enter * (1 - exit),
    yOff: (1 - enter) * -2.6 + exit * 2.2,
    t,
  }
}

type AnyMat = THREE.Material & { opacity: number }
type Mats = AnyMat[]

function collectMats(root: THREE.Object3D | null): Mats {
  const mats: Mats = []
  root?.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (mesh.isMesh) {
      const m = mesh.material as AnyMat
      m.transparent = true
      mats.push(m)
    }
  })
  return mats
}

const setOpacity = (mats: Mats, o: number) => {
  for (let i = 0; i < mats.length; i++) mats[i].opacity = o
}

// A physical card: navy slab + front/back textured planes (standard
// material — clearcoat was costing more than it looked).
function Card3D({
  front,
  back,
  scale = 1,
}: {
  front: THREE.Texture
  back: THREE.Texture
  scale?: number
}) {
  const bodyGeometry = useMemo(makeCardBodyGeometry, [])
  return (
    <group scale={scale}>
      <mesh geometry={bodyGeometry} position={[0, 0, -0.01]}>
        <meshStandardMaterial color={NAVY_DEEP} metalness={0.35} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[CARD_W, CARD_H]} />
        <meshStandardMaterial
          map={front}
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

function Label({
  text,
  style = "ghost",
  height = 0.42,
}: {
  text: string
  style?: "chip" | "ghost"
  height?: number
}) {
  const { texture, aspect } = useMemo(() => {
    const { canvas, aspect } = drawLabel(text, style)
    return { texture: toTexture(canvas), aspect }
  }, [text, style])
  return (
    <mesh>
      <planeGeometry args={[height * aspect, height]} />
      <meshBasicMaterial map={texture} transparent opacity={0} />
    </mesh>
  )
}

function useTextures() {
  return useMemo(() => {
    const back = toTexture(drawBack())
    const face = (rank: string, suit: Suit, stamp?: string) =>
      toTexture(drawFace(rank, suit, stamp))
    return {
      back,
      eights: (["spades", "hearts", "clubs", "diamonds"] as Suit[]).map((s) =>
        face("8", s),
      ),
      nineHearts: face("9", "hearts"),
      tenClubs: face("10", "clubs"),
      book: (["9", "10", "J", "Q", "K", "A"] as const).map((r) =>
        face(r, "hearts"),
      ),
    }
  }, [])
}

type Tex = ReturnType<typeof useTextures>
type Diorama = { progress: MotionValue<number>; tex: Tex }

// The dioramas are authored in a fixed design space. The Canvas itself is
// clipped to the right-hand visual lane, and FittedStage scales the design
// inside that lane. This is a hard collision boundary: WebGL pixels cannot
// enter the copy column at any desktop aspect ratio.
const DESIGN_LEFT = -3.45
const DESIGN_RIGHT = 3.45

function FittedStage({ children }: { children: ReactNode }) {
  const viewportW = useThree((s) => s.viewport.width)
  const scale = useMemo(() => {
    const design = DESIGN_RIGHT - DESIGN_LEFT
    return Math.min(1, Math.max(0.34, (viewportW - 0.65) / design))
  }, [viewportW])

  return (
    <group scale={scale}>
      {children}
    </group>
  )
}

// --- 01 THE DECK: the stack fans out; the four 8s eject and fall away. -----
function DeckDiorama({ progress, tex }: Diorama) {
  const root = useRef<THREE.Group>(null)
  const backs = useRef<(THREE.Group | null)[]>([])
  const eights = useRef<(THREE.Group | null)[]>([])
  const backMats = useRef<Mats>([])
  const eightMats = useRef<Mats[]>([])

  useEffect(() => {
    backMats.current = backs.current.flatMap((b) => collectMats(b))
    eightMats.current = eights.current.map((e) => collectMats(e))
  }, [])

  useFrame((state) => {
    const g = root.current
    if (!g) return
    const { visible, opacity, yOff, t } = presence(progress.get(), 0)
    g.visible = visible
    if (!visible) return
    g.position.y = yOff
    const clock = state.clock.elapsedTime

    const fan = smooth(clamp01((t - 0.12) / 0.5))
    for (let i = 0; i < 8; i++) {
      const b = backs.current[i]
      if (!b) continue
      const fx = -2.3 + i * 0.66
      const fy = 0.35 - Math.pow((i - 3.5) / 3.5, 2) * 0.55
      b.position.x = lerp(0.02 * (i - 4), fx, fan)
      b.position.y =
        lerp(0.2 + i * 0.012, fy, fan) + Math.sin(clock * 0.9 + i) * 0.03
      b.position.z = lerp(-0.05 * i, -0.3 - i * 0.02, fan)
      b.rotation.z = lerp(0.03 * (i - 4), 0.3 - i * 0.085, fan)
    }
    setOpacity(backMats.current, opacity)
    for (let i = 0; i < 4; i++) {
      const e = eights.current[i]
      if (!e) continue
      const te = clamp01((t - (0.28 + i * 0.13)) / 0.34)
      const fall = Math.pow(te, 1.6)
      e.position.x = 0.3 + i * 0.12 + fall * (i % 2 === 0 ? 1.4 : -1.1)
      e.position.y = 0.1 - fall * 6.2
      e.position.z = 0.35 + i * 0.02
      e.rotation.z = fall * (i % 2 === 0 ? -1.1 : 0.9)
      setOpacity(eightMats.current[i] ?? [], opacity * (1 - te * 0.95))
    }
  })

  return (
    <group ref={root} visible={false}>
      {Array.from({ length: 8 }, (_, i) => (
        <group key={`b${i}`} ref={(el) => void (backs.current[i] = el)}>
          <Card3D front={tex.back} back={tex.back} scale={0.6} />
        </group>
      ))}
      {tex.eights.map((face, i) => (
        <group key={`e${i}`} ref={(el) => void (eights.current[i] = el)}>
          <Card3D front={face} back={tex.back} scale={0.6} />
        </group>
      ))}
    </group>
  )
}

// --- 02 THE ASK: two held hands; the 9♥ travels from EAST to YOU. ----------
function AskDiorama({
  progress,
  tex,
  askShift,
}: Diorama & { askShift?: MotionValue<number> }) {
  const root = useRef<THREE.Group>(null)
  const traveler = useRef<THREE.Group>(null)
  const askLabel = useRef<THREE.Group>(null)
  const hitChip = useRef<THREE.Group>(null)
  const hands = useRef<(THREE.Group | null)[]>([])
  const baseMats = useRef<Mats>([])
  const travelerMats = useRef<Mats>([])
  const askMats = useRef<Mats>([])
  const hitMats = useRef<Mats>([])

  useEffect(() => {
    baseMats.current = hands.current.flatMap((h) => collectMats(h))
    travelerMats.current = collectMats(traveler.current)
    askMats.current = collectMats(askLabel.current)
    hitMats.current = collectMats(hitChip.current)
    // YOU / EAST labels ride with base opacity
    const you = root.current?.getObjectByName("hand-labels")
    baseMats.current.push(...collectMats(you ?? null))
  }, [])

  useFrame((state) => {
    const g = root.current
    if (!g) return
    const { visible, opacity, yOff, t } = presence(progress.get(), 1)
    g.visible = visible
    if (!visible) {
      askShift?.set(0)
      return
    }
    g.position.y = yOff
    const clock = state.clock.elapsedTime

    hands.current.forEach((h, i) => {
      if (h) h.position.y = -1.25 + Math.sin(clock + i) * 0.03
    })

    const tt = smooth(clamp01((t - 0.16) / 0.52))
    // The copy leans away as the card flies toward its side of the stage.
    askShift?.set(opacity * smooth(clamp01((tt - 0.45) / 0.45)))
    const tr = traveler.current
    if (tr) {
      tr.position.x = lerp(2.1, -1.9, tt)
      tr.position.y = -0.7 + Math.sin(tt * Math.PI) * 1.65
      tr.position.z = 0.6
      tr.rotation.y = Math.PI * (1 - tt)
      tr.rotation.z = lerp(-0.25, 0.18, tt)
      tr.visible = t > 0.05
    }

    const askOn =
      smooth(clamp01((t - 0.04) / 0.14)) *
      (1 - smooth(clamp01((t - 0.62) / 0.12)))
    const hitOn = smooth(clamp01((t - 0.74) / 0.12))
    if (askLabel.current) askLabel.current.position.y = 2.05 + askOn * 0.08
    if (hitChip.current) {
      const s = 1.45 - 0.45 * hitOn
      hitChip.current.scale.setScalar(Math.max(0.001, s * hitOn || 0.001))
    }

    setOpacity(baseMats.current, opacity)
    setOpacity(travelerMats.current, opacity)
    setOpacity(askMats.current, opacity * askOn)
    setOpacity(hitMats.current, opacity * hitOn)
  })

  const handCard = (
    key: string,
    i: number,
    x: number,
    mirror: boolean,
    slot: number,
  ) => (
    <group
      key={key}
      ref={(el) => void (hands.current[i] = el)}
      position={[x, -1.25, 0]}
    >
      <group
        position={[(slot - 1) * (mirror ? -0.52 : 0.52), 0, slot * 0.03]}
        rotation={[0, mirror ? -0.3 : 0.3, (slot - 1) * (mirror ? 0.24 : -0.24)]}
      >
        <Card3D front={tex.back} back={tex.back} scale={0.58} />
      </group>
    </group>
  )

  return (
    <group ref={root} visible={false}>
      {[0, 1, 2].map((s) => handCard(`you${s}`, s, -2.15, false, s))}
      {[0, 1, 2].map((s) => handCard(`east${s}`, s + 3, 2.15, true, s))}
      <group name="hand-labels">
        <group position={[-2.15, -2.5, 0]}>
          <Label text="YOU" />
        </group>
        <group position={[2.15, -2.5, 0]}>
          <Label text="EAST" />
        </group>
      </group>
      <group ref={askLabel} position={[0, 2.05, 0]}>
        <Label text="ASK: 9♥" height={0.5} />
      </group>
      <group ref={traveler} visible={false}>
        <Card3D front={tex.nineHearts} back={tex.back} scale={0.62} />
      </group>
      <group ref={hitChip} position={[-1.35, 0.55, 0.8]}>
        <Label text="HIT" style="chip" height={0.52} />
      </group>
    </group>
  )
}

// --- 03 THE LEAK: information radiates off the ten of clubs. ---------------
function LeakDiorama({ progress, tex }: Diorama) {
  const root = useRef<THREE.Group>(null)
  const card = useRef<THREE.Group>(null)
  const rings = useRef<(THREE.Mesh | null)[]>([])
  const labels = useRef<(THREE.Group | null)[]>([])
  const cardMats = useRef<Mats>([])
  const labelMats = useRef<Mats[]>([])

  useEffect(() => {
    cardMats.current = collectMats(card.current)
    labelMats.current = labels.current.map((l) => collectMats(l))
  }, [])

  useFrame((state) => {
    const g = root.current
    if (!g) return
    const { visible, opacity, yOff, t } = presence(progress.get(), 2)
    g.visible = visible
    if (!visible) return
    g.position.y = yOff
    const clock = state.clock.elapsedTime

    if (card.current) {
      card.current.position.y = 0.1 + Math.sin(clock * 0.9) * 0.06
      card.current.rotation.z = Math.sin(clock * 0.6) * 0.03
    }
    setOpacity(cardMats.current, opacity)

    for (let i = 0; i < 3; i++) {
      const ring = rings.current[i]
      if (!ring) continue
      const phase = (clock * 0.3 + i / 3) % 1
      ring.scale.setScalar(1 + phase * 1.7)
      ;(ring.material as AnyMat).opacity =
        opacity * (1 - phase) * 0.45 * smooth(clamp01(t / 0.2))
    }

    const starts = [0.12, 0.34, 0.56]
    labels.current.forEach((label, i) => {
      if (!label) return
      const on = smooth(clamp01((t - starts[i]) / 0.16))
      label.position.y = label.userData.baseY + on * 0.1
      setOpacity(labelMats.current[i] ?? [], opacity * on)
    })
  })

  const labelDefs = [
    { text: "HOLDS HIGH ♣", x: -2.3, y: 1.55 },
    { text: "NOT THE 10", x: 2.25, y: 0.55 },
    { text: "SIGNAL?", x: -2.05, y: -1.65 },
  ]

  return (
    <group ref={root} visible={false}>
      <group ref={card}>
        <Card3D front={tex.tenClubs} back={tex.back} scale={0.82} />
      </group>
      {[0, 1, 2].map((i) => (
        <mesh
          key={`r${i}`}
          ref={(el) => void (rings.current[i] = el)}
          position={[0, 0.1, -0.25]}
        >
          <ringGeometry args={[1.52, 1.56, 96]} />
          <meshBasicMaterial color={GOLD} transparent opacity={0} />
        </mesh>
      ))}
      {labelDefs.map((d, i) => (
        <group
          key={d.text}
          ref={(el) => {
            labels.current[i] = el
            if (el) el.userData.baseY = d.y
          }}
          position={[d.x, d.y, 0.4]}
        >
          <Label text={d.text} />
        </group>
      ))}
    </group>
  )
}

// --- 04 THE DECLARE: the high-hearts book flips face-up, then the stamp. ---
function DeclareDiorama({ progress, tex }: Diorama) {
  const root = useRef<THREE.Group>(null)
  const cards = useRef<(THREE.Group | null)[]>([])
  const stamp = useRef<THREE.Group>(null)
  const cardMats = useRef<Mats>([])
  const stampMats = useRef<Mats>([])

  useEffect(() => {
    cardMats.current = cards.current.flatMap((c) => collectMats(c))
    stampMats.current = collectMats(stamp.current)
  }, [])

  useFrame((state) => {
    const g = root.current
    if (!g) return
    const { visible, opacity, yOff, t } = presence(progress.get(), 3)
    g.visible = visible
    if (!visible) return
    g.position.y = yOff
    const clock = state.clock.elapsedTime

    for (let i = 0; i < 6; i++) {
      const c = cards.current[i]
      if (!c) continue
      const flip = smooth(clamp01((t - (0.05 + i * 0.11)) / 0.18))
      c.position.x = -2.65 + i * 1.06
      c.position.y =
        -0.4 -
        Math.pow((i - 2.5) / 2.5, 2) * 0.35 +
        Math.sin(flip * Math.PI) * 0.5 +
        Math.sin(clock + i) * 0.03
      c.position.z = i * 0.02
      c.rotation.y = Math.PI * (1 - flip)
      c.rotation.z = -0.12 + i * 0.048
    }
    setOpacity(cardMats.current, opacity)

    const sOn = smooth(clamp01((t - 0.78) / 0.14))
    if (stamp.current) {
      const s = 1.5 - 0.5 * sOn
      stamp.current.scale.setScalar(Math.max(0.001, s * (sOn > 0 ? 1 : 0.001)))
      stamp.current.rotation.z = -0.08
    }
    setOpacity(stampMats.current, opacity * sOn)
  })

  return (
    <group ref={root} visible={false}>
      {tex.book.map((face, i) => (
        <group key={i} ref={(el) => void (cards.current[i] = el)}>
          <Card3D front={face} back={tex.back} scale={0.58} />
        </group>
      ))}
      <group ref={stamp} position={[0, 1.8, 0.6]}>
        <Label text="BOOK +1" style="chip" height={0.56} />
      </group>
    </group>
  )
}

function Scene({
  progress,
  askShift,
}: {
  progress: MotionValue<number>
  askShift?: MotionValue<number>
}) {
  const rig = useRef<THREE.Group>(null)
  const tex = useTextures()

  useFrame((state, delta) => {
    const g = rig.current
    if (!g) return
    const damp = Math.min(1, delta * 2.4)
    g.rotation.y += (state.pointer.x * 0.09 - g.rotation.y) * damp
    g.rotation.x += (-state.pointer.y * 0.05 - g.rotation.x) * damp
  })

  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 5, 6]} intensity={1.7} />
      <pointLight position={[-5, -3, 4]} color={GOLD} intensity={36} distance={14} />
      <group ref={rig}>
        <FittedStage>
          <DeckDiorama progress={progress} tex={tex} />
          <AskDiorama progress={progress} tex={tex} askShift={askShift} />
          <LeakDiorama progress={progress} tex={tex} />
          <DeclareDiorama progress={progress} tex={tex} />
        </FittedStage>
      </group>
    </>
  )
}

export default function StepScene({
  progress,
  askShift,
}: {
  progress: MotionValue<number>
  askShift?: MotionValue<number>
}) {
  const isStatic = useMemo(
    () => document.documentElement.classList.contains("qa-static"),
    [],
  )
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
  }, [])
  const running = !isStatic && inView

  // Supersample past native resolution while the machine holds frame rate
  // (SSAA sharpening); the monitor steps DPR down only on sustained drops.
  const maxDpr = useMemo(
    () => Math.min((window.devicePixelRatio || 1.5) * 1.25, 3),
    [],
  )
  const [dpr, setDpr] = useState(maxDpr)

  return (
    <div ref={wrapRef} className="step-scene-canvas">
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
          <Scene progress={progress} askShift={askShift} />
        </PerformanceMonitor>
        {isStatic && <StaticFrame />}
      </Canvas>
    </div>
  )
}
