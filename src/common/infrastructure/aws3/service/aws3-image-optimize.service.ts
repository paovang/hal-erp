import sharp from 'sharp';
import { HttpStatus, Injectable } from '@nestjs/common';
import { DomainException } from '@src/common/domain/exceptions/domain.exception';

type ImageFormat = 'jpeg' | 'jpg' | 'png' | 'webp' | 'tiff';
export interface ImageOptions {
  /**
   * Scale factor for resizing the image. A scale of 1 means the original dimensions will be used.
   */
  scale?: number;

  /**
   * Desired width for the output image.
   */
  width?: number;

  /**
   * Desired height for the output image.
   */
  height?: number;

  /**
   * Desired format for the output image.
   */
  format?: ImageFormat;

  /**
   * Quality setting for the output image. Ranges from 0 to 100.
   */
  quality?: number;

  /**
   * File size setting for validating. unit is byte ex: 1MB = one million bytes.
   */
  max_file_size?: number;
}

/**
 * ImageService class provides methods to optimize images.
 */
@Injectable()
export class AmazonS3ImageOptimizeService {
  /**
   * Optimize an image based on provided options.
   *
   * @param {Buffer} file - The buffer containing image data.
   * @param {ImageOptions} options - Options to optimize the image.
   * @returns {Promise<Buffer>} - A promise that resolves to a buffer containing the optimized image.
   * @throws Will throw an error if invalid parameters are provided.
   */
  async optimizeImage(
    file: Express.Multer.File,
    options: ImageOptions = {},
  ): Promise<Buffer> {
    const DEFAULT_SCALE = 1;
    const DEFAULT_QUALITY = 80;
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const buffer = Buffer.from(file.buffer);
    if (!Buffer.isBuffer(buffer)) {
      throw new DomainException('INVALID_IMAGE_BUFFER', HttpStatus.BAD_REQUEST);
    }
    // Validate file size
    if (buffer.length > (options.max_file_size ?? MAX_FILE_SIZE)) {
      throw new DomainException(
        `FILE_TOO_LARGE ${MAX_FILE_SIZE / 1000000}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    let image = sharp(buffer);

    const metadata = await image.metadata();
    const originalFormat = metadata.format;

    const formatToUse = options.format ?? originalFormat;

    const { width = 0, height = 0 } = metadata;
    const scale = options.scale ?? DEFAULT_SCALE;
    image = image.resize(
      options.width ?? Math.floor(width * scale),
      options.height ?? Math.floor(height * scale),
    );

    if (formatToUse) {
      image = image.toFormat(formatToUse);

      const quality = options.quality ?? DEFAULT_QUALITY;
      switch (formatToUse) {
        case 'jpeg':
        case 'jpg':
          image = image.jpeg({
            quality,
          });
          break;
        case 'png':
          image = image.png({
            quality,
          });
          break;
        case 'webp':
          image = image.webp({
            quality,
          });
          break;
        case 'tiff':
          image = image.tiff({
            quality,
          });
          break;
        default:
          throw new DomainException('INVALID_IMAGE_FORMAT', 400, 'custom');
      }
    }
    return await image.toBuffer();
  }
}
