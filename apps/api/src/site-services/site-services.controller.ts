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
import { Roles } from '../common/decorators/roles.decorator'
import { RolesGuard } from '../common/guards/roles.guard'
import {
  IMAGE_UPLOAD_MIME_TO_EXT,
  ImageUploadService,
} from '../uploads/image-upload.service'
import { CreateSiteServiceDto } from './dto/create-site-service.dto'
import { UpdateSiteServiceDto } from './dto/update-site-service.dto'
import { SiteServicesRepository } from './site-services.repository'

/**
 * Marketing catalog: `GET /public` (no auth).
 * Dashboard: same resource shape as jobs/workers — `GET /` with JWT returns full list (incl. inactive).
 * Static path segments must be registered before `:id`.
 */
@Controller('site-services')
export class SiteServicesController {
  constructor(
    private readonly siteServices: SiteServicesRepository,
    private readonly imageUpload: ImageUploadService,
  ) {}

  @Get('public')
  listPublic() {
    return this.siteServices.listPublic()
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  listAll() {
    return this.siteServices.listAdmin()
  }

  @Post('uploads/icon')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
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
  uploadIcon(@UploadedFile() file: Express.Multer.File | undefined) {
    if (!file) {
      throw new BadRequestException('Missing file field `file`.')
    }
    return this.imageUpload.saveUploadedImage(file)
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  create(@Body() dto: CreateSiteServiceDto) {
    return this.siteServices.create(dto)
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.siteServices.findOneAdmin(id)
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdateSiteServiceDto) {
    return this.siteServices.update(id, dto)
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.siteServices.remove(id)
  }
}
