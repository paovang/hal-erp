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
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { PURCHASE_ORDER_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { IPurchaseOrderServiceInterface } from '../domain/ports/input/purchase-order-domain-service.interface';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { PurchaseOrderDataMapper } from '../application/mappers/purchase-order.mapper';
import { PurchaseOrderQueryDto } from '../application/dto/query/purchase-order.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PurchaseOrderResponse } from '../application/dto/response/purchase-order.response';
import { CreatePurchaseOrderDto } from '../application/dto/create/purchaseOrder/create.dto';
import { UpdatePurchaseOrderDto } from '../application/dto/create/purchaseOrder/update.dto';
import { EnumType } from '../application/constants/status-key.const';
import { ExcelExportService } from '@common/utils/excel-export.service';

@Controller('purchase-orders')
export class PurchaseOrderController {
  constructor(
    @Inject(PURCHASE_ORDER_APPLICATION_SERVICE)
    private readonly _purchaseOrderService: IPurchaseOrderServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: PurchaseOrderDataMapper,
    private readonly _excelExportService: ExcelExportService,
  ) {}

  @Get('')
  async getAll(
    @Query() dto: PurchaseOrderQueryDto,
  ): Promise<ResponseResult<PurchaseOrderResponse>> {
    const result = await this._purchaseOrderService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<PurchaseOrderResponse>> {
    const result = await this._purchaseOrderService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Post('')
  async create(
    @Body() dto: CreatePurchaseOrderDto,
  ): Promise<ResponseResult<PurchaseOrderResponse>> {
    const result = await this._purchaseOrderService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdatePurchaseOrderDto,
  ): Promise<ResponseResult<PurchaseOrderResponse>> {
    let result;
    if (dto.type === EnumType.VENDOR) {
      result = await this._purchaseOrderService.update(id, dto);
    } else if (dto.type === EnumType.BUDGET_ITEM_DETAIL) {
      result = await this._purchaseOrderService.updateBudgetItem(id, dto);
    }
    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._purchaseOrderService.delete(id);
  }

  @Get('export/:id')
  async exportToExcel(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<void> {
    try {
      // Get purchase order data
      const result = await this._purchaseOrderService.getOne(id);
      const purchaseOrderResponse = this._transformResultService.execute(
        this._dataMapper.toResponse.bind(this._dataMapper),
        result,
      );

      // Handle different response types
      let purchaseOrderData: PurchaseOrderResponse | null = null;

      if (Array.isArray(purchaseOrderResponse)) {
        purchaseOrderData =
          purchaseOrderResponse.length > 0 ? purchaseOrderResponse[0] : null;
      } else if (purchaseOrderResponse && 'data' in purchaseOrderResponse) {
        purchaseOrderData = (purchaseOrderResponse as any).data || null;
      } else if (purchaseOrderResponse) {
        purchaseOrderData = purchaseOrderResponse as PurchaseOrderResponse;
      }

      if (!purchaseOrderData) {
        res.status(HttpStatus.NOT_FOUND).json({
          message: 'Purchase Order not found',
        });
        return;
      }

      // Generate Excel file
      const excelBuffer =
        await this._excelExportService.exportPurchaseOrderToExcel(
          purchaseOrderData,
        );
      const fileName = this._excelExportService.generateFileName(
        purchaseOrderData.po_number || `PO-${id}`,
      );

      // Set response headers
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName}"`,
      );
      res.setHeader('Content-Length', excelBuffer.length);

      // Send the file
      res.send(excelBuffer);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to export purchase order',
        error: error.message,
      });
    }
  }
}
