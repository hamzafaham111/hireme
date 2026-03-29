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
import { CreateWorkerDto } from './dto/create-worker.dto'
import { UpdateWorkerDto } from './dto/update-worker.dto'
import { WorkersService } from './workers.service'

@Controller('workers')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('superadmin', 'admin', 'agent')
export class WorkersController {
  constructor(private readonly workers: WorkersService) {}

  @Get()
  findAll() {
    return this.workers.findAll()
  }

  @Get('next-code')
  nextCode() {
    return this.workers.nextWorkerCode().then((code) => ({ workerId: code }))
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workers.findOne(id)
  }

  @Post()
  create(@Body() dto: CreateWorkerDto) {
    return this.workers.create(dto)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWorkerDto) {
    return this.workers.update(id, dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workers.remove(id)
  }
}
