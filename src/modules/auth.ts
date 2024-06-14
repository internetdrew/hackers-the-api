import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { processEnv } from '..';
import { User } from '@prisma/client';

export interface AuthedRequest extends Request {
  user: string | JwtPayload;
}

export const comparePasswords = (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10);
};

export const createJWT = (user: User) => {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    processEnv.JWT_SECRET
  );
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
    const user = jwt.verify(token, processEnv.JWT_SECRET);
    (req as AuthedRequest).user = user;
    next();
  } catch (e) {
    res.status(401);
    res.json({ message: 'Invalid token.' });
    return;
  }
};
