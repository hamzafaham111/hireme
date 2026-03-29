import { IsIn, IsOptional, IsString, MinLength } from 'class-validator'

const STATUSES = ['draft', 'published'] as const

export class CreateBlogPostDto {
  @IsString()
  @MinLength(1)
  title!: string

  @IsString()
  excerpt!: string

  @IsString()
  @MinLength(1)
  bodyMarkdown!: string

  @IsIn(STATUSES)
  status!: (typeof STATUSES)[number]

  @IsOptional()
  @IsString()
  slug?: string
}
