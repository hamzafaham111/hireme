import type { ReactNode } from 'react'
import { Suspense } from 'react'
import { WorkerGate } from '@/components/auth/WorkerGate'

export default function WorkerSectionLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-sm text-slate-500">Loading…</div>
      }
    >
      <WorkerGate>{children}</WorkerGate>
    </Suspense>
  )
}
