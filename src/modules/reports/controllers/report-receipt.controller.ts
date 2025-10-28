import { Controller, Get, Inject } from '@nestjs/common';
import { REPORT_RECEIPT_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { IReportReceiptServiceInterface } from '../domain/ports/input/report-receipt-domain-service.interface';

@Controller('reports/receipts')
export class ReportReceiptController {
  constructor(
    @Inject(REPORT_RECEIPT_APPLICATION_SERVICE)
    private readonly _service: IReportReceiptServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
  ) {}
  @Get('money')
  async reportMoney(): Promise<any> {
    const result = await this._service.reportMoney();
    return result;
  }
}
