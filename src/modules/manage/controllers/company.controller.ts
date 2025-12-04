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
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { COMPANY_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { CreateCompanyDto } from '../application/dto/create/company/create.dto';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { ICompanyServiceInterface } from '../domain/ports/input/company-domain-service.interface';
import { CompanyDataMapper } from '../application/mappers/company.mapper';
import { CompanyResponse } from '../application/dto/response/company.response';
import { UpdateCompanyDto } from '../application/dto/create/company/update.dto';
import { CompanyQueryDto } from '../application/dto/query/company-query.dto';
import { ReportCompanyInterface } from '@src/common/application/interfaces/report-company.intergace';

@Controller('companies')
export class CompanyController {
  constructor(
    @Inject(COMPANY_APPLICATION_SERVICE)
    private readonly _companyService: ICompanyServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: CompanyDataMapper,
  ) {}

  @Post('')
  async create(
    @Body()
    dto: CreateCompanyDto,
  ): Promise<ResponseResult<CompanyResponse>> {
    const result = await this._companyService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get('')
  async getAll(
    @Query() dto: CompanyQueryDto,
  ): Promise<ResponseResult<CompanyResponse>> {
    const result = await this._companyService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  // report company
  @Get('report')
  async getReport(): Promise<ResponseResult<ReportCompanyInterface>> {
    return await this._companyService.getReport();
  }

  @Get('report/receipt')
  async getReportReceipt(
    @Query() query: CompanyQueryDto,
  ): Promise<ResponseResult<CompanyResponse>> {
    const result = await this._companyService.getReportReceipt(query);
    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<CompanyResponse>> {
    const result = await this._companyService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get('/report/:id')
  async getOneReport(@Param('id') id: number): Promise<ResponseResult<any>> {
    // console.log('hello world');
    return await this._companyService.getOneReport(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateCompanyDto,
  ): Promise<ResponseResult<CompanyResponse>> {
    const result = await this._companyService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._companyService.delete(id);
  }

  // private async processLogoFile(logoFile: Express.Multer.File): Promise<string> {
  //   const optimizedImage = await this._optimizeService.optimize(logoFile);
  //   const uploadedUrl = await this._amazonS3Service.uploadImage(
  //     optimizedImage,
  //     `companies/logos/${Date.now()}-${logoFile.originalname}`,
  //   );
  //   return uploadedUrl;
  // }
}
