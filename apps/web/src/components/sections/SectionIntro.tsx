import type { ReactNode } from 'react'

export type SectionIntroProps = {
  eyebrow: string
  title: ReactNode
  description: string
  /** e.g. CTA row below the description */
  children?: ReactNode
  className?: string
  /** Hide eyebrow + description below `md` (title only on small screens). */
  hideEyebrowAndDescriptionBelowMd?: boolean
}

/**
 * Shared section header: left-aligned eyebrow, title, and lead copy—matches Services &
 * How it works so the marketing page reads as one system.
 */
export function SectionIntro({
  eyebrow,
  title,
  description,
  children,
  className = '',
  hideEyebrowAndDescriptionBelowMd = false,
}: SectionIntroProps) {
  const compact = hideEyebrowAndDescriptionBelowMd

  return (
    <div className={`max-w-2xl text-left ${className}`.trim()}>
      <p
        className={`rounded-full border border-brand-300/90 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-900 dark:border-brand-400/60 dark:bg-brand-900 dark:text-white ${
          compact ? 'hidden md:inline-flex' : 'inline-flex'
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`font-display text-xl md:font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white ${
          compact ? 'mt-0 md:mt-4' : 'mt-4'
        }`}
      >
        {title}
      </h2>
      <p
        className={`mt-4 text-lg text-slate-600 dark:text-slate-300 ${
          compact ? 'hidden md:block' : ''
        }`}
      >
        {description}
      </p>
      {children}
    </div>
  )
}
