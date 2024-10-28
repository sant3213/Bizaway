import { VALID_AIRPORT_CODES } from '../utils/airportCodes.js';
import { AppError } from '../errors/AppError.js';
import { FILTERS } from '../utils/constants.js';

export const validateSearchParams = (params: any) => {
  const requiredFields = ['origin', 'destination', 'sort_by'];

  for (const field of requiredFields) {
    if (!params[field]) {
      const errorMessage = `Missing required query parameter: ${field}`;
      throw new AppError(errorMessage, 400);
    }
  }

  if (!VALID_AIRPORT_CODES.includes(params.origin)) {
    throw new AppError(`Invalid origin code: ${params.origin}`, 400);
  }

  if (!VALID_AIRPORT_CODES.includes(params.destination)) {
    throw new AppError(`Invalid destination code: ${params.destination}`, 400);
  }

  if (params.sort_by && ![FILTERS.FASTEST, FILTERS.CHEAPEST].includes(params.sort_by)) {
    throw new AppError(`Invalid value for 'sort_by': ${params.sort_by}`, 400);
  }
};
