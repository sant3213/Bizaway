import express from 'express';
import { searchValidatorSchema } from '../validators/schemas.js';
import { searchTrips } from '../controllers/searchTrips/searchTripsController.js';
import { validate } from '../middleware/validate.js';

const searchTripRoutes = express.Router();

searchTripRoutes.get('/', validate(searchValidatorSchema, 'query'), searchTrips);

export default searchTripRoutes;
