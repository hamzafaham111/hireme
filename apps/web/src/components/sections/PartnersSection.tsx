/** Placeholder partners—swap for real logos when you have brand assets. */
const partners = [
  { name: 'Apex Skyline', role: 'Property & rentals' },
  { name: 'SafeDrive UAE', role: 'Licensed drivers' },
  { name: 'Urban Logistics', role: 'Last-mile network' },
  { name: 'PetCare Plus', role: 'Vet & pet transport' },
  { name: 'Corporate Desk', role: 'B2B errands' },
  { name: 'Retail Collective', role: 'Shopping partners' },
]

export function PartnersSection() {
  return (
    <section id="partners" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Who we work with
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Trusted specialists and networks so every job is covered by people
            who know their lane—from property to pets to corporate desks.
          </p>
        </div>
        <ul className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((p) => (
            <li
              key={p.name}
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center dark:border-slate-600 dark:bg-slate-900/30"
            >
              <span className="font-display text-sm font-bold text-slate-800 dark:text-slate-100">
                {p.name}
              </span>
              <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {p.role}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
