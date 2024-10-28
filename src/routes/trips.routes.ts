import express from 'express';
import { deleteTrip, listTrips, saveTrip, searchTrips } from '../controllers/tripsController.js';
import { validateQuery, validateBody } from '../middleware/validate.js';
import { searchValidatorSchema, saveValidatorSchema } from '../validators/tripValidator.js';

const tripRoutes = express.Router();

tripRoutes.get('/search', validateQuery(searchValidatorSchema), searchTrips);

tripRoutes.post('/', validateBody(saveValidatorSchema), saveTrip);

tripRoutes.get('/', listTrips);

tripRoutes.delete('/:id', deleteTrip);

export default tripRoutes;
