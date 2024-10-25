import { Request, Response, NextFunction } from 'express';
import { searchTrips } from './tripsController';
import { fetchTrips, sortTrips } from '../services/tripsService';
import { ERROR_MESSAGES } from '../utils/constants';
import logger from '../utils/logger';
import { AppError } from '../errors/AppError';

jest.mock('../services/tripsService');
jest.mock('../utils/logger');

describe('searchTrips Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      query: {},
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error if required parameters are missing', async () => {
    await searchTrips(req as Request, res as Response, next);
    expect(logger.warn).toHaveBeenCalledWith(ERROR_MESSAGES.MISSING_PARAMETER_SEARCH_TRIP);
    expect(next).toHaveBeenCalledWith(new AppError(ERROR_MESSAGES.MISSING_PARAMETER_SEARCH_TRIP, 400));
  });

  it('should fetch, filter, and sort trips correctly when all parameters are provided', async () => {
    req.query = { origin: 'SYD', destination: 'GRU', sort_by: 'cost' };
    
    const mockTrips = [
      {
        origin: 'SYD',
        destination: 'GRU',
        cost: 625,
        duration: 5,
        type: 'flight',
        id: 'a749c866-7928-4d08-9d5c-a6821a583d1a',
        display_name: 'from SYD to GRU by flight',
      },
      {
        origin: 'SYD',
        destination: 'GRU',
        cost: 1709,
        duration: 32,
        type: 'car',
        id: 'd1b89056-ae55-4040-bbd6-0373405705d4',
        display_name: 'from SYD to GRU by car',
      },
      {
        origin: 'SYD',
        destination: 'GRU',
        cost: 2386,
        duration: 7,
        type: 'car',
        id: '00401bc6-ffb5-4340-85a6-e3725bb6dd3e',
        display_name: 'from SYD to GRU by car',
      },
      {
        origin: 'SYD',
        destination: 'GRU',
        cost: 3141,
        duration: 20,
        type: 'car',
        id: 'e6438572-0e0f-49ab-88fc-b05bbbeff1e3',
        display_name: 'from SYD to GRU by car',
      },
      {
        origin: 'SYD',
        destination: 'GRU',
        cost: 4236,
        duration: 5,
        type: 'train',
        id: 'd6bbe5e5-be4d-40d5-9125-cedb57508897',
        display_name: 'from SYD to GRU by train',
      },
    ];

    (fetchTrips as jest.Mock).mockResolvedValue(mockTrips);
    (sortTrips as jest.Mock).mockReturnValue(mockTrips);

    await searchTrips(req as Request, res as Response, next);

    expect(fetchTrips).toHaveBeenCalledWith('SYD', 'GRU', 'cost');
    expect(sortTrips).toHaveBeenCalledWith(mockTrips, 'cost');
    expect(res.json).toHaveBeenCalledWith(mockTrips);
  });

  it('should handle external API errors', async () => {
    req.query = { origin: 'SYD', destination: 'GRU', sort_by: 'cost' };

    const mockError = {
      response: {
        status: 404,
        data: { message: 'Not Found' },
      },
    };
    (fetchTrips as jest.Mock).mockRejectedValue(mockError);

    await searchTrips(req as Request, res as Response, next);

    expect(logger.error).toHaveBeenCalledWith('Error in searchTrips controller:', mockError);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Not Found' });
  });

  it('should handle unexpected errors', async () => {
    req.query = { origin: 'SYD', destination: 'GRU', sort_by: 'cost' };

    const mockError = new Error('Unexpected Error');
    (fetchTrips as jest.Mock).mockRejectedValue(mockError);

    await searchTrips(req as Request, res as Response, next);

    expect(logger.error).toHaveBeenCalledWith('Error in searchTrips controller:', mockError);
    expect(next).toHaveBeenCalledWith(new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500));
  });
});
