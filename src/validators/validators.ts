import { AppError } from '../errors/AppError.js';
import { VALID_AIRPORT_CODES } from '../utils/airportCodes.js';
import { ERROR_MESSAGES } from '../utils/constants.js';
import { saveValidatorSchema, searchValidatorSchema } from './schemas.js';

export const validateSearchParams = (params: any) => {
  const { error } = searchValidatorSchema.validate(params);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  if (!VALID_AIRPORT_CODES.includes(params.origin)) {
    throw new AppError(ERROR_MESSAGES.INVALID_ORIGIN_CODE, 400);
  }
  if (!VALID_AIRPORT_CODES.includes(params.destination)) {
    throw new AppError(ERROR_MESSAGES.INVALID_DESTINATION_CODE, 400);
  }

  if (params.origin === params.destination) {
    throw new AppError(ERROR_MESSAGES.SAME_ORIGIN_DESTINATION, 400);
  }
};

export const validateBodyParams = (body: any) => {
  const { error } = saveValidatorSchema.validate(body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }
};
