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
import { DOCUMENT_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { IDocumentServiceInterface } from '../domain/ports/input/document-domain-service.interface';
import { DocumentDataMapper } from '../application/mappers/document.mapper';
import { CreateDocumentDto } from '../application/dto/create/document/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DocumentResponse } from '../application/dto/response/document.response';
import { DocumentQueryDto } from '../application/dto/query/document.dto';
import { UpdateDocumentDto } from '../application/dto/create/document/update.dto';

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

  @Get('')
  async getAll(
    @Query() dto: DocumentQueryDto,
  ): Promise<ResponseResult<DocumentResponse>> {
    const result = await this._documentService.getAll(dto);
    console.log('object', result);
    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<DocumentResponse>> {
    const result = await this._documentService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateDocumentDto,
  ): Promise<ResponseResult<DocumentResponse>> {
    const result = await this._documentService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._documentService.delete(id);
  }
}
