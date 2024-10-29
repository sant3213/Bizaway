import { Request, Response, NextFunction } from 'express';
import { fetchTrips, listTripsService, sortTrips } from '../services/tripsService.js';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants.js';
import logger from '../utils/logger.js';
import { AppError } from '../errors/AppError.js';
import { TripModel } from '../models/Trip.js';
import { validateSearchParams } from '../validators/queryValidators.js';
import { validateBodyParams } from '../validators/bodyValidators.js';

const handleError = (error: any, res: Response, next: NextFunction) => {
  logger.error('Controller error:', error);
  
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

export const searchTrips = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { origin, destination, sort_by } = req.query;
  
  try {
    validateSearchParams(req.query);

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

export const saveTrip = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { origin, destination, cost, duration, type, id, display_name } = req.body;
  
  try {
    validateBodyParams(req.body);
    const trip = new TripModel({ origin, destination, cost, duration, type, id, display_name });
    await trip.save();

    res.status(201).json({ message: SUCCESS_MESSAGES.TRIPS.SAVE_SUCCESS, data: trip });
  } catch (error) {
    handleError(error, res, next);
  }
};


export const listTrips = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  try {
    const { trips, pagination } = await listTripsService(page, limit);

    res.status(200).json({
      message: SUCCESS_MESSAGES.TRIPS.FETCH_SUCCESS,
      data: trips,
      pagination,
    });
  } catch (error) {
    handleError(error, res, next);
  }
};

export const deleteTrip = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedTrip = await TripModel.findByIdAndDelete(id);
    
    if (!deletedTrip) {
      res.status(404).json({ message:  ERROR_MESSAGES.TRIP_NOT_FOUND });
      return;
    }

    res.status(200).json({ message: ERROR_MESSAGES.TRIP_DELETED_SUCCESS});
  } catch (error) {
    handleError(error, res, next);
  }
};
