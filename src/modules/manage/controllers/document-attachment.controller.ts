import { Body, Controller, Inject, Param, Patch } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DOCUMENT_ATTACHMENT_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { IDocumentAttachmentServiceInterface } from '../domain/ports/input/document-attachment-domain-service.interface';
import { DocumentAttachmentDataMapper } from '../application/mappers/document-attachment.mapper';
import { DocumentAttachmentResponse } from '../application/dto/response/document-attachment.response';
import { UpdateDocumentAttachmentDto } from '../application/dto/create/documentSttachment/update.dto';

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
  async updateFile(
    @Param('id') id: number,
    @Body() dto: UpdateDocumentAttachmentDto,
  ): Promise<ResponseResult<DocumentAttachmentResponse>> {
    const result = await this._documentAttachmentService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }
}
