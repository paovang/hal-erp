import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { IPurchaseOrderSelectedVendorServiceInterface } from '../../domain/ports/input/purchase-order-selected-vendor-domain-service.interface';
import { PurchaseOrderSelectedVendorEntity } from '../../domain/entities/purchase-order-selected-vendor.entity';
import { UpdatePurchaseOrderSelectedVendorFileDto } from '../dto/create/purchaseOrderSelectedVendor/update-file.dto';
import { UpdateFileCommand } from '../commands/purchaseOrderSelectedVendor/update-file.command';

@Injectable()
export class PurchaseOrderSelectedVendorService
  implements IPurchaseOrderSelectedVendorServiceInterface
{
  constructor(
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async updateFile(
    id: number,
    dto: UpdatePurchaseOrderSelectedVendorFileDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<PurchaseOrderSelectedVendorEntity>> {
    return await this._commandBus.execute(
      new UpdateFileCommand(id, dto, manager ?? this._readEntityManager),
    );
  }
}
