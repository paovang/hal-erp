import { ImageOptions } from './image-option.interface';

export interface IImageOptimizeService {
  optimizeImage(
    file: Express.Multer.File,
    options?: ImageOptions,
  ): Promise<Express.Multer.File>;
}
