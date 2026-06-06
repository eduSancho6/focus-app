import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { AreasService } from './areas.service';

@Controller('areas')
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Get()
  findAll() {
    const userId = 'eduSancho6';
    return this.areasService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const userId = 'eduSancho6';
    return this.areasService.findOne(id, userId);
  }

  @Post()
  create(@Body('name') name: string) {
    const userId = 'eduSancho6';
    return this.areasService.create(name, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('name') name: string) {
    const userId = 'eduSancho6';
    return this.areasService.update(id, name, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const userId = 'eduSancho6';
    return this.areasService.remove(id, userId);
  }
}
