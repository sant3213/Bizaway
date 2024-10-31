import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redisClient';

export const cacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { origin, destination, sort_by } = req.query;
    const cacheKey = `trips:${origin}:${destination}:${sort_by}`;

    try {
        const data = await redisClient.get(cacheKey);
        
        if (data) {
            return res.json(JSON.parse(data));
        }

        // If data is not found in cache, continue to the next middleware
        next();
    } catch (err) {
        console.error('Redis cache error:', err);
        next();
    }
};
