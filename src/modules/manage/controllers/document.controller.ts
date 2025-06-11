import { Body, Controller, Inject, Post } from '@nestjs/common';
import { DOCUMENT_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { IDocumentServiceInterface } from '../domain/ports/input/document-domain-service.interface';
import { DocumentDataMapper } from '../application/mappers/document.mapper';
import { CreateDocumentDto } from '../application/dto/create/Document/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DocumentResponse } from '../application/dto/response/document.response';

@Controller('documents')
export class DocumentController {
  constructor(
    @Inject(DOCUMENT_APPLICATION_SERVICE)
    private readonly _documentService: IDocumentServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: DocumentDataMapper,
  ) {}

  @Post('')
  async create(
    @Body() dto: CreateDocumentDto,
  ): Promise<ResponseResult<DocumentResponse>> {
    const result = await this._documentService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }
}
