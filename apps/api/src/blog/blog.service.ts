import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import type { BlogPost as PrismaBlogPost, BlogPostStatus } from '@prisma/client'
import type { BlogPost } from '@hire-me/types'
import { randomUUID } from 'crypto'
import type { RequestUser } from '../common/decorators/current-user.decorator'
import { PrismaService } from '../common/prisma/prisma.service'
import { slugify } from '../common/utils/slugify'
import { CreateBlogPostDto } from './dto/create-blog-post.dto'
import { UpdateBlogPostDto } from './dto/update-blog-post.dto'

const BLOG_MANAGER_ROLES = ['superadmin', 'admin', 'content_editor'] as const

function isBlogManager(user: RequestUser | undefined): boolean {
  return Boolean(user && BLOG_MANAGER_ROLES.includes(user.role as (typeof BLOG_MANAGER_ROLES)[number]))
}

function toApi(p: PrismaBlogPost): BlogPost {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    bodyMarkdown: p.bodyMarkdown,
    status: p.status,
    authorId: p.authorId,
    authorName: p.authorName,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
  }
}

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  /** Public list, or all posts (including drafts) for blog managers when JWT is present. */
  async list(viewer?: RequestUser) {
    if (isBlogManager(viewer)) {
      const list = await this.prisma.blogPost.findMany({
        orderBy: { updatedAt: 'desc' },
      })
      return list.map(toApi)
    }
    const list = await this.prisma.blogPost.findMany({
      where: { status: 'published' },
      orderBy: [{ publishedAt: 'desc' }, { updatedAt: 'desc' }],
    })
    return list.map(toApi)
  }

  /** Published posts are public; drafts visible only to blog managers. */
  async findPublishedOrDraftBySlug(slug: string, viewer?: RequestUser) {
    const post = await this.prisma.blogPost.findUnique({ where: { slug } })
    if (!post) {
      throw new NotFoundException('Post not found.')
    }
    if (post.status === 'published') {
      return toApi(post)
    }
    if (isBlogManager(viewer)) {
      return toApi(post)
    }
    throw new NotFoundException('Post not found.')
  }

  async findOneForManagers(id: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { id } })
    if (!post) throw new NotFoundException('Post not found.')
    return toApi(post)
  }

  private async ensureUniqueSlug(base: string): Promise<string> {
    let slug = base || `post-${randomUUID().slice(0, 8)}`
    const existing = await this.prisma.blogPost.findUnique({ where: { slug } })
    if (!existing) return slug
    return `${slug}-${randomUUID().slice(0, 8)}`
  }

  async create(dto: CreateBlogPostDto, author: RequestUser) {
    const title = dto.title.trim()
    const rawSlug = dto.slug?.trim() ? slugify(dto.slug) : slugify(title)
    const slug = await this.ensureUniqueSlug(rawSlug)
    const now = new Date()
    const status = dto.status as BlogPostStatus
    const publishedAt = status === 'published' ? now : null
    const excerpt = dto.excerpt.trim() || title.slice(0, 160)

    const post = await this.prisma.blogPost.create({
      data: {
        slug,
        title,
        excerpt,
        bodyMarkdown: dto.bodyMarkdown,
        status,
        authorId: author.userId,
        authorName: author.name,
        publishedAt,
      },
    })
    return toApi(post)
  }

  async update(id: string, dto: UpdateBlogPostDto, _editor: RequestUser) {
    const existing = await this.prisma.blogPost.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Post not found.')

    let slug = existing.slug
    if (dto.slug !== undefined) {
      const raw = dto.slug.trim()
      if (raw) {
        const nextSlug = slugify(raw)
        if (nextSlug && nextSlug !== existing.slug) {
          const taken = await this.prisma.blogPost.findUnique({ where: { slug: nextSlug } })
          if (taken && taken.id !== id) {
            throw new ConflictException('Slug already in use.')
          }
          slug = nextSlug
        }
      }
    }

    const now = new Date()
    let nextStatus = existing.status as BlogPostStatus
    if (dto.status !== undefined) {
      nextStatus = dto.status as BlogPostStatus
    }

    let publishedAt = existing.publishedAt
    if (nextStatus === 'published' && !publishedAt) {
      publishedAt = now
    }
    if (nextStatus === 'draft') {
      publishedAt = null
    }

    const post = await this.prisma.blogPost.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
        ...(dto.excerpt !== undefined ? { excerpt: dto.excerpt.trim() || existing.excerpt } : {}),
        ...(dto.bodyMarkdown !== undefined ? { bodyMarkdown: dto.bodyMarkdown } : {}),
        slug,
        status: nextStatus,
        publishedAt,
      },
    })
    return toApi(post)
  }

  async remove(id: string) {
    const existing = await this.prisma.blogPost.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Post not found.')
    await this.prisma.blogPost.delete({ where: { id } })
  }
}
