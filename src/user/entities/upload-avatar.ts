import { resolve } from 'path';
import { StorageEngine, diskStorage } from 'multer';
import { randomBytes } from 'crypto';

interface IUploadConfig {
  driver: 's3' | 'disk';
  tmpFolder: string;
  directory: string;
  multer: {
    storage: StorageEngine;
  };
  config: {
    aws: {
      bucket: string;
    };
  };
}

const uploadFolder = resolve(__dirname, 'upload');
const tmpFolder = resolve(__dirname, 'temp');

export default {
  driver: process.env.STORAGE_DRIVER,
  directory: uploadFolder,
  tmpFolder,
  multer: {
    storage: diskStorage({
      destination: tmpFolder,
      filename(req, file, callback) {
        const fileHash = randomBytes(5).toString('hex');

        const filename = `${fileHash}-${file.originalname}`;

        callback(null, filename);
      },
    }),
  },
  config: {
    aws: {
      bucket: 'api-vendas',
    },
  },
} as IUploadConfig;
