import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const HOST = process.env.DB_HOST || 'localhost';
    const PORT = process.env.DB_PORT || 27017;
    const DB = process.env.DB_DATABASE || 'files_manager';
    const URI = `mongodb://${HOST}:${PORT}`;

    this.mongoClient = new MongoClient(URI, { useUnifiedTopology: true });
    this.mongoClient.connect((error) => {
      if (!error) this.db = this.mongoClient.db(DB);
    });
  }

  isAlive() {
    return this.mongoClient.isConnected();
  }

  async nbUsers() {
    try {
      const userCollections = await this.db.collection('users');
      const userCount = await userCollections.countDocuments();
      return userCount;
    } catch (err) {
      return err;
    }
  }

  async nbFiles() {
    try {
      const fileCollections = await this.db.collection('files');
      const filesCount = await fileCollections.countDocuments();
      return filesCount;
    } catch (error) {
      return error;
    }
  }

  async close() {
    try {
      await this.mongoClient.close();
    } catch (error) {
      console.log(error);
    }
  }
}

const dbClient = new DBClient();
module.exports = dbClient;
