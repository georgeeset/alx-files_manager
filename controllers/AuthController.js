import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import UserController from './UsersController';

const uuidv4 = require('uuid').v4;

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    // get user credentials Basic Auth
    const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8').split(':');
    const [email, password] = credentials;
    // find user
    const user = await dbClient.getUserByEmailandPassword(
      email, UserController.hashPassword(password),
    );

    if (user) {
      const token = uuidv4();
      const key = `auth_${token}`; res.status(200);
      // store user id in redis for 24 hrs
      await redisClient.set(key, user._id.toString(), 24 * 60 * 60);
      return res.status(200).send({ token });
    }
    return res.status(401).send({ error: 'Unauthorized' });
  }

  static async getDisconnect(req, res) {
    const tokenHeader = req.headers['x-token'];
    // Get the user id from redis store using token as key
    const userId = await redisClient.get(`auth_${tokenHeader}`);
    const user = await dbClient.getUserById(userId);
    if (!user) return res.status(401).send({ error: 'Unauthorized' });
    // Delete the user id from redis store
    await redisClient.del(`auth_${tokenHeader}`);
    return res.status(204).send();
  }
}
// const authController = new AuthController()
module.exports = AuthController;
