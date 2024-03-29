import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

const AuthController = require('../controllers/AuthController');
// const FilesController = require('../controllers/FilesController');
const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
// add user
router.post('/users', UsersController.postNew);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/connect', AuthController.getConnect);
router.get('/users/me', AuthController.getMe);

// router.post('/files', FilesController.postUpload);

module.exports = router;
