import { fetchTrips, listTripsService } from './tripsService';
import { AppError } from '../errors/AppError';
import dotenv from 'dotenv';
import { TripModel } from '../models/Trip';
import redisClient from '../config/redisClient';

dotenv.config();

global.fetch = jest.fn();

jest.mock('../utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
}));

jest.mock('../models/Trip');
jest.mock("../config/redisClient.js");


describe('fetchTrips Service', () => {
  const origin = 'SYD';
  const destination = 'GRU';
  const sortBy = 'cost';
  const apiUrl = process.env.TRIPS_API_URL as string;
  const apiKey = process.env.API_KEY as string;
  const mockOrigin = "NYC";
  const mockDestination = "LAX";
  const mockSortBy = "FASTEST";
  const mockTrips = [{ id: 1, duration: 200, cost: 50 }];

  beforeEach(() => {
    jest.clearAllMocks();
    (redisClient.get as jest.Mock).mockResolvedValue(null);
    (redisClient.set as jest.Mock).mockResolvedValue("OK");
  });

  it("should return cached trips data if available", async () => {
    (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(mockTrips));
    
    const result = await fetchTrips(mockOrigin, mockDestination, mockSortBy);
    
    expect(result).toEqual(mockTrips);
    expect(redisClient.get).toHaveBeenCalledWith(
      `trips:${mockOrigin}:${mockDestination}:${mockSortBy}`
    );
  });

  it("should fetch trips data from the API if not in cache", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockTrips),
    });

    const result = await fetchTrips(mockOrigin, mockDestination, mockSortBy);
    
    expect(result).toEqual(mockTrips);
    expect(global.fetch).toHaveBeenCalled();
    expect(redisClient.set).toHaveBeenCalledWith(
      `trips:${mockOrigin}:${mockDestination}:${mockSortBy}`,
      JSON.stringify(mockTrips),
      { EX: 3600 }
    );
  });

  it('should throw an AppError if the API response is not ok', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
      status: 404,
    });

    await expect(fetchTrips(origin, destination, sortBy)).rejects.toThrow(AppError);
  });

  it('should throw an internal AppError if fetch fails', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network Error'));

    await expect(fetchTrips(origin, destination, sortBy)).rejects.toThrow(AppError);
  });
});


describe('listTripsService', () => {
  const mockTrips = [
    { origin: 'SYD', destination: 'GRU', cost: 625, duration: 5, type: 'flight', id: '1', display_name: 'Flight' },
    { origin: 'SYD', destination: 'GRU', cost: 1709, duration: 32, type: 'car', id: '2', display_name: 'Car' },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return paginated trips correctly when page and limit are within bounds', async () => {
    const page = 1;
    const limit = 2;
    const totalTrips = 10;
    const totalPages = Math.ceil(totalTrips / limit);

    (TripModel.countDocuments as jest.Mock).mockResolvedValueOnce(totalTrips);
    (TripModel.find as jest.Mock).mockReturnValueOnce({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValueOnce(mockTrips),
    });

    const result = await listTripsService(page, limit);

    expect(result).toEqual({
      trips: mockTrips,
      pagination: {
        totalTrips,
        currentPage: page,
        totalPages,
        limit,
      },
    });
  });

  it('should return the last page if requested page exceeds totalPages', async () => {
    const page = 5;
    const limit = 2;
    const totalTrips = 3;
    const totalPages = Math.ceil(totalTrips / limit);
    const currentPage = totalPages;

    (TripModel.countDocuments as jest.Mock).mockResolvedValueOnce(totalTrips);
    (TripModel.find as jest.Mock).mockReturnValueOnce({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValueOnce(mockTrips),
    });

    const result = await listTripsService(page, limit);

    expect(result.pagination.currentPage).toBe(currentPage);
    expect(result.pagination.totalPages).toBe(totalPages);
    expect(result.trips).toEqual(mockTrips);
  });

  it('should return an empty list and pagination when there are no trips', async () => {
    const page = 1;
    const limit = 2;
    const totalTrips = 0;

    (TripModel.countDocuments as jest.Mock).mockResolvedValueOnce(totalTrips);
    (TripModel.find as jest.Mock).mockReturnValueOnce({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValueOnce([]),
    });

    const result = await listTripsService(page, limit);

    expect(result.trips).toEqual([]);
    expect(result.pagination).toEqual({
      totalTrips,
      currentPage: 1,
      totalPages: 1,
      limit,
    });
  });
});