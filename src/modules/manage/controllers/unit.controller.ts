import { Controller, Inject } from "@nestjs/common";
import { TRANSFORM_RESULT_SERVICE } from "@src/common/constants/inject-key.const";
import { UNIT_APPLICATION_SERVICE } from "../application/constants/inject-key.const";
import { ITransformResultService } from "@src/common/application/interfaces/transform-result-service.interface";
import { IUnitServiceInterface } from "../domain/ports/input/unit-domain-service.interface";
import { UnitDataMapper } from "../application/mappers/unit.mapper";

@Controller('units')
export class UnitController {
  constructor(
    @Inject(UNIT_APPLICATION_SERVICE)
    private readonly _unitService: IUnitServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: UnitDataMapper,
  ) {}

//   @Post('')
//       async create(
//         @Body() dto: CreateDocumentTypeDto,
//       ): Promise<ResponseResult<DocumentTypeResponse>> {
//         const result = await this._documentTypeService.create(dto);
    
//         return this._transformResultService.execute(
//           this._dataMapper.toResponse.bind(this._dataMapper),
//           result,
//         );
//       }
}