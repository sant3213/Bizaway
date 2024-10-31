import { createClient } from 'redis';
import logger from '../utils/logger.js';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

let redisConnected = false;

const connectToRedis = async () => {
  if (!redisConnected) {
    try {
      await redisClient.connect();
      redisConnected = true;
      logger.info('Connected to Redis');
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }
};

if (process.env.NODE_ENV !== 'test') {
  connectToRedis();
}

export default redisClient;
