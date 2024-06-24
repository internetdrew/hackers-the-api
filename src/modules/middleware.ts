import { SkillLevel } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';

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
