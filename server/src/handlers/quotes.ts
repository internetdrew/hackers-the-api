import { Request, Response } from 'express';
import prisma from '../db';

export const getAllQuotes = async (req: Request, res: Response) => {
  const quotes = await prisma.quote.findMany();
  res.json({ data: quotes });
};

export const getQuoteById = async (req: Request, res: Response) => {
  const quote = await prisma.quote.findUnique({
    where: {
      id: parseInt(req.params?.id),
    },
  });
  return res.json({ data: quote });
};
