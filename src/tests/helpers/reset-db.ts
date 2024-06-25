import prisma from '../../db';

export default async () => {
  await prisma.$transaction([
    prisma.user.deleteMany(),
    prisma.character.deleteMany(),
  ]);
};
