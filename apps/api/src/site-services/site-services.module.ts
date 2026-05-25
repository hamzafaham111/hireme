import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { RolesGuard } from '../common/guards/roles.guard'
import { UploadsModule } from '../uploads/uploads.module'
import { SiteServicesController } from './site-services.controller'
import { SiteServicesRepository } from './site-services.repository'

@Module({
  imports: [AuthModule, UploadsModule],
  controllers: [SiteServicesController],
  providers: [SiteServicesRepository, RolesGuard],
})
export class SiteServicesModule {}
