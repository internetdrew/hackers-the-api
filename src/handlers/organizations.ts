import { Request, Response } from 'express';
import prisma from '../db';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
    res.status(500).json({
      error: 'An unexpected error has occurred while creating an organization.',
    });
  }
};

export const updateOrganization = async (req: Request, res: Response) => {
  try {
    const organization = await prisma.organization.update({
      where: {
        id: parseInt(req.params?.id),
      },
      data: req.body,
    });
    res.json({ data: organization });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return res.status(404).json({
        message: 'Organization not found.',
      });
    }
    res.status(500).json({
      error: 'An unexpected error has occurred while updating an organization.',
    });
  }
};
