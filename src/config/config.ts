import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  dbUri: process.env.MONGODB_URI as string,
  apiUrl: process.env.TRIPS_API_URL as string,
  apiKey: process.env.API_KEY as string,
};
