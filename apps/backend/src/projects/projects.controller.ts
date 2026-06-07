import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  findAll(@CurrentUser() userId: string) {
    return this.projectsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.projectsService.findOne(id, userId);
  }

  @Post()
  create(@Body('name') name: string, @Body('subareaId') subareaId: string, @CurrentUser() userId: string) {
    return this.projectsService.create(name, subareaId, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() userId: string,
    @Body('name') name?: string,
    @Body('completed') completed?: boolean,
  ) {
    return this.projectsService.update(id, userId, name, completed);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.projectsService.remove(id, userId);
  }
}
