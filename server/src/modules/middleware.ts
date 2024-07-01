import { SkillLevel } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import prisma from '../db';
import { addTokenToResponseCookies, createJWT } from './auth';

interface verifiedJwtPayload extends JwtPayload {
  id: string;
  username: string;
}

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
  body('targetCharacterId').isInt().optional(),
  body('targetOrganizationId').isInt().optional(),
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.targetCharacterId && !req.body.targetOrganizationId) {
      return res.status(400).json({
        message: 'Must provide a targetCharacterId or targetOrganizationId.',
      });
    }
    next();
  },
];

export const validateHackContributorInput = [
  body('characterId').isInt(),
  body('hackId').isInt(),
];

export const validateHackTargetCreationInputs = [
  body('hackId').isInt(),
  body('characterId').optional().isInt(),
  body('organizationId').optional().isInt(),
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.characterId && !req.body.organizationId) {
      return res
        .status(400)
        .json({ message: 'Must provide a characterId or organizationId.' });
    }
    next();
  },
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
    return res.status(401).json({ message: 'Unauthorized!' });
  }

  const [_, token] = bearer.split(' ');
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as AuthedRequest).user = user;
    next();
  } catch (e: any) {
    if (e.name === 'TokenExpiredError') {
      const refreshTokenOnRequest = req.cookies['refreshToken'];
      if (!refreshTokenOnRequest) {
        return res.status(401).json({ message: 'Unauthorized!' });
      }

      try {
        const userData = jwt.verify(
          refreshTokenOnRequest,
          process.env.JWT_SECRET as string
        ) as verifiedJwtPayload;
        const newAccessToken = createJWT(
          userData.id,
          userData.username,
          'access'
        );
        const newRefreshToken = createJWT(
          userData.id,
          userData.username,
          'refresh'
        );
        addTokenToResponseCookies(res, 'access', newAccessToken);
        addTokenToResponseCookies(res, 'refresh', newRefreshToken);

        req.headers.authorization = `Bearer ${newAccessToken}`;
        (req as AuthedRequest).user = userData;
        next();
      } catch (error) {
        return res.status(403).json({ message: 'Token cannot be refreshed.' });
      }
    } else {
      return res.status(401).json({ message: 'Invalid token.' });
    }
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
