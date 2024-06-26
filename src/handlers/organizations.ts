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

export const createOrganization = async (req: Request, res: Response) => {
  try {
    const organization = await prisma.organization.create({
      data: req.body,
    });
    res.json({ data: organization });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error has occurred.' });
  }
};
