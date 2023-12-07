import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import UsersController from './UsersController';

const uuidv4 = require('uuid').v4;

const getConnect = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).send({ error: 'Unauthorized' });
  }
  // get user credentials Basic Auth
  const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8').split(':');
  const [email, password] = credentials;
  // find user
  const user = await dbClient.getUserByEmailandPassword(
    email, UsersController.hashPassword(password),
  );

  if (user) {
    const token = uuidv4();
    const key = `auth_${token}`; res.status(200);
    // store user id in redis for 24 hrs
    await redisClient.set(key, user._id.toString(), 24 * 60 * 60);
    return res.status(200).json({ token });
  }
  return res.status(401).json({ error: 'Unauthorized' });
};

const getDisconnect = async (req, res) => {
  try {
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const key = `auth_${token}`;
    const userId = await redisClient.get(key);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Delete the token in Redis
    await redisClient.del(key);

    return res.status(204).end();
  } catch (error) {
    return res.status(401).send({ error: 'Unauthorized' });
  }
};
const getMe = async (req, res) => {
  const token = await req.headers['x-token'];
  if (token) {
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    const user = await dbClient.getUserById(userId);
    if (!user || user._id === null) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    // Return user object (email and _id only)
    const { _id, email } = user;
    return res.status(200).send({ id: _id.toString(), email });
  }
  return res.status(401).send({ error: 'Unauthorized' });
};
module.exports = { getConnect, getDisconnect, getMe };
