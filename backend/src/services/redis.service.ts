import Redis from 'ioredis';
import { config } from '../config/env';

const redis = new Redis({
    host: config.REDIS_HOST,
    port: parseInt(config.REDIS_PORT, 10),
});

redis.on('connect', () => {
    console.log('Successfully connected to Redis 🚀');
});

redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});

/**
 * Store a refresh token for a user with an expiration time.
 */
export const storeRefreshToken = async (userId: string, token: string, expiresIn: number) => {
    // Key format: refresh_token:userId
    await redis.set(`refresh_token:${userId}`, token, 'EX', expiresIn);
};

/**
 * Get the stored refresh token for a user.
 */
export const getRefreshToken = async (userId: string) => {
    return await redis.get(`refresh_token:${userId}`);
};

/**
 * Delete a refresh token (e.g., on logout).
 */
export const deleteRefreshToken = async (userId: string) => {
    await redis.del(`refresh_token:${userId}`);
};

/**
 * Add a token to the blacklist (e.g., when an access token is prematurely invalidated).
 */
export const blacklistToken = async (token: string, expiresIn: number) => {
    await redis.set(`blacklist:${token}`, '1', 'EX', expiresIn);
};

/**
 * Check if a token is blacklisted.
 */
export const isTokenBlacklisted = async (token: string) => {
    const result = await redis.get(`blacklist:${token}`);
    return result === '1';
};

export default redis;
