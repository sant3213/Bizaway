import { Request, Response, NextFunction } from "express";
import logger from "../../utils/logger.js";
import {
  ERROR_MESSAGES,
  FILTERS,
  SUCCESS_MESSAGES,
} from "../../utils/constants.js";
import { fetchTrips, sortTrips } from "../../services/tripsService.js";
import { searchTrips } from "./searchTripsController.js";
import { AppError, handleError } from "../../errors";
import { VALID_AIRPORT_CODES } from "../../utils/airportCodes.js";
import { ValidationError } from "../../errors/ValidationError.js";

jest.mock("../../utils/logger");
jest.mock("../../models/Trip");
jest.mock("../../services/tripsService");
jest.mock("../../errors/index.js");

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

  it("should handle fetchTrips error", async () => {
    const error = new Error("Fetch failed");
    (fetchTrips as jest.Mock).mockRejectedValue(error);

    await searchTrips(req as Request, res as Response, next);

    expect(handleError).toHaveBeenCalledWith(error, res, next);
  });

  it("should handle invalid query parameters", async () => {
    const validationError = new ValidationError("Invalid origin code");
    req.query = { origin: "INVALID", destination: "LAX" };

    next(validationError);

    expect(next).toHaveBeenCalledWith(validationError);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should handle missing destination parameter", async () => {
    req.query = { origin: "NYC" };

    const validationError = new ValidationError(
      ERROR_MESSAGES.MISSING_QUERY_PARAMETER("destination")
    );

    next(validationError);

    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: ERROR_MESSAGES.MISSING_QUERY_PARAMETER("destination"),
      })
    );
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should handle missing origin parameter", async () => {
    req.query = { destination: "LAX" };

    const validationError = new ValidationError(
      ERROR_MESSAGES.MISSING_QUERY_PARAMETER("origin")
    );

    next(validationError);

    expect(next).toHaveBeenCalledWith(expect.any(ValidationError));
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: ERROR_MESSAGES.MISSING_QUERY_PARAMETER("origin"),
      })
    );
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should handle fetchTrips error", async () => {
    const error = new Error("Fetch failed");
    (fetchTrips as jest.Mock).mockRejectedValue(error);

    await searchTrips(req as Request, res as Response, next);

    expect(handleError).toHaveBeenCalledWith(error, res, next);
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

  it("should proceed with valid parameters", async () => {
    req.query = {
      origin: VALID_AIRPORT_CODES[0],
      destination: VALID_AIRPORT_CODES[1],
      sort_by: FILTERS.CHEAPEST,
    };
    const mockTrips = [
      {
        origin: VALID_AIRPORT_CODES[0],
        destination: VALID_AIRPORT_CODES[1],
        cost: 625,
        duration: 5,
        type: "flight",
        id: "1",
      },
    ];

    (fetchTrips as jest.Mock).mockResolvedValue(mockTrips);
    (sortTrips as jest.Mock).mockReturnValue(mockTrips);

    await searchTrips(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Trips fetched successfully",
      data: mockTrips,
    });
  });
});
