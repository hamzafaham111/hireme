import { WhatsAppButton } from '@/components/WhatsAppButton'

export function WhatsAppInfoSection() {
  return (
    <section className="border-b border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:grid-cols-2 sm:px-6 lg:gap-16 lg:px-8">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Why WhatsApp?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            You already live in chat. Booking there means faster handoffs, media
            when you need to show a receipt or map pin, and a searchable history
            of every job. No new passwords, no app store detours—just the same
            channel you use with family and clients.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            What to send first
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex gap-2">
              <span className="font-semibold text-brand-600 dark:text-brand-400">
                1.
              </span>
              Short description of the task (pick up, buy, deliver, wait in
              line, etc.)
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-brand-600 dark:text-brand-400">
                2.
              </span>
              Addresses or store names, and any time windows.
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-brand-600 dark:text-brand-400">
                3.
              </span>
              Photos or links if they help us buy the exact item or find the
              desk.
            </li>
          </ul>
          <div className="mt-6">
            <WhatsAppButton>Start a conversation</WhatsAppButton>
          </div>
        </div>
      </div>
    </section>
  )
}
