// routes/index.js
import express from 'express';
import UsersController from '../controllers/UsersController';

const router = express.Router();

// Define routes here
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the API' });
});

// Add the new user creation endpoint
router.post('/users', UsersController.postNew);

export default router;

