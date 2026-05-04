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
import { PurchaseOrderDataMapper } from '../application/mappers/purchase-order.mapper';
import { PurchaseRequestDataMapper } from '../application/mappers/purchase-request.mapper';
import { IReceiptServiceInterface } from '../domain/ports/input/receipt-domain-service.interface';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ReceiptResponse } from '../application/dto/response/receipt.response';
import { CreateReceiptDto } from '../application/dto/create/receipt/create.dto';
import { ReceiptQueryDto } from '../application/dto/query/receipt.dto';
import { ReceiptExportQueryDto } from '../application/dto/query/receipt-export.dto';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UpdateReceiptDto } from '../application/dto/create/receipt/update.dto';
import { ExcelExportService } from '@src/common/utils/excel-export.service';
import { Response } from 'express';
import { TokenDto } from '@src/common/validations/dto/token.dto';
import { verifyHashData } from '@src/common/utils/server/hash-data.util';
import { ManageDomainException } from '../domain/exceptions/manage-domain.exception';
import { Public } from '@core-system/auth';

@Controller('receipts')
export class ReceiptController {
  constructor(
    @Inject(RECEIPT_APPLICATION_SERVICE)
    private readonly _receiptService: IReceiptServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: ReceiptDataMapper,
    private readonly _purchaseOrderDataMapper: PurchaseOrderDataMapper,
    private readonly _purchaseRequestDataMapper: PurchaseRequestDataMapper,
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

  @Public()
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

  @Get('/print/:receipt_id')
  async printReceipt(
    @Param('receipt_id') id: number,
    @Query() query: ReceiptQueryDto,
  ) {
    const { receipt, purchase_order, purchase_request } =
      await this._receiptService.getPrint(id, query);

    return {
      receipt: this._dataMapper.toResponse(receipt),
      purchase_order: purchase_order
        ? this._purchaseOrderDataMapper.toResponse(purchase_order)
        : null,
      purchase_request: purchase_request
        ? this._purchaseRequestDataMapper.toResponse(purchase_request)
        : null,
    };
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

  @Get('export-excel')
  @ApiOperation({ summary: 'Export receipts within a date range to Excel' })
  @ApiQuery({ name: 'startDate', required: true, type: String, description: 'ISO 8601 date' })
  @ApiQuery({ name: 'endDate', required: true, type: String, description: 'ISO 8601 date' })
  async exportListToExcel(
    @Query() dto: ReceiptExportQueryDto,
    @Res() res: Response,
  ): Promise<void> {
    if (
      !(dto.startDate instanceof Date) ||
      !(dto.endDate instanceof Date) ||
      dto.endDate < dto.startDate
    ) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message: 'startDate and endDate are required and endDate must be >= startDate',
      });
      return;
    }

    const rows = await this._receiptService.getAllForExport(dto);

    const excelBuffer =
      await this._excelExportService.exportReceiptListToExcel(rows);
    const fileName = this._excelExportService.generateListFileName(
      'Receipt',
      dto.startDate,
      dto.endDate,
    );

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
    );
    res.setHeader('Content-Length', excelBuffer.length);
    res.send(excelBuffer);
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
