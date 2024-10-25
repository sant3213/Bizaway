import express from 'express';
import { searchTrips } from './controllers/tripsController.js';
import { config } from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import { tripSchema } from './validators/tripValidator.js';
import { validate } from './middleware/validate.js';
import { connectToDatabase } from './config/database.js';
import { deleteTrip, listTrips, saveTrip } from './controllers/tripManagement.js'
import { setupSwagger } from './utils/swaggerSetup.js';

config();

const app = express();
const port = 3000;

app.use(express.json());

connectToDatabase();

setupSwagger(app);

app.get('/search-trips', validate(tripSchema),searchTrips);

app.post('/trips', saveTrip);
app.get('/trips', listTrips);
app.delete('/trips/:id', deleteTrip);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
