import type { ServiceDefinition } from '@/components/sections/services/service-data'
import { SERVICES } from '@/components/sections/services/service-data'
import { SectionIntro } from '@/components/sections/SectionIntro'
import { GridBackdrop } from '@/components/ui/GridBackdrop'

function ServiceCard({ title, tagline, Icon }: ServiceDefinition) {
  return (
    <li className="min-w-0">
      <div
        className="group flex h-full min-h-[9.5rem] flex-col items-start justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm ring-1 ring-slate-900/[0.04] transition active:scale-[0.98] sm:min-h-[10.5rem] sm:rounded-3xl sm:p-5 dark:border-slate-700/80 dark:bg-slate-900/70 dark:ring-white/[0.06] dark:active:bg-slate-800/80"
        role="presentation"
      >
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-500/[0.12] text-brand-600 transition group-hover:bg-brand-500/[0.18] dark:bg-brand-400/15 dark:text-brand-300 dark:group-hover:bg-brand-400/25 sm:size-14 sm:rounded-2xl"
          aria-hidden
        >
          <Icon className="size-6 sm:size-7" />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="font-display text-sm font-semibold leading-snug text-slate-900 sm:text-base dark:text-white">
            {title}
          </p>
          <p className="mt-1.5 text-left text-[11px] leading-relaxed text-slate-600 sm:text-xs dark:text-slate-400">
            {tagline}
          </p>
        </div>
      </div>
    </li>
  )
}

export function ServicesSection() {
  return (
    <section
      id="services"
      className="relative scroll-mt-[var(--site-sticky-header-offset)] overflow-hidden bg-white py-4 sm:py-16"
    >
      <GridBackdrop />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="What we do"
          title="Services"
          description="Pick what fits your errand, then message us on WhatsApp—updates stay in one chat."
          hideEyebrowAndDescriptionBelowMd
        />

        <ul className="md:mt-10 mt-2 grid grid-cols-2 gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {SERVICES.map((item) => (
            <ServiceCard key={item.title} {...item} />
          ))}
        </ul>
      </div>
    </section>
  )
}
