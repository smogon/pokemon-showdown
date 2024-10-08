import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
});

export async function getStateValue(stateHash: string): Promise<string | null> {
  try {
    const value = await redis.get(stateHash);
    return value;
  } catch (error) {
    console.error(`Error fetching state value for hash ${stateHash}:`, error);
    return null;
  }
}