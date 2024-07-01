import { Request, Response } from 'express';
import { comparePasswords, createJWT, hashPassword } from '../modules/auth';
import prisma from '../db';

export const createUser = async (req: Request, res: Response) => {
  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  });
  if (userAlreadyExists) {
    res.status(409);
    res.json({ message: 'User already exists.' });
    return;
  }

  const user = await prisma.user.create({
    data: {
      username: req.body.username,
      password: await hashPassword(req.body.password),
    },
  });
  const accessToken = createJWT(user.id, user.username, 'access');
  const refreshToken = createJWT(user.id, user.username, 'refresh');

  res.cookie('accessToken', accessToken, {
    maxAge: 900000,
    httpOnly: true,
    domain: 'localhost',
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });
  res.cookie('refreshToken', refreshToken, {
    maxAge: 365 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    domain: 'localhost',
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });
  res.json({
    data: {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      accessToken,
      refreshToken,
    },
  });
};

export const login = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  });

  if (!user || !(await comparePasswords(req.body.password, user.password))) {
    res.status(401);
    res.json({ message: 'Invalid credentials.' });
    return;
  }

  const accessToken = createJWT(user.id, user.username, 'access');
  const refreshToken = createJWT(user.id, user.username, 'refresh');
  res.json({ accessToken, refreshToken });
};

export const authorizeAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await prisma.user.update({
      where: {
        id: req.body.id,
      },
      data: {
        role: 'ADMIN',
      },
    });
    res.json({ data: admin });
  } catch (error) {
    res.status(500).json({ message: 'An unexpected error occurred.' });
  }
};
