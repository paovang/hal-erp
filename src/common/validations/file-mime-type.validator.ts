import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileMimeTypeValidator implements PipeTransform {
  constructor(private readonly allowedTypes: string[]) {}

  transform(value: any): any {
    if (!this.isValidMimeType(value.mimetype, this.allowedTypes)) {
      throw new BadRequestException(
        `File type not allowed. Allowed types: ${this.allowedTypes.join(', ')}`,
      );
    }
    return value;
  }

  isValidMimeType(mimeType: string, allowedTypes: string[]): boolean {
    return allowedTypes.includes(mimeType);
  }
}
