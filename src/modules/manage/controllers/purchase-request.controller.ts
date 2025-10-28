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
import { IPurchaseRequestServiceInterface } from '../domain/ports/input/purchase-request-service.interface';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { PURCHASE_REQUEST_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { PurchaseRequestDataMapper } from '../application/mappers/purchase-request.mapper';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PurchaseRequestResponse } from '../application/dto/response/purchase-request.response';
import { CreatePurchaseRequestDto } from '../application/dto/create/purchaseRequest/create.dto';
import { PurchaseRequestQueryDto } from '../application/dto/query/purchase-request.dto';
import { UpdatePurchaseRequestDto } from '../application/dto/create/purchaseRequest/update.dto';
import { AddStepDto } from '../application/dto/create/purchaseRequest/add-step.dto';
import { ExcelExportService } from '@src/common/utils/excel-export.service';
import { Response } from 'express';

@Controller('purchase-requests')
export class PurchaseRequestController {
  constructor(
    @Inject(PURCHASE_REQUEST_APPLICATION_SERVICE)
    private readonly _purchaseRequestService: IPurchaseRequestServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: PurchaseRequestDataMapper,
    private readonly _excelExportService: ExcelExportService,
  ) {}

  @Post('')
  async create(
    @Body() dto: CreatePurchaseRequestDto,
  ): Promise<ResponseResult<PurchaseRequestResponse>> {
    const result = await this._purchaseRequestService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put('add-step/:id')
  async addStep(
    @Param('id') id: number,
    @Body() dto: AddStepDto,
  ): Promise<ResponseResult<PurchaseRequestResponse>> {
    const result = await this._purchaseRequestService.addStep(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get('')
  async getAll(
    @Query() dto: PurchaseRequestQueryDto,
  ): Promise<ResponseResult<PurchaseRequestResponse>> {
    const result = await this._purchaseRequestService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<PurchaseRequestResponse>> {
    const result = await this._purchaseRequestService.getOne(id);

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
      const result = await this._purchaseRequestService.getOne(id);
      const purchaseRequestResponse = this._transformResultService.execute(
        this._dataMapper.toResponse.bind(this._dataMapper),
        result,
      );

      // Handle different response types
      let purchaseRequestData: PurchaseRequestResponse | null = null;

      if (Array.isArray(purchaseRequestResponse)) {
        purchaseRequestData =
          purchaseRequestResponse.length > 0
            ? purchaseRequestResponse[0]
            : null;
      } else if (purchaseRequestResponse && 'data' in purchaseRequestResponse) {
        purchaseRequestData = (purchaseRequestResponse as any).data || null;
      } else if (purchaseRequestResponse) {
        purchaseRequestData =
          purchaseRequestResponse as PurchaseRequestResponse;
      }

      if (!purchaseRequestData) {
        res.status(HttpStatus.NOT_FOUND).json({
          message: 'Purchase Request not found',
        });
        return;
      }

      // Generate Excel file
      const excelBuffer =
        await this._excelExportService.exportPurchaseRequestToExcel(
          purchaseRequestData,
        );
      const fileName = this._excelExportService.generateFileName(
        purchaseRequestData.requested_date || `request-${id}`,
        'Request',
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
        message: 'Failed to export purchase request',
        error: error.message,
      });
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdatePurchaseRequestDto,
  ): Promise<ResponseResult<PurchaseRequestResponse>> {
    const result = await this._purchaseRequestService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._purchaseRequestService.delete(id);
  }
}
