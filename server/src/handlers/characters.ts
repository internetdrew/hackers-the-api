import { Request, Response } from 'express';
import prisma from '../db';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { databaseResponseTimeHistogram } from '../modules/metrics';

export const getAllCharacters = async (_req: Request, res: Response) => {
  const metricsLabels = { operation: 'getAllCharacters' };
  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const characters = await prisma.character.findMany({
      include: {
        quotes: true,
        hackContributions: true,
        hacksTargetedBy: true,
      },
    });
    timer({ ...metricsLabels, success: 'true' });
    return res.json({ data: characters });
  } catch (error) {
    timer({ ...metricsLabels, success: 'false' });
    return res.status(500).json({ error: 'An unexpected error has occurred.' });
  }
};

export const getCharacterById = async (req: Request, res: Response) => {
  const metricsLabels = { operation: 'getCharacterById' };
  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const character = await prisma.character.findUnique({
      where: {
        id: parseInt(req.params?.id),
      },
      include: {
        quotes: true,
        hackContributions: true,
        hacksTargetedBy: true,
      },
    });
    timer({ ...metricsLabels, success: 'true' });
    return res.json({ data: character });
  } catch (error) {
    timer({ ...metricsLabels, success: 'false' });
    res.status(500).json({ error: 'An unexpected error has occurred.' });
  }
};

export const getCharacterQuotes = async (req: Request, res: Response) => {
  const metricsLabels = { operation: 'getCharacterQuotes' };
  const timer = databaseResponseTimeHistogram.startTimer();

  try {
    const quotes = await prisma.quote.findMany({
      where: {
        characterId: parseInt(req.params?.id),
      },
    });
    timer({ ...metricsLabels, success: 'true' });
    res.json({ data: quotes });
  } catch (error) {
    timer({ ...metricsLabels, success: 'false' });
    res.status(500).json({ error: 'An unexpected error has occurred.' });
  }
};

export const getCharacterHacks = async (req: Request, res: Response) => {
  const metricsLabels = { operation: 'getCharacterHacks' };
  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const hacker = await prisma.character.findUnique({
      where: {
        id: parseInt(req.params?.id),
      },
      include: {
        hackContributions: true,
      },
    });

    timer({ ...metricsLabels, success: 'true' });
    return res.json({ data: hacker?.hackContributions });
  } catch (error) {
    timer({ ...metricsLabels, success: 'false' });
    res.status(500).json({ error: 'An unexpected error has occurred.' });
  }
};

export const createCharacter = async (req: Request, res: Response) => {
  const metricsLabels = { operation: 'createCharacter' };
  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const character = await prisma.character.create({
      data: req.body,
    });
    timer({ ...metricsLabels, success: 'true' });
    res.json({ data: character });
  } catch (error) {
    timer({ ...metricsLabels, success: 'false' });
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      res
        .status(409)
        .json({ error: 'A character with this name already exists.' });
    } else {
      res.status(500).json({ error: 'An unexpected error has occurred.' });
    }
  }
};

export const updateCharacter = async (req: Request, res: Response) => {
  const metricsLabels = { operation: 'updateCharacter' };
  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const character = await prisma.character.update({
      where: {
        id: parseInt(req.params?.id),
      },
      data: req.body,
    });
    timer({ ...metricsLabels, success: 'true' });
    res.json({ data: character });
  } catch (error) {
    timer({ ...metricsLabels, success: 'false' });
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return res.status(404).json({
        message: 'Character not found.',
      });
    } else {
      res.status(500).json({
        error: 'An unexpected error has occurred.',
      });
    }
  }
};

export const deleteCharacter = async (req: Request, res: Response) => {
  const metricsLabels = { operation: 'deleteCharacter' };
  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    await prisma.character.delete({
      where: {
        id: parseInt(req.params?.id),
      },
    });
    timer({ ...metricsLabels, success: 'true' });
    res.json({ message: 'Character deleted.' });
  } catch (error) {
    timer({ ...metricsLabels, success: 'false' });
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      return res.status(404).json({
        message: 'Character not found.',
      });
    } else {
      res.status(500).json({
        error: 'An unexpected error has occurred.',
      });
    }
  }
};
