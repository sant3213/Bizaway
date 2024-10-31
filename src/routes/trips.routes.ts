import express from 'express';
import { paginationSchema, saveValidatorSchema } from '../validators/schemas.js';
import { saveTrip } from '../controllers/trips/saveTripController.js';
import { listTrips } from '../controllers/trips/listTripsController.js';
import { deleteTrip } from '../controllers/trips/deleteTripController.js';
import { validate } from '../middleware/validate.js';

const tripRoutes = express.Router();

tripRoutes.post('/', validate(saveValidatorSchema, 'body'), saveTrip);

tripRoutes.get('/', validate(paginationSchema, 'query'),listTrips);

tripRoutes.delete('/:id', deleteTrip);

export default tripRoutes;
