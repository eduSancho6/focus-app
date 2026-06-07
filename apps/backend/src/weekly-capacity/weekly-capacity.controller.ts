import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { WeeklyCapacityService } from './weekly-capacity.service';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('weekly-capacity')
export class WeeklyCapacityController {
  constructor(private readonly weeklyCapacityService: WeeklyCapacityService) {}

  @Get()
  findAll(
    @CurrentUser() userId: string,
    @Query('weekNumber') weekNumber?: string,
    @Query('year') year?: string,
  ) {
    return this.weeklyCapacityService.findAll(
      userId,
      weekNumber ? parseInt(weekNumber, 10) : undefined,
      year ? parseInt(year, 10) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.weeklyCapacityService.findOne(id, userId);
  }

  @Post()
  create(
    @CurrentUser() userId: string,
    @Body('weekNumber') weekNumber: number,
    @Body('year') year: number,
    @Body('totalBudgetPoints') totalBudgetPoints?: number,
  ) {
    return this.weeklyCapacityService.create(userId, weekNumber, year, totalBudgetPoints);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() userId: string,
    @Body('totalBudgetPoints') totalBudgetPoints?: number,
  ) {
    return this.weeklyCapacityService.update(id, userId, totalBudgetPoints);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.weeklyCapacityService.remove(id, userId);
  }
}
