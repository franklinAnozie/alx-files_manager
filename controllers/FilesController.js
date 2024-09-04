import fs from 'fs';
import { v4 } from 'uuid';
import mongodb from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class FilesController {
  static async postUpload(request, response) {
    const token = request.headers['x-token'];
    if (!token) return response.status(401).json({ error: 'Unauthorized' });
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) return response.status(401).json({ error: 'Unauthorized' });
    const users = dbClient.getCollections('users');
    const user = await users.findOne({ _id: mongodb.ObjectId(userId) });
    if (!user) return response.status(401).json({ error: 'Unauthorized' });
    const {
      name,
      type,
      parentId,
      isPublic,
      data,
    } = request.body;
    if (!name) return response.status(400).json({ error: 'Missing name' });
    if (!type || !['folder', 'file', 'image'].includes(type)) return response.status(400).json({ error: 'Missing type' });
    if (!data && type !== 'folder') return response.status(400).json({ error: 'Missing data' });
    if (parentId) {
      const parents = await dbClient.getCollections('files');
      const parent = await parents.findOne({ _id: mongodb.ObjectId(parentId) });
      if (!parent) return response.status(400).json({ error: 'Parent not found' });
      if (parent[0].type !== 'folder') return response.status(400).json({ error: 'Parent is not a folder' });
    }
    if (type === 'folder') {
      const files = await dbClient.getCollections('files');
      const fileDetails = {
        userId: user,
        name,
        type,
        parentId: parentId || 0,
        isPublic,
      };
      const fileId = files.insertOne(fileDetails);
      return response.status(201).json({
        id: fileId,
        userId: user,
        name,
        type,
        isPublic: fileDetails.isPublic,
        parentId: fileDetails.parentId,
      });
    }
    const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
    const fileName = v4();
    const fileDetails = {
      userId: user,
      name,
      type,
      parentId: parentId || 0,
      isPublic,
      localPath: `${folderPath}/${fileName}`,
    };
    const files = await dbClient.getCollections('files');
    const fileId = files.insertOne(fileDetails);
    const filePath = `${folderPath}/${fileName}`;
    const dataBuffer = Buffer.from(data, 'base64');
    fs.writeFileSync(filePath, dataBuffer);
    return response.status(201).json({
      id: fileId,
      userId: user,
      name,
      type,
      isPublic: fileDetails.isPublic,
      parentId: fileDetails.parentId,
    });
  }
}

export default FilesController;
