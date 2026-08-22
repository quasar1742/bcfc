const BUBBLES = [
  [8, 18, 8], [17, 67, 4], [27, 35, 6], [38, 81, 10], [51, 22, 5],
  [63, 59, 7], [74, 14, 4], [83, 73, 9], [92, 41, 5],
] as const

export default function OceanDepth() {
  return (
    <div className="ocean-depth-atmos" aria-hidden="true">
      <div className="ocean-depth-rays" />
      <div className="ocean-depth-particles" />
      <div className="ocean-depth-bubbles">
        {BUBBLES.map(([left, top, size], i) => (
          <i
            key={`${left}-${top}`}
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              animationDelay: `${i * -1.7}s`,
              animationDuration: `${9 + (i % 4) * 2}s`,
            }}
          />
        ))}
      </div>
      <svg className="ocean-depth-school" viewBox="0 0 280 80">
        <g fill="currentColor">
          <path d="M8 21c15-13 35-13 50 0-15 13-35 13-50 0Zm0 0L0 11v20Z" />
          <path d="M104 51c12-10 29-10 41 0-12 10-29 10-41 0Zm0 0-7-8v16Z" />
          <path d="M208 25c18-14 41-14 58 0-17 14-40 14-58 0Zm0 0-10-11v22Z" />
        </g>
      </svg>
    </div>
  )
}
