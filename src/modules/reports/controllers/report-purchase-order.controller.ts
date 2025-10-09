import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { REPORT_PURCHASE_ORDER_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { IReportPurchaseOrderServiceInterface } from '../domain/ports/input/report-purchase-order-domain-service.interface';
import { ReportPurchaseOrderDataMapper } from '../application/mappers/report-purchase-order.mapper';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ReportPurchaseOrderResponse } from '../application/dto/response/report-purchase-order.response';
import { PurchaseOrderReportQueryDto } from '../application/dto/query/purchase-order-report.query.dto';

@Controller('reports/purchase-orders')
export class ReportPurchaseOrderController {
  constructor(
    @Inject(REPORT_PURCHASE_ORDER_APPLICATION_SERVICE)
    private readonly _service: IReportPurchaseOrderServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: ReportPurchaseOrderDataMapper,
  ) {}

  @Get('')
  async report(
    @Query() dto: PurchaseOrderReportQueryDto,
  ): Promise<ResponseResult<ReportPurchaseOrderResponse>> {
    const result = await this._service.report(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get('money')
  async reportMoney(): Promise<any> {
    const result = await this._service.reportMoney();
    return result;
  }

  @Get('money-by-pagination')
  async reportMoneyByPagination(
    @Query() dto: PurchaseOrderReportQueryDto,
  ): Promise<ResponseResult<any>> {
    const result = await this._service.reportMoneyByPagination(dto);

    return result;
  }
}
