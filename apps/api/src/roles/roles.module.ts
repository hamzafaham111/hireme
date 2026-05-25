import { Module } from '@nestjs/common'
import { RolesGuard } from '../common/guards/roles.guard'
import { RolesController } from './roles.controller'

@Module({
  controllers: [RolesController],
  providers: [RolesGuard],
})
export class RolesModule {}
