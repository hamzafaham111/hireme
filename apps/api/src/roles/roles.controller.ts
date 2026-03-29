import { Controller, Get } from '@nestjs/common'

/** Static catalog — mirrors dashboard `RolesPage` until roles become DB-driven. */
const SYSTEM_ROLES = [
  {
    id: 'r1',
    key: 'superadmin',
    label: 'Super Admin',
    description:
      'Full control of dashboard users, system settings, and sensitive worker/job data.',
  },
  {
    id: 'r2',
    key: 'admin',
    label: 'Admin',
    description:
      'Manage day-to-day operations: workers, jobs, assignments, and team users.',
  },
  {
    id: 'r3',
    key: 'agent',
    label: 'Agent',
    description:
      'Handle customer requests: create jobs, contact workers, update job status and quotations.',
  },
  {
    id: 'r4',
    key: 'content_editor',
    label: 'Content editor',
    description:
      'Create and publish marketing blog posts only; no access to users, workers, or jobs.',
  },
] as const

@Controller('roles')
export class RolesController {
  @Get()
  findAll() {
    return SYSTEM_ROLES
  }
}
