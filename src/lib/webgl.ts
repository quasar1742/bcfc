// Three-free WebGL probe (safe to import from the main bundle).
export function supportsWebgl(): boolean {
  try {
    const canvas = document.createElement("canvas")
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"))
  } catch {
    return false
  }
}
