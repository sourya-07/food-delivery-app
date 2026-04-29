const { PrismaClient } = require('@prisma/client');

// Single shared Prisma client for the whole app.
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

module.exports = prisma;
