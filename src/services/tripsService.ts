import dotenv from "dotenv";
import { ERROR_MESSAGES, FILTERS } from "../utils/constants.js";
import { Trip } from "../types/trip.js";
import logger from "../utils/logger.js";
import { TripModel } from "../models/Trip.js";
import { ExternalApiError } from "../errors/ExternalApiError.js";
import redisClient from "../config/redisClient.js";

dotenv.config();

/**
 * Fetches trips from a third-party API or cache if available.
 * Caches fetched data in Redis to optimize repeated requests.
 */
export const fetchTrips = async (
  origin: string,
  destination: string,
  sort_by: string
): Promise<Trip[]> => {
  try {
    const cacheKey = `trips:${origin}:${destination}:${sort_by}`;

    // Check cache for existing data to reduce external API calls
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      logger.info("Serving trips data from cache");
      return JSON.parse(cachedData);
    }

    // Construct URL with query parameters for API request
    const url = new URL(process.env.TRIPS_API_URL as string);
    url.searchParams.append("origin", origin);
    url.searchParams.append("destination", destination);
    url.searchParams.append("sort_by", sort_by);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY as string,
      },
    });

    if (!response.ok) {
      logger.error(`Failed to fetch trips: ${response.statusText}`);
      throw new ExternalApiError(
        ERROR_MESSAGES.EXTERNAL_API_ERROR(response.statusText),
        response.status
      );
    }

    const data = (await response.json()) as Trip[];

    // Cache the retrieved data for future requests
    await redisClient.set(cacheKey, JSON.stringify(data), { EX: 3600 });

    return data;
  } catch (error) {
    throw new ExternalApiError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
  }
};

/**
 * Sorts an array of trips based on the specified criterion.
 * Supports sorting by "fastest" (duration) and "cheapest" (cost).
 */
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

/**
 * Lists trips from the database with pagination.
 * Returns trip data and pagination metadata.
 */
export const listTripsService = async (
  page = 1,
  limit = 10
) => {
  const totalTrips = await TripModel.countDocuments();
  const totalPages = totalTrips > 0 ? Math.ceil(totalTrips / limit) : 1;

  // Ensure the current page does not exceed total pages
  const currentPage = page > totalPages ? totalPages : page;
  const skip = (currentPage - 1) * limit;

  // Fetch paginated trips from the database
  const trips = totalTrips > 0 ? await TripModel.find().skip(skip).limit(limit).lean() : [];

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
