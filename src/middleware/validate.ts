import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from '../errors/ValidationError.js';

type ValidationTarget = 'body' | 'query' | 'params';

export const validate = (schema: Joi.Schema, target: ValidationTarget = 'body') => (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error } = schema.validate(req[target]);

  if (error) {
    next(new ValidationError(error.details[0].message));
  } else {
    next();
  }
};
