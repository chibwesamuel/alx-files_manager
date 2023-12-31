// controllers/UsersController.js
import sha1 from 'sha1';
import DBClient from '../utils/db';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class UsersController {
  static async getMe(req, res) {
    const token = req.header('X-Token');
    if (!token) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const user = await dbClient.users.findOne({ _id: userId });
    if (!user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    return res.status(200).send({ id: user._id, email: user.email });
  }
}

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Check if the email already exists in the database
    const existingUser = await DBClient.db.collection('users').findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hash the password using SHA1
    const hashedPassword = sha1(password);

    // Create the new user document
    const newUser = {
      email,
      password: hashedPassword,
    };

    try {
      // Insert the new user document into the 'users' collection
      const result = await DBClient.db.collection('users').insertOne(newUser);

      // Return the new user with only the email and id (auto-generated by MongoDB)
      const { _id } = result.ops[0];
      const responseUser = { id: _id, email };
      return res.status(201).json(responseUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default UsersController;

