import type { DashboardUser } from '@hire-me/types'

export function UserRoleBadge({ role }: { role: DashboardUser['role'] }) {
  const styles = {
    superadmin:
      'bg-violet-100 text-violet-900 dark:bg-violet-950/60 dark:text-violet-200',
    admin: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-200',
    agent: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
    content_editor:
      'bg-teal-100 text-teal-900 dark:bg-teal-950/60 dark:text-teal-200',
  } as const
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[role]}`}
    >
      {role === 'content_editor' ? 'content editor' : role}
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
