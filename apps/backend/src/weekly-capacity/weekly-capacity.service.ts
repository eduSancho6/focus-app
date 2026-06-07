import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WeeklyCapacityService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, weekNumber?: number, year?: number) {
    const where: { userId: string; weekNumber?: number; year?: number } = { userId };

    if (weekNumber !== undefined) {
      where.weekNumber = weekNumber;
    }

    if (year !== undefined) {
      where.year = year;
    }

    return this.prisma.weeklyCapacity.findMany({
      where,
      orderBy: [{ year: 'desc' }, { weekNumber: 'desc' }],
    });
  }

  async findOne(id: string, userId: string) {
    const capacity = await this.prisma.weeklyCapacity.findFirst({
      where: { id, userId },
    });

    if (!capacity) {
      throw new NotFoundException('Weekly capacity not found');
    }

    return capacity;
  }

  async create(userId: string, weekNumber: number, year: number, totalBudgetPoints?: number) {
    return this.prisma.weeklyCapacity.create({
      data: {
        weekNumber,
        year,
        totalBudgetPoints: totalBudgetPoints ?? 100,
        userId,
      },
    });
  }

  async update(
    id: string,
    userId: string,
    totalBudgetPoints?: number,
  ) {
    const capacity = await this.prisma.weeklyCapacity.findFirst({
      where: { id, userId },
    });

    if (!capacity) {
      throw new NotFoundException('Weekly capacity not found');
    }

    const data: { totalBudgetPoints?: number } = {};
    if (totalBudgetPoints !== undefined) data.totalBudgetPoints = totalBudgetPoints;

    return this.prisma.weeklyCapacity.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string) {
    const capacity = await this.prisma.weeklyCapacity.findFirst({
      where: { id, userId },
    });

    if (!capacity) {
      throw new NotFoundException('Weekly capacity not found');
    }

    return this.prisma.weeklyCapacity.delete({
      where: { id },
    });
  }

  async initializeWeeklyBudget(
    userId: string,
    weekNumber: number,
    year: number,
    totalBudgetPoints: number,
    allocations: { areaId: string; allocatedPoints: number }[],
  ) {
    const totalAllocated = allocations.reduce((sum, a) => sum + a.allocatedPoints, 0);
    if (totalAllocated > totalBudgetPoints) {
      throw new BadRequestException('Allocated points exceed total weekly budget');
    }

    return this.prisma.$transaction(async (tx) => {
      const weeklyCapacity = await tx.weeklyCapacity.upsert({
        where: {
          weekNumber_year_userId: { weekNumber, year, userId },
        },
        create: {
          weekNumber,
          year,
          totalBudgetPoints,
          userId,
        },
        update: {
          totalBudgetPoints,
        },
      });

      const areaBudgets: { areaId: string; allocatedPoints: number; usedPoints: number; id: string; weeklyCapacityId: string }[] = [];
      for (const allocation of allocations) {
        const ab = await tx.areaBudget.upsert({
          where: {
            areaId_weeklyCapacityId: {
              areaId: allocation.areaId,
              weeklyCapacityId: weeklyCapacity.id,
            },
          },
          create: {
            allocatedPoints: allocation.allocatedPoints,
            usedPoints: 0,
            areaId: allocation.areaId,
            weeklyCapacityId: weeklyCapacity.id,
          },
          update: {
            allocatedPoints: allocation.allocatedPoints,
            usedPoints: 0,
          },
        });
        areaBudgets.push(ab);
      }

      return { weeklyCapacity, areaBudgets };
    });
  }
}
