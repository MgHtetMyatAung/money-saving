import { PrismaClient } from "@prisma/client";

let prisma;

const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Check if we're in development and using the global object to reuse the Prisma instance
if (typeof global.prisma === "undefined") {
  prisma = prismaClientSingleton();
  if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
  }
} else {
  prisma = global.prisma;
}

export default prisma;
