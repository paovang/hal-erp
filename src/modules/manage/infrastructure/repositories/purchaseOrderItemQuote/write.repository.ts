// import { Injectable } from '@nestjs/common';
// import { IWritePurchaseOrderItemQuoteRepository } from '@src/modules/manage/domain/ports/output/purchase-order-item-quote-repository.interface';
// import { PurchaseOrderItemQuoteDataAccessMapper } from '../../mappers/purchase-order-item-quote.mapper';
// import { PurchaseOrderItemQuoteEntity } from '@src/modules/manage/domain/entities/purchase-order-item-quote.entity';
// import { EntityManager } from 'typeorm';
// import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
// import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
// import { PurchaseOrderItemQuoteOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order-item-quote.orm';
// import { PurchaseOrderItemQuoteId } from '@src/modules/manage/domain/value-objects/purchase-order-item-quote-id.vo';

// @Injectable()
// export class WritePurchaseOrderItemQuoteRepository
//   implements IWritePurchaseOrderItemQuoteRepository
// {
//   constructor(
//     private readonly _dataAccessMapper: PurchaseOrderItemQuoteDataAccessMapper,
//   ) {}

//   async create(
//     entity: PurchaseOrderItemQuoteEntity,
//     manager: EntityManager,
//   ): Promise<ResponseResult<PurchaseOrderItemQuoteEntity>> {
//     return this._dataAccessMapper.toEntity(
//       await manager.save(
//         this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
//       ),
//     );
//   }

//   async update(
//     entity: PurchaseOrderItemQuoteEntity,
//     manager: EntityManager,
//   ): Promise<ResponseResult<PurchaseOrderItemQuoteEntity>> {
//     const OrmEntity = this._dataAccessMapper.toOrmEntity(
//       entity,
//       OrmEntityMethod.UPDATE,
//     );

//     try {
//       await manager.update(
//         PurchaseOrderItemQuoteOrmEntity,
//         entity.getId().value,
//         OrmEntity,
//       );

//       return this._dataAccessMapper.toEntity(OrmEntity);
//     } catch (error) {
//       throw error;
//     }
//   }

//   async delete(
//     id: PurchaseOrderItemQuoteId,
//     manager: EntityManager,
//   ): Promise<void> {
//     try {
//       await manager.softDelete(PurchaseOrderItemQuoteOrmEntity, id.value);
//     } catch (error) {
//       throw error;
//     }
//   }
// }
