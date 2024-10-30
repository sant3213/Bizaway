import { Request, Response, NextFunction } from "express";
import {
  deleteTrip,
  listTrips,
  saveTrip,
  searchTrips,
} from "./tripsController";
import { fetchTrips, listTripsService, sortTrips } from "../services/tripsService";
import { ERROR_MESSAGES, FILTERS, SUCCESS_MESSAGES } from "../utils/constants";
import logger from "../utils/logger";
import { AppError } from "../errors/AppError";
import { TripModel } from "../models/Trip";
import { VALID_AIRPORT_CODES } from "../utils/airportCodes";

jest.mock("../services/tripsService");
jest.mock("../utils/logger");
jest.mock("../models/Trip");

const mockedTripModel = TripModel as jest.MockedClass<typeof TripModel>;

describe("searchTrips Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { query: {} };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    logger.warn = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch, filter, and sort trips correctly when all parameters are provided", async () => {
    req.query = {
      origin: "SYD",
      destination: "GRU",
      sort_by: FILTERS.CHEAPEST,
    };

    const mockTrips = [
      {
        origin: "SYD",
        destination: "GRU",
        cost: 625,
        duration: 5,
        type: "flight",
        id: "1",
        display_name: "Flight",
      },
      {
        origin: "SYD",
        destination: "GRU",
        cost: 1709,
        duration: 32,
        type: "car",
        id: "2",
        display_name: "Car",
      },
    ];

    (fetchTrips as jest.Mock).mockResolvedValue(mockTrips);
    (sortTrips as jest.Mock).mockReturnValue(mockTrips);

    await searchTrips(req as Request, res as Response, next);

    expect(fetchTrips).toHaveBeenCalledWith("SYD", "GRU", FILTERS.CHEAPEST);
    expect(sortTrips).toHaveBeenCalledWith(mockTrips, FILTERS.CHEAPEST);
    expect(res.json).toHaveBeenCalledWith({
      message: "Trips fetched successfully",
      data: mockTrips,
    });
  });

  it("should handle external API errors", async () => {
    req.query = {
      origin: "SYD",
      destination: "GRU",
      sort_by: FILTERS.CHEAPEST,
    };

    const mockError = {
      response: {
        status: 404,
        data: { message: "Not Found" },
      },
    };
    (fetchTrips as jest.Mock).mockRejectedValue(mockError);

    await searchTrips(req as Request, res as Response, next);

    expect(logger.error).toHaveBeenCalledWith("Controller error:", mockError);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Not Found" });
  });

  it("should handle unexpected errors", async () => {
    req.query = { origin: "SYD", destination: "GRU", sort_by: "cheapest" };

    const mockError = new Error("Unexpected Error");
    (fetchTrips as jest.Mock).mockRejectedValue(mockError);

    await searchTrips(req as Request, res as Response, next);

    expect(logger.error).toHaveBeenCalledWith("Controller error:", mockError);
    expect(next).toHaveBeenCalledWith(
      new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500)
    );
  });

  it("should fetch, filter, and sort trips correctly by cheapest", async () => {
    req.query = {
      origin: "SYD",
      destination: "GRU",
      sort_by: FILTERS.CHEAPEST,
    };

    const mockTrips = [
      {
        origin: "SYD",
        destination: "GRU",
        cost: 625,
        duration: 5,
        type: "flight",
        id: "1",
        display_name: "Flight",
      },
      {
        origin: "SYD",
        destination: "GRU",
        cost: 1709,
        duration: 32,
        type: "car",
        id: "2",
        display_name: "Car",
      },
    ];

    const sortedByCheapest = [
      {
        origin: "SYD",
        destination: "GRU",
        cost: 625,
        duration: 5,
        type: "flight",
        id: "1",
        display_name: "Flight",
      },
      {
        origin: "SYD",
        destination: "GRU",
        cost: 1709,
        duration: 32,
        type: "car",
        id: "2",
        display_name: "Car",
      },
    ];

    (fetchTrips as jest.Mock).mockResolvedValue(mockTrips);
    (sortTrips as jest.Mock).mockReturnValue(sortedByCheapest);

    await searchTrips(req as Request, res as Response, next);

    expect(fetchTrips).toHaveBeenCalledWith("SYD", "GRU", FILTERS.CHEAPEST);
    expect(sortTrips).toHaveBeenCalledWith(mockTrips, FILTERS.CHEAPEST);
    expect(res.json).toHaveBeenCalledWith({
      message: "Trips fetched successfully",
      data: sortedByCheapest,
    });
  });

  it("should fetch, filter, and sort trips correctly by fastest", async () => {
    req.query = {
      origin: "SYD",
      destination: "GRU",
      sort_by: FILTERS.FASTEST,
    };

    const mockTrips = [
      {
        origin: "SYD",
        destination: "GRU",
        cost: 1709,
        duration: 32,
        type: "car",
        id: "2",
        display_name: "Car",
      },
      {
        origin: "SYD",
        destination: "GRU",
        cost: 625,
        duration: 5,
        type: "flight",
        id: "1",
        display_name: "Flight",
      },
    ];

    const filteredTrips = [
      {
        origin: "SYD",
        destination: "GRU",
        cost: 625,
        duration: 5,
        type: "flight",
        id: "1",
        display_name: "Flight",
      },
      {
        origin: "SYD",
        destination: "GRU",
        cost: 1709,
        duration: 32,
        type: "car",
        id: "2",
        display_name: "Car",
      },
    ];

    (fetchTrips as jest.Mock).mockResolvedValue(mockTrips);
    (sortTrips as jest.Mock).mockReturnValue(filteredTrips);

    await searchTrips(req as Request, res as Response, next);

    expect(fetchTrips).toHaveBeenCalledWith("SYD", "GRU", FILTERS.FASTEST);
    expect(sortTrips).toHaveBeenCalledWith(mockTrips, FILTERS.FASTEST);
    expect(res.json).toHaveBeenCalledWith({
      message: SUCCESS_MESSAGES.TRIPS.FETCH_SUCCESS,
      data: filteredTrips,
    });
  });

  it('should return a 400 error if "origin" is missing', async () => {
    req.query = { destination: VALID_AIRPORT_CODES[1], sort_by: FILTERS.CHEAPEST };

    await searchTrips(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: ERROR_MESSAGES.MISSING_QUERY_PARAMETER('origin') });
  });

  it('should return a 400 error if "destination" is missing', async () => {
    req.query = { origin: VALID_AIRPORT_CODES[0], sort_by: FILTERS.CHEAPEST };

    await searchTrips(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: ERROR_MESSAGES.MISSING_QUERY_PARAMETER('destination') });
  });

  it('should return a 400 error if "origin" is invalid', async () => {
    req.query = { origin: 'INVALID', destination: VALID_AIRPORT_CODES[1], sort_by: FILTERS.CHEAPEST };

    await searchTrips(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: ERROR_MESSAGES.INVALID_ORIGIN_CODE });
  });

  it('should return a 400 error if "destination" is invalid', async () => {
    req.query = { origin: VALID_AIRPORT_CODES[0], destination: 'INVALID', sort_by: FILTERS.CHEAPEST };

    await searchTrips(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: ERROR_MESSAGES.INVALID_DESTINATION_CODE });
  });

  it('should return a 400 error if "sort_by" is invalid', async () => {
    req.query = { origin: VALID_AIRPORT_CODES[0], destination: VALID_AIRPORT_CODES[1], sort_by: 'INVALID_SORT' };

    await searchTrips(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: ERROR_MESSAGES.INVALID_SORT_BY });
  });

  it('should proceed with valid parameters', async () => {
    req.query = { origin: VALID_AIRPORT_CODES[0], destination: VALID_AIRPORT_CODES[1], sort_by: FILTERS.CHEAPEST };
    const mockTrips = [
      { origin: VALID_AIRPORT_CODES[0], destination: VALID_AIRPORT_CODES[1], cost: 625, duration: 5, type: 'flight', id: '1' },
    ];

    (fetchTrips as jest.Mock).mockResolvedValue(mockTrips);
    (sortTrips as jest.Mock).mockReturnValue(mockTrips);

    await searchTrips(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Trips fetched successfully", data: mockTrips });
  });
});

describe("saveTrip", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    req = {
      body: {
        origin: "New York",
        destination: "Los Angeles",
        cost: 200,
        duration: 300,
        type: "flight",
        id: "12345",
        display_name: "NY-LA Flight",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    mockedTripModel.prototype.save = jest.fn().mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should save the trip and return a 201 status with success message", async () => {
    await saveTrip(req as Request, res as Response, next);

    expect(mockedTripModel.prototype.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: SUCCESS_MESSAGES.TRIPS.SAVE_SUCCESS,
      data: expect.any(Object),
    });
  });
});

describe("listTrips Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      query: {
        page: "1",
        limit: "10",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const trips = [
    {
      origin: "SYD",
      destination: "GRU",
      cost: 625,
      duration: 5,
      type: "flight",
      id: "a749c866-7928-4d08-9d5c-a6821a583d1a",
      display_name: "from SYD to GRU by flight",
    },
  ];

  it('should return a successful response with trips and pagination data', async () => {
    const mockPagination = { page: 1, limit: 10, total: 1 };
    
    (listTripsService as jest.Mock).mockResolvedValue({
      trips: trips,
      pagination: mockPagination,
    });

    await listTrips(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      message: SUCCESS_MESSAGES.TRIPS.FETCH_SUCCESS,
      data: trips,
      pagination: mockPagination,
    });
  });

  it('should call next with an error on service failure', async () => {
    const mockError = new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    (listTripsService as jest.Mock).mockRejectedValue(mockError);

    await listTrips(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });

  it('should return the single existing trip when page exceeds the dataset size', async () => {
    const mockPagination = { page: 2, limit: 20, total: 1 };
    
    (listTripsService as jest.Mock).mockResolvedValue({
      trips: trips,
      pagination: mockPagination,
    });

    await listTrips(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: SUCCESS_MESSAGES.TRIPS.FETCH_SUCCESS,
      data: trips,
      pagination: mockPagination,
    });

    expect(next).not.toHaveBeenCalled();
  });

  it('should return an empty list when there are no trips available', async () => {
    const mockPagination = { page: 1, limit: 10, total: 0 };
    
    (listTripsService as jest.Mock).mockResolvedValue({
      trips: [],
      pagination: mockPagination,
    });

    await listTrips(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      message: SUCCESS_MESSAGES.TRIPS.FETCH_SUCCESS,
      data: [],
      pagination: mockPagination,
    });

    expect(next).not.toHaveBeenCalled();
  });
});

describe("deleteTrip", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    req = { params: { id: "test-id" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should delete a trip and return a success message", async () => {
    jest.spyOn(TripModel, "findByIdAndDelete").mockResolvedValueOnce(true);

    await deleteTrip(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: SUCCESS_MESSAGES.TRIPS.DELETE_SUCCESS,
    });
  });

  it("should return 404 if trip not found", async () => {
    jest.spyOn(TripModel, "findByIdAndDelete").mockResolvedValueOnce(null);

    await deleteTrip(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: ERROR_MESSAGES.TRIP_NOT_FOUND,
    });
  });

  it("should call next with error on delete failure", async () => {
    const error = new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    jest.spyOn(TripModel, "findByIdAndDelete").mockRejectedValueOnce(error);

    await deleteTrip(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(
      new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500)
    );
  });
});