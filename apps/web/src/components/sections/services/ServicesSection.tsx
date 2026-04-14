import { GridBackdrop } from '@/components/ui/grid-backdrop'
import { fetchPublicSiteServices } from '@/lib/site-services-public'
import { ServicesPanel } from './ServicesPanel'

export async function ServicesSection() {
  const services = await fetchPublicSiteServices()

  return (
    <section
      id="services"
      className="relative scroll-mt-[var(--site-sticky-header-offset)] overflow-hidden bg-white py-4 dark:bg-slate-950 sm:py-8"
    >
      <GridBackdrop />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ServicesPanel services={services} />
      </div>
    </section>
  )
}
