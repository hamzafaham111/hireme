import { Controller, Get, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Roles } from '../common/decorators/roles.decorator'
import { RolesGuard } from '../common/guards/roles.guard'

/** Static catalog — mirrors dashboard `RolesPage` until roles become DB-driven. */
const SYSTEM_ROLES = [
  {
    id: 'r1',
    key: 'admin',
    label: 'Admin',
    description:
      'Operations dashboard: manage users, workers, jobs, site services, and blog content.',
  },
  {
    id: 'r2',
    key: 'customer',
    label: 'Customer',
    description:
      'Public web app: post jobs, browse nearby workers, and track requests.',
  },
  {
    id: 'r3',
    key: 'worker',
    label: 'Worker',
    description:
      'Public web app: see nearby jobs that match your services and profile.',
  },
] as const

@Controller('roles')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class RolesController {
  @Get()
  findAll() {
    return SYSTEM_ROLES
  }
}
