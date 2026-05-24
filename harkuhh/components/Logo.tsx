export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 270 100"
      className={className}
      fill="none"
      aria-label="BestBikeForMe logo"
      role="img"
    >
      {/* Bike icon */}
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="32" cy="64" r="15" />
        <circle cx="76" cy="64" r="15" />
        <circle cx="48" cy="66" r="2.5" />
        <line x1="48" y1="66" x2="32" y2="64" />
        <line x1="48" y1="66" x2="44" y2="42" />
        <line x1="48" y1="66" x2="68" y2="44" />
        <line x1="44" y1="42" x2="68" y2="44" />
        <line x1="44" y1="42" x2="32" y2="64" />
        <line x1="68" y1="44" x2="76" y2="64" />
        <path d="M66 40 L68 44 L72 40" />
        <line x1="40" y1="41" x2="47" y2="41" />
      </g>

      {/* Brand text */}
      <g fill="currentColor">
        <text x="108" y="52" fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif" fontSize="18" fontWeight="700" letterSpacing="-0.5">best</text>
        <text x="148" y="52" fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif" fontSize="18" fontWeight="700" letterSpacing="-0.5">bike</text>
        <text x="189" y="52" fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif" fontSize="18" fontWeight="700" letterSpacing="-0.5">for</text>
        <text x="217" y="52" fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif" fontSize="18" fontWeight="700" letterSpacing="-0.5">me</text>
      </g>

      {/* Tagline */}
      <text x="108" y="70" fontFamily="'Inter', 'Helvetica Neue', Arial, sans-serif" fontSize="7" fontWeight="400" fill="currentColor" opacity="0.5" letterSpacing="3">FIND YOUR PERFECT RIDE</text>
    </svg>
  );
}
