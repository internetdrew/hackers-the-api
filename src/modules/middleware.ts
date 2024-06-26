import { SkillLevel } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import prisma from '../db';

export interface AuthedRequest extends Request {
  user: string | JwtPayload;
}

export const validateUserInputs = [
  body('username').trim().notEmpty().isString().escape(),
  body('password').trim().notEmpty().isString().escape(),
];

export const validateCharacterCreationInputs = [
  body('name').trim().notEmpty().isString().escape(),
  body('knownAliases').isArray(),
  body('imageUrl').isURL(),
  body('bio').trim().notEmpty().isString().escape(),
  body('skillLevel').custom(value => {
    if (!Object.values(SkillLevel).includes(value)) {
      throw new Error('Invalid skill level.');
    }
    return true;
  }),
];

export const validateOrganizationCreationInputs = [
  body('name').trim().notEmpty().isString().escape(),
  body('description').trim().notEmpty().isString().escape(),
  body('imageUrl').isURL(),
];

export const validateHackCreationInputs = [
  body('title').trim().notEmpty().isString().escape(),
  body('description').trim().notEmpty().isString().escape(),
  body('characterTargetId').optional().isInt(),
  body('organizationTargetId').optional().isInt(),
  body().custom((_, { req }) => {
    if (!req.body.characterTargetId && !req.body.organizationTargetId) {
      throw new Error(
        'Either characterTargetId or organizationTargetId must be provided on a hack.'
      );
    }
    return true;
  }),
];

export const handleInputErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }
  next();
};

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});

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
    where: {
      id: userDataOnRequest.id,
    },
  });

  if (user?.role !== 'ADMIN') {
    res.status(401).json({ message: 'Not authorized.' });
    return;
  }
  next();
};
