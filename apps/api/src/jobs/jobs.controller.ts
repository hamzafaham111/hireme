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
import { Roles } from '../common/decorators/roles.decorator'
import { RolesGuard } from '../common/guards/roles.guard'
import { CreateJobDto } from './dto/create-job.dto'
import { UpdateJobDto } from './dto/update-job.dto'
import { JobsService } from './jobs.service'

@Controller('jobs')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('superadmin', 'admin', 'agent')
export class JobsController {
  constructor(private readonly jobs: JobsService) {}

  @Get()
  findAll() {
    return this.jobs.findAll()
  }

  @Get('next-code')
  nextCode() {
    return this.jobs.nextJobCode().then((code) => ({ jobId: code }))
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobs.findOne(id)
  }

  @Post()
  create(@Body() dto: CreateJobDto) {
    return this.jobs.create(dto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateJobDto) {
    return this.jobs.update(id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobs.remove(id)
  }
}
