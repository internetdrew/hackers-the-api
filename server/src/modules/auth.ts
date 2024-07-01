import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Response } from 'express';

export const comparePasswords = (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
};

export const createJWT = (
  userId: string,
  username: string,
  type: 'access' | 'refresh'
): string => {
  const secret = process.env.JWT_SECRET as string;
  const userDataPayload = { id: userId, username };

  const token = jwt.sign(userDataPayload, secret, {
    expiresIn: type === 'access' ? '15m' : '1y',
  });
  return token;
};

export const addTokenToResponseCookies = (
  res: Response,
  tokenType: 'access' | 'refresh',
  token: string
) => {
  tokenType === 'access'
    ? res.cookie('accessToken', token, {
        maxAge: 900000,
        httpOnly: true,
        domain: 'localhost',
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      })
    : res.cookie('refreshToken', token, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        domain: 'localhost',
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });
};
