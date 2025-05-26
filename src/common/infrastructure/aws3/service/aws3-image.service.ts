import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, Inject } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
// import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Readable } from 'stream';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  AMAZON_S3_BUCKET_KEY,
  AMAZON_S3_OPTION_KEY,
  AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME,
} from '../config/inject-key';
import { IAmazonS3ImageService } from '../interface/amazon-s3-image-service.interface';
import { AmazonS3Response } from '../interface/aws3.response';
@Injectable()
export class S3Service implements IAmazonS3ImageService {
  constructor(
    // @InjectPinoLogger(S3Service.name) private readonly logger: PinoLogger,
    @Inject(AMAZON_S3_OPTION_KEY) private readonly s3Client: S3Client,
    @Inject(AMAZON_S3_BUCKET_KEY)
    private readonly amazonS3BucketName: string,
    @Inject(AWS_CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME)
    private readonly _amazonS3CloudFrontDomain: string,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    folder: string,
    fileKey: string = '',
  ): Promise<AmazonS3Response> {
    const currentTimestamp = Date.now();
    if (fileKey === '') {
      fileKey = `${folder}/${uuidv7()}-${currentTimestamp}`;
    } else {
      fileKey = `${folder}/${fileKey}`;
    }

    const command = new PutObjectCommand({
      Bucket: this.amazonS3BucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await this.s3Client.send(command);
      return new AmazonS3Response({
        fileKey: fileKey,
        size: file.size,
        mimeType: file.mimetype,
      });
    } catch (error) {
      //   this.logger.error('Error uploading file to S3', error);
      throw error;
    }
  }
  async uploadFiles(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<AmazonS3Response[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file, folder));
    return await Promise.all(uploadPromises);
  }

  async getFile(key: string): Promise<Readable> {
    const fileKey = `${key}`;
    const command = new GetObjectCommand({
      Bucket: this.amazonS3BucketName,
      Key: fileKey,
    });

    try {
      const data = await this.s3Client.send(command);
      const stream = new Readable();
      stream._read = () => {};
      const imageByteArray = await data.Body?.transformToByteArray();
      stream.push(imageByteArray);
      // stream.push(null);
      return stream;
    } catch (error) {
      //   this.logger.error('Error getting file from S3', error);
      throw error;
    }
  }

  async getPreSignedUrl(
    key: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    const fileKey = `${key}`;
    const command = new GetObjectCommand({
      Bucket: this.amazonS3BucketName,
      Key: fileKey,
    });

    try {
      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      return url;
    } catch (error) {
      //   this.logger.error('Error generating pre-signed URL', error);
      throw error;
    }
  }

  async deleteFile(key: string): Promise<void> {
    const fileKey = `${key}`;
    const command = new DeleteObjectCommand({
      Bucket: this.amazonS3BucketName,
      Key: fileKey,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      //   this.logger.error('Error deleting file from S3', error);
      throw error;
    }
  }

  getCloudFrontImageUrl(key: string): string {
    return `${this._amazonS3CloudFrontDomain}/${key}`;
  }
  async deleteFiles(keys: string[]): Promise<void> {
    const deletePromises = keys.map((key) => this.deleteFile(key));
    await Promise.all(deletePromises);
  }
}
