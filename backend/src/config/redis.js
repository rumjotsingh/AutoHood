import { Redis } from '@upstash/redis';
import { createClient } from 'redis';

let redisClient = null;

const connectRedis = async () => {
  // Skip Redis if not enabled
  if (process.env.REDIS_ENABLED !== 'true') {
    console.log('⚠️  Redis caching is disabled'.yellow);
    return null;
  }

  try {
    // Check if using Upstash
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      console.log('🔄 Connecting to Upstash Redis...'.cyan);
      
      redisClient = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });

      // Test connection
      await redisClient.ping();
      console.log('✅ Upstash Redis Connected'.cyan.bold);
      return redisClient;
    } else {
      // Local Redis
      console.log('🔄 Connecting to local Redis...'.cyan);
      redisClient = createClient({
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT || 6379,
        },
        password: process.env.REDIS_PASSWORD || undefined,
      });

      redisClient.on('error', (err) => {
        console.error('❌ Redis Client Error:', err);
      });

      redisClient.on('connect', () => {
        console.log('✅ Redis Connected'.cyan.bold);
      });

      await redisClient.connect();
      return redisClient;
    }
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    console.log('⚠️  Continuing without Redis caching'.yellow);
    return null;
  }
};

// Cache helper functions
export const getCache = async (key) => {
  if (!redisClient) return null;
  
  try {
    const data = await redisClient.get(key);
    if (!data) return null;
    
    // Upstash returns parsed data, standard Redis returns string
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
};

export const setCache = async (key, value, expireSeconds = 3600) => {
  if (!redisClient) return false;
  
  try {
    // Upstash Redis uses setex differently
    if (redisClient.setex) {
      await redisClient.setex(key, expireSeconds, JSON.stringify(value));
    } else {
      await redisClient.setEx(key, expireSeconds, JSON.stringify(value));
    }
    return true;
  } catch (error) {
    console.error('Redis set error:', error);
    return false;
  }
};

export const deleteCache = async (key) => {
  if (!redisClient) return false;
  
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('Redis delete error:', error);
    return false;
  }
};

export const deleteCachePattern = async (pattern) => {
  if (!redisClient) return false;
  
  try {
    const keys = await redisClient.keys(pattern);
    if (keys && keys.length > 0) {
      await redisClient.del(...keys);
    }
    return true;
  } catch (error) {
    console.error('Redis delete pattern error:', error);
    return false;
  }
};

export { redisClient };
export default connectRedis;
