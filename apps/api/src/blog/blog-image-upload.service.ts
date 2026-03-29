import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Express } from 'express'

/** Allowed marketing image types → safe file extension on disk */
export const BLOG_IMAGE_MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
}

const MAX_BYTES = 5 * 1024 * 1024

@Injectable()
export class BlogImageUploadService implements OnModuleInit {
  private readonly dir: string

  constructor(private readonly config: ConfigService) {
    this.dir =
      this.config.get<string>('UPLOAD_DIR')?.trim() || join(process.cwd(), 'uploads')
  }

  async onModuleInit() {
    await mkdir(this.dir, { recursive: true })
  }

  /** Absolute path where files are written (must match static mount in `main.ts`). */
  getUploadDir(): string {
    return this.dir
  }

  /**
   * Public origin used in returned URLs. Must be reachable by browsers (dashboard + Next.js).
   * Do not include `/api/v1` — uploads are served at `/uploads/...` on the API host.
   */
  private publicBase(): string {
    const raw = this.config.get<string>('PUBLIC_BASE_URL')?.trim()
    return (raw || 'http://localhost:4000').replace(/\/$/, '')
  }

  async saveUploadedImage(file: Express.Multer.File): Promise<{ url: string }> {
    if (!file?.buffer?.length) {
      throw new BadRequestException('No image file received.')
    }
    if (file.size > MAX_BYTES) {
      throw new BadRequestException('Image must be 5 MB or smaller.')
    }
    const ext = BLOG_IMAGE_MIME_TO_EXT[file.mimetype]
    if (!ext) {
      throw new BadRequestException('Only JPEG, PNG, GIF, and WebP images are allowed.')
    }
    const filename = `${randomUUID()}${ext}`
    await writeFile(join(this.dir, filename), file.buffer)
    return { url: `${this.publicBase()}/uploads/${filename}` }
  }
}
