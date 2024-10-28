import { AppError } from "../errors/AppError.js";

export const validateBodyParams = (body: any) => {
    const requiredFields = ['type', 'id', 'display_name', 'destination', 'origin', 'cost', 'duration'];
  
    for (const field of requiredFields) {
      if (!body[field]) {
        const errorMessage = `Missing required body parameter: ${field}`;
        throw new AppError(errorMessage, 400);
      }
    }
  
    if (typeof body.cost !== 'number' || typeof body.duration !== 'number') {
      throw new AppError(`Invalid data type for cost or duration`, 400);
    }
  };
  