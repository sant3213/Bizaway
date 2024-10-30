import { Request, Response, NextFunction } from "express";
import { TripModel } from "../../models/Trip.js";
import { deleteTrip } from "./deleteTripController.js";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../utils/constants.js";
import { AppError } from "../../errors";

jest.mock("../../models/Trip");

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