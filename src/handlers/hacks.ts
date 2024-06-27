import { Request, Response } from 'express';
import prisma from '../db';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const getAllHacks = async (req: Request, res: Response) => {
  const hacks = await prisma.hack.findMany({
    include: {
      contributingHackers: true,
      targetedCharacters: true,
      targetedOrganizations: true,
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
      contributingHackers: true,
      targetedCharacters: true,
      targetedOrganizations: true,
    },
  });

  return res.json({ data: hack });
};

export const getHackTargets = async (req: Request, res: Response) => {
  const targetedOrganizations = await prisma.hackTargetOrganization.findMany({
    where: {
      hackId: parseInt(req.params?.id),
    },
    include: {
      organization: true,
    },
  });

  const targetedCharacters = await prisma.hackTargetCharacter.findMany({
    where: {
      hackId: parseInt(req.params?.id),
    },
    include: {
      character: true,
    },
  });

  return res.json({
    data: {
      targetedOrganizations,
      targetedCharacters,
    },
  });
};

export const getHackHackers = async (req: Request, res: Response) => {
  const hackContributors = await prisma.hackContributor.findMany({
    where: {
      hackId: parseInt(req.params?.id),
    },
    include: {
      character: true,
    },
  });
  return res.json({ data: hackContributors });
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

export const updateHack = async (req: Request, res: Response) => {
  try {
    const hack = await prisma.hack.update({
      where: {
        id: parseInt(req.params?.id),
      },
      data: req.body,
    });
    res.json({ data: hack });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return res.status(404).json({
        message: 'This hack record does not exist.',
      });
    }
    res.status(500).json({
      error: 'An unexpected error has occurred while updating a hack.',
    });
  }
};
