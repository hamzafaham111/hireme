import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthGuard } from '@nestjs/passport'
import type { Express } from 'express'
import { memoryStorage } from 'multer'
import {
  CurrentUser,
  type RequestUser,
} from '../common/decorators/current-user.decorator'
import { Roles } from '../common/decorators/roles.decorator'
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import {
  IMAGE_UPLOAD_MIME_TO_EXT,
  ImageUploadService,
} from '../uploads/image-upload.service'
import { BlogService } from './blog.service'
import { CreateBlogPostDto } from './dto/create-blog-post.dto'
import { UpdateBlogPostDto } from './dto/update-blog-post.dto'

@Controller('blog')
export class BlogController {
  constructor(
    private readonly blog: BlogService,
    private readonly imageUpload: ImageUploadService,
  ) {}

  @Get('posts')
  @UseGuards(OptionalJwtAuthGuard)
  listPosts(@CurrentUser() user?: RequestUser) {
    return this.blog.list(user)
  }

  @Get('posts/by-slug/:slug')
  @UseGuards(OptionalJwtAuthGuard)
  postBySlug(@Param('slug') slug: string, @CurrentUser() user?: RequestUser) {
    return this.blog.findPublishedOrDraftBySlug(slug, user)
  }

  @Get('posts/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('superadmin', 'admin', 'content_editor')
  postById(@Param('id') id: string) {
    return this.blog.findOneForManagers(id)
  }

  @Post('uploads/image')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('superadmin', 'admin', 'content_editor')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const ok = Boolean(IMAGE_UPLOAD_MIME_TO_EXT[file.mimetype])
        cb(
          ok
            ? null
            : new BadRequestException(
                'Only JPEG, PNG, GIF, and WebP images are allowed.',
              ),
          ok,
        )
      },
    }),
  )
  uploadBlogImage(@UploadedFile() file: Express.Multer.File | undefined) {
    if (!file) {
      throw new BadRequestException('Missing file field `file`.')
    }
    return this.imageUpload.saveUploadedImage(file)
  }

  @Post('posts')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('superadmin', 'admin', 'content_editor')
  createPost(@Body() dto: CreateBlogPostDto, @CurrentUser() user: RequestUser) {
    return this.blog.create(dto, user)
  }

  @Patch('posts/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('superadmin', 'admin', 'content_editor')
  updatePost(
    @Param('id') id: string,
    @Body() dto: UpdateBlogPostDto,
    @CurrentUser() user: RequestUser,
  ) {
    return this.blog.update(id, dto, user)
  }

  @Delete('posts/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('superadmin', 'admin', 'content_editor')
  removePost(@Param('id') id: string) {
    return this.blog.remove(id)
  }
}
