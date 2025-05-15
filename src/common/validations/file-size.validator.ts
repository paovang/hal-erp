import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FileSizeValidator implements PipeTransform {
  constructor(private readonly maxSize: number) {}

  transform(value: any): any {
    if (value.size > this.maxSize) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${this.maxSize} bytes`,
      );
    }
    return value;
  }
}
