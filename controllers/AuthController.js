import { v4 } from 'uuid';
import dbClient from '../utils/db';
import UsersController from './UsersController';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(request, response) {
    try {
      const authHeaders = request.headers.authorization;
      if (!authHeaders || !authHeaders.startsWith('Basic ')) {
        return response.status(401).json({ error: 'Unauthorized' });
      }
      const authCred = authHeaders.split('')[1];
      const credentials = Buffer.from(authCred, 'base64').toString('ascii');
      const [email, password] = credentials.split(':');
      if (!email || !password) return response.status(401).json({ error: 'Unauthorized' });
      const hashedPassword = UsersController.hashPasswordSHA1(password);
      const user = await dbClient.getCollections('users').findOne({ email, password: hashedPassword });
      if (!user) return response.status(401).json({ error: 'Unauthorized' });

      const token = v4();
      const key = `auth_${token}`;

      await redisClient.set(key, user._id.toString(), 24 * 60 * 60);

      return response.status(200).json({ token });
    } catch (error) {
      return response.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getDisconnect(request, response) {
    const token = request.headers['x-token'];
    if (!token) return response.status(401).json({ error: 'Unauthorized' });

    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) return response.status(400).json({ eror: 'Unauthorized' });

    await redisClient.del(key);
    return response.status(200).send();
  }
}

export default AuthController;
