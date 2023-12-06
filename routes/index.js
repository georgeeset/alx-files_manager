const express = require('express');
const AppController = require('../controllers/AppController');
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');

const router = express.Router();
router.get('/status', AppController.getStats);
router.get('/stats', AppController.getStats);
router.post('/users', UserController.postNew);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/connect', AuthController.getConnect);
router.get('/users/me', AuthController.getMe);


module.exports = router;
