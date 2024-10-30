import { listTripsService } from "../../services/tripsService.js";
import { Request, Response, NextFunction } from "express";
import { SUCCESS_MESSAGES } from "../../utils/constants.js";
import { handleError } from "../../errors/index.js";

export const listTrips = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;

  try {
    const { trips, pagination } = await listTripsService(page, limit);

    res.status(200).json({
      message: SUCCESS_MESSAGES.TRIPS.FETCH_SUCCESS,
      data: trips,
      pagination,
    });
  } catch (error) {
    handleError(error, res, next);
  }
};
