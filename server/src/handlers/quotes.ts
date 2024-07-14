import { Request, Response } from 'express';
import prisma from '../db';
import { databaseResponseTimeHistogram } from '../modules/metrics';

export const getAllQuotes = async (req: Request, res: Response) => {
  const metricsLabels = { operation: 'getAllQuotes' };
  const timer = databaseResponseTimeHistogram.startTimer();

  try {
    const quotes = await prisma.quote.findMany();
    timer({ ...metricsLabels, success: 'true' });
    res.json({ data: quotes });
  } catch (error) {
    timer({ ...metricsLabels, success: 'false' });
    res.status(500).json({
      error: 'An unexpected error has occurred while deleting an organization.',
    });
  }
};

export const getQuoteById = async (req: Request, res: Response) => {
  const metricsLabels = { operation: 'getQuoteById' };
  const timer = databaseResponseTimeHistogram.startTimer();

  try {
    const quote = await prisma.quote.findUnique({
      where: {
        id: parseInt(req.params?.id),
      },
    });
    timer({ ...metricsLabels, success: 'true' });
    return res.json({ data: quote });
  } catch (error) {
    timer({ ...metricsLabels, success: 'false' });
    res.status(500).json({
      error: 'An unexpected error has occurred while deleting an organization.',
    });
  }
};
