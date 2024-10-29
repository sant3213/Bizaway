import express from 'express';
import { searchTrips } from '../controllers/tripsController.js';
import { validateQuery } from '../middleware/validate.js';
import { searchValidatorSchema } from '../validators/schemas.js';

const searchTripRoutes = express.Router();

searchTripRoutes.get('/', validateQuery(searchValidatorSchema), searchTrips);

export default searchTripRoutes;
