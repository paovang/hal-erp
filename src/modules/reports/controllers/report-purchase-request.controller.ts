import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { REPORT_PURCHASE_REQUEST_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { IReportPurchaseRequestServiceInterface } from '../domain/ports/input/report-purchase-request-domain-service.interface';
import { ReportPurchaseRequestDataMapper } from '../application/mappers/report-purchase-request.mpper';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ReportPurchaseRequestResponse } from '../application/dto/response/report-purchase-request.response';

@Controller('reports/purchase-requests')
export class ApprovalWorkflowStepController {
  constructor(
    @Inject(REPORT_PURCHASE_REQUEST_APPLICATION_SERVICE)
    private readonly _service: IReportPurchaseRequestServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: ReportPurchaseRequestDataMapper,
  ) {}

  @Get('')
  async report(
    @Query() dto: any,
  ): Promise<ResponseResult<ReportPurchaseRequestResponse>> {
    const result = await this._service.report(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }
}
