import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { BlogImageUploadService } from './blog-image-upload.service'
import { BlogController } from './blog.controller'
import { BlogService } from './blog.service'

@Module({
  imports: [AuthModule],
  controllers: [BlogController],
  providers: [BlogService, BlogImageUploadService],
})
export class BlogModule {}
