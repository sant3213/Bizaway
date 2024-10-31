import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';
import { ERROR_MESSAGES } from '../utils/constants.js';
import logger from '../utils/logger.js';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

  logger.error('Error:', { statusCode, message, stack: err.stack });

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};
