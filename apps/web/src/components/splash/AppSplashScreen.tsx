'use client'

import { useEffect, useRef, useState, type TransitionEvent } from 'react'
import { siteName } from '@/lib/site'

type Phase = 'show' | 'exit' | 'gone'

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Short branded overlay on first paint (mobile-app–style). SSR starts visible so
 * the first HTML already includes the shell — avoids a flash of page content.
 * Uses CSS animations + `fonts.ready` (capped) — no animation libraries.
 */
export function AppSplashScreen() {
  const [phase, setPhase] = useState<Phase>('show')
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (phase !== 'show') return

    let cancelled = false
    const reduce = prefersReducedMotion()
    const minMs = reduce ? 200 : 850
    const maxMs = reduce ? 400 : 2600

    const waitFonts = (): Promise<void> => {
      if (typeof document === 'undefined' || !document.fonts?.ready) {
        return Promise.resolve()
      }
      return document.fonts.ready.then(() => undefined).catch(() => undefined)
    }

    const run = async () => {
      const t0 = performance.now()
      const fontRace = Promise.race([
        waitFonts(),
        new Promise<void>((r) => setTimeout(r, maxMs)),
      ])
      await fontRace
      const elapsed = performance.now() - t0
      const remaining = Math.max(0, minMs - elapsed)
      if (remaining > 0) {
        await new Promise<void>((r) => setTimeout(r, remaining))
      }
      if (cancelled) return
      setPhase('exit')
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [phase])

  const onTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    if (phase !== 'exit' || e.target !== rootRef.current || e.propertyName !== 'opacity') {
      return
    }
    setPhase('gone')
  }

  /** Backup if `transitionend` never fires (reduced motion, older engines). */
  useEffect(() => {
    if (phase !== 'exit') return
    const t = window.setTimeout(() => setPhase('gone'), 700)
    return () => window.clearTimeout(t)
  }, [phase])

  if (phase === 'gone') {
    return null
  }

  const exiting = phase === 'exit'

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-busy={!exiting}
      aria-label={`Loading ${siteName}`}
      onTransitionEnd={onTransitionEnd}
      className={[
        'fixed inset-0 z-[200] flex flex-col items-center justify-center gap-8',
        'bg-white/92 backdrop-blur-md dark:bg-slate-950/92',
        'transition-opacity duration-500 ease-out motion-reduce:transition-none',
        exiting ? 'pointer-events-none opacity-0' : 'opacity-100',
      ].join(' ')}
    >
      <div className="flex flex-col items-center gap-3 px-6 text-center">
        <p className="font-display text-2xl font-bold tracking-tight text-brand-600 dark:text-brand-400 sm:text-3xl">
          {siteName}
        </p>
        <p className="max-w-xs text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">
          Getting things ready…
        </p>
      </div>

      <div
        className="flex gap-2 motion-reduce:gap-1"
        aria-hidden
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={[
              'size-2.5 rounded-full bg-brand-500/90 sm:size-3',
              'motion-reduce:opacity-80',
              'animate-splash-dot',
              i === 1 ? '[animation-delay:150ms]' : '',
              i === 2 ? '[animation-delay:300ms]' : '',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  )
}
