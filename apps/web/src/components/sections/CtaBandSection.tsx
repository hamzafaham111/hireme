import { WhatsAppButton } from '@/components/WhatsAppButton'

export function CtaBandSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-violet-800 px-8 py-14 text-center shadow-xl sm:px-12">
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 50%, white 0%, transparent 45%), radial-gradient(circle at 80% 80%, white 0%, transparent 40%)',
            }}
            aria-hidden
          />
          <div className="relative">
            <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Ready when you are
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-brand-100">
              Quick booking on WhatsApp. No extra apps, no noise—just tell us
              what you need and we handle the rest.
            </p>
            <div className="mt-8 flex justify-center">
              <WhatsAppButton className="!bg-white !text-slate-900 !shadow-lg hover:!bg-brand-50">
                Message us now
              </WhatsAppButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
