import express from 'express';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

const router = express.Router();

// Existing endpoints
router.get('/status', (req, res) => {
  res.status(200).send({ status: 'OK' });
});

router.get('/stats', (req, res) => {
  res.status(200).send({ users: 10, files: 50 });
});

// New endpoints
router.post('/users', UsersController.postNew);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe);
router.get('/files/:id', FilesController.getShow);
router.get('/files', FilesController.getIndex);

export default router;

