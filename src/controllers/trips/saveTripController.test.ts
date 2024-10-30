import { Request, Response, NextFunction } from "express";
import { TripModel } from "../../models/Trip.js";
import { saveTrip } from "./saveTripController";
import { SUCCESS_MESSAGES } from "../../utils/constants.js";

jest.mock("../../models/Trip");

const mockedTripModel = TripModel as jest.MockedClass<typeof TripModel>;
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