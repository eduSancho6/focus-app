import { Module } from '@nestjs/common';
import { WeeklyCapacityController } from './weekly-capacity.controller';
import { WeeklyCapacityService } from './weekly-capacity.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WeeklyCapacityController],
  providers: [WeeklyCapacityService],
})
export class WeeklyCapacityModule {}
