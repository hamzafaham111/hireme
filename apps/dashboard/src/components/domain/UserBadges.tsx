import type { DashboardUser } from '@hire-me/types'

export function UserRoleBadge({ role }: { role: DashboardUser['role'] }) {
  const styles = {
    admin: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-200',
    customer: 'bg-sky-100 text-sky-900 dark:bg-sky-950/60 dark:text-sky-200',
    worker: 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200',
  } as const
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[role]}`}
    >
      {role}
    </span>
  )
}

export function UserStatusBadge({ status }: { status: DashboardUser['status'] }) {
  const map = {
    active:
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    invited: 'bg-amber-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-200',
  } as const
  const label = status === 'active' ? 'Active' : 'Invited'
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${map[status]}`}
    >
      {label}
    </span>
  )
}
