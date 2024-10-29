import { VALID_AIRPORT_CODES } from '../utils/airportCodes.js';
import { AppError } from '../errors/AppError.js';
import { ERROR_MESSAGES, FILTERS } from '../utils/constants.js';

export const validateSearchParams = (params: any) => {
  const requiredFields = ['origin', 'destination'];

  for (const field of requiredFields) {
    if (!params[field]) {
      throw new AppError(ERROR_MESSAGES.MISSING_QUERY_PARAMETER(field), 400);
    }
  }

  if (!VALID_AIRPORT_CODES.includes(params.origin)) {
    throw new AppError(ERROR_MESSAGES.INVALID_ORIGIN_CODE, 400);
  }

  if (!VALID_AIRPORT_CODES.includes(params.destination)) {
    throw new AppError(ERROR_MESSAGES.INVALID_DESTINATION_CODE, 400);
  }

  if (params.sort_by && ![FILTERS.FASTEST, FILTERS.CHEAPEST].includes(params.sort_by)) {
    throw new AppError(ERROR_MESSAGES.INVALID_SORT_BY, 400);
  }
};
