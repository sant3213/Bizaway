import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateBody = (schema: Joi.Schema) => (req: Request, res: Response, next: NextFunction): void => {
  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
    return;
  } else {
    next();
  }
};

export const validateQuery = (schema: Joi.Schema) => (req: Request, res: Response, next: NextFunction): void => {
  const { error } = schema.validate(req.query);
  if (error) {
     res.status(400).json({ error: error.details[0].message });
     return;
  } else {
    next();
  }
};
