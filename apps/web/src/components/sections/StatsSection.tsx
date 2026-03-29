const stats = [
  { value: '50K+', label: 'Happy customers' },
  { value: '500K+', label: 'Tasks completed' },
  { value: '8+', label: 'Years experience' },
  { value: '4.9', label: 'Average rating' },
]

export function StatsSection() {
  return (
    <section className="border-b border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-900/30">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-3xl font-bold text-brand-600 dark:text-brand-400 sm:text-4xl">
              {s.value}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
