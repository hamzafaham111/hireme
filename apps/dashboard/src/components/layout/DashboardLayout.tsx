import { useEffect, useState, type ReactNode } from 'react'
import { Header } from './Header'
import { type NavItem, Sidebar } from './Sidebar'

const SIDEBAR_COLLAPSED_KEY = 'dashboard-sidebar-collapsed'

export interface DashboardLayoutProps {
  navItems: NavItem[]
  headerTitle: string
  headerSubtitle?: string
  headerActions?: ReactNode
  children: ReactNode
}

/**
 * Shell layout: sidebar + sticky header + scrollable main (no footer).
 */
export function DashboardLayout({
  navItems,
  headerTitle,
  headerSubtitle,
  headerActions,
  children,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
      if (raw === '1') setCollapsed(true)
    } catch {
      /* ignore */
    }
  }, [])

  const persistCollapsed = (next: boolean) => {
    setCollapsed(next)
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? '1' : '0')
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950">
      {/* Full-viewport background; inner shell caps at 1800px and centers on ultra-wide screens */}
      <div className="mx-auto flex min-h-dvh w-full max-w-[1800px]">
        <Sidebar
          items={navItems}
          collapsed={collapsed}
          onToggleCollapsed={() => persistCollapsed(!collapsed)}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <Header
            title={headerTitle}
            subtitle={headerSubtitle}
            onOpenSidebar={() => setMobileOpen(true)}
            actions={headerActions}
          />
          <main className="min-h-0 flex-1 overflow-auto px-4 py-6 sm:px-6">
            <div className="w-full">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}
