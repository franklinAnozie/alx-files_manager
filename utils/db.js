import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const HOST = process.env.DB_HOST || 'localhost';
    const PORT = process.env.DB_PORT || 27017;
    const DB = process.env.DB_DATABASE || 'files_manager';
    const URI = `mongodb://${HOST}:${PORT}`;

    this.mongoClient = new MongoClient(URI, { useUnifiedTopology: true });
    this.mongoClient.connect().then(() => {
      this.db = this.mongoClient.db(DB);
    }).catch((error) => console.log(error));
  }

  isAlive() {
    return this.mongoClient.isConnected();
  }

  getCollections(collection) {
    return this.db.collection(collection);
  }

  async nbUsers() {
    try {
      return this.getCollections('users').countDocuments();
    } catch (err) {
      return err;
    }
  }

  async nbFiles() {
    try {
      return this.getCollections('files').countDocuments();
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
export default dbClient;
