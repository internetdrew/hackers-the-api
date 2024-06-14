import { Request, Response } from 'express';
import prisma from '../db';

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
