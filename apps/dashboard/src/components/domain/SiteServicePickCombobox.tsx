import { useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import type { SiteService } from '@hire-me/types'
import { SiteServiceIconVisual } from '@hire-me/site-icons/site-service-visual'
import { formInputClass } from '../../lib/formStyles'
import { useSearchableCombobox } from '../ui/useSearchableCombobox'

function filterServices(services: SiteService[], query: string): SiteService[] {
  const q = query.trim().toLowerCase()
  if (!q) return services
  return services.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.serviceKey.toLowerCase().includes(q) ||
      s.slug.toLowerCase().includes(q),
  )
}

export interface SiteServicePickComboboxProps {
  /** From `GET /site-services/admin` (includes inactive). */
  services: SiteService[]
  /** Selected catalog row ids (`Worker.siteServiceIds`). */
  values: string[]
  onChange: (siteServiceIds: string[]) => void
  label: string
  labelClassName: string
  hint?: string
  disabled?: boolean
}

/**
 * Searchable picker for linking a worker to multiple catalog site services.
 * Persists `siteServiceIds`; API derives denormalized `service` title.
 */
export function SiteServicePickCombobox({
  services,
  values,
  onChange,
  label,
  labelClassName,
  hint = 'Search by title, key (SS-01), or slug. Pick one or more rows to link this worker to the catalog.',
  disabled = false,
}: SiteServicePickComboboxProps) {
  const [inputValue, setInputValue] = useState('')
  const { listId, containerRef, open, setOpen, highlight, setHighlight, close } =
    useSearchableCombobox(inputValue)

  const sorted = useMemo(
    () => [...services].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title)),
    [services],
  )

  const selected = useMemo(
    () => values.map((id) => sorted.find((s) => s.id === id)).filter((x): x is SiteService => Boolean(x)),
    [sorted, values],
  )

  const filtered = filterServices(sorted, inputValue)

  useEffect(() => {
    if (open) return
    setInputValue('')
  }, [values, open, selected.length])

  const pickService = (s: SiteService) => {
    const alreadySelected = values.includes(s.id)
    const next = alreadySelected ? values.filter((id) => id !== s.id) : [...values, s.id]
    onChange(next)
    setInputValue('')
    setOpen(true)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return
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
      setHighlight((h) => Math.min(h + 1, Math.max(filtered.length - 1, 0)))
      e.preventDefault()
      return
    }

    if (e.key === 'ArrowUp') {
      setHighlight((h) => Math.max(h - 1, 0))
      e.preventDefault()
      return
    }

    if (e.key === 'Enter') {
      const s = filtered[highlight]
      if (s) pickService(s)
      e.preventDefault()
    }
  }

  return (
    <div ref={containerRef} className="relative sm:col-span-2">
      <label className={labelClassName} htmlFor={`${listId}-input`}>
        {label}
      </label>
      <div className="relative flex items-stretch gap-2">
        <input
          id={`${listId}-input`}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          disabled={disabled}
          className={`${formInputClass} min-w-0 flex-1`}
          placeholder={selected.length > 0 ? 'Add another service…' : 'Search services…'}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setOpen(true)
          }}
          onFocus={() => !disabled && setOpen(true)}
          onKeyDown={onKeyDown}
        />
      </div>
      {selected.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {selected.map((row) => (
            <span
              key={row.id}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-800 dark:border-indigo-800/70 dark:bg-indigo-950/40 dark:text-indigo-100"
            >
              <span className="flex size-5 items-center justify-center overflow-hidden rounded-full text-indigo-600 dark:text-indigo-300 [&_img]:size-4 [&_img]:object-contain">
                <SiteServiceIconVisual service={row} className="size-4" />
              </span>
              <span>{row.title}</span>
              <button
                type="button"
                onClick={() => onChange(values.filter((id) => id !== row.id))}
                className="rounded-full px-1 text-indigo-700 hover:bg-indigo-100 dark:text-indigo-200 dark:hover:bg-indigo-900/50"
                aria-label={`Remove ${row.title}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : null}
      {hint ? (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      ) : null}

      {open && !disabled ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
        >
          {sorted.length === 0 ? (
            <li className="px-3 py-3 text-sm text-slate-500 dark:text-slate-400">
              No site services yet. Add them under Site services.
            </li>
          ) : filtered.length === 0 ? (
            <li className="px-3 py-3 text-sm text-slate-500 dark:text-slate-400">
              No services match “{inputValue.trim() || '…'}”.
            </li>
          ) : (
            filtered.map((s, i) => {
              const active = highlight === i
              return (
                <li key={s.id} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={values.includes(s.id)}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm ${
                      active
                        ? 'bg-indigo-50 text-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-100'
                        : 'text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                    onMouseEnter={() => setHighlight(i)}
                    onClick={() => pickService(s)}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200/80 bg-slate-50 text-indigo-600 dark:border-slate-600 dark:bg-slate-800/60 dark:text-indigo-300 [&_img]:size-6 [&_img]:object-contain">
                      <SiteServiceIconVisual service={s} className="size-6" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{s.title}</span>
                      <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                        {s.serviceKey}
                        {values.includes(s.id) ? ' · selected' : ''}
                        {!s.isActive ? ' · hidden on public site' : ''}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })
          )}
        </ul>
      ) : null}
    </div>
  )
}
