import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.project.findMany({
      where: { userId },
      include: { subarea: { include: { area: true } }, tasks: true },
    });
  }

  async findOne(id: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, userId },
      include: { subarea: { include: { area: true } }, tasks: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async create(name: string, subareaId: string, userId: string) {
    const subarea = await this.prisma.subarea.findFirst({
      where: { id: subareaId, area: { userId } },
    });

    if (!subarea) {
      throw new NotFoundException('Subarea not found');
    }

    return this.prisma.project.create({
      data: { name, subareaId, userId },
    });
  }

  async update(id: string, userId: string, name?: string, completed?: boolean) {
    const project = await this.prisma.project.findFirst({
      where: { id, userId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const data: { name?: string; completed?: boolean } = {};
    if (name !== undefined) data.name = name;
    if (completed !== undefined) data.completed = completed;

    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, userId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return this.prisma.project.delete({
      where: { id },
    });
  }
}
