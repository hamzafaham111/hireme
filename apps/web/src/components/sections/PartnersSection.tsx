import { SectionIntro } from '@/components/sections/SectionIntro'

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
    <section
      id="partners"
      className="scroll-mt-20 border-b border-slate-200 py-14 dark:border-slate-800 sm:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="Partners"
          title="Who we work with"
          description="Trusted specialists and networks so every job is covered by people who know their lane—from property to pets to corporate desks."
        />
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:mt-14 sm:grid-cols-3 lg:grid-cols-6">
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
