import {
  Controller,
  HttpStatus,
  Inject,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerStorage } from '@src/common/utils/multer.utils';
import { FileValidationInterceptor } from '@src/common/interceptors/file/file.interceptor';
import { FileMimeTypeValidator } from '@src/common/validations/file-mime-type.validator';
import { FileSizeValidator } from '@src/common/validations/file-size.validator';
import {
  SUPPORTED_UPLOAD_MIME_TYPES,
  TRANSFORM_RESULT_SERVICE,
} from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DOCUMENT_ATTACHMENT_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { IDocumentAttachmentServiceInterface } from '../domain/ports/input/document-attachment-domain-service.interface';
import { DocumentAttachmentDataMapper } from '../application/mappers/document-attachment.mapper';
import { DocumentAttachmentResponse } from '../application/dto/response/document-attachment.response';
import { UpdateDocumentAttachmentDto } from '../application/dto/create/documentSttachment/update.dto';
import { ManageDomainException } from '../domain/exceptions/manage-domain.exception';

@Controller('document-attachments')
export class DocumentAttachmentController {
  constructor(
    @Inject(DOCUMENT_ATTACHMENT_APPLICATION_SERVICE)
    private readonly _documentAttachmentService: IDocumentAttachmentServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: DocumentAttachmentDataMapper,
  ) {}

  @Patch(':id/file')
  @ApiOperation({
    summary: 'Replace the uploaded file of a document attachment (PO/PR/receipt)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', { storage: multerStorage }),
    new FileValidationInterceptor(
      new FileMimeTypeValidator([...SUPPORTED_UPLOAD_MIME_TYPES]),
      new FileSizeValidator(10 * 1024 * 1024),
      'file',
    ),
  )
  async updateFile(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseResult<DocumentAttachmentResponse>> {
    if (!file) {
      throw new ManageDomainException(
        'errors.file_name_required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const dto: UpdateDocumentAttachmentDto = { file_name: file.filename };
    const result = await this._documentAttachmentService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }
}
