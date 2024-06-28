import prisma from '../../db';
import { beforeEach } from 'vitest';

beforeEach(async () => {
  await prisma.$transaction([
    prisma.hackContribution.deleteMany(),
    prisma.user.deleteMany(),
    prisma.character.deleteMany(),
    prisma.hack.deleteMany(),
    prisma.organization.deleteMany(),
    prisma.quote.deleteMany(),
  ]);
});
