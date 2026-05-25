import type { ReactNode } from 'react'
import { Suspense } from 'react'
import { CustomerGate } from '@/components/auth/CustomerGate'

export default function CustomerSectionLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-sm text-slate-500">Loading…</div>
      }
    >
      <CustomerGate>{children}</CustomerGate>
    </Suspense>
  )
}
