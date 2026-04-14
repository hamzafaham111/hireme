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

export class UpdateSiteServiceDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  shortDescription?: string

  @IsOptional()
  @IsString()
  @IsIn(ICON_KEYS)
  iconKey?: string

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

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  iconImageUrl?: string | null
}
