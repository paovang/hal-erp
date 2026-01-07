import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Res,
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
import { ExcelExportService } from '@src/common/utils/excel-export.service';
import { Response } from 'express';
import { TokenDto } from '@src/common/validations/dto/token.dto';
import { verifyHashData } from '@src/common/utils/server/hash-data.util';
import { ManageDomainException } from '../domain/exceptions/manage-domain.exception';

@Controller('receipts')
export class ReceiptController {
  constructor(
    @Inject(RECEIPT_APPLICATION_SERVICE)
    private readonly _receiptService: IReceiptServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: ReceiptDataMapper,
    private readonly _excelExportService: ExcelExportService,
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

  @Get('by-token')
  async getByToken(
    @Query() dto: TokenDto,
  ): Promise<ResponseResult<ReceiptResponse>> {
    const verify = await verifyHashData(dto.token);
    if (!verify) {
      throw new ManageDomainException(
        'errors.invalid_token',
        HttpStatus.BAD_REQUEST,
      );
    }
    const id = verify.id;
    const result = await this._receiptService.getOne(id);

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

  @Get('export/:id')
  async exportToExcel(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<void> {
    try {
      // Get purchase order data
      const result = await this._receiptService.getOne(id);
      const receiptResponse = this._transformResultService.execute(
        this._dataMapper.toResponse.bind(this._dataMapper),
        result,
      );

      // Handle different response types
      let receiptData: ReceiptResponse | null = null;

      if (Array.isArray(receiptResponse)) {
        receiptData = receiptResponse.length > 0 ? receiptResponse[0] : null;
      } else if (receiptResponse && 'data' in receiptResponse) {
        receiptData = (receiptResponse as any).data || null;
      } else if (receiptResponse) {
        receiptData = receiptResponse as ReceiptResponse;
      }

      if (!receiptData) {
        res.status(HttpStatus.NOT_FOUND).json({
          message: 'Receipt not found',
        });
        return;
      }

      // Generate Excel file
      const excelBuffer =
        await this._excelExportService.exportReceiptToExcel(receiptData);
      const fileName = this._excelExportService.generateFileName(
        receiptData.receipt_number || `Receipt-${id}`,
        'Receipt',
      );

      // Set response headers
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      // Use encodeURIComponent to ensure the filename is safe for HTTP headers
      const encodedFileName = encodeURIComponent(fileName);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename*=UTF-8''${encodedFileName}`,
      );
      res.setHeader('Content-Length', excelBuffer.length);

      // Send the file
      res.send(excelBuffer);
    } catch (error) {
      console.error('Failed to export Receipt:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to export Receipt',
        error: error.message,
      });
    }
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
