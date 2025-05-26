import { Readable } from 'stream';
import { AmazonS3Response } from './aws3.response';

export interface IAmazonS3ImageService {
  uploadFile(
    file: Express.Multer.File,
    folder: string,
    fileKey?: string,
  ): Promise<AmazonS3Response>;
  uploadFiles(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<AmazonS3Response[]>;
  getFile(key: string): Promise<Readable>;
  getPreSignedUrl(key: string, expiresIn: number): Promise<string>;
  deleteFile(key: string): Promise<void>;
  deleteFiles(keys: string[]): Promise<void>;
  getCloudFrontImageUrl(key: string): string;
}
