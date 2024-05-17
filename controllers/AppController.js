// controllers/AppController.js
const { getRedisClient } = require('../utils/redis');
const { getDbClient } = require('../utils/db');

class AppController {
  static async getStatus(req, res) {
    const redisClient = getRedisClient();
    const dbClient = getDbClient();

    const redisAlive = await redisClient.isAlive();
    const dbAlive = await dbClient.isAlive();

    res.status(200).json({ redis: redisAlive, db: dbAlive });
  }

  static async getStats(req, res) {
    const dbClient = getDbClient();

    const usersCount = await dbClient.nbUsers();
    const filesCount = await dbClient.nbFiles();

    res.status(200).json({ users: usersCount, files: filesCount });
  }
}

module.exports = AppController;
