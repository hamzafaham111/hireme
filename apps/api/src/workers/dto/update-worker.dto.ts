import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateIf,
} from 'class-validator'

const STATUSES = ['active', 'not-active', 'on-hold', 'canceled'] as const
const APPROVAL_STATUSES = ['pending', 'approved', 'rejected', 'suspended'] as const

export class UpdateWorkerDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  workerId?: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  phone?: string

  @IsOptional()
  @IsString()
  @MinLength(1)
  location?: string

  /** When set, replaces catalog links and syncs denormalized `service` from selected titles. */
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID(undefined, { each: true })
  siteServiceIds?: string[]

  @IsOptional()
  @IsIn(STATUSES)
  status?: (typeof STATUSES)[number]

  @IsOptional()
  @IsIn(APPROVAL_STATUSES)
  approvalStatus?: (typeof APPROVAL_STATUSES)[number]

  @IsOptional()
  @IsNumber()
  internalRating?: number

  @IsOptional()
  @IsNumber()
  customerRating?: number

  @IsOptional()
  @ValidateIf((_, v) => v !== null && v !== undefined)
  @IsUUID()
  userId?: string | null
}
