import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DataTable } from '../../components/data/DataTable'
import { UserRoleBadge, UserStatusBadge } from '../../components/domain/UserBadges'
import { AddActionLink } from '../../components/ui/AddActionLink'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { useOperationsData } from '../../context/OperationsDataContext'
import type { DataTableColumn } from '../../types/dataTable'
import type { DashboardUser } from '@hire-me/types'

function PasswordPlaceholder() {
  return (
    <span
      className="select-none font-mono text-slate-400 tracking-widest dark:text-slate-500"
      aria-label="Password hidden"
    >
      ••••••••
    </span>
  )
}

export function UsersListPage() {
  const { users, deleteUser } = useOperationsData()
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    name: string
  } | null>(null)

  const columns = useMemo<DataTableColumn<DashboardUser>[]>(
    () => [
      { key: 'name', header: 'Name' },
      { key: 'email', header: 'Email' },
      {
        key: 'password',
        header: 'Password',
        cell: () => <PasswordPlaceholder />,
        className: 'text-slate-500',
      },
      {
        key: 'role',
        header: 'Role',
        cell: (row) => <UserRoleBadge role={row.role} />,
      },
      {
        key: 'status',
        header: 'Status',
        cell: (row) => <UserStatusBadge status={row.status} />,
      },
      {
        key: 'id',
        header: 'Actions',
        headerClassName:
          'min-w-[180px] whitespace-nowrap text-right align-middle',
        className: 'whitespace-nowrap text-right align-middle',
        cell: (row) => (
          <div className="flex flex-row flex-nowrap items-center justify-end gap-2">
            <Link
              to={`/users/${row.id}`}
              className="inline-flex shrink-0 rounded-lg px-2 py-1 text-xs font-medium whitespace-nowrap text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
            >
              View
            </Link>
            <Link
              to={`/users/${row.id}/edit`}
              className="inline-flex shrink-0 rounded-lg px-2 py-1 text-xs font-medium whitespace-nowrap text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Edit
            </Link>
            <button
              type="button"
              className="inline-flex shrink-0 rounded-lg px-2 py-1 text-xs font-medium whitespace-nowrap text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
              onClick={() => setDeleteTarget({ id: row.id, name: row.name })}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [setDeleteTarget],
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Internal team accounts (JWT auth later). Passwords stay hidden in the
          grid; add or edit users to set credentials in this demo store.
        </p>
        <AddActionLink to="/users/new">Add user</AddActionLink>
      </div>
      <DataTable<DashboardUser>
        caption="Dashboard users"
        columns={columns}
        rows={users}
        rowKey={(row) => row.id}
        tableClassName="min-w-[960px]"
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Remove user?"
        description={
          deleteTarget ? (
            <>
              <strong className="text-slate-800 dark:text-slate-200">
                {deleteTarget.name}
              </strong>{' '}
              will be removed from dashboard users. This cannot be undone in the
              demo.
            </>
          ) : null
        }
        variant="danger"
        cancelLabel="Cancel"
        confirmLabel="Delete"
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteUser(deleteTarget.id)
            setDeleteTarget(null)
          }
        }}
      />
    </div>
  )
}
