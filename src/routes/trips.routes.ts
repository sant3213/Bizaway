import express from 'express';
import { deleteTrip, listTrips, saveTrip } from '../controllers/tripsController.js';
import { validateBody } from '../middleware/validate.js';
import { saveValidatorSchema } from '../validators/tripValidator.js';

const tripRoutes = express.Router();

tripRoutes.post('/', validateBody(saveValidatorSchema), saveTrip);

tripRoutes.get('/', listTrips);

tripRoutes.delete('/:id', deleteTrip);

export default tripRoutes;
