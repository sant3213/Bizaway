import express from "express";
import { errorHandler } from "./middleware/errorHandler.js";
import { connectToDatabase } from "./config/database.js";
import { setupSwagger } from "./utils/swaggerSetup.js";
import { config } from "./config/config.js";
import routes from "./routes/index.js";
import helmet from "helmet";

const app = express();

app.use(helmet());

if (process.env.NODE_ENV === "production") {
  console.log("Running in production mode");
} else if (process.env.NODE_ENV === "test") {
  console.log("Running in test mode");
} else {
  console.log("Running in development mode");
}

app.use(express.json());

connectToDatabase();

  if (process.env.NODE_ENV !== 'production') {
    setupSwagger(app);
  }

app.use("/api/v1", routes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`API running on http://localhost:${config.port}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Swagger docs available at http://localhost:${config.port}/api-docs`);
  }
});
