import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const crypto = require('crypto');

class UserController {
  static hashPassword(password) {
    const sha1Hash = crypto.createHash('sha1');
    sha1Hash.update(password, 'utf-8');
    const hashPassword = sha1Hash.digest('hex');
    return hashPassword;
  }

  static async postNew(req, res) {
    try {
      console.log('Request body:', req.body);
      const { email, password } = req.body;

      if (!email) {
        return res.status(400).send({ error: 'Missing email' });
      }

      if (!password) {
        return res.status(400).send({ error: 'Missing password' });
      }

      // check if user already exists in Db
      const existingUser = await dbClient.findUserByEmail(email);

      if (existingUser) {
        return res.status(400).json({ error: 'Already exist' });
      }

      const hashedPassword = UserController.hashPassword(password);

      // create new User
      const newUser = {
        email,
        password: hashedPassword,
      };

      // save the user
      const result = await dbClient.insertUser(newUser);

      // list of recently added users
      const userObj = result.ops[0];

      // id
      const { _id } = userObj;

      // email
      const userEmail = userObj.email;

      // return the new user with only email and id
      return res.status(201).send({ id: _id, email: userEmail });
    } catch (error) {
      console.error('Error:', error);
      return res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  static async getMe(req, res) {
    try {
      const token = req.headers['x-token'];
      console.log('Token:', token);

      const key = `auth_${token}`;
      const userId = await redisClient.get(key);
      console.log('User ID from Redis:', userId);

      const user = await dbClient.getUserById(userId);
      console.log('User from MongoDB:', user);

      if (!user) {
        return res.status(401).send({ error: 'Unauthorized' });
      }

      // Return user object (email and _id only)
      const { _id, email } = user;
      return res.status(200).send({ id: _id.toString(), email });
    } catch (error) {
      console.error('Error in getMe:', error);
      return res.status(500).send({ error: 'Internal Server Error' });
    }
  }
}

module.exports = UserController;
