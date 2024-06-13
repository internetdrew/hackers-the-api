import { Request, Response } from 'express';
import { comparePasswords, createJWT, hashPassword } from '../modules/auth';
import prisma from '../db';

export const createUser = async (req: Request, res: Response) => {
  const user = await prisma.user.create({
    data: {
      username: req.body.username,
      password: await hashPassword(req.body.password),
    },
  });

  const token = createJWT(user);
  res.json({ token });
};

export const login = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  });

  const valid = await comparePasswords(req.body.password, user!.password);

  if (!valid) {
    res.status(401);
    res.json({ message: 'Invalid credentials.' });
    return;
  }

  const token = createJWT(user!);
  res.json({ token });
};
