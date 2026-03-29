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
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UsersService } from './users.service'

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @Roles('superadmin', 'admin', 'agent')
  findAll() {
    return this.users.findAll()
  }

  @Get(':id')
  @Roles('superadmin', 'admin', 'agent')
  findOne(@Param('id') id: string) {
    return this.users.findOne(id)
  }

  @Post()
  @Roles('superadmin', 'admin')
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto)
  }

  @Patch(':id')
  @Roles('superadmin', 'admin')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.users.update(id, dto)
  }

  @Delete(':id')
  @Roles('superadmin', 'admin')
  remove(@Param('id') id: string) {
    return this.users.remove(id)
  }
}
