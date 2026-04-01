import { GridBackdrop } from '@/components/ui/GridBackdrop'
import { ServicesPanel } from '@/components/sections/ServicesPanel'

export function ServicesSection() {
  return (
    <section
      id="services"
      className="relative scroll-mt-[var(--site-sticky-header-offset)] overflow-hidden bg-white py-4 dark:bg-slate-950 sm:py-8"
    >
      <GridBackdrop />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ServicesPanel />
      </div>
    </section>
  )
}
