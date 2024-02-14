// tests/redisClient.test.js
import redisClient from '../utils/redis';

describe('Redis Client Tests', () => {
  test('Redis client connection', async () => {
    const isConnected = await redisClient.isConnected();
    expect(isConnected).toBe(true);
  });

  test('Set and Get data in Redis', async () => {
    const key = 'testKey';
    const value = 'testValue';

    await redisClient.set(key, value);
    const retrievedValue = await redisClient.get(key);

    expect(retrievedValue).toBe(value);
  });
});

