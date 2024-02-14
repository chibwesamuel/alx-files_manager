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
router.post('/files', FilesController.postUpload); // New endpoint
router.get('/files/:id', FilesController.getShow);
router.get('/files', FilesController.getIndex);
router.put('/files/:id/publish', FilesController.putPublish); // New endpoint
router.put('/files/:id/unpublish', FilesController.putUnpublish); // New endpoint
router.get('/status', AppController.getStatus); // Assuming AppController exists
router.get('/stats', AppController.getStats); // Assuming AppController exists

export default router;
