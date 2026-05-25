'use client'

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  type KeyboardEvent,
} from 'react'
import type { SiteService } from '@hire-me/types'
import { SiteServiceIconVisual } from '@hire-me/site-icons/site-service-visual'
import { formInputClass, formLabelClass } from '@/lib/formStyles'
import { useSearchableCombobox } from '@/components/ui/useSearchableCombobox'

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

export type JobServicePick =
  | { source: 'catalog'; service: SiteService }
  | { source: 'custom'; label: string }

export interface JobServiceComboboxHandle {
  /** Resolves typed text or an explicit pick for `POST /jobs` (exact catalog title → catalog id). */
  resolveSubmitPick: () => JobServicePick | null
}

export interface JobServiceComboboxProps {
  services: SiteService[]
  loading?: boolean
  value: JobServicePick | null
  onChange: (next: JobServicePick | null) => void
}

/**
 * Searchable catalog picker (dashboard-style) with a **custom** service path when the need
 * is not listed. Submit can resolve free text without an explicit &quot;Use custom&quot; click.
 */
export const JobServiceCombobox = forwardRef<
  JobServiceComboboxHandle,
  JobServiceComboboxProps
>(function JobServiceCombobox({ services, loading = false, value, onChange }, ref) {
  const [inputValue, setInputValue] = useState('')
  const { listId, containerRef, open, setOpen, highlight, setHighlight, close } =
    useSearchableCombobox(inputValue)

  const sorted = useMemo(
    () => [...services].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title)),
    [services],
  )

  const filtered = filterServices(sorted, inputValue)

  useEffect(() => {
    if (!value) return
    if (value.source === 'catalog') {
      setInputValue(value.service.title)
    } else {
      setInputValue(value.label)
    }
  }, [value])

  const selectedCatalogId = value?.source === 'catalog' ? value.service.id : null
  const selectedTitle = value?.source === 'catalog' ? value.service.title : null

  const canUseCustom =
    inputValue.trim().length > 0 &&
    (!selectedCatalogId || inputValue.trim() !== selectedTitle?.trim())

  const listLength = filtered.length + (canUseCustom ? 1 : 0)

  useImperativeHandle(ref, () => ({
    resolveSubmitPick: (): JobServicePick | null => {
      if (value) return value
      const t = inputValue.trim()
      if (!t) return null
      const exact = sorted.find((s) => s.title.toLowerCase() === t.toLowerCase())
      if (exact) return { source: 'catalog', service: exact }
      return { source: 'custom', label: t }
    },
  }))

  const pickCatalog = (s: SiteService) => {
    onChange({ source: 'catalog', service: s })
    setInputValue(s.title)
    close()
  }

  const pickCustom = () => {
    const label = inputValue.trim()
    if (!label) return
    onChange({ source: 'custom', label })
    close()
  }

  const onInputChange = (next: string) => {
    setInputValue(next)
    setOpen(true)
    if (value?.source === 'catalog' && next.trim() !== value.service.title.trim()) {
      onChange(null)
    }
    if (value?.source === 'custom' && next.trim() !== value.label.trim()) {
      onChange(null)
    }
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
      setHighlight((h) => Math.min(h + 1, Math.max(listLength - 1, 0)))
      e.preventDefault()
      return
    }

    if (e.key === 'ArrowUp') {
      setHighlight((h) => Math.max(h - 1, 0))
      e.preventDefault()
      return
    }

    if (e.key === 'Enter') {
      if (canUseCustom && highlight === filtered.length) {
        pickCustom()
        e.preventDefault()
        return
      }
      const s = filtered[highlight]
      if (s) pickCatalog(s)
      else if (canUseCustom) pickCustom()
      e.preventDefault()
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <label className={formLabelClass} htmlFor={`${listId}-service`}>
        Type of service
      </label>
      <input
        id={`${listId}-service`}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        autoComplete="off"
        disabled={loading}
        className={`${formInputClass} ${loading ? 'opacity-70' : ''}`}
        placeholder={
          loading
            ? 'Loading services from catalog…'
            : 'Search catalog or type your own service…'
        }
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        onFocus={() => !loading && setOpen(true)}
        onKeyDown={onKeyDown}
      />
      <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
        Search services created in the dashboard, or type any service name if it is not in the
        list.
      </p>

      {open && !loading ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-72 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
        >
          {sorted.length === 0 && !canUseCustom ? (
            <li className="px-3 py-3 text-sm text-slate-500 dark:text-slate-400">
              No services in the catalog yet. Type the service you need — you can post with that
              name.
            </li>
          ) : null}

          {sorted.length > 0 && filtered.length === 0 && inputValue.trim() ? (
            <li className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
              No catalog row matches &quot;{inputValue.trim()}&quot;. You can still post with a
              custom name.
            </li>
          ) : null}

          {filtered.map((s, i) => {
            const active = highlight === i
            return (
              <li key={s.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selectedCatalogId === s.id}
                  onMouseDown={(ev) => ev.preventDefault()}
                  className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm ${
                    active
                      ? 'bg-indigo-50 text-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-100'
                      : 'text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                  onMouseEnter={() => setHighlight(i)}
                  onClick={() => pickCatalog(s)}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200/80 bg-slate-50 text-indigo-600 dark:border-slate-600 dark:bg-slate-800/60 dark:text-indigo-300 [&_img]:size-6 [&_img]:object-contain">
                    <SiteServiceIconVisual service={s} className="size-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{s.title}</span>
                    <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                      {s.serviceKey}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}

          {canUseCustom ? (
            <li
              role="presentation"
              className={
                filtered.length > 0 ? 'border-t border-slate-100 dark:border-slate-800' : ''
              }
            >
              <button
                type="button"
                role="option"
                aria-selected={value?.source === 'custom' && value.label === inputValue.trim()}
                onMouseDown={(ev) => ev.preventDefault()}
                className={`w-full px-3 py-2.5 text-left text-sm ${
                  highlight === filtered.length
                    ? 'bg-amber-50 text-amber-950 dark:bg-amber-950/40 dark:text-amber-100'
                    : 'text-amber-900 hover:bg-amber-50/80 dark:text-amber-200 dark:hover:bg-amber-950/30'
                }`}
                onMouseEnter={() => setHighlight(filtered.length)}
                onClick={() => pickCustom()}
              >
                <span className="font-medium">Use custom service:</span>{' '}
                <span className="text-slate-700 dark:text-slate-300">
                  &quot;{inputValue.trim()}&quot;
                </span>
              </button>
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  )
})
