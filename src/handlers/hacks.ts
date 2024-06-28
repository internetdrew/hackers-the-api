import { Request, Response } from 'express';
import prisma from '../db';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const getAllHacks = async (req: Request, res: Response) => {
  const hacks = await prisma.hack.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      targetCharacterId: false,
      targetOrganizationId: false,
      contributors: {
        select: {
          character: true,
        },
      },
      targetCharacter: true,
      targetOrganization: true,
    },
  });

  res.json({ data: hacks });
};

export const getHackById = async (req: Request, res: Response) => {
  const hack = await prisma.hack.findUnique({
    where: {
      id: parseInt(req.params?.id),
    },
    select: {
      id: true,
      title: true,
      description: true,
      targetCharacterId: false,
      targetOrganizationId: false,
      contributors: {
        select: {
          character: true,
        },
      },
      targetCharacter: true,
      targetOrganization: true,
    },
  });

  if (!hack) {
    return res.status(404).json({
      data: { message: 'This hack does not exist.' },
    });
  }

  return res.json({ data: hack });
};

export const createHack = async (req: Request, res: Response) => {
  try {
    const hack = await prisma.hack.create({
      data: req.body,
      select: {
        id: true,
        title: true,
        description: true,
        targetCharacterId: false,
        targetOrganizationId: false,
        contributors: {
          select: {
            character: true,
          },
        },
        targetCharacter: true,
        targetOrganization: true,
      },
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
      select: {
        id: true,
        title: true,
        description: true,
        targetCharacterId: false,
        targetOrganizationId: false,
        contributors: {
          select: {
            character: true,
          },
        },
        targetCharacter: true,
        targetOrganization: true,
      },
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

export const addHackContributor = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { characterId } = req.body;

  try {
    const hack = await prisma.hack.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        id: true,
        title: true,
        description: true,
        targetCharacterId: false,
        targetOrganizationId: false,
        contributors: {
          select: {
            character: true,
          },
        },
        targetCharacter: true,
        targetOrganization: true,
      },
    });

    if (!hack) {
      return res.status(404).json({
        message: 'This hack record does not exist.',
      });
    }

    const character = await prisma.character.findUnique({
      where: {
        id: parseInt(characterId),
      },
    });

    if (!character) {
      return res.status(404).json({
        message: 'This character record does not exist.',
      });
    }

    const contribution = await prisma.hackContribution.create({
      data: {
        hackId: parseInt(id),
        characterId: parseInt(characterId),
      },
      select: {
        characterId: false,
        hackId: false,
        character: true,
        hack: true,
      },
    });
    res.json({ data: contribution });
  } catch (error) {
    res.status(500).json({
      error: 'An unexpected error has occurred while adding a contributor.',
    });
  }
};

export const deleteHack = async (req: Request, res: Response) => {
  try {
    const hack = await prisma.hack.delete({
      where: {
        id: parseInt(req.params?.id),
      },
    });
    res.json({ data: { hack, message: 'Hack deleted successfully.' } });
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
      error: 'An unexpected error has occurred while deleting a hack.',
    });
  }
};
