import { useEffect, useState, type KeyboardEvent } from 'react'
import type { Worker } from '@hire-me/types'
import { formInputClass } from '../../lib/formStyles'
import { useSearchableCombobox } from '../ui/useSearchableCombobox'

function filterWorkers(workers: Worker[], query: string): Worker[] {
  const q = query.trim().toLowerCase()
  if (!q) return workers
  return workers.filter(
    (w) =>
      w.name.toLowerCase().includes(q) ||
      w.workerId.toLowerCase().includes(q),
  )
}

export interface WorkerAssignComboboxProps {
  /** Only `active` workers should be passed in (filter at call site). */
  activeWorkers: Worker[]
  /** Stored job field: worker display name or em dash when unassigned. */
  value: string
  onChange: (assignedWorkerNameOrDash: string) => void
  label: string
  labelClassName: string
  /** Optional hint under the field */
  hint?: string
}

/**
 * Searchable assignment control: type name or worker ID to filter, pick from list or clear.
 */
export function WorkerAssignCombobox({
  activeWorkers,
  value,
  onChange,
  label,
  labelClassName,
  hint = 'Active workers only. Type to filter by name or Worker ID.',
}: WorkerAssignComboboxProps) {
  const [inputValue, setInputValue] = useState(() =>
    value === '—' ? '' : value,
  )
  const { listId, containerRef, open, setOpen, highlight, setHighlight, close } =
    useSearchableCombobox(inputValue)

  const filtered = filterWorkers(activeWorkers, inputValue)
  type ListEntry =
    | { kind: 'unassigned' }
    | { kind: 'worker'; worker: Worker }
  const listEntries: ListEntry[] = [
    { kind: 'unassigned' },
    ...filtered.map((w) => ({ kind: 'worker' as const, worker: w })),
  ]

  useEffect(() => {
    if (!open) setInputValue(value === '—' ? '' : value)
  }, [value, open])

  const pickNone = () => {
    onChange('—')
    setInputValue('')
    close()
  }

  const pickWorker = (w: Worker) => {
    onChange(w.name)
    setInputValue(w.name)
    close()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setOpen(true)
        e.preventDefault()
      }
      return
    }

    if (e.key === 'Escape') {
      close()
      e.preventDefault()
      return
    }

    if (e.key === 'ArrowDown') {
      setHighlight((h) => Math.min(h + 1, listEntries.length - 1))
      e.preventDefault()
      return
    }

    if (e.key === 'ArrowUp') {
      setHighlight((h) => Math.max(h - 1, 0))
      e.preventDefault()
      return
    }

    if (e.key === 'Enter') {
      const item = listEntries[highlight]
      if (!item) return
      if (item.kind === 'unassigned') pickNone()
      else pickWorker(item.worker)
      e.preventDefault()
    }
  }

  return (
    <div ref={containerRef} className="relative sm:col-span-2">
      <label className={labelClassName} htmlFor={`${listId}-input`}>
        {label}
      </label>
      <input
        id={`${listId}-input`}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        className={formInputClass}
        placeholder="Search name or Worker ID…"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />
      {hint ? (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      ) : null}

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
        >
          <li role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={value === '—'}
              onMouseDown={(e) => e.preventDefault()}
              className={`flex w-full px-3 py-2.5 text-left text-sm ${
                highlight === 0
                  ? 'bg-indigo-50 text-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-100'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
              onMouseEnter={() => setHighlight(0)}
              onClick={() => pickNone()}
            >
              <span className="font-medium text-slate-500 dark:text-slate-400">
                Unassigned
              </span>
            </button>
          </li>
          {filtered.length === 0 ? (
            <li className="px-3 py-3 text-sm text-slate-500 dark:text-slate-400">
              No active workers match “{inputValue.trim() || '…'}”.
            </li>
          ) : (
            filtered.map((w, i) => {
              const idx = i + 1
              const active = highlight === idx
              return (
                <li key={w.id} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === w.name}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`flex w-full flex-col gap-0.5 px-3 py-2.5 text-left text-sm ${
                      active
                        ? 'bg-indigo-50 text-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-100'
                        : 'text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                    onMouseEnter={() => setHighlight(idx)}
                    onClick={() => pickWorker(w)}
                  >
                    <span className="font-medium">{w.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {w.workerId}
                      {w.location ? ` · ${w.location}` : ''}
                      {w.service ? ` · ${w.service}` : ''}
                    </span>
                  </button>
                </li>
              )
            })
          )}
        </ul>
      )}
    </div>
  )
}
