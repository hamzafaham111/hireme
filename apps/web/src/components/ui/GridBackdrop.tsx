/**
 * Decorative grid used behind marketing sections — always non-interactive.
 * Pass `className` to tune opacity (defaults match the slate-50 sections).
 */
export function GridBackdrop({
  className = 'opacity-50 dark:opacity-30',
}: {
  className?: string
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 bg-[length:40px_40px] bg-grid-slate ${className}`.trim()}
      aria-hidden
    />
  )
}
