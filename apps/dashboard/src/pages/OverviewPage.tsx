import { Link } from 'react-router-dom'

function StatCard({
  label,
  value,
  delta,
}: {
  label: string
  value: string
  delta: string
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
        {value}
      </p>
      <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        {delta}
      </p>
    </div>
  )
}

export function OverviewPage() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active workers"
          value="128"
          delta="Drivers, sitters, vets & more"
        />
        <StatCard
          label="Pending jobs"
          value="14"
          delta="Awaiting worker assignment"
        />
        <StatCard
          label="In progress"
          value="31"
          delta="Worker assigned, not completed"
        />
        <StatCard
          label="Completed (30d)"
          value="206"
          delta="Successfully closed jobs"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white shadow-lg lg:col-span-2">
          <h2 className="text-lg font-semibold">Hire Me — operations</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-indigo-100">
            Customers reach you via WhatsApp or the public website. Your team
            creates jobs here, contacts workers in the right area, agrees time
            and quotation with the customer, then assigns a worker and tracks the
            job through completion.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/jobs"
              className="inline-flex rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/25"
            >
              Open jobs
            </Link>
            <Link
              to="/workers"
              className="inline-flex rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/20"
            >
              Browse workers
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Pipeline snapshot
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex justify-between gap-2">
              <span>New requests (today)</span>
              <span className="font-medium text-slate-900 dark:text-white">
                12
              </span>
            </li>
            <li className="flex justify-between gap-2">
              <span>Awaiting quotation</span>
              <span className="font-medium text-slate-900 dark:text-white">
                5
              </span>
            </li>
            <li className="flex justify-between gap-2">
              <span>Cancelled this week</span>
              <span className="font-medium text-slate-900 dark:text-white">
                3
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
