import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskType, FocusFeedback } from '../../generated/prisma';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    description: string,
    type: TaskType,
    effortPoints?: number,
    projectId?: string,
    parentId?: string,
  ) {
    return this.prisma.task.create({
      data: {
        description,
        type,
        effortPoints: effortPoints ?? 10,
        userId,
        projectId,
        parentId,
      },
    });
  }

  async complete(taskId: string, userId: string, feedback: FocusFeedback) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.completed) {
      return { message: 'Task already completed', taskId };
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.task.update({
        where: { id: taskId },
        data: {
          completed: true,
          completedAt: new Date(),
          focusFeedback: feedback,
        },
      });

      const growthFactor = 1.002;
      const updateData: {
        scoreGlobal: number;
        scoreDiscipline?: number;
        scoreMental?: number;
      } = {
        scoreGlobal: user.scoreGlobal * growthFactor,
      };

      if (feedback === FocusFeedback.DISCIPLINE) {
        updateData.scoreDiscipline = user.scoreDiscipline * growthFactor;
      }

      if (feedback === FocusFeedback.CONCENTRATION) {
        updateData.scoreMental = user.scoreMental * growthFactor;
      }

      await tx.user.update({
        where: { id: userId },
        data: updateData,
      });

      let parentReady = false;
      if (task.parentId) {
        const incompleteSiblings = await tx.task.count({
          where: {
            parentId: task.parentId,
            completed: false,
            id: { not: taskId },
          },
        });
        parentReady = incompleteSiblings === 0;
      }

      return { taskId, parentReady };
    });
  }
}
