import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll() {
    const userId = 'eduSancho6';
    return this.projectsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const userId = 'eduSancho6';
    return this.projectsService.findOne(id, userId);
  }

  @Post()
  create(@Body('name') name: string, @Body('subareaId') subareaId: string) {
    const userId = 'eduSancho6';
    return this.projectsService.create(name, subareaId, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body('name') name?: string,
    @Body('completed') completed?: boolean,
  ) {
    const userId = 'eduSancho6';
    return this.projectsService.update(id, userId, name, completed);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const userId = 'eduSancho6';
    return this.projectsService.remove(id, userId);
  }
}
