import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { UploadsModule } from '../uploads/uploads.module'
import { SiteServicesController } from './site-services.controller'
import { SiteServicesRepository } from './site-services.repository'

@Module({
  imports: [AuthModule, UploadsModule],
  controllers: [SiteServicesController],
  providers: [SiteServicesRepository],
})
export class SiteServicesModule {}
