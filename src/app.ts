import express from 'express';
import { deleteTrip, listTrips, saveTrip, searchTrips } from './controllers/tripsController.js';
import { errorHandler } from './middleware/errorHandler.js';
import { saveValidatorSchema, searchValidatorSchema } from './validators/tripValidator.js';
import { validateBody, validateQuery } from './middleware/validate.js';
import { connectToDatabase } from './config/database.js';
import { setupSwagger } from './utils/swaggerSetup.js';
import { config } from './config/config.js';
import tripRoutes from './routes/trips.routes.js';

const app = express();

app.use(express.json());

connectToDatabase();

setupSwagger(app);

app.use('/trips', tripRoutes)

app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`API running on http://localhost:${config.port}`);
    console.log(`Swagger docs available at http://localhost:${config.port}/api-docs`);
});
