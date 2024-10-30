import express from 'express';
import { validateQuery } from '../middleware/validate.js';
import { searchValidatorSchema } from '../validators/schemas.js';
import { searchTrips } from '../controllers/searchTrips/searchTripsController.js';

const searchTripRoutes = express.Router();

searchTripRoutes.get('/', validateQuery(searchValidatorSchema), searchTrips);

export default searchTripRoutes;
