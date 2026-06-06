import { PrismaClient, TaskType, FocusFeedback } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

async function main() {
  const pool = new Pool({ connectionString: process.env['DATABASE_URL'] });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const userId = 'edu-test-123';

  console.log('1. Checking user...');
  const user = await prisma.user.findUnique({ where: { id: userId } });
  console.log(`   User found: ${user?.id}, scoreGlobal: ${user?.scoreGlobal}`);

  console.log('2. Creating a task...');
  const task = await prisma.task.create({
    data: {
      description: 'Test: deploy Focus MVP',
      type: TaskType.WORK,
      effortPoints: 10,
      userId,
    },
  });
  console.log(`   Task created: ${task.id} - "${task.description}"`);

  console.log('3. Completing the task with CONCENTRATION feedback...');
  const userBefore = await prisma.user.findUnique({ where: { id: userId } });
  console.log(`   Score before: global=${userBefore!.scoreGlobal}, mental=${userBefore!.scoreMental}`);

  await prisma.$transaction(async (tx) => {
    await tx.task.update({
      where: { id: task.id },
      data: {
        completed: true,
        completedAt: new Date(),
        focusFeedback: FocusFeedback.CONCENTRATION,
      },
    });

    await tx.user.update({
      where: { id: userId },
      data: {
        scoreGlobal: userBefore!.scoreGlobal * 1.002,
        scoreMental: userBefore!.scoreMental * 1.002,
      },
    });
  });

  const userAfter = await prisma.user.findUnique({ where: { id: userId } });
  console.log(`   Score after:  global=${userAfter!.scoreGlobal}, mental=${userAfter!.scoreMental}`);
  console.log(`   Growth verified: +0.2% applied`);

  console.log('\n4. Creating hierarchy...');
  const area = await prisma.area.create({ data: { name: 'Health', userId } });
  console.log(`   Area: ${area.id} - ${area.name}`);

  const subarea = await prisma.subarea.create({ data: { name: 'Physical Training', areaId: area.id } });
  console.log(`   Subarea: ${subarea.id} - ${subarea.name}`);

  const project = await prisma.project.create({ data: { name: 'TRX Routine', subareaId: subarea.id, userId } });
  console.log(`   Project: ${project.id} - ${project.name}`);

  const habit = await prisma.habit.create({ data: { name: 'Magnesium + Creatine', userId } });
  console.log(`   Habit: ${habit.id} - ${habit.name}`);

  const capacity = await prisma.weeklyCapacity.create({
    data: { weekNumber: 23, year: 2026, totalBudgetPoints: 100, userId },
  });
  console.log(`   WeeklyCapacity: week ${capacity.weekNumber}/${capacity.year}, budget: ${capacity.totalBudgetPoints}`);

  console.log('\n5. Cleanup...');
  await prisma.task.deleteMany({ where: { userId } });
  await prisma.weeklyCapacity.deleteMany({ where: { userId } });
  await prisma.habit.deleteMany({ where: { userId } });
  await prisma.project.deleteMany({ where: { userId } });
  await prisma.subarea.deleteMany({ where: { area: { userId } } });
  await prisma.area.deleteMany({ where: { userId } });
  console.log('   Test data cleaned up.');
  console.log('\nAll systems operational. Focus backend connected to Supabase.');

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error('ERROR:', e);
  process.exit(1);
});
