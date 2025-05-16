import { Body, Controller, Inject, Post } from "@nestjs/common";
import { DOCUMENT_TYPE_APPLICATION_SERVICE } from "../application/constants/inject-key.const";
import { IDocumentTypeServiceInterface } from "../domain/ports/input/document-type-domain-service.interface";
import { TRANSFORM_RESULT_SERVICE } from "@src/common/constants/inject-key.const";
import { ITransformResultService } from "@src/common/application/interfaces/transform-result-service.interface";
import { DocumentTypeDataMapper } from "../application/mappers/document-type.mapper";
import { ResponseResult } from "@src/common/application/interfaces/pagination.interface";
import { CreateDocumentTypeDto } from "../application/dto/create/documentType/create.dto";
import { DocumentTypeResponse } from "../application/dto/response/document-type.response";

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
        console.log('object 1', );
      const result = await this._documentTypeService.create(dto);
  
      return this._transformResultService.execute(
        this._dataMapper.toResponse.bind(this._dataMapper),
        result,
      );
    }
}