import Redis from 'ioredis';
import { config } from '../config/env';

let redis: Redis;

// ✨✨✨ 逻辑修改：优先检查 REDIS_URL ✨✨✨
if (config.REDIS_URL) {
    console.log('🔗 Connecting to Redis using REDIS_URL (Production)...');
    redis = new Redis(config.REDIS_URL);
} else {
    console.log('🔗 Connecting to Redis using HOST/PORT (Local)...');
    redis = new Redis({
        host: config.REDIS_HOST,
        port: parseInt(config.REDIS_PORT, 10),
    });
}

redis.on('connect', () => {
    console.log('✅ Successfully connected to Redis 🚀');
});

redis.on('error', (err) => {
    console.error('❌ Redis connection error:', err);
});

// ... 下面的各种 export 函数保持不变 ...
export const storeRefreshToken = async (userId: string, token: string, expiresIn: number) => {
    await redis.set(`refresh_token:${userId}`, token, 'EX', expiresIn);
};

export const getRefreshToken = async (userId: string) => {
    return await redis.get(`refresh_token:${userId}`);
};

export const deleteRefreshToken = async (userId: string) => {
    await redis.del(`refresh_token:${userId}`);
};

export const blacklistToken = async (token: string, expiresIn: number) => {
    await redis.set(`blacklist:${token}`, '1', 'EX', expiresIn);
};

export const isTokenBlacklisted = async (token: string) => {
    const result = await redis.get(`blacklist:${token}`);
    return result === '1';
};

export default redis;