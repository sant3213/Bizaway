import { Request, Response, NextFunction } from "express";
import { SUCCESS_MESSAGES } from "../../utils/constants.js";
import { handleError } from "../../errors/index.js";
import { TripModel } from "../../models/Trip.js";

export const saveTrip = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { origin, destination, cost, duration, type, id, display_name } =
    req.body;

  try {
    const trip = new TripModel({
      origin,
      destination,
      cost,
      duration,
      type,
      id,
      display_name,
    });
    await trip.save();

    res
      .status(201)
      .json({ message: SUCCESS_MESSAGES.TRIPS.SAVE_SUCCESS, data: trip });
  } catch (error) {
    handleError(error, res, next);
  }
};
