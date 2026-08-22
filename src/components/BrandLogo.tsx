type BrandLogoProps = {
  className?: string
  markOnly?: boolean
}

// Original BCFC identity: a fish built from three forward planes and a
// split-tail chevron. It stays legible at favicon size and in one color.
export function FishMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 42"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M2 7.5 16.5 17v7L2 34.5l6.2-13.4L2 7.5Z"
        fill="currentColor"
      />
      <path
        d="M15.7 19.9C23.4 7.8 43 7.2 54 18.6c-9.2 2-17.8 2.8-25.8 2.5-4.4-.1-8.5-.5-12.5-1.2Z"
        fill="currentColor"
      />
      <path
        d="M15.7 23.1c4.7.8 9.3 1.2 13.8 1.2 7.4 0 15.6-.9 24.5-2.8-11.2 12.3-30.8 11.9-38.3 1.6Z"
        fill="currentColor"
        opacity=".68"
      />
      <path d="M23 20.7c6.2-4.5 13.8-5.4 21.4-3.2" stroke="var(--color-card)" strokeWidth="1.15" strokeLinecap="round" opacity=".34" />
      <circle cx="43.8" cy="16.4" r="1.65" fill="var(--color-berkeley-deep)" />
    </svg>
  )
}

// A deliberately lighter companion to the solid brand mark. This small
// line-art swimmer is used only as the page-progress indicator, so it reads
// as interface motion rather than a duplicated logo.
export function ProgressFishMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 58 26"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <path
        className="progress-fish-tail"
        d="M12 13C7.5 9.2 5 6 3.2 3.6c1.4 4.8 1.4 14 0 18.8C5 20 7.5 16.8 12 13Z"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M55 13C48.5 5.5 37.5 3.2 28.5 6.2 21.5 8.6 15.5 11.6 11.5 13c4 1.4 10 4.4 17 6.8 9 3 20 0.7 26.5-6.8Z"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M44.5 8.2c-1.7 3-1.7 6.6 0 9.6M21 13h19"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity=".5"
      />
      <circle cx="48.8" cy="11" r="1.2" fill="currentColor" />
    </svg>
  )
}

export default function BrandLogo({ className = "", markOnly = false }: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <FishMark className="h-9 w-12 shrink-0 text-gold drop-shadow-[0_5px_14px_rgba(231,184,83,0.16)] transition-transform duration-300 group-hover:translate-x-0.5" />
      {!markOnly && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[21px] font-bold tracking-[-0.045em]">BCFC</span>
          <span className="mt-1 font-mono text-[6.5px] font-semibold uppercase tracking-[0.19em] opacity-58">
            Canadian Fish Club
          </span>
        </span>
      )}
    </span>
  )
}
