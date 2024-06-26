import prisma from '../../db';
import { beforeEach } from 'vitest';

beforeEach(async () => {
  await prisma.$transaction([
    prisma.user.deleteMany(),
    prisma.character.deleteMany(),
    prisma.organization.deleteMany(),
    prisma.hack.deleteMany(),
  ]);
});
