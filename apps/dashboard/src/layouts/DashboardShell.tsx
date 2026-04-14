import { useEffect, useMemo } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  IconBlog,
  IconBriefcase,
  IconHome,
  IconJobs,
  IconSiteServices,
  IconUsers,
  IconWorker,
} from '../components/icons/NavIcons'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import type { NavItem } from '../components/layout/Sidebar'
import { useAuth } from '../context/AuthContext'
import { useOperationsData } from '../context/OperationsDataContext'
import { dashboardHeader } from '../lib/dashboardHeader'

/**
 * Authenticated shell: sidebar + header driven by URL; main area is the route `Outlet`.
 */
export default function DashboardShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const { opsError, clearOpsError } = useOperationsData()
  const { title, subtitle } = dashboardHeader(location.pathname)

  /** Content editors only manage marketing blog posts — keep ops routes unreachable. */
  useEffect(() => {
    if (user?.role !== 'content_editor') return
    if (location.pathname.startsWith('/blog')) return
    navigate('/blog', { replace: true })
  }, [user?.role, location.pathname, navigate])

  const navItems: NavItem[] = useMemo(() => {
    const all: NavItem[] = [
      {
        id: 'overview',
        label: 'Overview',
        icon: <IconHome className="size-5" />,
        to: '/',
        end: true,
      },
      {
        id: 'blog',
        label: 'Blog',
        icon: <IconBlog className="size-5" />,
        to: '/blog',
      },
      {
        id: 'site-services',
        label: 'Site services',
        icon: <IconSiteServices className="size-5" />,
        to: '/site-services',
      },
      {
        id: 'users',
        label: 'Users',
        icon: <IconUsers className="size-5" />,
        to: '/users',
      },
      {
        id: 'workers',
        label: 'Workers',
        icon: <IconWorker className="size-5" />,
        to: '/workers',
      },
      {
        id: 'jobs',
        label: 'Jobs',
        icon: <IconJobs className="size-5" />,
        to: '/jobs',
      },
      {
        id: 'roles',
        label: 'Roles',
        icon: <IconBriefcase className="size-5" />,
        to: '/roles',
      },
    ]
    if (user?.role === 'content_editor') {
      return all.filter((item) => item.id === 'blog')
    }
    return all
  }, [user?.role])

  return (
    <DashboardLayout
      navItems={navItems}
      headerTitle={title}
      headerSubtitle={subtitle}
      headerActions={
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <span
              className="hidden max-w-[220px] truncate text-xs text-slate-500 dark:text-slate-400 md:inline"
              title={user.email}
            >
              {user.name} · {user.email}
            </span>
          ) : null}
          <button
            type="button"
            className="hidden rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 sm:inline-flex dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Export
          </button>
          <button
            type="button"
            onClick={() => logout()}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Log out
          </button>
        </div>
      }
    >
      {user?.role !== 'content_editor' && opsError ? (
        <div
          className="mb-4 flex flex-col gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-100 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <span>
            <span className="font-medium">Could not load operations data.</span>{' '}
            <span className="opacity-90">{opsError}</span>
          </span>
          <button
            type="button"
            className="self-start rounded-lg border border-rose-300 bg-white px-2.5 py-1 text-xs font-medium text-rose-900 shadow-sm transition hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-50 dark:hover:bg-rose-900"
            onClick={() => clearOpsError()}
          >
            Dismiss
          </button>
        </div>
      ) : null}
      <Outlet />
    </DashboardLayout>
  )
}
