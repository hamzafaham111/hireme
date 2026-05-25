'use client'

import type { ReactNode } from 'react'
import { WebAuthProvider } from '@/context/WebAuthContext'

export function WebProviders({ children }: { children: ReactNode }) {
  return <WebAuthProvider>{children}</WebAuthProvider>
}
