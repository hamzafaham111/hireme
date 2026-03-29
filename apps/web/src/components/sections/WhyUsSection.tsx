const reasons = [
  {
    title: 'Human support',
    description: 'Real people on WhatsApp—no bots gatekeeping your urgent run.',
  },
  {
    title: 'Fast by default',
    description: 'Same-day is normal; urgent jobs get priority routing.',
  },
  {
    title: 'No lock-in',
    description: 'Pay per task. No annual contracts or unused credits.',
  },
  {
    title: 'Zero app fatigue',
    description: 'If you have WhatsApp, you already have everything you need.',
  },
  {
    title: 'On your terms',
    description: 'Odd hours, custom briefs, and sensitive items—we adapt.',
  },
  {
    title: 'Proof, not promises',
    description: 'Photos, timestamps, and receipts when it matters.',
  },
]

export function WhyUsSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Why teams pick Hire Me
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-slate-600 dark:text-slate-400">
          We took the best of concierge-style services and stripped the friction:
          one channel, clear updates, and operators who treat your time as
          expensive.
        </p>
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/40"
            >
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
