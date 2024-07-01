import { Request, Response } from 'express';
import prisma from '../db';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { databaseResponseTimeHistogram } from '../modules/metrics';

export const getAllHacks = async (req: Request, res: Response) => {
  const metricsLabels = { operation: 'getAllHacks' };
  const timer = databaseResponseTimeHistogram.startTimer();

  try {
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

    timer({ ...metricsLabels, success: 'true' });
    res.json({ data: hacks });
  } catch (error) {
    timer({ ...metricsLabels, success: 'false' });
    res.status(500).json({
      error: 'An unexpected error has occurred.',
    });
  }
};

export const getHackById = async (req: Request, res: Response) => {
  const metricsLabels = { operation: 'getHackById' };
  const timer = databaseResponseTimeHistogram.startTimer();

  try {
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
    timer({ ...metricsLabels, success: 'true' });
    return res.json({ data: hack });
  } catch (error) {
    timer({ ...metricsLabels, success: 'false' });
    return res.status(500).json({ error: 'An unexpected error has occurred.' });
  }
};

export const createHack = async (req: Request, res: Response) => {
  const metricsLabels = { operation: 'createHack' };
  const timer = databaseResponseTimeHistogram.startTimer();

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
    timer({ ...metricsLabels, success: 'true' });
    res.json({ data: hack });
  } catch (error) {
    timer({ ...metricsLabels, success: 'false' });
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({
        message: 'This hack already exists.',
      });
    }
    res.status(500).json({
      error: 'An unexpected error has occurred.',
    });
  }
};

export const updateHack = async (req: Request, res: Response) => {
  const metricsLabels = { operation: 'updateHack' };
  const timer = databaseResponseTimeHistogram.startTimer();
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
    timer({ ...metricsLabels, success: 'true' });
    res.json({ data: hack });
  } catch (error) {
    timer({ ...metricsLabels, success: 'false' });
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return res.status(404).json({
        message: 'This hack record does not exist.',
      });
    }
    res.status(500).json({
      error: 'An unexpected error has occurred.',
    });
  }
};

export const addHackContributor = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { characterId } = req.body;
  const metricsLabels = { operation: 'addHackContributor' };
  const timer = databaseResponseTimeHistogram.startTimer();

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
    timer({ ...metricsLabels, success: 'true' });
    res.json({ data: contribution });
  } catch (error) {
    timer({ ...metricsLabels, success: 'false' });
    res.status(500).json({
      error: 'An unexpected error has occurred.',
    });
  }
};

export const deleteHack = async (req: Request, res: Response) => {
  const metricsLabels = { operation: 'deleteHack' };
  const timer = databaseResponseTimeHistogram.startTimer();

  try {
    const hack = await prisma.hack.delete({
      where: {
        id: parseInt(req.params?.id),
      },
    });
    timer({ ...metricsLabels, success: 'true' });
    res.json({ data: { hack, message: 'Hack deleted successfully.' } });
  } catch (error) {
    timer({ ...metricsLabels, success: 'false' });
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
