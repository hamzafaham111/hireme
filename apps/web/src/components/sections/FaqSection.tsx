'use client'

import { useState } from 'react'

const faqs = [
  {
    q: 'What can I book through Hire Me?',
    a: 'Most everyday errands: deliveries, shopping, documents, gifts, vehicle-related runs, pet support, and corporate tasks. If it is legal and doable, ask on WhatsApp and we will confirm.',
  },
  {
    q: 'How do I book?',
    a: 'Message us on WhatsApp. No app install or long forms—just your brief, locations, and timing.',
  },
  {
    q: 'How fast can you complete a task?',
    a: 'Many jobs are same-day. Urgent work is prioritised when physically possible. We quote an honest window before we start.',
  },
  {
    q: 'Are sensitive items safe?',
    a: 'Yes. Cheques, contracts, and personal items get discreet handling, updates, and proof of handover when you need it.',
  },
  {
    q: 'Do I need a contract?',
    a: 'No long-term lock-in. You book per task with clear pricing upfront.',
  },
  {
    q: 'What if my request is unusual?',
    a: 'Ask anyway. If it is legal and ethical, we will propose a plan or connect you with the right partner.',
  },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Frequently asked questions
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-slate-600 dark:text-slate-400">
          Straight answers—the same tone you get when you message the team.
        </p>
        <ul className="mt-12 space-y-3">
          {faqs.map((item, i) => {
            const isOpen = open === i
            return (
              <li
                key={item.q}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/40"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:text-white dark:hover:bg-slate-800/50"
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  {item.q}
                  <span
                    className={`shrink-0 text-brand-600 transition dark:text-brand-400 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden
                  >
                    <svg
                      className="size-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="border-t border-slate-100 px-5 pb-4 pt-3 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-400">
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
