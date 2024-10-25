import { Request, Response, NextFunction } from 'express';
import { TripModel } from '../models/Trip.js';

export const saveTrip = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { origin, destination, cost, duration } = req.body;
    const trip = new TripModel({ origin, destination, cost, duration });
    await trip.save();
    res.status(201).json({ message: 'Trip saved successfully', trip });
  } catch (error) {
    next(error);
  }
};

export const listTrips = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const trips = await TripModel.find();
    res.status(200).json(trips);
  } catch (error) {
    next(error);
  }
};

export const deleteTrip = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedTrip = await TripModel.findByIdAndDelete(id);

    if (!deletedTrip) {
        res.status(404).json({ message: 'Trip not found' });
        return;
      }

    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    next(error);
  }
};
