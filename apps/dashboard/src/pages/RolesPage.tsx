import { useEffect, useMemo, useState } from 'react'
import { DataTable } from '../components/data/DataTable'
import { apiFetch } from '../lib/api'
import type { DataTableColumn } from '../types/dataTable'

/** Dashboard RBAC: internal team roles for Hire Me operations. */
export interface RoleRow {
  id: string
  key: string
  label: string
  description: string
}

export function RolesPage() {
  const [rows, setRows] = useState<RoleRow[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [rolesLoading, setRolesLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setRolesLoading(true)
      try {
        const data = await apiFetch<RoleRow[]>('/roles')
        if (!cancelled) {
          setRows(data)
          setLoadError(null)
        }
      } catch (e) {
        if (!cancelled) {
          setRows([])
          setLoadError(e instanceof Error ? e.message : 'Could not load roles.')
        }
      } finally {
        if (!cancelled) setRolesLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const columns = useMemo<DataTableColumn<RoleRow>[]>(
    () => [
      {
        key: 'key',
        header: 'Role',
        cell: (row) => (
          <code className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            {row.key}
          </code>
        ),
      },
      { key: 'label', header: 'Label' },
      { key: 'description', header: 'Description' },
    ],
    [],
  )

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Catalog served by <code className="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-slate-800">GET /api/v1/roles</code>
        ; extend the API when roles become database-driven.
      </p>
      {loadError ? (
        <p
          className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200"
          role="alert"
        >
          {loadError}
        </p>
      ) : null}
      <DataTable<RoleRow>
        caption="System roles"
        columns={columns}
        rows={rows}
        rowKey={(row) => row.id}
        emptyMessage={
          rolesLoading ? 'Loading roles…' : loadError ? 'Could not load roles.' : 'No rows to display.'
        }
      />
    </div>
  )
}
