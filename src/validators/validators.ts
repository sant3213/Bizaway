import { ValidationError } from '../errors/ValidationError.js';
import { VALID_AIRPORT_CODES } from '../utils/airportCodes.js';
import { ERROR_MESSAGES } from '../utils/constants.js';
import { saveValidatorSchema, searchValidatorSchema } from './schemas.js';

export const validateSearchParams = (params: any) => {
  const { error } = searchValidatorSchema.validate(params);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }

  if (!VALID_AIRPORT_CODES.includes(params.origin)) {
    throw new ValidationError(ERROR_MESSAGES.INVALID_ORIGIN_CODE);
  }
  if (!VALID_AIRPORT_CODES.includes(params.destination)) {
    throw new ValidationError(ERROR_MESSAGES.INVALID_DESTINATION_CODE);
  }

  if (params.origin === params.destination) {
    throw new ValidationError(ERROR_MESSAGES.SAME_ORIGIN_DESTINATION);
  }
};

export const validateBodyParams = (body: any) => {
  const { error } = saveValidatorSchema.validate(body);
  if (error) {
    throw new ValidationError(error.details[0].message);
  }
};
