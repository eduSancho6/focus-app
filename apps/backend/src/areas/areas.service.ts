import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AreasService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.area.findMany({
      where: { userId },
      include: { subareas: true },
    });
  }

  async findOne(id: string, userId: string) {
    const area = await this.prisma.area.findFirst({
      where: { id, userId },
      include: { subareas: true },
    });

    if (!area) {
      throw new NotFoundException('Area not found');
    }

    return area;
  }

  async create(name: string, userId: string) {
    return this.prisma.area.create({
      data: { name, userId },
    });
  }

  async update(id: string, name: string, userId: string) {
    const area = await this.prisma.area.findFirst({
      where: { id, userId },
    });

    if (!area) {
      throw new NotFoundException('Area not found');
    }

    return this.prisma.area.update({
      where: { id },
      data: { name },
    });
  }

  async remove(id: string, userId: string) {
    const area = await this.prisma.area.findFirst({
      where: { id, userId },
    });

    if (!area) {
      throw new NotFoundException('Area not found');
    }

    return this.prisma.area.delete({
      where: { id },
    });
  }
}
