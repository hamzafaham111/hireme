import { NearYouPanel } from './NearYouPanel'

export function NearYouSection() {
  return (
    <section
      id="near-you"
      className="relative scroll-mt-[var(--site-sticky-header-offset)] overflow-hidden bg-white py-4 dark:bg-slate-950 sm:py-8"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <NearYouPanel />
      </div>
    </section>
  )
}
