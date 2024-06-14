import { Request, Response } from 'express';
import prisma from '../db';

export const getAllOrganizations = async (req: Request, res: Response) => {
  const organizations = await prisma.organization.findMany();
  res.json({ data: organizations });
};

export const getOrganizationById = async (req: Request, res: Response) => {
  const organization = await prisma.organization.findUnique({
    where: {
      id: parseInt(req.params?.id),
    },
  });
  return res.json({ data: organization });
};
