import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { WeeklyCapacityService } from './weekly-capacity.service';

@Controller('weekly-capacity')
export class WeeklyCapacityController {
  constructor(private readonly weeklyCapacityService: WeeklyCapacityService) {}

  @Get()
  findAll(
    @Query('weekNumber') weekNumber?: string,
    @Query('year') year?: string,
  ) {
    const userId = 'eduSancho6';
    return this.weeklyCapacityService.findAll(
      userId,
      weekNumber ? parseInt(weekNumber, 10) : undefined,
      year ? parseInt(year, 10) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const userId = 'eduSancho6';
    return this.weeklyCapacityService.findOne(id, userId);
  }

  @Post()
  create(
    @Body('weekNumber') weekNumber: number,
    @Body('year') year: number,
    @Body('totalBudgetPoints') totalBudgetPoints?: number,
  ) {
    const userId = 'eduSancho6';
    return this.weeklyCapacityService.create(userId, weekNumber, year, totalBudgetPoints);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body('totalBudgetPoints') totalBudgetPoints?: number,
    @Body('usedPoints') usedPoints?: number,
  ) {
    const userId = 'eduSancho6';
    return this.weeklyCapacityService.update(id, userId, totalBudgetPoints, usedPoints);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const userId = 'eduSancho6';
    return this.weeklyCapacityService.remove(id, userId);
  }
}
