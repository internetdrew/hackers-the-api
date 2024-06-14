import { Request, Response } from 'express';
import prisma from '../db';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const getAllCharacters = async (req: Request, res: Response) => {
  const characters = await prisma.character.findMany({
    include: {
      quotes: true,
      hacksAsHacker: true,
      hacksAsTarget: true,
    },
  });
  res.json({ data: characters });
};

export const getCharacterById = async (req: Request, res: Response) => {
  const character = await prisma.character.findUnique({
    where: {
      id: parseInt(req.params?.id),
    },
    include: {
      quotes: true,
      hacksAsHacker: true,
      hacksAsTarget: true,
    },
  });
  return res.json({ data: character });
};

export const getCharacterQuotes = async (req: Request, res: Response) => {
  const quotes = await prisma.quote.findMany({
    where: {
      characterId: parseInt(req.params?.id),
    },
  });
  res.json({ data: quotes });
};

export const createCharacter = async (req: Request, res: Response) => {
  try {
    const character = await prisma.character.create({
      data: req.body,
    });
    res.json({ data: character });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      res
        .status(400)
        .json({ error: 'A character with this name already exists.' });
    } else {
      res.status(500).json({ error: 'An unexpected error has occurred.' });
    }
  }
};
