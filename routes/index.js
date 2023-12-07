import express from 'express';
import AppController from '../controllers/AppController';
import UserController from '../controllers/UsersController';

import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
// add user
router.post('/users', UserController.postNew);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/connect', AuthController.getConnect);
router.get('/users/me', UserController.getMe);

router.post('/files', FilesController.postUpload);

module.exports = router;
