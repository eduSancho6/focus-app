import { Controller, Post, Body, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskType, FocusFeedback } from '../../generated/prisma';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  createTask(
    @Body('description') description: string,
    @Body('type') type: TaskType,
    @Body('effortPoints') effortPoints?: number,
    @Body('projectId') projectId?: string,
    @Body('parentId') parentId?: string,
  ) {
    const userId = 'edu-test-123';
    return this.tasksService.create(userId, description, type, effortPoints, projectId, parentId);
  }

  @Post(':id/complete')
  completeTask(
    @Param('id') id: string,
    @Body('feedback') feedback: FocusFeedback,
  ) {
    const userId = 'edu-test-123';
    return this.tasksService.complete(id, userId, feedback);
  }
}
