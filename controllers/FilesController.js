import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class FilesController {
  // Existing methods

  static async getShow(req, res) {
    const { id } = req.params;
    const token = req.header('X-Token');

    if (!token) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const file = await dbClient.files.findOne({ _id: id, userId });
    if (!file) {
      return res.status(404).send({ error: 'Not found' });
    }

    return res.status(200).send(file);
  }

  static async getIndex(req, res) {
    const token = req.header('X-Token');

    if (!token) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const { parentId = '0', page = 0 } = req.query;
    const pageSize = 20;
    const skip = page * pageSize;

    const files = await dbClient.files
      .aggregate([
        {
          $match: {
            $and: [{ parentId }, { userId }],
          },
        },
        { $skip: skip },
        { $limit: pageSize },
      ])
      .toArray();

    return res.status(200).send(files);
  }

  // New endpoints

  static async postUpload(req, res) {
    // Implementation for POST /files
  }
}

export default FilesController;

