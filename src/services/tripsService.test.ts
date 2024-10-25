import { fetchTrips } from './tripsService';
import { AppError } from '../errors/AppError';
import dotenv from 'dotenv';

dotenv.config();

global.fetch = jest.fn();

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
