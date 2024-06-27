import prisma from '../../db';
import { Role } from '@prisma/client';

const makeUserRole = async ({
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

export default makeUserRole;
