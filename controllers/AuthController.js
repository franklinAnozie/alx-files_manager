import crypto from 'crypto';
import dbClient from '../utils/db';

class UsersController {
  static hashPasswordSHA1(password) {
    return crypto.createHash('sha1').update(password).digest('hex');
  }

  async postNew(request, response) {
    try {
      const { email, password } = request.body;
      if (!email) return response.status(400).json({ error: 'Missing email' });
      if (!password) return response.status(400).json({ error: 'Missing password' });
      const users = dbClient.getCollections('users');
      const existingUser = await users.findOne({ email });
      if (existingUser) return response.status(400).json({ error: 'Already exist' });
      const hashedPassword = this.hashPasswordSHA1(password);
      const newUser = { email, password: hashedPassword };
      const result = await users.insertOne(newUser);
      return response.status(201).json({ id: result.insertedId, email });
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new UsersController();
