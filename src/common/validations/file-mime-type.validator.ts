import { HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { DomainException } from '../domain/exceptions/domain.exception';

@Injectable()
export class FileMimeTypeValidator implements PipeTransform {
  constructor(private readonly allowedTypes: string[]) {}

  transform(value: any): any {
    if (!this.isValidMimeType(value.mimetype, this.allowedTypes)) {
      throw new DomainException(
        'errors.invalid_file_type',
        HttpStatus.BAD_REQUEST,
        { property: this.allowedTypes.join(', ') },
      );
    }
    return value;
  }

  isValidMimeType(mimeType: string, allowedTypes: string[]): boolean {
    return allowedTypes.includes(mimeType);
  }
}
