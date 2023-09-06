import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AuthController {
  static async getConnect(req, res) {
    const auth = req.header('Authorization');
    if (!auth || !auth.startsWith('Basic ')) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const credentials = Buffer.from(auth.slice(6), 'base64').toString();
    const [email, password] = credentials.split(':');
    const hashedPassword = sha1(password);

    const user = await dbClient.users.findOne({ email, password: hashedPassword });
    if (!user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const token = uuidv4();
    const key = `auth_${token}`;
    await redisClient.set(key, user._id.toString(), 86400);

    return res.status(200).send({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.header('X-Token');
    if (!token) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    await redisClient.del(`auth_${token}`);
    return res.status(204).send();
  }
}

export default AuthController;

