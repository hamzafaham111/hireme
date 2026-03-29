import { SectionIntro } from '@/components/sections/SectionIntro'

const reviews = [
  {
    quote:
      'They collected a cheque from my office and had it at the bank before my meeting ended. Updates on WhatsApp the whole way.',
    name: 'Layla M.',
    role: 'Operations manager',
    rating: 5,
  },
  {
    quote:
      'I stopped using three different apps. One message and my shopping list shows up the same evening—exact items, photos attached.',
    name: 'James T.',
    role: 'Product lead',
    rating: 5,
  },
  {
    quote:
      'We use them for client gifts and urgent documents. Reliable, discreet, and the team actually reads the brief.',
    name: 'Priya K.',
    role: 'Agency founder',
    rating: 5,
  },
]

function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5 text-amber-400" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: n }, (_, i) => (
        <svg
          key={i}
          className="size-4"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  )
}

export function TestimonialsSection() {
  return (
    <section
      id="reviews"
      className="scroll-mt-[var(--site-sticky-header-offset)] border-t border-slate-200 bg-gradient-to-b from-brand-50/50 to-transparent py-14 dark:border-slate-800 dark:from-brand-950/20 sm:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="Reviews"
          title="What customers say"
          description="Real feedback from people who wanted speed without the hassle of another app subscription."
        >
          <p className="mt-4 text-sm font-semibold text-brand-700 dark:text-brand-300">
            ★ 4.9 avg. · Google & WhatsApp
          </p>
        </SectionIntro>
        <ul className="mt-10 grid gap-6 sm:mt-14 md:grid-cols-3">
          {reviews.map((r) => (
            <li
              key={r.name}
              className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
            >
              <Stars n={r.rating} />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                “{r.quote}”
              </blockquote>
              <footer className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {r.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {r.role}
                </p>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
