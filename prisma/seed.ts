import { PrismaClient } from "@prisma/client"

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient
}

let prisma: PrismaClient
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient()
  }
  prisma = global.cachedPrisma
}

const db = prisma

import { faker } from '@faker-js/faker';
import { MemberRole } from '@prisma/client';

async function main() {
  const alice = await db.user.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      userToken: faker.internet.mac(),
      image: faker.image.avatarGitHub(),
      members: {
        create: {
          companyId: "d976e646-e6ef-465f-b8cf-35729119543d",
          role: MemberRole.GUEST
        }
      }
    }
  })
  
  console.log({ alice })
}

let count: number = 0;

async function runLoop() {
  while (count <= 100) {
    try {
      await main();
      await db.$disconnect();
    } catch (e) {
      console.error(e);
      await db.$disconnect();
      process.exit(1);
    }

    count++; // Increment the count variable
  }
}

runLoop();