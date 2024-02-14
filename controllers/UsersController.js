// controllers/UsersController.js

import dbClient from '../utils/db';
import sha1 from 'sha1';

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

    // Check if email already exists in DB
    const userExists = await dbClient.db.collection('users').findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hash the password
    const hashedPassword = sha1(password);

    // Insert the new user into the database
    const result = await dbClient.db.collection('users').insertOne({ email, password: hashedPassword });

    // Return the new user's ID and email
    const newUser = { id: result.insertedId, email };
    return res.status(201).json(newUser);
  }
}

export default UsersController;
