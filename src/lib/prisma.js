import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const globalForPrisma = globalThis;

const dbUrl = process.env.DATABASE_URL || 'file:./dev.db'
const adapter = new PrismaBetterSqlite3({ url: dbUrl })

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
