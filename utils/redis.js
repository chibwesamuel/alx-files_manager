// utils/redis.js
import redis from 'redis';

class RedisClient {
  constructor() {
    // Create a new Redis client
    this.client = redis.createClient();

    // Listen for errors and log them to the console
    this.client.on('error', (error) => {
      console.error(`Redis error: ${error}`);
    });
  }

  isAlive() {
    // Check if the connection to Redis is alive
    return this.client.connected;
  }

  async get(key) {
    // Asynchronously get a value from Redis based on the provided key
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  async set(key, value, duration) {
    // Asynchronously set a value in Redis with an expiration (in seconds)
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  async del(key) {
    // Asynchronously delete a value in Redis based on the provided key
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();

export default redisClient;


