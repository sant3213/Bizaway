import { AppError } from "../errors/AppError.js";
import { ERROR_MESSAGES } from "../utils/constants.js";

export const validateBodyParams = (body: any) => {
    const requiredFields = ['type', 'id', 'display_name', 'destination', 'origin', 'cost', 'duration'];
  
    for (const field of requiredFields) {
      if (!body[field]) {
        throw new AppError(ERROR_MESSAGES.MISSING_BODY_PARAMETER(field), 400);
      }
    }
  
    if (typeof body.cost !== 'number' || typeof body.duration !== 'number') {
      throw new AppError(ERROR_MESSAGES.INVALID_COST_OR_DURATION, 400);
    }
  };
  