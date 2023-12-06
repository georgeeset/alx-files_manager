import redisClient from "../utils/redis";
import dbclient from "../utils/db";

const getStatus = async (req, res) => {
	const redisStatus = redisClient.isAlive();
	const dbStatus = dbclient.isAlive();
	return res.status(200).json({redis: redisStatus, db: dbStatus});
};
const getStats = async (req, res) => {
	const userNumber = dbclient.nbUsers();
	const fileNumber = dbclient.nbFiles();
	return res.status(200). json({users: userNumber, files: fileNumber});
};
module.exports = { getStatus, getStats };