import prisma from '../../db';

export const getUserAccessToken = async (userId: string) => {
  const token = await prisma.token.findUnique({
    where: {
      userId,
    },
    select: {
      value: true,
    },
  });
  return token?.value;
};
