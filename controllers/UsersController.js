//import redisClient from "../utils/redis";
import dbclient from "../utils/db";
const crytpo = require('crypto');

function  hashPassword(password) {
	const sha1Hash = crytpo.createHash('sha1');
	sha1Hash.update(password, 'utf-8');
	const hashPassword = sha1Hash.digest('hex');
	return hashPassword;
	}
	
const postNew = async (req, res) => {
	try{
		console.log('Request body:',req.body);
		const {email, password} = req.body;
		if(!email){
			return res.status(400).json({ error: 'Missing email'});
		}
		if (!password) {
			return res.status(400).json({error: 'Missing passowrd'});
		}
		// check if user already exsts in Db
		const ExistingUser = dbclient.findUserByEmail(email);
		if (ExistingUser){
			return res.status(400).json({error: 'User Already Exists'});
		}
		const hashedPassword = hashPassword(password);
		// create new User
		const newUser = {
			email,
			password: hashedPassword,
		};
		//save the user
		const result = await dbclient.insertUser(newUser);
		// recently addedusers
		const userObj = result.ops[0];
		// id
		const _id = userObj._id;
		// email
		const userEmail = userObj.email;
		// return the new user with only email and id
		return res.status(201).json({ id: _id, email: userEmail });
	} catch (error){
		return res.status(500).json({})
	}
}
module.exports = {hashPassword, postNew};