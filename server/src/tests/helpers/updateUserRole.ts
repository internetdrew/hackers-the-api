import prisma from '../../db';
import { Role } from '@prisma/client';

export const updateUserRole = async ({
  userId,
  role,
}: {
  userId: string;
  role: Role;
}) => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role,
    },
  });
};
