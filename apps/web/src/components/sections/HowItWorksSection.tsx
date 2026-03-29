import type { FC } from 'react'
import type { SiteIconProps } from '@/components/icons/site-icons'
import {
  IconConfirmScope,
  IconDescribeErrand,
  IconProofDone,
  IconRunErrand,
  IconStepArrow,
} from '@/components/icons/site-icons'
import { SectionIntro } from '@/components/sections/SectionIntro'
import { GridBackdrop } from '@/components/ui/GridBackdrop'
import { siteName } from '@/lib/site'
import { WhatsAppButton } from '@/components/WhatsAppButton'

/**
 * Horizontal bridge between desktop step cards: gradient lines run slightly into each card
 * so the flow reads as one path, not a tiny glyph floating in the flex gap.
 * Middle segment matches parent `gap-4` (1rem); side segments bleed into adjacent cards.
 */
function StepConnector() {
  return (
    <div
      className="pointer-events-none absolute left-[calc(100%-1.125rem)] top-1/2 z-10 flex h-10 w-[calc(1.125rem+1rem+1.125rem)] -translate-y-1/2 items-center"
      aria-hidden
    >
      <div className="h-0.5 min-w-0 flex-1 rounded-full bg-gradient-to-r from-transparent via-brand-300/80 to-brand-500/90 dark:from-transparent dark:via-brand-500/50 dark:to-brand-400/80" />
      <div className="mx-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-brand-200/80 bg-white shadow-sm ring-2 ring-white dark:border-brand-500/40 dark:bg-slate-900 dark:ring-slate-950">
        <IconStepArrow className="size-3.5 text-brand-600 dark:text-brand-400" />
      </div>
      <div className="h-0.5 min-w-0 flex-1 rounded-full bg-gradient-to-r from-violet-500/90 via-violet-300/75 to-transparent dark:from-brand-400/80 dark:via-brand-500/45 dark:to-transparent" />
    </div>
  )
}

const steps: {
  step: string
  title: string
  body: string
  Icon: FC<SiteIconProps>
}[] = [
  {
    step: '1',
    title: 'Message your errand',
    body: `Delivery, shopping, pharmacy, documents, queues, or something custom—describe it once in WhatsApp. No app or forms.`,
    Icon: IconDescribeErrand,
  },
  {
    step: '2',
    title: 'We confirm scope & price',
    body: `Pickup and drop-off, timing, and a clear quote. You approve; we assign someone to run it.`,
    Icon: IconConfirmScope,
  },
  {
    step: '3',
    title: 'We execute & update you',
    body: `Photos, ETAs, and quick pings if anything changes—all in the same chat, whatever the job.`,
    Icon: IconRunErrand,
  },
  {
    step: '4',
    title: 'Closed with proof',
    body: `Task signed off in-thread. Book your next parcel, store run, or errand the same way.`,
    Icon: IconProofDone,
  },
]

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-[var(--site-sticky-header-offset)] overflow-hidden border-b border-slate-200 bg-white py-14 sm:py-20 dark:border-slate-800 dark:bg-slate-950"
    >
      <GridBackdrop className="opacity-40 dark:opacity-25" />
      <div className="pointer-events-none absolute -right-24 top-0 size-72 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/15" />
      <div className="pointer-events-none absolute -left-24 bottom-0 size-72 rounded-full bg-brand-500/10 blur-3xl dark:bg-brand-500/15" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="From message to done"
          title={`How ${siteName} works`}
          description="The same simple flow for every service above—errands, deliveries, and on-the-ground help stay in one WhatsApp thread start to finish."
        >
          <div className="mt-6">
            <WhatsAppButton className="shadow-md">Book on WhatsApp</WhatsAppButton>
          </div>
        </SectionIntro>

        {/* Mobile / tablet: stacked timeline */}
        <ol
          className="relative mt-12 space-y-0 sm:mt-16 lg:hidden"
          aria-label="Steps to book with Hire Me"
        >
          <div
            className="absolute left-[1.35rem] top-8 bottom-8 w-px bg-gradient-to-b from-brand-400/60 via-violet-400/50 to-brand-400/60 dark:from-brand-500/40 dark:via-violet-500/35 dark:to-brand-500/40"
            aria-hidden
          />
          {steps.map(({ step, title, body, Icon }) => (
            <li key={step} className="relative flex gap-5 pb-10 last:pb-0">
              <div className="relative z-10 flex shrink-0 flex-col items-center">
                <div className="flex size-11 items-center justify-center rounded-2xl border border-brand-200/80 bg-white shadow-sm ring-4 ring-white dark:border-brand-500/30 dark:bg-slate-900 dark:ring-slate-950">
                  <Icon className="size-5 text-brand-600 dark:text-brand-400" />
                </div>
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <span className="text-xs font-bold tabular-nums text-brand-600 dark:text-brand-400">
                  Step {step}
                </span>
                <h3 className="mt-1 font-display text-lg font-semibold text-slate-900 dark:text-white">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Desktop: horizontal journey with arrows */}
        <ol
          className="relative mt-14 hidden gap-4 lg:mt-16 lg:flex lg:items-stretch"
          aria-label="Steps to book with Hire Me"
        >
          {steps.map(({ step, title, body, Icon }, i) => (
            <li key={step} className="relative flex min-w-0 flex-1 flex-col">
              <div className="flex h-full flex-col rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white to-slate-50/80 p-6 shadow-sm ring-1 ring-slate-900/[0.04] transition hover:border-brand-200/80 hover:shadow-md dark:border-slate-700/80 dark:from-slate-900/80 dark:to-slate-950/80 dark:ring-white/[0.06] dark:hover:border-brand-500/30">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className="flex size-12 items-center justify-center rounded-xl bg-brand-500/[0.12] text-brand-600 dark:bg-brand-400/15 dark:text-brand-300"
                    aria-hidden
                  >
                    <Icon className="size-6" />
                  </div>
                  <span className="font-display text-2xl font-bold tabular-nums text-brand-200 dark:text-brand-900/80">
                    {step}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-base font-semibold leading-snug text-slate-900 dark:text-white">
                  {title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {body}
                </p>
              </div>
              {i < steps.length - 1 ? <StepConnector /> : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
