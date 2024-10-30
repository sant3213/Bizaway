import { Request, Response, NextFunction } from "express";
import { listTripsService } from "../../services/tripsService.js";
import { listTrips } from "./listTripsController.js";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../utils/constants.js";

jest.mock("../../services/tripsService");
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