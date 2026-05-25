/**
 * `admin` — operations dashboard only.
 * `customer` | `worker` — marketplace web app.
 */
export type DashboardRole = 'admin' | 'customer' | 'worker'

export interface DashboardUser {
  id: string
  name: string
  email: string
  role: DashboardRole
  status: 'active' | 'invited'
  password: string
}
