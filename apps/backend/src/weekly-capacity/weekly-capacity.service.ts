import { Injectable, NotFoundException } from '@nestjs/common';
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
    usedPoints?: number,
  ) {
    const capacity = await this.prisma.weeklyCapacity.findFirst({
      where: { id, userId },
    });

    if (!capacity) {
      throw new NotFoundException('Weekly capacity not found');
    }

    const data: { totalBudgetPoints?: number; usedPoints?: number } = {};
    if (totalBudgetPoints !== undefined) data.totalBudgetPoints = totalBudgetPoints;
    if (usedPoints !== undefined) data.usedPoints = usedPoints;

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
}
