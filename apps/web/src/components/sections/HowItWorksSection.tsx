import { WhatsAppButton } from '@/components/WhatsAppButton'

const steps = [
  {
    step: '01',
    title: 'Message us on WhatsApp',
    body: 'One thread. No downloads. Say what you need.',
  },
  {
    step: '02',
    title: 'We confirm the details',
    body: 'Pickup, drop-off, timing, and price. You approve; we assign a runner.',
  },
  {
    step: '03',
    title: 'We execute',
    body: 'Photos, live updates, and proactive pings if anything changes.',
  },
  {
    step: '04',
    title: 'You get time back',
    body: 'Task closed with proof of delivery. Book again the same way.',
  },
]

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-y border-slate-200 bg-slate-100/80 py-20 dark:border-slate-800 dark:bg-slate-900/50 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              How Hire Me works
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              The whole journey stays in WhatsApp: fast to start, easy to
              repeat, human when you need help.
            </p>
          </div>
          <WhatsAppButton className="self-start lg:self-auto">
            Open WhatsApp
          </WhatsAppButton>
        </div>
        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li
              key={s.step}
              className="relative rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-950"
            >
              <span className="font-display text-3xl font-bold text-brand-200 dark:text-brand-900">
                {s.step}
              </span>
              <h3 className="mt-2 font-semibold text-slate-900 dark:text-white">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
