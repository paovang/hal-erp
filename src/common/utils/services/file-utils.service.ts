import { PROFILE_IMAGE_ALLOW_MIME_TYPE } from '@src/common/constants/inject-key.const';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as mime from 'mime-types';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { HttpStatus } from '@nestjs/common';

export async function createMockMulterFile(
  baseFolder: string,
  filename: string,
): Promise<Express.Multer.File> {
  let files: string[];
  try {
    files = await fs.readdir(baseFolder);
  } catch (err) {
    throw new ManageDomainException(
      'errors.not_found_directory',
      HttpStatus.NOT_FOUND,
    );
  }

  if (!files.includes(filename)) {
    throw new ManageDomainException(
      'errors.not_found_file',
      HttpStatus.NOT_FOUND,
    );
  }

  const fullPath = path.join(baseFolder, filename);

  const buffer = await fs.readFile(fullPath);

  let mimeType = mime.lookup(fullPath) || 'application/octet-stream';
  if (!PROFILE_IMAGE_ALLOW_MIME_TYPE.includes(mimeType)) {
    mimeType = PROFILE_IMAGE_ALLOW_MIME_TYPE[0];
  }

  return {
    fieldname: 'signature',
    originalname: filename,
    encoding: '7bit',
    mimetype: mimeType,
    size: buffer.length,
    destination: path.dirname(fullPath),
    filename,
    path: fullPath,
    buffer,
    stream: (await import('fs')).createReadStream(fullPath),
  };
}
