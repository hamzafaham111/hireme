import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import {
  IconPanelCollapse,
  IconPanelExpand,
  IconX,
} from '../icons/LayoutIcons'

export interface NavItem {
  id: string
  label: string
  icon: ReactNode
  /** Dashboard route path */
  to: string
  /** When true, only exact `to` matches (used for overview `/`) */
  end?: boolean
}

export interface SidebarProps {
  items: NavItem[]
  /** Desktop: icon-only rail when true */
  collapsed: boolean
  onToggleCollapsed: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
}

/**
 * Responsive sidebar: fixed overlay on small screens, static rail on `lg+`.
 */
export function Sidebar({
  items,
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity lg:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onCloseMobile}
      />

      <aside
        className={[
          'fixed left-0 top-0 z-50 flex min-h-dvh w-64 flex-col border-r border-slate-200/80 bg-white shadow-xl transition-[width,transform] duration-200 dark:border-slate-800 dark:bg-slate-950 lg:static lg:z-0 lg:min-h-dvh lg:translate-x-0 lg:self-stretch lg:shadow-none',
          collapsed ? 'lg:w-[4.5rem]' : 'lg:w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        <div
          className={`flex h-16 shrink-0 items-center border-b border-slate-200/80 px-4 dark:border-slate-800 ${
            collapsed ? 'lg:justify-center lg:px-2' : 'lg:px-4'
          }`}
        >
          <div className="flex min-w-0 flex-1 items-center gap-2 lg:min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-md">
              H
            </div>
            <div
              className={`min-w-0 ${collapsed ? 'lg:hidden' : ''} ${mobileOpen ? '' : 'max-lg:hidden'}`}
            >
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                Hire Me
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                Operations
              </p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden dark:hover:bg-slate-800 dark:hover:text-slate-200"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
          >
            <IconX className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Main">
          {items.map((item) => (
            <NavLink
              key={item.id}
              to={item.to}
              end={item.end}
              onClick={() => onCloseMobile()}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                [
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition',
                  collapsed ? 'lg:justify-center lg:px-2' : '',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                      isActive
                        ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-300'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`truncate ${collapsed ? 'lg:hidden' : ''} ${!mobileOpen ? 'max-lg:hidden' : ''}`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden border-t border-slate-200/80 p-3 dark:border-slate-800 lg:block">
          <button
            type="button"
            onClick={onToggleCollapsed}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-expanded={!collapsed}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <IconPanelExpand className="size-5 shrink-0" title="Expand" />
            ) : (
              <>
                <IconPanelCollapse className="size-5 shrink-0" title="Collapse" />
                <span className="truncate">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
