import { Controller, Get, Inject } from '@nestjs/common';
import { REPORT_COMPANY_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { IReportCompanyServiceInterface } from '../domain/ports/input/report-company-order-domain-service.interface';

@Controller('report-company')
export class ReportCompanyController {
  constructor(
    @Inject(REPORT_COMPANY_APPLICATION_SERVICE)
    private readonly _service: IReportCompanyServiceInterface,
  ) {}
  @Get()
  async report() {
    const result = await this._service.reportCompany();
    return result;
  }
}
