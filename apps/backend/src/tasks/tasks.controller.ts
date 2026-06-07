import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskType, FocusFeedback } from '@prisma/client';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@CurrentUser() userId: string) {
    return this.tasksService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.tasksService.findOne(id, userId);
  }

  @Post()
  createTask(
    @CurrentUser() userId: string,
    @Body('description') description: string,
    @Body('type') type: TaskType,
    @Body('effortPoints') effortPoints?: number,
    @Body('projectId') projectId?: string,
    @Body('parentId') parentId?: string,
    @Body('areaId') areaId?: string,
  ) {
    return this.tasksService.create(userId, description, type, effortPoints, projectId, parentId, areaId);
  }

  @Post(':id/complete')
  completeTask(
    @CurrentUser() userId: string,
    @Param('id') id: string,
    @Body('feedback') feedback: FocusFeedback,
  ) {
    return this.tasksService.complete(id, userId, feedback);
  }
}
