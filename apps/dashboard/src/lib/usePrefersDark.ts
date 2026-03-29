import { useSyncExternalStore } from 'react'

/**
 * Tracks OS dark preference (`prefers-color-scheme`), matching Tailwind’s default `dark:` behavior.
 * Used to sync third-party editors (e.g. markdown) with the dashboard theme.
 */
export function usePrefersDark(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    },
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
    () => false,
  )
}
