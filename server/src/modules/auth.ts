import bcrypt from 'bcrypt';
import prisma from '../db';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';

interface AuthedPayload extends JwtPayload {
  id: string;
  username: string;
}

export const compareValues = (value1: string, value2: string) => {
  return bcrypt.compare(value1, value2);
};

export const hashValue = async (value: string) => {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(value, salt);
};

export const createToken = (userId: string, username: string) => {
  const secret = process.env.JWT_SECRET as string;
  const userDataPayload = { id: userId, username };

  const token = jwt.sign(userDataPayload, secret);
  return token;
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const sessionToken = req.cookies['hackers_api_session_token'];
  if (!sessionToken) {
    return res.status(200).json({ message: 'No user found.' });
  }

  const user = jwt.verify(sessionToken, process.env.JWT_SECRET as string);
  const userId = (user as AuthedPayload).id;

  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        token: true,
      },
    });
    res.json({
      username: currentUser?.username,
      accessToken: currentUser?.token?.value,
    });
  } catch (e) {
    res.status(404).json({ message: 'Something went wrong.' });
  }
};
