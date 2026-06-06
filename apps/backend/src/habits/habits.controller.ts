import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { HabitsService } from './habits.service';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  findAll() {
    const userId = 'eduSancho6';
    return this.habitsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const userId = 'eduSancho6';
    return this.habitsService.findOne(id, userId);
  }

  @Post()
  create(@Body('name') name: string) {
    const userId = 'eduSancho6';
    return this.habitsService.create(name, userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('name') name: string) {
    const userId = 'eduSancho6';
    return this.habitsService.update(id, name, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const userId = 'eduSancho6';
    return this.habitsService.remove(id, userId);
  }
}
