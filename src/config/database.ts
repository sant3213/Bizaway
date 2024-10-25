import mongoose from 'mongoose';
import logger from '../utils/logger.js';

export const connectToDatabase = async (): Promise<void> => {
  try {
    const dbUri = process.env.MONGODB_URI as string;
    if (!dbUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(dbUri);
    logger.info('Successfully connected to MongoDB');
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
