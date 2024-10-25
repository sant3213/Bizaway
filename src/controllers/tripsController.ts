import { Request, Response, NextFunction } from 'express';
import { fetchTrips, sortTrips } from '../services/tripsService.js';
import { ERROR_MESSAGES } from '../utils/constants.js';
import logger from '../utils/logger.js';
import { AppError } from '../errors/AppError.js';


export const searchTrips = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { origin, destination, sort_by } = req.query;

  if (!origin || !destination || !sort_by) {
    logger.warn(ERROR_MESSAGES.MISSING_PARAMETER_SEARCH_TRIP);
    return next(new AppError(ERROR_MESSAGES.MISSING_PARAMETER_SEARCH_TRIP, 400));
  }

  try {
    const trips = await fetchTrips(origin as string, destination as string, sort_by as string);
    const filteredTrips = trips.filter(
      (trip) =>
        trip.origin === (origin as string).toUpperCase() &&
        trip.destination === (destination as string).toUpperCase()
    );
    const sortedTrips = sortTrips(filteredTrips, sort_by as string);
    res.json(sortedTrips);
  } catch (error: any) {
    logger.error('Error in searchTrips controller:', error);

    if (error.response) {
      const statusCode = error.response.status || 500;
      const errorMessage = error.response.data?.message || 'Error from external API';

      res.status(statusCode).json({ error: errorMessage });
      return;
    }

    return next(new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500));
  }
};
