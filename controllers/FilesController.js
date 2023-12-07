import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class FilesController {
  static async postUpload(req, res) {
    try {
      const token = req.headers['x-token'];

      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const key = `auth_${token}`;
      const userId = await redisClient.get(key);
      const user = await dbClient.getUserById(userId);

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const {
        name, type, parentId = 0, isPublic = false, data,
      } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Missing name' });
      }

      if (!type || !['folder', 'file', 'image'].includes(type)) {
        return res.status(400).json({ error: 'Missing or invalid type' });
      }

      if ((type !== 'folder') && !data) {
        return res.status(400).json({ error: 'Missing data' });
      }

      if (parentId !== 0) {
        const parentFile = await dbClient.getFileById(parentId);

        if (!parentFile) {
          return res.status(400).json({ error: 'Parent not found' });
        }

        if (parentFile.type !== 'folder') {
          return res.status(400).json({ error: 'Parent is not a folder' });
        }
      }

      let localPath;

      if (type !== 'folder') {
        // Decode Base64 data
        const fileContent = Buffer.from(data, 'base64');

        // Create a local path in the storing folder with filename as UUID
        const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
        localPath = `${folderPath}/${uuidv4()}`;

        // Store the file in clear in the local path
        fs.writeFileSync(localPath, fileContent);
      }

      // Save file information to MongoDB
      const newFile = {
        userId: user._id,
        name,
        type,
        isPublic,
        parentId,
        localPath: localPath || null,
      };

      const result = await dbClient.insertFile(newFile);

      return res.status(201).json({
        id: result.ops[0]._id,
        name,
        type,
        parentId,
        isPublic,
        localPath,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default FilesController;
