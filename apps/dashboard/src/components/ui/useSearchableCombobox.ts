import { useCallback, useEffect, useId, useRef, useState } from 'react'

/**
 * Shared open/close, highlight, and outside-click behavior for searchable comboboxes
 * ({@link WorkerAssignCombobox}, {@link SiteServicePickCombobox}).
 */
export function useSearchableCombobox(filterKey: string | number) {
  const listId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)

  const close = useCallback(() => {
    setOpen(false)
    setHighlight(0)
  }, [])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open, close])

  useEffect(() => {
    setHighlight(0)
  }, [filterKey])

  return {
    listId,
    containerRef,
    open,
    setOpen,
    highlight,
    setHighlight,
    close,
  }
}
