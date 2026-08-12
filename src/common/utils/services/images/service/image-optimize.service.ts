import sharp from 'sharp';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import { IImageOptimizeService } from '@src/common/utils/services/images/interface/image-optimize-service.interface';
import { ImageOptions } from '@src/common/utils/services/images/interface/image-option.interface';
import { DomainException } from '@src/common/domain/exceptions/domain.exception';
import {
  SUPPORTED_IMAGE_MIME_TYPES,
  NON_RASTER_IMAGE_MIME_TYPES,
  MAX_IMAGE_DIMENSION,
} from '@src/common/constants/inject-key.const';

/**
 * ImageService class provides methods to optimize images.
 */
@Injectable()
export class ImageOptimizeService implements IImageOptimizeService {
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
  ): Promise<Express.Multer.File> {
    if (
      !SUPPORTED_IMAGE_MIME_TYPES.includes(file.mimetype) ||
      NON_RASTER_IMAGE_MIME_TYPES.includes(file.mimetype)
    ) {
      // Return original file without image processing
      return file;
    }
    // Promise<Buffer>
    const DEFAULT_QUALITY = 90;
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

    // rotate() applies the EXIF orientation, otherwise photos taken on a phone
    // come out sideways once the tag is dropped by the re-encode below.
    let image = sharp(buffer).rotate();

    const metadata = await image.metadata();
    const originalFormat = metadata.format;

    const formatToUse = options.format ?? originalFormat;

    const { width = 0, height = 0 } = metadata;
    const scale = options.scale;
    if (options.width || options.height || scale) {
      image = image.resize(
        options.width ?? (scale ? Math.floor(width * scale) : null),
        options.height ?? (scale ? Math.floor(height * scale) : null),
      );
    } else {
      // No explicit size requested: keep the original resolution and only cap
      // oversized images, never upscale.
      image = image.resize({
        width: MAX_IMAGE_DIMENSION,
        height: MAX_IMAGE_DIMENSION,
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    if (formatToUse) {
      image = image.toFormat(formatToUse);

      const quality = options.quality ?? DEFAULT_QUALITY;
      switch (formatToUse) {
        case 'jpeg':
        case 'jpg':
          image = image.jpeg({
            quality,
            chromaSubsampling: '4:4:4',
          });
          break;
        case 'png':
          // No `quality` here: sharp reads it as "quantise to a palette", which
          // crushes screenshots and gradients down to 256 colours.
          image = image.png({
            compressionLevel: 9,
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
    const optimizedBuffer = await image.toBuffer();
    return this.bufferToMulterFile(
      optimizedBuffer,
      file.originalname,
      file.mimetype,
    );
    // return await image.toBuffer();
  }
  private bufferToMulterFile(
    buffer: Buffer,
    filename: string,
    mimetype: string,
  ): Express.Multer.File {
    return {
      buffer,
      originalname: filename,
      mimetype,
      size: buffer.length,
      fieldname: 'file',
      encoding: '7bit',
      stream: this.bufferToStream(buffer),
      destination: '',
      filename: '',
      path: '',
    } as Express.Multer.File;
  }
  private bufferToStream(buffer: Buffer): Readable {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }
}
