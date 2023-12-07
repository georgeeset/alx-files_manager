const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    const uri = `mongodb://${host}:${port}/${database}`;

    this.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    this.client.connect((err) => {
      if (err) {
        console.error(`MongoDB Connection Error: ${err}`);
      } else {
        console.log('Connected to MongoDB');
      }
    });
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    const usersCollection = this.client.db().collection('users');
    try {
      const count = await usersCollection.countDocuments();
      return count;
    } catch (error) {
      console.error(`Error counting users: ${error}`);
      throw error;
    }
  }

  async nbFiles() {
    const filesCollection = this.client.db().collection('files');
    try {
      const count = await filesCollection.countDocuments();
      return count;
    } catch (error) {
      console.error(`Error counting files: ${error}`);
      throw error;
    }
  }
  async findUserByEmail(email){
    const userCollection = this.client.db().collection('users');
    const result = await userCollection.findOne({email});
    return result
  }
  async insertUser(userObj) {
    const userCollection = this.client.db().collection('users');
    const result = await userCollection.insertOne(userObj);
    return result;
  }

  async getUserByEmailandPassword(email, hashedPassword) {
    const userCollection = this.client.db().collection('users');
    const user = await userCollection.findOne({ email, password: hashedPassword });
    return user;
  }

  async getUserById(userId) {
    const userCollection = this.client.db().collection('users');
    const user = await userCollection.findOne({userId });
    return user;
  }
}
const dbclient = new DBClient();
export default dbclient;
