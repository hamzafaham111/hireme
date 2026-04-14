import { SITE_SERVICE_ICON_KEYS } from '@hire-me/types'
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

const ICON_KEYS = [...SITE_SERVICE_ICON_KEYS] as [string, ...string[]]

export class CreateSiteServiceDto {
  @IsString()
  @MinLength(1)
  title!: string

  @IsString()
  @MinLength(1)
  shortDescription!: string

  @IsString()
  @IsIn(ICON_KEYS)
  iconKey!: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  slug?: string

  @IsOptional()
  @IsInt()
  sortOrder?: number

  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  /** Full URL from `POST site-services/uploads/icon` or external CDN. */
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  iconImageUrl?: string | null
}
