import express from 'express';
import searchTripRoutes from './searchTrips.routes.js';
import tripRoutes from './trips.routes.js';
const router = express.Router();

router.use('/search-trips', searchTripRoutes);
router.use('/trips', tripRoutes);

export default router;
