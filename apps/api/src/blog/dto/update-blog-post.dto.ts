import { IsIn, IsOptional, IsString, MinLength } from 'class-validator'

const STATUSES = ['draft', 'published'] as const

export class UpdateBlogPostDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string

  @IsOptional()
  @IsString()
  excerpt?: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  bodyMarkdown?: string

  @IsOptional()
  @IsIn(STATUSES)
  status?: (typeof STATUSES)[number]

  @IsOptional()
  @IsString()
  slug?: string
}
