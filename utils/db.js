const { MongoClient } = require('mongodb');

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

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
		if (this.isAlive()){
    	const userColletion = this.client.db().collection('users');
    	const userNumber = await userColletion.countDocuments();
    	return userNumber;
		}
  }

  async nbFiles() {
    
		if (this.isAlive()){
			// access the collectiom

    	const filesColletion = this.client.db().collection('files');
    	const fileNumber = await filesColletion.countDocuments();
    	return fileNumber;
		}
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
const dbclient = new DBClient();
export default dbclient;
