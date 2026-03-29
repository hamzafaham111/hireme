import type { ReactNode } from 'react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { UserRoleBadge, UserStatusBadge } from '../../components/domain/UserBadges'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { useOperationsData } from '../../context/OperationsDataContext'

const actionBtn =
  'rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm transition-colors'

export function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const { getUser, deleteUser } = useOperationsData()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const user = userId ? getUser(userId) : undefined

  if (!user) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900/40">
        <p className="text-slate-600 dark:text-slate-300">User not found.</p>
        <Link
          to="/users"
          className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Back to users
        </Link>
      </div>
    )
  }

  const rows: { label: string; value: ReactNode }[] = [
    { label: 'Name', value: user.name },
    { label: 'Email', value: user.email },
    {
      label: 'Password',
      value: (
        <span className="font-mono tracking-widest text-slate-400 dark:text-slate-500">
          ••••••••
        </span>
      ),
    },
    {
      label: 'Role',
      value: <UserRoleBadge role={user.role} />,
    },
    {
      label: 'Status',
      value: <UserStatusBadge status={user.status} />,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {user.name}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {user.email}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/users"
            className={`${actionBtn} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800`}
          >
            Back to list
          </Link>
          <Link
            to={`/users/${user.id}/edit`}
            className={`${actionBtn} bg-indigo-600 font-semibold text-white hover:bg-indigo-500`}
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className={`${actionBtn} border border-rose-200 bg-white text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:bg-slate-900 dark:text-rose-300 dark:hover:bg-rose-950/40`}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
        <dl className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-1 gap-1 px-5 py-4 sm:grid-cols-[180px_1fr] sm:gap-8"
            >
              <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {row.label}
              </dt>
              <dd className="text-sm text-slate-900 dark:text-slate-100">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Remove user?"
        description={`${user.name} will be removed from dashboard users. This cannot be undone in the demo.`}
        variant="danger"
        cancelLabel="Cancel"
        confirmLabel="Delete"
        onConfirm={async () => {
          await deleteUser(user.id)
          navigate('/users', { replace: true })
        }}
      />
    </div>
  )
}
