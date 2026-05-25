import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CurrentUser, type RequestUser } from '../common/decorators/current-user.decorator'
import { CreateJobDto } from './dto/create-job.dto'
import { UpdateJobDto } from './dto/update-job.dto'
import { JobsService } from './jobs.service'

/**
 * Jobs CRUD: `admin`, `customer`, and `worker` JWTs are accepted; role rules are enforced in
 * `JobsService` (e.g. customers see only their jobs; workers use marketplace discovery).
 */
@Controller('jobs')
@UseGuards(AuthGuard('jwt'))
export class JobsController {
  constructor(private readonly jobs: JobsService) {}

  @Get()
  findAll(@CurrentUser() user: RequestUser) {
    return this.jobs.findAll(user)
  }

  @Get('next-code')
  nextCode(@CurrentUser() user: RequestUser) {
    return this.jobs.nextJobCode(user).then((code) => ({ jobId: code }))
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.jobs.findOne(id, user)
  }

  @Post()
  create(@Body() dto: CreateJobDto, @CurrentUser() user: RequestUser) {
    return this.jobs.create(dto, user)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateJobDto, @CurrentUser() user: RequestUser) {
    return this.jobs.update(id, dto, user)
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.jobs.remove(id, user)
  }
}
