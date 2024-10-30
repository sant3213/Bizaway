import { Request, Response, NextFunction } from "express";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../utils/constants.js";
import { handleError } from "../../errors/index.js";
import { TripModel } from "../../models/Trip.js";
import { NotFoundError } from '../../errors/index.js';

export const deleteTrip = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedTrip = await TripModel.findByIdAndDelete(id);

    if (!deletedTrip) {
      throw new NotFoundError(ERROR_MESSAGES.TRIP_NOT_FOUND);
    }

    res.status(200).json({ message: SUCCESS_MESSAGES.TRIPS.DELETE_SUCCESS });
  } catch (error) {
    handleError(error, res, next);
  }
};
