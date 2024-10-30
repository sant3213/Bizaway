import { Request, Response, NextFunction } from "express";
import logger from "../../utils/logger.js";
import { ERROR_MESSAGES, FILTERS, SUCCESS_MESSAGES } from "../../utils/constants.js";
import { fetchTrips, sortTrips } from "../../services/tripsService.js";
import { searchTrips } from "./searchTripsController.js";
import { AppError } from "../../errors";
import { VALID_AIRPORT_CODES } from "../../utils/airportCodes.js";

jest.mock("../../utils/logger");
jest.mock("../../models/Trip");
jest.mock("../../services/tripsService");

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