'use client'

import { useCallback, useState, useSyncExternalStore } from 'react'
import { SectionIntro } from '@/components/sections/shared'
import type { ServiceDefinition } from './service-data'
import { SERVICES } from './service-data'

/** Two grid rows: 3 cols on md, 4 cols on lg (matches Tailwind `md:grid-cols-3 lg:grid-cols-4`). */
function subscribeDesktopTwoRowPreview(cb: () => void) {
  const mqMd = window.matchMedia('(min-width: 768px)')
  const mqLg = window.matchMedia('(min-width: 1024px)')
  const run = () => cb()
  mqMd.addEventListener('change', run)
  mqLg.addEventListener('change', run)
  return () => {
    mqMd.removeEventListener('change', run)
    mqLg.removeEventListener('change', run)
  }
}

function getDesktopTwoRowPreview(): 'off' | 'md' | 'lg' {
  if (typeof window === 'undefined') return 'lg'
  if (window.matchMedia('(min-width: 1024px)').matches) return 'lg'
  if (window.matchMedia('(min-width: 768px)').matches) return 'md'
  return 'off'
}

function getServerTwoRowPreview(): 'lg' {
  return 'lg'
}

type LayoutMode = 'carousel' | 'grid'

function ServiceCard({
  title,
  tagline,
  Icon,
  layout,
}: ServiceDefinition & { layout: LayoutMode }) {
  const carouselLi =
    layout === 'carousel'
      ? 'max-md:shrink-0 max-md:snap-start max-md:basis-[calc((100%-1rem)/2.2)]'
      : ''

  return (
    <li className={`min-w-0 ${carouselLi}`}>
      <div
        className="group flex h-full min-h-[7.75rem] flex-col items-start justify-between gap-2 rounded-2xl border border-slate-200/90 bg-white p-3 shadow-sm ring-1 ring-slate-900/[0.04] transition active:scale-[0.98] sm:min-h-[10.5rem] sm:gap-3 sm:rounded-3xl sm:p-5 dark:border-slate-700/80 dark:bg-slate-900/70 dark:ring-white/[0.06] dark:active:bg-slate-800/80"
        role="presentation"
      >
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/[0.12] text-brand-600 transition group-hover:bg-brand-500/[0.18] dark:bg-brand-400/15 dark:text-brand-300 dark:group-hover:bg-brand-400/25 sm:size-14 sm:rounded-2xl"
          aria-hidden
        >
          <Icon className="size-5 sm:size-7" />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="font-display text-[13px] font-semibold leading-snug text-slate-900 sm:text-base dark:text-white">
            {title}
          </p>
          <p className="mt-1 text-left text-[10px] leading-snug text-slate-600 line-clamp-3 sm:mt-1.5 sm:text-xs sm:leading-relaxed dark:text-slate-400 md:line-clamp-none">
            {tagline}
          </p>
        </div>
      </div>
    </li>
  )
}

const linkLike =
  'text-sm font-semibold text-brand-600 underline-offset-4 transition hover:text-brand-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:text-brand-400 dark:hover:text-brand-300'

/**
 * Mobile: default horizontal carousel; “See all” switches to the classic 2-column grid.
 * `md+`: responsive grid with two rows by default; “See more / See less” reveals the rest (CSS hide so SSR + mobile carousel stay in sync).
 */
export function ServicesPanel() {
  const [layout, setLayout] = useState<LayoutMode>('carousel')
  const [desktopExpanded, setDesktopExpanded] = useState(false)

  const twoRowPreview = useSyncExternalStore(
    subscribeDesktopTwoRowPreview,
    getDesktopTwoRowPreview,
    getServerTwoRowPreview,
  )

  const showGrid = useCallback(() => setLayout('grid'), [])
  const showCarousel = useCallback(() => setLayout('carousel'), [])

  const toggleDesktopExpanded = useCallback(() => {
    setDesktopExpanded((v) => !v)
  }, [])

  const desktopPreviewCapacity = twoRowPreview === 'lg' ? 8 : twoRowPreview === 'md' ? 6 : 0
  const canToggleDesktop =
    twoRowPreview !== 'off' && SERVICES.length > desktopPreviewCapacity

  /**
   * Tablet (md–lg): 3×2 → hide from 7th item. Desktop lg+: 4×2 → hide from 9th.
   * Below md, no hiding (carousel / 2-col grid shows the full list).
   */
  const desktopCollapsedRowClasses =
    !desktopExpanded && twoRowPreview !== 'off'
      ? 'md:max-lg:[&>li:nth-child(n+7)]:hidden lg:[&>li:nth-child(n+9)]:hidden'
      : ''

  const listCarousel =
    'mt-2 flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:mt-10 md:grid md:snap-none md:grid-cols-3 md:gap-4 md:overflow-visible md:pb-0 sm:mt-4 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden'

  const listGrid =
    'mt-2 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-3 md:gap-4 sm:mt-14 lg:grid-cols-4'

  return (
    <>
      <SectionIntro
        eyebrow="What we do"
        title="Services"
        description="Pick what fits your errand, then message us on WhatsApp—updates stay in one chat."
        hideEyebrowAndDescriptionBelowMd
        titleTrailing={
          <div className="md:hidden">
            {layout === 'carousel' ? (
              <button type="button" className={linkLike} onClick={showGrid}>
                See all
              </button>
            ) : (
              <button type="button" className={linkLike} onClick={showCarousel}>
                Carousel
              </button>
            )}
          </div>
        }
      />

      <ul
        className={`${layout === 'carousel' ? listCarousel : listGrid} ${desktopCollapsedRowClasses}`.trim()}
        aria-label={
          layout === 'carousel'
            ? 'Services — swipe sideways on mobile'
            : 'All services'
        }
      >
        {SERVICES.map((item) => (
          <ServiceCard key={item.title} {...item} layout={layout} />
        ))}
      </ul>

      {canToggleDesktop && (
        <div className="mt-4 hidden justify-start md:flex">
          <button
            type="button"
            className={linkLike}
            onClick={toggleDesktopExpanded}
            aria-expanded={desktopExpanded}
          >
            {desktopExpanded ? 'See less' : 'See more'}
          </button>
        </div>
      )}
    </>
  )
}
