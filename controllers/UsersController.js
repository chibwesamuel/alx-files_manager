// UserController.js

import dbClient from '../utils/db';
import sha1 from 'sha1';
import redisClient from '../utils/redis';
import userQueue from '../queues/userQueue';

class UserController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Check if email already exists in DB
    const userExists = await dbClient.db.collection('users').findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hash the password
    const hashedPassword = sha1(password);

    // Insert the new user into the database
    const result = await dbClient.db.collection('users').insertOne({ email, password: hashedPassword });

    // Add a job to the userQueue with the userId
    await userQueue.add({ userId: result.insertedId });

    // Return the new user's ID and email
    const newUser = { id: result.insertedId, email };
    return res.status(201).json(newUser);
  }

  static async getMe(req, res) {
    const { 'x-token': token } = req.headers;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await dbClient.db.collection('users').findOne({ _id: userId });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.status(200).json({ id: user._id, email: user.email });
  }
}

export default UserController;
