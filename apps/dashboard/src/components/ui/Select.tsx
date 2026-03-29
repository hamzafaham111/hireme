import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'

export type SelectOption = { value: string; label: string }

const sizeStyles = {
  sm: {
    trigger:
      'min-h-[34px] rounded-lg py-1.5 pl-2.5 pr-9 text-xs',
    option: 'px-2.5 py-2 text-xs',
  },
  md: {
    trigger:
      'min-h-[42px] rounded-xl py-2.5 pl-3.5 pr-10 text-sm',
    option: 'px-3 py-2.5 text-sm',
  },
} as const

const triggerBase =
  'w-full border border-slate-200 bg-white text-left font-medium text-slate-900 shadow-sm outline-none transition hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:border-slate-600 dark:focus:border-indigo-400'

const labelDefault =
  'mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200'

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
    >
      <path
        d="M5.5 7.5 10 12l4.5-4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export interface SelectProps {
  id?: string
  /** Visible label; omit if you render your own (set `ariaLabel`) */
  label?: ReactNode
  labelClassName?: string
  /** Required when `label` is omitted */
  ariaLabel?: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  /** Shown in trigger when `value` is empty and no option matches */
  placeholder?: string
  disabled?: boolean
  /** `sm` for toolbars and dense rows */
  size?: keyof typeof sizeStyles
  className?: string
  /** Merged onto the outer wrapper */
  wrapperClassName?: string
}

/**
 * Custom dropdown select: spaced chevron, styled list panel, keyboard support.
 * Replaces native `<select>` for a consistent dashboard look.
 */
export function Select({
  id: idProp,
  label,
  labelClassName = labelDefault,
  ariaLabel,
  value,
  onChange,
  options,
  placeholder = 'Select…',
  disabled = false,
  size = 'md',
  className = '',
  wrapperClassName = '',
}: SelectProps) {
  const reactId = useId()
  const id = idProp ?? `select-${reactId}`
  const listboxId = `${id}-listbox`
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const selected = options.find((o) => o.value === value)
  const displayLabel = selected?.label ?? placeholder

  const close = useCallback(() => setOpen(false), [])

  const openAtValue = useCallback(() => {
    const i = Math.max(
      0,
      options.findIndex((o) => o.value === value),
    )
    setHighlight(i)
    setOpen(true)
  }, [options, value])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open, close])

  useEffect(() => {
    if (!open) return
    const i = Math.max(0, options.findIndex((o) => o.value === value))
    setHighlight(i)
  }, [open, value, options])

  const pick = useCallback(
    (v: string) => {
      onChange(v)
      close()
      triggerRef.current?.focus()
    },
    [onChange, close],
  )

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!open) openAtValue()
        else
          setHighlight((h) => Math.min(h + 1, options.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        if (!open) openAtValue()
        else setHighlight((h) => Math.max(h - 1, 0))
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (open && options[highlight]) pick(options[highlight].value)
        else openAtValue()
        break
      case 'Escape':
        if (open) {
          e.preventDefault()
          close()
        }
        break
      case 'Home':
        if (open) {
          e.preventDefault()
          setHighlight(0)
        }
        break
      case 'End':
        if (open) {
          e.preventDefault()
          setHighlight(options.length - 1)
        }
        break
      default:
        break
    }
  }

  const onListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => Math.min(h + 1, options.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (options[highlight]) pick(options[highlight].value)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      close()
      triggerRef.current?.focus()
    }
  }

  const sz = sizeStyles[size]

  return (
    <div className={`relative ${wrapperClassName} ${className}`} ref={wrapRef}>
      {label ? (
        <label className={labelClassName} htmlFor={id}>
          {label}
        </label>
      ) : null}
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          id={id}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-label={!label ? ariaLabel : undefined}
          className={`${triggerBase} ${sz.trigger} relative flex w-full items-center`}
          onClick={() => {
            if (disabled) return
            if (open) close()
            else openAtValue()
          }}
          onKeyDown={onTriggerKeyDown}
        >
          <span
            className={`block min-w-0 flex-1 truncate ${
              selected ? '' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {displayLabel}
          </span>
          <ChevronDown
            className={`pointer-events-none absolute top-1/2 size-4 shrink-0 -translate-y-1/2 text-slate-500 dark:text-slate-400 ${
              size === 'sm' ? 'right-2.5' : 'right-3'
            }`}
          />
        </button>

        {open ? (
          <ul
            id={listboxId}
            role="listbox"
            tabIndex={-1}
            aria-activedescendant={
              options[highlight] ? `${id}-opt-${highlight}` : undefined
            }
            className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-xl border border-slate-200/90 bg-white py-1 shadow-lg ring-1 ring-slate-900/5 dark:border-slate-600 dark:bg-slate-800 dark:ring-black/20"
            onKeyDown={onListKeyDown}
          >
            {options.map((opt, i) => {
              const isSelected = opt.value === value
              const isHi = i === highlight
              return (
                <li
                  key={opt.value || `opt-${i}`}
                  id={`${id}-opt-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  className={`${sz.option} cursor-pointer outline-none transition-colors ${
                    isHi
                      ? 'bg-indigo-50 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-100'
                      : 'text-slate-800 dark:text-slate-100'
                  } ${
                    isSelected && !isHi
                      ? 'bg-slate-50 font-medium dark:bg-slate-800/80'
                      : ''
                  }`}
                  onMouseEnter={() => setHighlight(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(opt.value)}
                >
                  {opt.label}
                </li>
              )
            })}
          </ul>
        ) : null}
      </div>
    </div>
  )
}
