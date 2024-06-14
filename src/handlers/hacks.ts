import { Request, Response } from 'express';
import prisma from '../db';

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
