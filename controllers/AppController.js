import { dbClient, redisClient } from '../utils';

const getStatus = async (request, response) => {
  try {
    const redisStatus = await redisClient.isAlive();
    const dbStatus = await dbClient.isAlive();

    return response
      .status(200)
      .json({
        redis: redisStatus,
        db: dbStatus,
      });
  } catch (error) {
    return error;
  }
};

const getStats = async (request, response) => {
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
};

module.exports = {
  getStats,
  getStatus,
};
