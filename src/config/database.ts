import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export const connectToDatabase = async (): Promise<void> => {
  const dbUri = process.env.NODE_ENV === 'production'
    ? process.env.MONGODB_URI_PROD
    : process.env.NODE_ENV === 'test'
    ? process.env.MONGODB_URI_TEST
    : process.env.MONGODB_URI_DEV;

  try {
    if (!dbUri) {
      throw new Error('MongoDB URI not defined in environment variables');
    }
    await mongoose.connect(dbUri, { serverSelectionTimeoutMS: 5000 });
    logger.info('Successfully connected to MongoDB');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
