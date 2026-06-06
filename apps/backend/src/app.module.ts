import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';
import { AreasModule } from './areas/areas.module';
import { SubareasModule } from './subareas/subareas.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [PrismaModule, TasksModule, AreasModule, SubareasModule, ProjectsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
