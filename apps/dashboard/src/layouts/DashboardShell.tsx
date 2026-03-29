import { useEffect, useMemo } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  IconBlog,
  IconBriefcase,
  IconHome,
  IconJobs,
  IconUsers,
  IconWorker,
} from '../components/icons/NavIcons'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import type { NavItem } from '../components/layout/Sidebar'
import { useAuth } from '../context/AuthContext'
import { dashboardHeader } from '../lib/dashboardHeader'

/**
 * Authenticated shell: sidebar + header driven by URL; main area is the route `Outlet`.
 */
export default function DashboardShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user } = useAuth()
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
      <Outlet />
    </DashboardLayout>
  )
}
