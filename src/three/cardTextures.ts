import * as THREE from "three"
import { MAPLE_LEAF_PATH, SUIT_PATHS } from "../components/cards"
import type { Suit } from "../lib/content"

// ---------------------------------------------------------------------------
// Canvas-drawn card textures shared by every 3D scene. Same brand system as
// the SVG cards: guilloche rosettes, the maple-Campanile medallion, mono
// corner indices.
// ---------------------------------------------------------------------------

export const NAVY = "#123747"
export const NAVY_DEEP = "#071f2a"
export const GOLD = "#e7b853"
export const CREAM = "#faf6ea"
export const MAPLE = "#b8523f"

export const TEX_W = 512
export const TEX_H = 717
export const CARD_W = 2.5
export const CARD_H = 3.5
const RADIUS_PX = 40

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

// All draw code targets the TEX_W × TEX_H coordinate space; the backing
// store is TEX_SCALE× for crisp close-ups on the full-screen stage.
const TEX_SCALE = 2

function makeCanvas(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement("canvas")
  canvas.width = TEX_W * TEX_SCALE
  canvas.height = TEX_H * TEX_SCALE
  const ctx = canvas.getContext("2d")!
  ctx.scale(TEX_SCALE, TEX_SCALE)
  return [canvas, ctx]
}

export function toTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 16
  return tex
}

// Navy guilloche card back with the maple-Campanile medallion.
export function drawBack(): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas()
  ctx.clearRect(0, 0, TEX_W, TEX_H)
  roundedRectPath(ctx, 0, 0, TEX_W, TEX_H, RADIUS_PX)
  ctx.save()
  ctx.clip()
  ctx.fillStyle = NAVY
  ctx.fillRect(0, 0, TEX_W, TEX_H)

  ctx.strokeStyle = GOLD
  ctx.globalAlpha = 0.55
  ctx.lineWidth = 2
  roundedRectPath(ctx, 22, 22, TEX_W - 44, TEX_H - 44, 24)
  ctx.stroke()
  ctx.globalAlpha = 0.25
  ctx.lineWidth = 1
  roundedRectPath(ctx, 34, 34, TEX_W - 68, TEX_H - 68, 18)
  ctx.stroke()

  const cx = TEX_W / 2
  const cy = TEX_H / 2
  ctx.globalAlpha = 0.16
  ctx.lineWidth = 1.4
  for (let i = 0; i < 12; i++) {
    ctx.beginPath()
    ctx.ellipse(cx, cy, 205, 60, (i * 15 * Math.PI) / 180, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.globalAlpha = 0.11
  for (let i = 0; i < 8; i++) {
    ctx.beginPath()
    ctx.ellipse(
      cx,
      cy,
      145,
      102,
      ((i * 22.5 + 11) * Math.PI) / 180,
      0,
      Math.PI * 2,
    )
    ctx.stroke()
  }

  ctx.globalAlpha = 1
  ctx.fillStyle = NAVY
  ctx.beginPath()
  ctx.arc(cx, cy, 108, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = GOLD
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.arc(cx, cy, 108, 0, Math.PI * 2)
  ctx.stroke()
  ctx.globalAlpha = 0.5
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(cx, cy, 96, 0, Math.PI * 2)
  ctx.stroke()
  ctx.globalAlpha = 1

  const leaf = new Path2D(MAPLE_LEAF_PATH)
  ctx.save()
  ctx.translate(cx, cy)
  ctx.scale(7.4, 7.4)
  ctx.fillStyle = GOLD
  ctx.fill(leaf)
  ctx.fillRect(-1.2, 8, 2.4, 3.4)
  ctx.restore()

  ctx.save()
  ctx.translate(cx, cy - 6)
  ctx.scale(3.9, 3.9)
  ctx.fillStyle = NAVY
  ctx.fillRect(-2.6, -3.6, 5.2, 13.1)
  ctx.beginPath()
  ctx.moveTo(-3.4, -3.6)
  ctx.lineTo(0, -9.8)
  ctx.lineTo(3.4, -3.6)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = GOLD
  ctx.fillRect(-1.7, -2.6, 1.1, 3.4)
  ctx.fillRect(0.6, -2.6, 1.1, 3.4)
  ctx.beginPath()
  ctx.arc(0, 3.2, 1.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = NAVY
  ctx.beginPath()
  ctx.arc(0, 3.2, 0.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  ctx.fillStyle = GOLD
  ctx.globalAlpha = 0.85
  ctx.font = '500 20px "JetBrains Mono", monospace'
  ctx.textAlign = "center"
  ctx.letterSpacing = "6px"
  ctx.fillText("CF@B · MMXXVI", cx, cy + 158)
  ctx.restore()
  return canvas
}

// Clean card face; optional gold stamp across the lower half (e.g. "BOOK +1").
export function drawFace(
  rank: string,
  suit: Suit,
  stamp?: string,
): HTMLCanvasElement {
  const [canvas, ctx] = makeCanvas()
  ctx.clearRect(0, 0, TEX_W, TEX_H)
  roundedRectPath(ctx, 0, 0, TEX_W, TEX_H, RADIUS_PX)
  ctx.save()
  ctx.clip()
  ctx.fillStyle = CREAM
  ctx.fillRect(0, 0, TEX_W, TEX_H)

  const color = suit === "hearts" || suit === "diamonds" ? MAPLE : NAVY

  ctx.strokeStyle = "#8a5b13"
  ctx.globalAlpha = 0.5
  ctx.lineWidth = 2
  roundedRectPath(ctx, 22, 22, TEX_W - 44, TEX_H - 44, 24)
  ctx.stroke()
  ctx.globalAlpha = 0.9
  ctx.lineWidth = 3
  const tick = 30
  for (const [tx, ty, sx, sy] of [
    [22, 22, 1, 1],
    [TEX_W - 22, 22, -1, 1],
    [22, TEX_H - 22, 1, -1],
    [TEX_W - 22, TEX_H - 22, -1, -1],
  ] as const) {
    ctx.beginPath()
    ctx.moveTo(tx, ty + sy * tick)
    ctx.lineTo(tx, ty)
    ctx.lineTo(tx + sx * tick, ty)
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  const pip = new Path2D(SUIT_PATHS[suit])

  const drawIndex = (flip: boolean) => {
    ctx.save()
    if (flip) {
      ctx.translate(TEX_W, TEX_H)
      ctx.rotate(Math.PI)
    }
    ctx.fillStyle = color
    ctx.font = '600 68px "JetBrains Mono", monospace'
    ctx.textAlign = "left"
    ctx.fillText(rank, 52, 118)
    ctx.translate(52, 132)
    ctx.scale(2.1, 2.1)
    ctx.fill(pip)
    ctx.restore()
  }
  drawIndex(false)
  drawIndex(true)

  ctx.strokeStyle = "#8a5b13"
  ctx.globalAlpha = 0.1
  ctx.lineWidth = 1.2
  for (let i = 0; i < 8; i++) {
    ctx.beginPath()
    ctx.ellipse(
      TEX_W / 2,
      TEX_H / 2,
      150,
      46,
      (i * 22.5 * Math.PI) / 180,
      0,
      Math.PI * 2,
    )
    ctx.stroke()
  }
  ctx.globalAlpha = 1

  ctx.save()
  ctx.translate(TEX_W / 2 - 84, TEX_H / 2 - 84)
  ctx.scale(7, 7)
  ctx.fillStyle = color
  ctx.fill(pip)
  ctx.restore()

  if (stamp) {
    ctx.save()
    ctx.translate(TEX_W / 2, TEX_H - 150)
    ctx.rotate(-0.14)
    ctx.font = '700 44px "Hanken Grotesk", sans-serif'
    ctx.textAlign = "center"
    const w = ctx.measureText(stamp).width + 56
    ctx.strokeStyle = GOLD
    ctx.lineWidth = 5
    roundedRectPath(ctx, -w / 2, -44, w, 72, 10)
    ctx.stroke()
    ctx.fillStyle = "#8a5b13"
    ctx.fillText(stamp, 0, 10)
    ctx.restore()
  }

  ctx.restore()
  return canvas
}

// Small floating label plane: chip (gold bg, navy text) or ghost (gold text).
export function drawLabel(
  text: string,
  style: "chip" | "ghost" = "ghost",
): { canvas: HTMLCanvasElement; aspect: number } {
  const measure = document.createElement("canvas").getContext("2d")!
  const font = '600 64px "Hanken Grotesk", "Helvetica Neue", sans-serif'
  measure.font = font
  const textW = measure.measureText(text).width
  const padX = 44
  const h = 120
  const w = Math.ceil(textW + padX * 2)
  const canvas = document.createElement("canvas")
  canvas.width = w * TEX_SCALE
  canvas.height = h * TEX_SCALE
  const ctx = canvas.getContext("2d")!
  ctx.scale(TEX_SCALE, TEX_SCALE)
  ctx.clearRect(0, 0, w, h)
  if (style === "chip") {
    ctx.fillStyle = GOLD
    ctx.beginPath()
    ctx.roundRect(0, 8, w, h - 16, 18)
    ctx.fill()
    ctx.fillStyle = NAVY
  } else {
    ctx.fillStyle = GOLD
  }
  ctx.font = font
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.letterSpacing = "6px"
  ctx.fillText(text, w / 2, h / 2 + 4)
  return { canvas, aspect: w / h }
}

// Rounded-rect slab geometry shared by 3D cards.
export function makeCardBodyGeometry(): THREE.ExtrudeGeometry {
  const r = 0.14
  const shape = new THREE.Shape()
  const w = CARD_W - 0.02
  const h = CARD_H - 0.02
  const x = -w / 2
  const y = -h / 2
  shape.moveTo(x + r, y)
  shape.lineTo(x + w - r, y)
  shape.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false)
  shape.lineTo(x + w, y + h - r)
  shape.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false)
  shape.lineTo(x + r, y + h)
  shape.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false)
  shape.lineTo(x, y + r)
  shape.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false)
  return new THREE.ExtrudeGeometry(shape, { depth: 0.02, bevelEnabled: false })
}
