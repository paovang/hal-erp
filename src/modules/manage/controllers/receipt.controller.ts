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
import { RECEIPT_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { ReceiptDataMapper } from '../application/mappers/receipt.mapper';
import { IReceiptServiceInterface } from '../domain/ports/input/receipt-domain-service.interface';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ReceiptResponse } from '../application/dto/response/receipt.response';
import { CreateReceiptDto } from '../application/dto/create/receipt/create.dto';
import { ReceiptQueryDto } from '../application/dto/query/receipt.dto';
import { UpdateReceiptDto } from '../application/dto/create/receipt/update.dto';

@Controller('receipts')
export class ReceiptController {
  constructor(
    @Inject(RECEIPT_APPLICATION_SERVICE)
    private readonly _receiptService: IReceiptServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: ReceiptDataMapper,
  ) {}

  @Post('')
  async create(
    @Body() dto: CreateReceiptDto,
  ): Promise<ResponseResult<ReceiptResponse>> {
    const result = await this._receiptService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get('')
  async getAll(
    @Query() dto: ReceiptQueryDto,
  ): Promise<ResponseResult<ReceiptResponse>> {
    const result = await this._receiptService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<ReceiptResponse>> {
    const result = await this._receiptService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateReceiptDto,
  ): Promise<ResponseResult<ReceiptResponse>> {
    const result = await this._receiptService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._receiptService.delete(id);
  }
}
