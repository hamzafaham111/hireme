import { SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'roles'

/** JWT `role` claim must be one of these (see `DashboardRole` in `@hire-me/types`). */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles)
