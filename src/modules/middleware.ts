import { SkillLevel } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { body, oneOf, validationResult } from 'express-validator';

export const validateUserInputs = [
  body('username').trim().notEmpty().isString().escape(),
  body('password').trim().notEmpty().isString().escape(),
];

export const validateCharacterCreationInputs = [
  body('name').trim().notEmpty().isString().escape(),
  body('knownAliases').isArray(),
  body('imageUrl').trim().notEmpty().isString().escape(),
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
    res.status(400);
    res.json({ errors: result.array() });
    return;
  }
  next();
};
