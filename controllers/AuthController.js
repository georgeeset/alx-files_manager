import redisClient from '../utils/redis';
import dbclient from '../utils/db';

const uuidv4 = require('uuid').v4;
const { hashedPassword } = require('./UsersController');

const getConnect = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // get user credentials Basic Auth
  const credentials = Buffer.from(authHeader.split('')[1], 'base64').toString('utf-8').split(':');
  const [email, passowrd] = credentials;
  // find user
  const user = await dbclient.getUserByEmailandPassword(email, hashedPassword(passowrd));

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
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
const getMe = async (req, res) => {
  const token = await req.headers['X-token'];
  if (token) {
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    const user = await dbclient.getUserById(userId);
    // Return user object (email and id only)
    const { _id, email } = user;
    return res.status(200).json({ id: _id.toString(), email });
  }
  return res.status(401).json({ error: 'Unauthorized' });
};
module.exports = { getConnect, getDisconnect, getMe };
