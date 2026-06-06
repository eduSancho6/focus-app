import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

async function main() {
  const pool = new Pool({ connectionString: process.env['DATABASE_URL'] });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const users = await prisma.user.findMany();
  console.log('Users in database:');
  for (const u of users) {
    console.log(`  ID: ${u.id}`);
    console.log(`  Email: ${u.email}`);
    console.log(`  Global: ${u.scoreGlobal}, Discipline: ${u.scoreDiscipline}, Mental: ${u.scoreMental}`);
    console.log(`  Created: ${u.createdAt}`);
    console.log('');
  }

  await prisma.$disconnect();
  await pool.end();
}

main();
