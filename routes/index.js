// routes/index.js
import express from 'express';
import AppController from '../controllers/AppController';

const router = express.Router();

// Define routes here
router.get('/', AppController.getHome);
router.post('/add', AppController.addNewItem);

export default router;

