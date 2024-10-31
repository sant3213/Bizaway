import logger from "../utils/logger.js";
import { AppError } from "./AppError.js";
import { Response, NextFunction } from "express";
import { ERROR_MESSAGES } from "../utils/constants.js";

export const handleError = (error: any, res: Response, next: NextFunction) => {
  logger.error("Controller error:", error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  if (error.response) {
    const statusCode = error.response.status || 500;
    const errorMessage = error.response.data?.message;
    return res.status(statusCode).json({ error: errorMessage });
  }

  next(new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500));
};
