import { fetchTrips, listTripsService } from './tripsService';
import { AppError } from '../errors/AppError';
import dotenv from 'dotenv';
import { TripModel } from '../models/Trip';

dotenv.config();

global.fetch = jest.fn();

jest.mock('../utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
}));

jest.mock('../models/Trip');


describe('fetchTrips Service', () => {
  const origin = 'SYD';
  const destination = 'GRU';
  const sortBy = 'cost';
  const apiUrl = process.env.TRIPS_API_URL as string;
  const apiKey = process.env.API_KEY as string;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch trips successfully and return data', async () => {
    const mockTrips = [
      { origin: 'SYD', destination: 'GRU', cost: 625, duration: 5, type: 'flight', id: 'a749c866' },
      { origin: 'SYD', destination: 'GRU', cost: 1709, duration: 32, type: 'car', id: 'd1b89056' },
    ];
    
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTrips,
    });

    const result = await fetchTrips(origin, destination, sortBy);

    expect(fetch).toHaveBeenCalledWith(`${apiUrl}?origin=SYD&destination=GRU&sort_by=cost`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
    });
    expect(result).toEqual(mockTrips);
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
    const totalTrips = 3; // Fewer trips than requested
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
      currentPage: 0,
      totalPages: 0,
      limit,
    });
  });
});