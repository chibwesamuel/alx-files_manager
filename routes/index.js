import express from 'express';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';
import { fileQueue } from '../workers/fileWorker';

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
router.post('/files', FilesController.postUpload, async (req, res) => {
  const { id, userId } = req.newFile;
  await fileQueue.add({ userId, fileId: id });
  return res.status(201).send(req.newFile);
}); // Updated endpoint
router.get('/files/:id', FilesController.getShow);
router.get('/files', FilesController.getIndex);
router.put('/files/:id/publish', FilesController.putPublish);
router.put('/files/:id/unpublish', FilesController.putUnpublish);
router.get('/files/:id/data', FilesController.getFile); // New endpoint

export default router;
