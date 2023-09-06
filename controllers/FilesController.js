import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class FilesController {
  static async postUpload(req, res) {
    const { name, type, parentId = 0, isPublic = false, data } = req.body;
    const token = req.header('X-Token');

    if (!token) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    if (!name) {
      return res.status(400).send({ error: 'Missing name' });
    }

    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return res.status(400).send({ error: 'Missing type' });
    }

    if (type !== 'folder' && !data) {
      return res.status(400).send({ error: 'Missing data' });
    }

    if (parentId !== 0) {
      const parentFile = await dbClient.files.findOne({ _id: parentId });
      if (!parentFile || parentFile.type !== 'folder') {
        return res.status(400).send({ error: 'Parent not found' });
      }
    }

    const filePath = process.env.FOLDER_PATH || '/tmp/files_manager';
    const localPath = `${filePath}/${uuidv4()}`;

    if (type !== 'folder') {
      const fileData = Buffer.from(data, 'base64');
      fs.writeFileSync(localPath, fileData);
    }

    const newFile = {
      userId,
      name,
      type,
      isPublic,
      parentId,
      localPath: type !== 'folder' ? localPath : undefined,
    };

    const insertedFile = await dbClient.files.insertOne(newFile);

    return res.status(201).send({
      id: insertedFile.insertedId,
      userId,
      name,
      type,
      isPublic,
      parentId,
    });
  }
}

export default FilesController;

