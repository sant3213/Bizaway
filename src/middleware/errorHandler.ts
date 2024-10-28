import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { ERROR_MESSAGES } from '../utils/constants.js';

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};
