import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { RolesGuard } from '../common/guards/roles.guard'
import { UploadsModule } from '../uploads/uploads.module'
import { BlogController } from './blog.controller'
import { BlogService } from './blog.service'

@Module({
  imports: [AuthModule, UploadsModule],
  controllers: [BlogController],
  providers: [BlogService, RolesGuard],
})
export class BlogModule {}
