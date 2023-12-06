const express = require('express');
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');
const FilesController = require('../collection/FilesController');
const router = express.Router();
router.get('/status', AppController.getStats);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/connect', AuthController.getConnect);
router.get('/users/me', AuthController.getMe);

router.post('/files', FilesController.postUpload);

module.exports = router;
