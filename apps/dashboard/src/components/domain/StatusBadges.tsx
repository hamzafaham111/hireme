import type { Job, Worker } from '@hire-me/types'

export function WorkerStatusBadge({ status }: { status: Worker['status'] }) {
  const map = {
    active:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    'not-active':
      'bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200',
    'on-hold':
      'bg-violet-100 text-violet-900 dark:bg-violet-950/50 dark:text-violet-200',
    canceled: 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200',
  } as const
  const label =
    status === 'not-active'
      ? 'Not active'
      : status === 'on-hold'
        ? 'On hold'
        : status === 'canceled'
          ? 'Canceled'
          : 'Active'
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${map[status]}`}
    >
      {label}
    </span>
  )
}

export function JobStatusBadge({ status }: { status: Job['status'] }) {
  const styles = {
    pending:
      'bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200',
    'in-progress':
      'bg-indigo-100 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-200',
    completed:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    cancelled: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  } as const
  const label =
    status === 'in-progress'
      ? 'In progress'
      : status === 'completed'
        ? 'Completed'
        : status === 'cancelled'
          ? 'Cancelled'
          : 'Pending'
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {label}
    </span>
  )
}
