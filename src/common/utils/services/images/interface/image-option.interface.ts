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
