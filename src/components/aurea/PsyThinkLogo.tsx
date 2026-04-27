export function PsyThinkLogo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="psy-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="60%" stopColor="hsl(var(--accent))" />
          <stop offset="100%" stopColor="hsl(var(--highlight))" />
        </linearGradient>
        <radialGradient id="psy-core" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="hsl(var(--lavender))" stopOpacity="0.9" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="17" fill="url(#psy-grad)" opacity="0.18" />
      <circle cx="20" cy="20" r="14" fill="url(#psy-core)" />
      {/* brain-like curls */}
      <path
        d="M11 22c0-5 3-9 9-9 5 0 9 3 9 8 0 3-2 5-4 6-1 .5-1 1.5 0 2 2 1 3 2 3 4"
        fill="none"
        stroke="hsl(var(--primary-foreground))"
        strokeOpacity="0.85"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M14 17c1-2 3-3 5-3M16 26c1 1.5 3 2.5 5 2.5"
        fill="none"
        stroke="hsl(var(--primary-foreground))"
        strokeOpacity="0.6"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="28" cy="13" r="1.4" fill="hsl(var(--gold))" />
    </svg>
  );
}
