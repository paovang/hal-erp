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
import { VENDOR_BANK_ACCOUNT_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { IVendorBankAccountServiceInterface } from '../domain/ports/input/vendor-bank-account-domain-service.interface';
import { VendorBankAccountDataMapper } from '../application/mappers/vendor-bank-account.mapper';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateVendorBankAccountDto } from '../application/dto/create/vendorBankAccount/create.dto';
import { VendorBankAccountResponse } from '../application/dto/response/vendor-bank-account.response';
import { VendorBankAccountQueryDto } from '../application/dto/query/vendor-bank-account-query.dto';
import { UpdateVendorBankAccountDto } from '../application/dto/create/vendorBankAccount/update.dto';
import { UseBankAccountDto } from '../application/dto/create/vendorBankAccount/use-bank-account.dto';

@Controller('vendor_bank_accounts')
export class VendorBankAccountController {
  constructor(
    @Inject(VENDOR_BANK_ACCOUNT_APPLICATION_SERVICE)
    private readonly _vendorBankAccountService: IVendorBankAccountServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: VendorBankAccountDataMapper,
  ) {}

  @Post('')
  async create(
    @Body() dto: CreateVendorBankAccountDto,
  ): Promise<ResponseResult<VendorBankAccountResponse>> {
    const result = await this._vendorBankAccountService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get('')
  async getAll(
    @Query() dto: VendorBankAccountQueryDto,
  ): Promise<ResponseResult<VendorBankAccountResponse>> {
    const result = await this._vendorBankAccountService.getAll(dto);
    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<VendorBankAccountResponse>> {
    const result = await this._vendorBankAccountService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateVendorBankAccountDto,
  ): Promise<ResponseResult<VendorBankAccountResponse>> {
    const result = await this._vendorBankAccountService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put('use/:id')
  async UseBankAccount(
    @Param('id') id: number,
    @Body() dto: UseBankAccountDto,
  ): Promise<ResponseResult<VendorBankAccountResponse>> {
    const result = await this._vendorBankAccountService.useBankAccount(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._vendorBankAccountService.delete(id);
  }
}
