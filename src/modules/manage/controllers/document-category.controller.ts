import { Controller, Get, Inject, Query } from '@nestjs/common';
import { DOCUMENT_CATEGORY_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { IDocumentCategoryServiceInterface } from '../domain/ports/input/document-category-domain-service.interface';
import { DocumentCategoryResponse } from '../application/dto/response/document-category.response';
import { DocumentCategoryDataMapper } from '../application/mappers/document-category.mapper';

@Controller('document-categories')
export class DocumentCategoryController {
  constructor(
    @Inject(DOCUMENT_CATEGORY_APPLICATION_SERVICE)
    private readonly _documentTypeService: IDocumentCategoryServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: DocumentCategoryDataMapper,
  ) {}

  @Get('')
  async getAll(): Promise<ResponseResult<DocumentCategoryResponse>> {
    const result = await this._documentTypeService.getAll();

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }
}
