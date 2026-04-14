'use client'

import { useCallback, useState, useSyncExternalStore } from 'react'
import type { SiteService } from '@hire-me/types'
import { SectionIntro } from '@/components/sections/shared'
import { SiteServiceIconVisual } from './site-service-icon-registry'

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
  service,
  layout,
}: {
  service: SiteService
  layout: LayoutMode
}) {
  const hasUploadedImage = Boolean(service.iconImageUrl?.trim())
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
          className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-500/[0.12] text-brand-600 transition group-hover:bg-brand-500/[0.18] dark:bg-brand-400/15 dark:text-brand-300 dark:group-hover:bg-brand-400/25 sm:size-16 sm:rounded-2xl"
          aria-hidden
        >
          <SiteServiceIconVisual
            service={service}
            className={
              hasUploadedImage
                ? 'size-full object-cover'
                : 'size-[78%] object-contain'
            }
          />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="font-display text-[13px] font-semibold leading-snug text-slate-900 sm:text-base dark:text-white">
            {service.title}
          </p>
          <p className="mt-1 text-left text-[10px] leading-snug text-slate-600 line-clamp-3 sm:mt-1.5 sm:text-xs sm:leading-relaxed dark:text-slate-400 md:line-clamp-none">
            {service.shortDescription}
          </p>
        </div>
      </div>
    </li>
  )
}

const linkLike =
  'text-sm font-semibold text-brand-600 underline-offset-4 transition hover:text-brand-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:text-brand-400 dark:hover:text-brand-300'

export function ServicesPanel({ services }: { services: SiteService[] }) {
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
    twoRowPreview !== 'off' && services.length > desktopPreviewCapacity

  const desktopCollapsedRowClasses =
    !desktopExpanded && twoRowPreview !== 'off'
      ? 'md:max-lg:[&>li:nth-child(n+7)]:hidden lg:[&>li:nth-child(n+9)]:hidden'
      : ''

  const listCarousel =
    'mt-2 flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:mt-10 md:grid md:snap-none md:grid-cols-3 md:gap-4 md:overflow-visible md:pb-0 sm:mt-4 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden'

  const listGrid =
    'mt-2 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-3 md:gap-4 sm:mt-14 lg:grid-cols-4'

  if (services.length === 0) {
    return (
      <>
        <SectionIntro
          eyebrow="What we do"
          title="Services"
          description="Pick what fits your errand, then message us on WhatsApp—updates stay in one chat."
          hideEyebrowAndDescriptionBelowMd
        />
        <p className="mt-6 text-sm text-slate-600 dark:text-slate-400">
          No services to show yet. Add them from the dashboard (Site services).
        </p>
      </>
    )
  }

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
        {services.map((item) => (
          <ServiceCard key={item.id} service={item} layout={layout} />
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
