import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';
import prisma from '../db';

export interface AuthedRequest extends Request {
  user: string | JwtPayload;
}

export const comparePasswords = (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
};

export const createJWT = (user: User) => {
  const secret = process.env.JWT_SECRET as string;
  const token = jwt.sign({ id: user?.id, username: user?.username }, secret);
  return token;
};

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    res.status(401);
    res.json({ message: 'Unauthorized!' });
    return;
  }

  const [_, token] = bearer.split(' ');
  if (!token) {
    res.status(401);
    res.json({ message: 'Invalid token.' });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as AuthedRequest).user = user;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userDataOnRequest = (req as AuthedRequest).user;

  if (typeof userDataOnRequest === 'string') {
    res.status(401);
    res.json({ message: 'Not authorized.' });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: userDataOnRequest?.id },
  });

  if (user?.role !== 'ADMIN') {
    res.status(401);
    res.json({ message: 'Not authorized.' });
    return;
  }
  next();
};
