import express from 'express';
import { validateBody } from '../middleware/validate.js';
import { saveValidatorSchema } from '../validators/schemas.js';
import { saveTrip } from '../controllers/trips/saveTripController.js';
import { listTrips } from '../controllers/trips/listTripsController.js';
import { deleteTrip } from '../controllers/trips/deleteTripController.js';

const tripRoutes = express.Router();

tripRoutes.post('/', validateBody(saveValidatorSchema), saveTrip);

tripRoutes.get('/', listTrips);

tripRoutes.delete('/:id', deleteTrip);

export default tripRoutes;
