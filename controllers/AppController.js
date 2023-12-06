import redisClient from '../utils/redis';
import dbclient from '../utils/db';

const getStatus = async (req, res) => {
  const redisStatus = await redisClient.isAlive();
  const dbStatus = await dbclient.isAlive();
  return res.status(200).json({ redis: redisStatus, db: dbStatus });
};
const getStats = async (req, res) => {
  const userNumber = await dbclient.nbUsers();
  const fileNumber = await dbclient.nbFiles();
  return res.status(200).json({ users: userNumber, files: fileNumber });
};
module.exports = { getStatus, getStats };
