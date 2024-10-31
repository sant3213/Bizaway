import { Request, Response, NextFunction } from 'express';
import { handleError } from '../../errors/index.js';
import { fetchTrips, sortTrips } from '../../services/tripsService.js';
import { SUCCESS_MESSAGES } from '../../utils/constants.js';

export const searchTrips = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { origin, destination, sort_by } = req.query;
  
  try {

    const trips = await fetchTrips(origin as string, destination as string, sort_by as string);
    const filteredTrips = trips.filter(
      (trip) =>
        trip.origin === (origin as string).toUpperCase() &&
        trip.destination === (destination as string).toUpperCase()
    );
    const sortedTrips = sortTrips(filteredTrips, sort_by as string);

    res.status(200).json({ message: SUCCESS_MESSAGES.TRIPS.FETCH_SUCCESS, data: sortedTrips });
  } catch (error) {
    handleError(error, res, next);
  }
};
