import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import mime from 'mime-types';
import thumbnail from 'image-thumbnail';

class FilesController {
  /**
   * Retrieves a file based on its ID.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Object} The file object or an error response.
   */
  static async getShow(req, res) {
    try {
      const { id } = req.params;
      const token = req.header('X-Token');

      if (!token) {
        return res.status(401).send({ error: 'Unauthorized' });
      }

      const userId = await redisClient.get(`auth_${token}`);
      if (!userId) {
        return res.status(401).send({ error: 'Unauthorized' });
      }

      const file = await dbClient.files.findOne({ _id: ObjectId(id), userId });
      if (!file) {
        return res.status(404).send({ error: 'Not found' });
      }

      return res.status(200).send(file);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: 'Server error' });
    }
  }

  /**
   * Retrieves a list of files with optional pagination.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Array} List of files or an error response.
   */
  static async getIndex(req, res) {
    try {
      const { parentId, page } = req.query;
      const token = req.header('X-Token');

      if (!token) {
        return res.status(401).send({ error: 'Unauthorized' });
      }

      const userId = await redisClient.get(`auth_${token}`);
      if (!userId) {
        return res.status(401).send({ error: 'Unauthorized' });
      }

      const parent = parentId ? { parentId } : { parentId: '0' };
      const limit = 20;
      const skip = page ? page * limit : 0;

      const files = await dbClient.files
        .find({ userId, ...parent })
        .skip(skip)
        .limit(limit)
        .toArray();

      return res.status(200).send(files);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: 'Server error' });
    }
  }

  /**
   * Sets the isPublic property to true on the file document based on the ID.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Object} The updated file object or an error response.
   */
  static async putPublish(req, res) {
    try {
      const { id } = req.params;
      const token = req.header('X-Token');

      if (!token) {
        return res.status(401).send({ error: 'Unauthorized' });
      }

      const userId = await redisClient.get(`auth_${token}`);
      if (!userId) {
        return res.status(401).send({ error: 'Unauthorized' });
      }

      const file = await dbClient.files.findOne({ _id: ObjectId(id), userId });
      if (!file) {
        return res.status(404).send({ error: 'Not found' });
      }

      await dbClient.files.updateOne({ _id: ObjectId(id) }, { $set: { isPublic: true } });
      const updatedFile = await dbClient.files.findOne({ _id: ObjectId(id), userId });

      return res.status(200).send(updatedFile);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: 'Server error' });
    }
  }

  /**
   * Sets the isPublic property to false on the file document based on the ID.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Object} The updated file object or an error response.
   */
  static async putUnpublish(req, res) {
    try {
      const { id } = req.params;
      const token = req.header('X-Token');

      if (!token) {
        return res.status(401).send({ error: 'Unauthorized' });
      }

      const userId = await redisClient.get(`auth_${token}`);
      if (!userId) {
        return res.status(401).send({ error: 'Unauthorized' });
      }

      const file = await dbClient.files.findOne({ _id: ObjectId(id), userId });
      if (!file) {
        return res.status(404).send({ error: 'Not found' });
      }

      await dbClient.files.updateOne({ _id: ObjectId(id) }, { $set: { isPublic: false } });
      const updatedFile = await dbClient.files.findOne({ _id: ObjectId(id), userId });

      return res.status(200).send(updatedFile);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: 'Server error' });
    }
  }

  /**
   * Retrieves the content of a file based on its ID.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Object} The file content or an error response.
   */
  static async getFile(req, res) {
    try {
      const { id } = req.params;
      const { size } = req.query;

      const file = await dbClient.files.findOne({ _id: ObjectId(id) });

      if (!file || (!file.isPublic && file.userId !== req.userId)) {
        return res.status(404).send({ error: 'Not found' });
      }

      if (file.type === 'folder') {
        return res.status(400).send({ error: "A folder doesn't have content" });
      }

      let filePath = file.localPath;

      if (size) {
        const thumbnailPath = `${filePath}_${size}`;
        if (!fs.existsSync(thumbnailPath)) {
          return res.status(404).send({ error: 'Not found' });
        }
        filePath = thumbnailPath;
      }

      const mimeType = mime.lookup(filePath);
      if (!mimeType) {
        return res.status(500).send({ error: 'Server error' });
      }

      const fileContent = fs.readFileSync(filePath);
      res.setHeader('Content-Type', mimeType);
      return res.status(200).send(fileContent);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: 'Server error' });
    }
  }
}

export default FilesController;
