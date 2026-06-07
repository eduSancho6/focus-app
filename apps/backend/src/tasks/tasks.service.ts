import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskType, FocusFeedback } from '@prisma/client';

function getCurrentISOWeek(): { weekNumber: number; year: number } {
  const now = new Date();
  const temp = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const dayNum = temp.getUTCDay() || 7;
  temp.setUTCDate(temp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil(((temp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return { weekNumber, year: temp.getUTCFullYear() };
}

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.task.findMany({
      where: { userId },
      include: { subtasks: true },
    });
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
      include: { subtasks: true },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async create(
    userId: string,
    description: string,
    type: TaskType,
    effortPoints?: number,
    projectId?: string,
    parentId?: string,
    areaId?: string,
  ) {
    const finalEffortPoints = effortPoints ?? 10;

    let resolvedAreaId: string | null = null;
    if (areaId) {
      resolvedAreaId = areaId;
    } else if (projectId) {
      const project = await this.prisma.project.findUnique({
        where: { id: projectId },
        include: { subarea: { select: { areaId: true } } },
      });
      resolvedAreaId = project?.subarea?.areaId ?? null;
    }

    if (resolvedAreaId && finalEffortPoints > 0) {
      const { weekNumber, year } = getCurrentISOWeek();

      const weeklyCapacity = await this.prisma.weeklyCapacity.findUnique({
        where: {
          weekNumber_year_userId: { weekNumber, year, userId },
        },
      });

      if (weeklyCapacity) {
        const areaBudget = await this.prisma.areaBudget.findUnique({
          where: {
            areaId_weeklyCapacityId: {
              areaId: resolvedAreaId,
              weeklyCapacityId: weeklyCapacity.id,
            },
          },
        });

        if (areaBudget) {
          if (areaBudget.usedPoints + finalEffortPoints > areaBudget.allocatedPoints) {
            throw new BadRequestException(
              'Energy capacity exceeded for this Area. Consider reallocating your weekly points or postponing this task.',
            );
          }

          return this.prisma.$transaction(async (tx) => {
            await tx.areaBudget.update({
              where: { id: areaBudget.id },
              data: { usedPoints: { increment: finalEffortPoints } },
            });

            return tx.task.create({
              data: {
                description,
                type,
                effortPoints: finalEffortPoints,
                userId,
                projectId,
                parentId,
                areaId: resolvedAreaId,
              },
            });
          });
        }
      }
    }

    return this.prisma.task.create({
      data: {
        description,
        type,
        effortPoints: finalEffortPoints,
        userId,
        projectId,
        parentId,
        areaId: resolvedAreaId ?? undefined,
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
