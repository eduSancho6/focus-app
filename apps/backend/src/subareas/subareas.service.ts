import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubareasService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.subarea.findMany({
      where: { area: { userId } },
      include: { area: true, projects: true },
    });
  }

  async findOne(id: string, userId: string) {
    const subarea = await this.prisma.subarea.findFirst({
      where: { id, area: { userId } },
      include: { area: true, projects: true },
    });

    if (!subarea) {
      throw new NotFoundException('Subarea not found');
    }

    return subarea;
  }

  async create(name: string, areaId: string, userId: string) {
    const area = await this.prisma.area.findFirst({
      where: { id: areaId, userId },
    });

    if (!area) {
      throw new NotFoundException('Area not found');
    }

    return this.prisma.subarea.create({
      data: { name, areaId },
    });
  }

  async update(id: string, name: string, userId: string) {
    const subarea = await this.prisma.subarea.findFirst({
      where: { id, area: { userId } },
    });

    if (!subarea) {
      throw new NotFoundException('Subarea not found');
    }

    return this.prisma.subarea.update({
      where: { id },
      data: { name },
    });
  }

  async remove(id: string, userId: string) {
    const subarea = await this.prisma.subarea.findFirst({
      where: { id, area: { userId } },
    });

    if (!subarea) {
      throw new NotFoundException('Subarea not found');
    }

    return this.prisma.subarea.delete({
      where: { id },
    });
  }
}
