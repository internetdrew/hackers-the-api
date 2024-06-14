import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const validateUserInputs = [
  body('username').trim().notEmpty().isString(),
  body('password').trim().notEmpty().isString(),
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
