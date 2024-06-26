import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';

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
