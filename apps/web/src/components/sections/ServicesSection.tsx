const services = [
  {
    title: 'Urgent delivery',
    description:
      'Documents, parcels, or last-minute drops. Picked up and delivered fast with live updates.',
    highlights: ['Same-day speed', 'City-wide coverage', 'Careful handling'],
  },
  {
    title: 'Purchase and delivery',
    description:
      'We buy from the store and bring it to your door. Returns and exchanges supported.',
    highlights: ['SKU checks', 'Receipts shared', 'Flexible timing'],
  },
  {
    title: 'Cheque and document runs',
    description:
      'Bank visits, signatures, and handovers without you leaving work or home.',
    highlights: ['Discreet handling', 'Scheduled pickups', 'Proof of drop-off'],
  },
  {
    title: 'Gifting and luxury shopping',
    description:
      'Curated gifts and boutique purchases, wrapped and delivered on schedule.',
    highlights: ['Budget-aware picks', 'Corporate and personal', 'Photo proof'],
  },
  {
    title: 'Vehicle and admin errands',
    description:
      'Testing centres, renewals, and queues. We wait so you do not have to.',
    highlights: ['Pickup and return', 'Status updates', 'Odd jobs welcome'],
  },
  {
    title: 'Pet and family help',
    description:
      'Vet trips and trusted on-the-ground support for busy households.',
    highlights: ['Trusted runners', 'Photo check-ins', 'Short-notice slots'],
  },
  {
    title: 'Corporate tasks',
    description:
      'Documents, gifts, and last-mile jobs too small for traditional courier.',
    highlights: ['Repeat bookings', 'One WhatsApp thread', 'No long contracts'],
  },
  {
    title: 'Custom requests',
    description:
      'If it is legal and doable, we figure it out. One-offs are welcome.',
    highlights: ['Clear quotes', 'Honest timelines', 'Responsive team'],
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Services built for real life
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Clear scope, fast execution, and updates in WhatsApp so you are
            never left guessing.
          </p>
        </div>
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li
              key={s.title}
              className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm transition hover:border-brand-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-brand-800"
            >
              <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                {s.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {s.description}
              </p>
              <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 dark:border-slate-800">
                {s.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-center gap-2 text-xs font-medium text-brand-700 dark:text-brand-300"
                  >
                    <span
                      className="size-1.5 shrink-0 rounded-full bg-brand-500"
                      aria-hidden
                    />
                    {h}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
