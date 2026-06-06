import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

jest.mock('@prisma/adapter-pg', () => ({
  PrismaPg: function () {
    this.provider = 'postgres';
    this.adapterName = '@prisma/adapter-pg';
  },
}));

jest.mock('pg', () => ({
  Pool: function () {},
}));

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    process.env['DATABASE_URL'] = 'postgresql://localhost:5432/test';

    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
