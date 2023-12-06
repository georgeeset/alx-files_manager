import redisClient from '../utils/redis';
import dbclient from '../utils/db';

class AppController {
  static getStatus(req, res) {
    const redisStatus = redisClient.isAlive();
    const dbStatus = dbclient.isAlive();
    res.status(200).json({ redis: redisStatus, db: dbStatus });
  }

  static async getStats(req, res) {
    const userNumber = await dbclient.nbUsers();
    const fileNumber = await dbclient.nbFiles();
    res.status(200).json({ users: userNumber, files: fileNumber });
  }
}
module.exports = AppController;
