import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DOCUMENT_TYPE_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { IDocumentTypeServiceInterface } from '../domain/ports/input/document-type-domain-service.interface';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { DocumentTypeDataMapper } from '../application/mappers/document-type.mapper';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CreateDocumentTypeDto } from '../application/dto/create/documentType/create.dto';
import { DocumentTypeResponse } from '../application/dto/response/document-type.response';
import { DocumentTypeQueryDto } from '../application/dto/query/document-type-query.dto';
import { UpdateDocumentTypeDto } from '../application/dto/create/documentType/update.dto';

@Controller('document-types')
export class DocumentTypeController {
  constructor(
    @Inject(DOCUMENT_TYPE_APPLICATION_SERVICE)
    private readonly _documentTypeService: IDocumentTypeServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: DocumentTypeDataMapper,
  ) {}

  @Post('')
  async create(
    @Body() dto: CreateDocumentTypeDto,
  ): Promise<ResponseResult<DocumentTypeResponse>> {
    const result = await this._documentTypeService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get('')
  async getAll(
    @Query() dto: DocumentTypeQueryDto,
  ): Promise<ResponseResult<DocumentTypeResponse>> {
    const result = await this._documentTypeService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<DocumentTypeResponse>> {
    const result = await this._documentTypeService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateDocumentTypeDto,
  ): Promise<ResponseResult<DocumentTypeResponse>> {
    const result = await this._documentTypeService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._documentTypeService.delete(id);
  }
}
