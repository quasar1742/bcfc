import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react"
import * as THREE from "three"

function seededRandom(seed: number) {
  let value = seed >>> 0
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0
    return value / 4294967296
  }
}

function ParticleField({ color, count, seed, size }: {
  color: string
  count: number
  seed: number
  size: number
}) {
  const positions = useMemo(() => {
    const random = seededRandom(seed)
    const data = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const angle = random() * Math.PI * 2
      const radius = Math.pow(random(), 0.62) * 10
      data[i * 3] = Math.cos(angle) * radius * 1.3
      data[i * 3 + 1] = Math.sin(angle) * radius * 0.78
      data[i * 3 + 2] = 12 - random() * 68
    }
    return data
  }, [count, seed])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={0.62}
        depthWrite={false}
      />
    </points>
  )
}

function DepthRings() {
  return (
    <group>
      {[2, -9, -20, -31, -42].map((z, index) => (
        <mesh key={z} position={[0, -0.4 + index * -0.22, z]}>
          <torusGeometry args={[6.7 + index * 0.38, 0.018, 6, 128]} />
          <meshBasicMaterial
            color={index < 2 ? "#a9c4c2" : "#e7b853"}
            transparent
            opacity={index < 2 ? 0.13 : 0.075}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

function DiveScene({ progress, reduced }: {
  progress: MotionValue<number>
  reduced: boolean
}) {
  const { camera, scene } = useThree()
  const surface = useMemo(() => new THREE.Color("#0b3140"), [])
  const abyss = useMemo(() => new THREE.Color("#071f2a"), [])
  const current = useMemo(() => new THREE.Color(), [])

  useFrame((state) => {
    const p = reduced ? 0.58 : progress.get()
    camera.position.z = 9 - p * 51
    camera.position.x = Math.sin(p * Math.PI * 3.2) * 0.3
    camera.position.y = -p * 1.65 + Math.sin(p * Math.PI * 2) * 0.12
    camera.rotation.z = Math.sin(p * Math.PI * 2.4) * 0.012
    camera.updateProjectionMatrix()

    current.copy(surface).lerp(abyss, Math.pow(p, 0.72))
    scene.background = current
    if (scene.fog instanceof THREE.Fog) scene.fog.color.copy(current)

    state.camera.lookAt(0, camera.position.y * 0.12, camera.position.z - 12)
  })

  return (
    <>
      <fog attach="fog" args={["#0b3140", 5, 23]} />
      <ParticleField color="#b9d3cc" count={680} seed={2026} size={0.055} />
      <ParticleField color="#e7b853" count={90} seed={1948} size={0.045} />
      <DepthRings />
    </>
  )
}

function PassingFish({ progress }: { progress: MotionValue<number> }) {
  const y = useTransform(progress, [0.02, 0.92], [420, -520])
  const x = useTransform(progress, [0, 0.45, 1], [-80, 48, -26])
  const opacity = useTransform(progress, [0.05, 0.18, 0.78, 0.92], [0, 0.24, 0.14, 0])
  const scale = useTransform(progress, [0, 1], [1.2, 0.65])

  return (
    <motion.svg
      viewBox="0 0 360 130"
      className="absolute left-[12%] top-1/2 w-[min(54vw,520px)] text-mist"
      style={{ x, y, opacity, scale }}
    >
      <g fill="currentColor">
        <path d="M18 38c38-30 89-30 127 0-38 30-89 30-127 0Zm0 0L0 15v46Z" />
        <path d="M198 91c27-21 64-21 91 0-27 21-64 21-91 0Zm0 0-17-17v34Z" opacity=".66" />
        <path d="M291 29c18-14 42-14 60 0-18 14-42 14-60 0Zm0 0-12-12v24Z" opacity=".42" />
      </g>
    </motion.svg>
  )
}

export default function DiveTransition() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion() ?? false
  const [inView, setInView] = useState(true)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "20% 0px" },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })
  const { scrollYProgress: entryProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  })
  const [meters, setMeters] = useState(0)
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setMeters(Math.round(value * 32))
    document.documentElement.classList.toggle(
      "dive-immersive",
      value > 0.025 && value < 0.999,
    )
  })
  useEffect(
    () => () => document.documentElement.classList.remove("dive-immersive"),
    [],
  )
  const surfaceOpacity = useTransform(scrollYProgress, [0, 0.28, 0.7], [0.8, 0.28, 0])
  const vignetteOpacity = useTransform(
    scrollYProgress,
    [0, 0.45, 0.82, 1],
    [0.12, 0.36, 0.72, 0],
  )
  const gaugeScale = useTransform(scrollYProgress, [0, 1], [0, 1])
  const cueOpacity = useTransform(
    scrollYProgress,
    [0.03, 0.12],
    [0, 1],
  )
  const cueY = useTransform(
    scrollYProgress,
    [0.03, 0.16],
    [34, 0],
  )
  // The canvas is already overscanned above the viewport before it fades in. This
  // lets the water column become fully opaque before the hero's reef ends, so the
  // two scenes dissolve through one another instead of exposing a shared edge.
  const entryOpacity = useTransform(entryProgress, [0, 0.32, 0.44, 0.55], [0, 0, 0.56, 1])

  return (
    <section
      ref={ref}
      id="dive"
      aria-label="Dive beneath the surface"
      className={reduced
        ? "pointer-events-none relative -mb-[10svh] h-[110svh] -translate-y-[10svh]"
        : "pointer-events-none relative -mb-[18svh] h-[258svh] -translate-y-[18svh]"
      }
    >
      <motion.div
        className={reduced
          ? "sticky top-[10svh] h-[100svh]"
          : "sticky top-[18svh] h-[100svh]"
        }
        style={{ opacity: reduced ? 1 : entryOpacity }}
      >
        <div
          className={reduced
            ? "absolute inset-x-0 -top-[20svh] bottom-0 overflow-hidden bg-[#0b3140]"
            : "absolute inset-x-0 -top-[40svh] bottom-0 overflow-hidden bg-[#0b3140]"
          }
        >
          <Canvas
            camera={{ position: [0, 0, 9], fov: 56, near: 0.1, far: 90 }}
            dpr={[1, 1.75]}
            gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
            frameloop={inView ? "always" : "never"}
            className="!pointer-events-none !absolute !inset-0"
            aria-hidden="true"
          >
            <DiveScene progress={scrollYProgress} reduced={reduced} />
          </Canvas>

          <motion.div className="dive-surface-light" style={{ opacity: surfaceOpacity }} />
          <PassingFish progress={scrollYProgress} />
          <motion.div className="dive-vignette" style={{ opacity: vignetteOpacity }} />

          <div className="absolute bottom-8 left-5 z-10 h-44 w-px overflow-hidden bg-mist/20 md:bottom-10 md:left-10">
            <motion.div className="absolute inset-0 origin-top bg-gold" style={{ scaleY: gaugeScale }} />
          </div>
          <div className="absolute bottom-8 right-5 z-10 flex h-44 items-stretch gap-3 md:bottom-10 md:right-10">
            <div className="relative w-px overflow-hidden bg-mist/20">
              <motion.div className="absolute inset-0 origin-top bg-gold" style={{ scaleY: gaugeScale }} />
            </div>
            <div className="flex flex-col justify-between font-mono text-[9px] uppercase tracking-[0.16em] text-mist/60">
              <span>0m</span>
              <span>-16m</span>
              <span className="text-gold">-{meters}m</span>
            </div>
          </div>
        </div>
      </motion.div>
      <motion.div
        className={reduced
          ? "dive-cue-layer pointer-events-none sticky top-[10svh] z-30 -mt-[100svh] flex h-[100svh] items-center justify-center px-6 text-center"
          : "dive-cue-layer pointer-events-none sticky top-[18svh] z-30 -mt-[100svh] flex h-[100svh] items-center justify-center px-6 text-center"
        }
        style={{ opacity: cueOpacity, y: cueY }}
      >
        <p className="dive-cue-title relative z-10 max-w-[860px] font-display text-[clamp(30px,4.2vw,64px)] font-medium leading-[1.04] tracking-[-0.035em] text-paper">
          Take a dive into the rules of the game.
        </p>
      </motion.div>
      <div className="dive-floor-handoff" aria-hidden="true" />
    </section>
  )
}
