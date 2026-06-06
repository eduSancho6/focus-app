import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';
import { AreasModule } from './areas/areas.module';
import { SubareasModule } from './subareas/subareas.module';
import { ProjectsModule } from './projects/projects.module';
import { HabitsModule } from './habits/habits.module';
import { WeeklyCapacityModule } from './weekly-capacity/weekly-capacity.module';

@Module({
  imports: [PrismaModule, TasksModule, AreasModule, SubareasModule, ProjectsModule, HabitsModule, WeeklyCapacityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
