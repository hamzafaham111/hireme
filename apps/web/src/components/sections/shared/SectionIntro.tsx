import type { ReactNode } from 'react'
import { sectionHeadingClass } from '@/lib/typography'

export type SectionIntroProps = {
  eyebrow: string
  title: ReactNode
  description: string
  /** e.g. CTA row below the description */
  children?: ReactNode
  className?: string
  /** Hide eyebrow + description below `md` (title only on small screens). */
  hideEyebrowAndDescriptionBelowMd?: boolean
  /** Inline with the title row, end-aligned (e.g. “See all” on mobile). */
  titleTrailing?: ReactNode
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
  titleTrailing,
}: SectionIntroProps) {
  const compact = hideEyebrowAndDescriptionBelowMd

  const titleRowMargin = compact ? 'mt-0 md:mt-4' : 'mt-4'
  const titleClass = sectionHeadingClass

  return (
    <div className={`max-w-2xl text-left ${className}`.trim()}>
      <p
        className={`rounded-full border border-brand-300/90 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-900 dark:border-brand-400/60 dark:bg-brand-900 dark:text-white ${
          compact ? 'hidden md:inline-flex' : 'inline-flex'
        }`}
      >
        {eyebrow}
      </p>
      {titleTrailing != null ? (
        <div
          className={`flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 ${titleRowMargin}`}
        >
          <h2 className={`${titleClass} min-w-0 flex-1`}>{title}</h2>
          <div className="shrink-0">{titleTrailing}</div>
        </div>
      ) : (
        <h2 className={`${titleClass} ${titleRowMargin}`}>{title}</h2>
      )}
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
