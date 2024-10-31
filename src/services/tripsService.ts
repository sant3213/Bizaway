import dotenv from "dotenv";
import { ERROR_MESSAGES, FILTERS } from "../utils/constants.js";
import { Trip } from "../types/trip.js";
import logger from "../utils/logger.js";
import { TripModel } from "../models/Trip.js";
import { ExternalApiError } from "../errors/ExternalApiError.js";
import redisClient from "../config/redisClient.js";

dotenv.config();

export const fetchTrips = async (
  origin: string,
  destination: string,
  sort_by: string
): Promise<Trip[]> => {
  try {
    const cacheKey = `trips:${origin}:${destination}:${sort_by}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      logger.info("Serving trips data from cache");
      return JSON.parse(cachedData);
    }

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
    await redisClient.set(cacheKey, JSON.stringify(data), { EX: 3600 });

    return data;
  } catch (error) {
    throw new ExternalApiError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
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

export const listTripsService = async (
  page = 1,
  limit = 10
) => {
  const totalTrips = await TripModel.countDocuments();
  const totalPages = totalTrips > 0 ? Math.ceil(totalTrips / limit) : 1;

  const currentPage = page > totalPages ? totalPages : page;
  const skip = (currentPage - 1) * limit;

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
