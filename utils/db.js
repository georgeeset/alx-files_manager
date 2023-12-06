import { MongoClient } from 'mongodb';
// const { MongoClient } = require('mongodb');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

class DBClient {
  constructor() {

    this.host = process.env.BD_HOST || 'localhost';
    this.port = process.env.PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';
    this.client = new MongoClient(`mongodb://${this.host}:${this.port}/${this.database}`, { useUnifiedTopology: true });

    this.client.connect()
      .then(() => {
        // console.log('Mongo bd connected');
      }).catch((error) => {
        console.log(error);
      });

  }

  isAlive() { return !!this.db; }

  async nbUsers() { return this.users.countDocuments(); }

  async nbFiles() { return this.files.countDocuments(); }

  async getUser(query) {
    const user = await this.db.collection('users').findOne(query);
    return user;
  }
	async findUserByEmail(email) {
		if (this.isAlive){
			const userCollection = this.client.db().collection('users');
			const user = await userCollection.findOne({email});
			return user;
		}

	}
	async insertUser(user){
		const userCollection = this.client.db().collection('users');
		const newuser = await userCollection.insertOne(user)
		return newuser;
	}
	async getUserByEmailandPassword(email, hashedPassword) {
		const userCollection = this.client.db().collection('users');
		const user = await userCollection.findOne({email, password:hashedPassword});
		return user;
	}
	async getUserById(userId) {
		const userCollection = this.client.db().collection('users');
		const user = await userCollection.findOne({_id: userId});
		return user;
	}
}

const dbClient = new DBClient();
module.exports = dbClient;
