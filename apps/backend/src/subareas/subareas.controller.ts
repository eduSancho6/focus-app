import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { SubareasService } from './subareas.service';

@Controller('subareas')
export class SubareasController {
  constructor(private readonly subareasService: SubareasService) {}

  @Get()
  findAll() {
    const userId = 'eduSancho6';
    return this.subareasService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const userId = 'eduSancho6';
    return this.subareasService.findOne(id, userId);
  }

  @Post()
  create(@Body('name') name: string, @Body('areaId') areaId: string) {
    const userId = 'eduSancho6';
    return this.subareasService.create(name, areaId, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('name') name: string) {
    const userId = 'eduSancho6';
    return this.subareasService.update(id, name, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const userId = 'eduSancho6';
    return this.subareasService.remove(id, userId);
  }
}
