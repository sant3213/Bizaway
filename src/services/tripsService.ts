import dotenv from 'dotenv';
import { FILTERS } from '../utils/constants.js';
import { Trip } from '../types/trip.js';
import { AppError } from '../errors/AppError.js';
import logger from '../utils/logger.js';
import { TripModel } from '../models/Trip.js';

dotenv.config();

export const fetchTrips = async (origin: string, destination: string, sort_by: string): Promise<Trip[]> => {
  try {

    const url = new URL(process.env.TRIPS_API_URL as string);
    url.searchParams.append('origin', origin);
    url.searchParams.append('destination', destination);
    url.searchParams.append('sort_by', sort_by);
    
    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.API_KEY as string
        },
      });

    if (!response.ok) {
      logger.error(`Failed to fetch trips: ${response.statusText}`);
      const errorMessage = `External API error: ${response.statusText}`;
      throw new AppError(errorMessage, response.status); 
      }

      const data = (await response.json() as Trip[]);
      return data;
  } catch (error) {
    throw new AppError('Internal server error while fetching trips', 500);
  }
};

export const sortTrips = (trips: Trip[], sortBy: string): Trip[] => {
  switch (sortBy) {
    case FILTERS.FASTEST:
      return trips.sort((a, b) => a.duration - b.duration);
    case FILTERS.CHEAPEST:
      return trips.sort((a, b) => a.cost - b.cost);
    default:
      return trips;
  }
};

export const listTripsService = async (page: number = 1, limit: number = 10) => {
  const totalTrips = await TripModel.countDocuments();
  const totalPages = Math.ceil(totalTrips / limit);

  const currentPage = page > totalPages ? totalPages : page;
  const skip = (currentPage - 1) * limit;

  const trips = await TripModel.find().skip(skip).limit(limit).lean();

  return {
    trips,
    pagination: {
      totalTrips,
      currentPage,
      totalPages,
      limit,
    },
  };
};
