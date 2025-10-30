import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { COMPANY_USER_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { CompanyUserDataMapper } from '../application/mappers/company-user.mapper';
import { ICompanyUserServiceInterface } from '../domain/ports/input/company-user-domain-service.interface';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateCompanyUserDto } from '../application/dto/create/companyUser/create.dto';
import { CompanyUserResponse } from '../application/dto/response/company-user.response';
import { CompanyUserQueryDto } from '../application/dto/query/company-user-query.dto';

@Controller('company-users')
export class CompanyUserController {
  constructor(
    @Inject(COMPANY_USER_APPLICATION_SERVICE)
    private readonly _service: ICompanyUserServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: CompanyUserDataMapper,
  ) {}

  @Post()
  async create(
    @Body() body: CreateCompanyUserDto,
  ): Promise<ResponseResult<CompanyUserResponse>> {
    const result = await this._service.create(body);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get()
  async getAll(
    @Query() query: CompanyUserQueryDto,
  ): Promise<ResponseResult<CompanyUserResponse>> {
    const result = await this._service.getAll(query);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }
}
