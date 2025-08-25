import {
  SUPPORTED_UPLOAD_MIME_TYPES,
  SUPPORTED_IMAGE_MIME_TYPES,
} from '@src/common/constants/inject-key.const';
import * as fs from 'fs/promises';
import * as fsSync from 'fs'; // for createReadStream
import * as path from 'path';
import * as mime from 'mime-types';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { HttpStatus } from '@nestjs/common';
import sharp from 'sharp';

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
  const mimeType = mime.lookup(fullPath) || 'application/octet-stream';

  if (!SUPPORTED_UPLOAD_MIME_TYPES.includes(mimeType)) {
    throw new ManageDomainException(
      'errors.unsupported_file_type',
      HttpStatus.UNSUPPORTED_MEDIA_TYPE,
    );
  }

  // Log the file type for debugging
  console.log(`📄 Uploaded file: ${filename}`);
  console.log(`🔍 Detected MIME type: ${mimeType}`);

  let finalBuffer = buffer;

  // Only process image files (optional)
  if (SUPPORTED_IMAGE_MIME_TYPES.includes(mimeType)) {
    try {
      finalBuffer = await sharp(buffer).resize(300).toBuffer();
    } catch (err) {
      console.error('🛑 Sharp failed to process image:', err.message);
      throw new ManageDomainException(
        'errors.unsupported_image_format',
        HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      );
    }
  }

  return {
    fieldname: 'file',
    originalname: filename,
    encoding: '7bit',
    mimetype: mimeType,
    size: finalBuffer.length,
    destination: path.dirname(fullPath),
    filename,
    path: fullPath,
    buffer: finalBuffer,
    stream: fsSync.createReadStream(fullPath),
  };
}
