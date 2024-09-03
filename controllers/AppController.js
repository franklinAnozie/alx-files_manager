import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AppController {
  static getStatus(request, response) {
    try {
      const redisStatus = redisClient.isAlive();
      const dbStatus = dbClient.isAlive();

      return response
        .status(200)
        .json({
          redis: redisStatus,
          db: dbStatus,
        });
    } catch (error) {
      return error;
    }
  }

  static async getStats(request, response) {
    try {
      const users = await dbClient.nbUsers();
      const files = await dbClient.nbFiles();

      return response
        .status(200)
        .json({
          users,
          files,
        });
    } catch (error) {
      return error;
    }
  }
}

export default AppController;
