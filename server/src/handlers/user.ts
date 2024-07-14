import { Request, Response } from 'express';
import { compareValues, createToken, hashValue } from '../modules/auth';
import { databaseResponseTimeHistogram } from '../modules/metrics';
import prisma from '../db';

export const createUser = async (req: Request, res: Response) => {
  const metricsLabels = { operation: 'createUser' };
  const timer = databaseResponseTimeHistogram.startTimer();

  const { username } = req.body;
  try {
    const userAlreadyExists = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (userAlreadyExists) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: await hashValue(req.body.password),
      },
    });
    const accessToken = createToken(user.id, user.username);
    await prisma.token.create({
      data: {
        value: accessToken,
        userId: user.id,
      },
    });

    const sessionToken = createToken(user.id, user.username);
    res.cookie('hackers_api_session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
    timer({ ...metricsLabels, success: 'true' });
    res.json({
      data: {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    timer({ ...metricsLabels, success: 'false' });
    res.status(500).json({
      error: 'An unexpected error occurred.',
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const metricsLabels = { operation: 'login' };
  const timer = databaseResponseTimeHistogram.startTimer();

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: req.body.username,
      },
    });

    if (!user || !(await compareValues(req.body.password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const sessionToken = createToken(user.id, user.username);
    res.cookie('hackers_api_session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    timer({ ...metricsLabels, success: 'true' });
    res.json({
      data: {
        userId: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    timer({ ...metricsLabels, success: 'false' });
    res.status(500).json({
      error: 'An unexpected error has occurred.',
    });
  }
};

export const authorizeAdmin = async (req: Request, res: Response) => {
  const metricsLabels = { operation: 'authorizeAdmin' };
  const timer = databaseResponseTimeHistogram.startTimer();

  try {
    const admin = await prisma.user.update({
      where: {
        id: req.body.id,
      },
      data: {
        role: 'ADMIN',
      },
    });
    timer({ ...metricsLabels, success: 'true' });
    res.json({ data: admin });
  } catch (error) {
    timer({ ...metricsLabels, success: 'false' });
    res.status(500).json({ message: 'An unexpected error occurred.' });
  }
};
