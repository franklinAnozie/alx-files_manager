import crypto from 'crypto';
import mongodb from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  static hashPasswordSHA1(password) {
    return crypto.createHash('sha1').update(password).digest('hex');
  }

  static async getMe(request, response) {
    const token = request.headers['X-Token'];
    if (!token) return response.status(401).json({ error: 'Unauthorized' });
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return response.status(401).json({ error: 'Unauthorized' });
    const users = dbClient.getCollections('users');
    const user = await users.findOne({ _id: mongodb.ObjectId(userId) });
    if (!user) return response.status(401).json({ error: 'Unauthorized' });
    return response.status(200).json({ id: user._id, email: user.email });
  }

  static async postNew(request, response) {
    try {
      const { email, password } = request.body;
      if (!email) return response.status(400).json({ error: 'Missing email' });
      if (!password) return response.status(400).json({ error: 'Missing password' });
      const users = dbClient.getCollections('users');
      const existingUser = await users.findOne({ email });
      if (existingUser) return response.status(400).json({ error: 'Already exist' });
      const hashedPassword = UsersController.hashPasswordSHA1(password);
      const newUser = { email, password: hashedPassword };
      const result = await users.insertOne(newUser);
      return response.status(201).json({ id: result.insertedId, email });
    } catch (error) {
      return response.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default UsersController;
