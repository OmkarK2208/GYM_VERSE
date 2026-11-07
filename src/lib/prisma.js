import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis;

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;

const pool =
  globalForPrisma.pgPool ||
  new pg.Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
    idleTimeoutMillis: 30000,
    max: 10,
  });

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pgPool = pool;
}
