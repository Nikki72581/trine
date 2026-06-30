import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function makeClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.PRISMA_DATABASE_URL!,
    // Vercel Prisma Postgres uses a self-signed cert at db.prisma.io;
    // remove this line if you switch to a database with a CA-verified cert.
    ssl: { rejectUnauthorized: false },
  });
  return new PrismaClient({ adapter });
}

// Prevent multiple PrismaClient instances during Next.js hot reloads in dev.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? makeClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
