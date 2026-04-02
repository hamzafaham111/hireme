'use client'

import Image from 'next/image'
import { useCallback, useState } from 'react'
import { SectionIntro } from '@/components/sections/shared'
import type { PopularNearYouItem } from './near-you-data'
import { POPULAR_NEAR_YOU_ITEMS } from './near-you-data'

type LayoutMode = 'carousel' | 'grid'

function NearYouCard({ id, title, tagline, imageSrc, imageAlt, layout }: PopularNearYouItem & { layout: LayoutMode }) {
  const carouselLi =
    layout === 'carousel'
      ? 'max-md:shrink-0 max-md:snap-start max-md:basis-[calc((100%-1rem)/2.2)]'
      : ''

  const headingId = `near-you-title-${id}`

  return (
    <li className={`min-w-0 ${carouselLi}`}>
      <article
        className="group flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm ring-1 ring-slate-900/[0.04] transition active:scale-[0.98] sm:rounded-3xl dark:border-slate-700/80 dark:bg-slate-900/70 dark:ring-white/[0.06] dark:active:bg-slate-800/80"
        aria-labelledby={headingId}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 45vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-0 p-3 sm:p-3.5 md:gap-1 md:py-4">
          <h3
            id={headingId}
            className="font-display text-[13px] font-semibold leading-snug text-slate-900 sm:text-base dark:text-white"
          >
            {title}
          </h3>
          <p className="hidden text-left text-xs leading-relaxed text-slate-600 md:block dark:text-slate-400">
            {tagline}
          </p>
        </div>
      </article>
    </li>
  )
}

const linkLike =
  'text-sm font-semibold text-brand-600 underline-offset-4 transition hover:text-brand-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 dark:text-brand-400 dark:hover:text-brand-300'

/**
 * Mobile: horizontal image carousel; “See all” toggles a 2-column grid.
 * `md+`: fixed responsive grid (toggle hidden).
 */
export function NearYouPanel() {
  const [layout, setLayout] = useState<LayoutMode>('carousel')

  const showGrid = useCallback(() => setLayout('grid'), [])
  const showCarousel = useCallback(() => setLayout('carousel'), [])

  const listCarousel =
    'mt-2 flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:mt-10 md:grid md:snap-none md:grid-cols-3 md:gap-4 md:overflow-visible md:pb-0 sm:mt-4 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden'

  const listGrid =
    'mt-2 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-3 md:gap-4 sm:mt-14 lg:grid-cols-4'

  return (
    <>
      <SectionIntro
        eyebrow="In your area"
        title="Popular near you"
        description="A snapshot of what people book most where you are—every item is part of our full services list. Message us on WhatsApp for the same runs where you live."
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
        className={layout === 'carousel' ? listCarousel : listGrid}
        aria-label={
          layout === 'carousel'
            ? 'Popular services near you — swipe sideways on mobile'
            : 'All popular services near you'
        }
      >
        {POPULAR_NEAR_YOU_ITEMS.map((item) => (
          <NearYouCard key={item.id} {...item} layout={layout} />
        ))}
      </ul>
    </>
  )
}
