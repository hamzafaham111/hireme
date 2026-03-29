import type { ChangeEvent } from 'react'
import type { SelectOption } from './Select'
import { Select } from './Select'

/** Alias for list pages that only need value + label pairs */
export type StatusFilterOption = SelectOption

const searchClass =
  'h-[34px] w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400'

const filterLabelClass =
  'mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400'

export interface ListFilterToolbarProps {
  /** Prefix for stable input/select ids (e.g. `jobs`, `workers`) */
  idPrefix: string
  searchPlaceholder: string
  searchValue: string
  onSearchChange: (value: string) => void
  statusValue: string
  onStatusChange: (value: string) => void
  statusOptions: StatusFilterOption[]
  /** Merged onto the root row (e.g. `min-w-0 flex-1` beside an Add button) */
  className?: string
}

/**
 * Compact search (left, fixed max width) + custom status {@link Select}.
 */
export function ListFilterToolbar({
  idPrefix,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  statusValue,
  onStatusChange,
  statusOptions,
  className = '',
}: ListFilterToolbarProps) {
  const searchId = `${idPrefix}-list-search`
  const statusId = `${idPrefix}-list-status`

  return (
    <div
      className={`flex min-w-0 flex-1 flex-row flex-wrap items-end gap-3 sm:gap-4 ${className}`}
    >
      <div className="w-full max-w-[200px] shrink-0 sm:max-w-[220px]">
        <label className={filterLabelClass} htmlFor={searchId}>
          Search
        </label>
        <input
          id={searchId}
          type="search"
          value={searchValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onSearchChange(e.target.value)
          }
          placeholder={searchPlaceholder}
          className={searchClass}
          autoComplete="off"
        />
      </div>
      <div className="w-full min-w-[10.5rem] max-w-[200px] shrink-0 sm:w-44 sm:max-w-none">
        <Select
          id={statusId}
          label="Status"
          labelClassName={filterLabelClass}
          value={statusValue}
          onChange={onStatusChange}
          options={statusOptions}
          placeholder="All statuses"
          size="sm"
        />
      </div>
    </div>
  )
}
