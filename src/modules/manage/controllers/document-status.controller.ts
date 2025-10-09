import { Controller, Get, Inject, Query } from '@nestjs/common';
import { DOCUMENT_STATUS_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { IDocumentStatusServiceInterface } from '../domain/ports/input/document-status-domain-service.interface';
import { DocumentStatusQueryDto } from '../application/dto/query/document-status.dto';
import { DocumentStatusResponse } from '../application/dto/response/document-status.response';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DocumentStatusDataMapper } from '../application/mappers/document-status.mapper';

@Controller('document-status')
export class DocumentStatusController {
  constructor(
    @Inject(DOCUMENT_STATUS_APPLICATION_SERVICE)
    private readonly _documentStatusService: IDocumentStatusServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: DocumentStatusDataMapper,
  ) {}

  @Get('')
  async getAll(
    @Query() query: DocumentStatusQueryDto,
  ): Promise<ResponseResult<DocumentStatusResponse>> {
    const result = await this._documentStatusService.getAll(query);
    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }
}
