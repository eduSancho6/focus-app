import { Module } from '@nestjs/common';
import { SubareasController } from './subareas.controller';
import { SubareasService } from './subareas.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SubareasController],
  providers: [SubareasService],
})
export class SubareasModule {}
