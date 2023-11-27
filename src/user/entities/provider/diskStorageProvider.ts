import { Injectable } from '@nestjs/common';
import uploadConfig from '../upload-avatar';
import { promises, mkdirSync } from 'fs';
import { resolve } from 'path';

@Injectable()
export default class DiskStorageProvider {
  public async saveFile(file: string): Promise<string> {
    await mkdirSync(uploadConfig.directory, { recursive: true });

    await promises.rename(
      resolve(uploadConfig.tmpFolder, file),
      resolve(uploadConfig.directory, file),
    );

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const filePath = resolve(uploadConfig.directory, file);

    try {
      await promises.stat(filePath);
    } catch {
      return;
    }

    await promises.unlink(filePath);
  }
}
