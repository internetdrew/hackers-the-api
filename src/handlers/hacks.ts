import { Request, Response } from 'express';
import prisma from '../db';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const getAllHacks = async (req: Request, res: Response) => {
  const hacks = await prisma.hack.findMany({
    include: {
      associatedHackers: true,
      targetedCharacter: true,
      targetedOrganization: true,
    },
  });

  res.json({ data: hacks });
};

export const getHackById = async (req: Request, res: Response) => {
  const hack = await prisma.hack.findUnique({
    where: {
      id: parseInt(req.params?.id),
    },
    include: {
      associatedHackers: true,
      targetedCharacter: true,
      targetedOrganization: true,
    },
  });

  return res.json({ data: hack });
};

export const getHackTarget = async (req: Request, res: Response) => {
  const hack = await prisma.hack.findUnique({
    where: {
      id: parseInt(req.params?.id),
    },
    include: {
      targetedCharacter: true,
    },
  });

  return res.json({ data: hack?.targetedCharacter });
};

export const getHackHackers = async (req: Request, res: Response) => {
  const hack = await prisma.hack.findUnique({
    where: {
      id: parseInt(req.params?.id),
    },
    include: {
      associatedHackers: true,
    },
  });

  return res.json({ data: hack?.associatedHackers });
};

export const createHack = async (req: Request, res: Response) => {
  try {
    const hack = await prisma.hack.create({
      data: req.body,
    });
    res.json({ data: hack });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({
        message: 'This hack already exists.',
      });
    }
    res.status(500).json({
      error: 'An unexpected error has occurred while creating a hack.',
    });
  }
};
