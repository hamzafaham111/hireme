import type { Customer } from '@hire-me/types'

export function CustomerTypeBadge({ type }: { type: Customer['customerType'] }) {
  const map = {
    individual: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300',
    residential: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300',
    commercial: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300',
  } as const
  
  const label = type === 'individual' 
    ? 'Individual' 
    : type === 'residential' 
      ? 'Residential' 
      : 'Commercial'
  
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${map[type]}`}
    >
      {label}
    </span>
  )
}
