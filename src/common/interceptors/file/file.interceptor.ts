import { FileMimeTypeValidator } from '@common//validations/file-mime-type.validator';
import { FileSizeValidator } from '@common/validations/file-size.validator';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class FileValidationInterceptor implements NestInterceptor {
  constructor(
    private readonly mimeTypeValidator: FileMimeTypeValidator,
    private readonly sizeValidator: FileSizeValidator,
    private readonly fileField: string,
    private readonly isRequired: boolean = false,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    let filteredFiles;
    if (Array.isArray(request.files)) {
      const files = (request.files as Express.Multer.File[]) || [];
      filteredFiles = files.filter((file) => file.fieldname === this.fileField);
    } else if (request.file) {
      const file = request.file as Express.Multer.File;
      if (file.fieldname === this.fileField) {
        filteredFiles = request.file;
      } else {
        filteredFiles = null;
      }
    }
    if (Array.isArray(filteredFiles) && filteredFiles.length > 0) {
      for (const filteredFile of filteredFiles) {
        try {
          this.mimeTypeValidator.transform(filteredFile); // Validate MIME type
          this.sizeValidator.transform(filteredFile); // Validate file size
        } catch (error) {
          throw new BadRequestException(error);
        }
      }
      request.body[this.fileField] = filteredFiles;
    } else if (filteredFiles) {
      try {
        this.mimeTypeValidator.transform(filteredFiles);
        this.sizeValidator.transform(filteredFiles);
      } catch (error) {
        throw new BadRequestException(error);
      }
      request.body[this.fileField] = filteredFiles;
    }
    if (
      this.isRequired &&
      ((!Array.isArray(filteredFiles) && !filteredFiles) ||
        (Array.isArray(filteredFiles) && filteredFiles.length <= 0))
    ) {
      throw new BadRequestException(`${this.fileField} is required`);
    }

    return next.handle();
  }
}
