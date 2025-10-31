import { Injectable, Inject } from '@nestjs/common';
import { IVendorProductServiceInterface } from '../../domain/ports/input/vendor-product-domain-service.interface';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateVendorProductDto } from '../dto/create/vendor-product/create.dto';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { VendorProductEntity } from '../../domain/entities/vendor-product.entity';
import { VendorProductQueryDto } from '../dto/query/vendor-product-query.dto';
import { UpdateVendorProductDto } from '../dto/create/vendor-product/update.dto';
import {
  READ_VENDOR_PRODUCT_REPOSITORY,
  WRITE_VENDOR_PRODUCT_REPOSITORY,
} from '../constants/inject-key.const';
import { IReadVendorProductRepository } from '../../domain/ports/output/vendor-product-repository.interface';
import { IWriteVendorProductRepository } from '../../domain/ports/output/vendor-product-repository.interface';
import { VendorProductId } from '../../domain/value-objects/vendor-product-id.vo';

@Injectable()
export class VendorProductService implements IVendorProductServiceInterface {
  constructor(
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _entityManager: EntityManager,
    @Inject(READ_VENDOR_PRODUCT_REPOSITORY)
    private readonly _readVendorProductRepository: IReadVendorProductRepository,
    @Inject(WRITE_VENDOR_PRODUCT_REPOSITORY)
    private readonly _writeVendorProductRepository: IWriteVendorProductRepository,
  ) {}

  async create(
    dto: CreateVendorProductDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorProductEntity>> {
    const entityManager = manager ?? this._entityManager;

    // Create entity using mapper (you would need to create the mapper)
    const entity = this.mapDtoToEntity(dto);

    return await this._writeVendorProductRepository.create(entity, entityManager);
  }

  async getAll(
    dto: VendorProductQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorProductEntity>> {
    const entityManager = manager ?? this._entityManager;

    return await this._readVendorProductRepository.findAll(dto, entityManager);
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorProductEntity>> {
    const entityManager = manager ?? this._entityManager;
    const vendorProductId = VendorProductId.create(id);

    return await this._readVendorProductRepository.findOne(vendorProductId, entityManager);
  }

  async update(
    id: number,
    dto: UpdateVendorProductDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorProductEntity>> {
    const entityManager = manager ?? this._entityManager;
    const vendorProductId = VendorProductId.create(id);

    // First, get the existing entity
    const existingResult = await this._readVendorProductRepository.findOne(
      vendorProductId,
      entityManager,
    );

    if (!existingResult) {
      throw new Error('Vendor product not found');
    }

    // Handle different types of ResponseResult
    const existingEntity = Array.isArray(existingResult)
      ? existingResult[0]
      : 'data' in existingResult
        ? existingResult.data?.[0] || existingResult.data
        : existingResult;

    if (!existingEntity) {
      throw new Error('Vendor product not found');
    }

    // Update entity properties
    const updatedEntity = this.updateEntityFromDto(existingEntity, dto);

    return await this._writeVendorProductRepository.update(updatedEntity, entityManager);
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    const entityManager = manager ?? this._entityManager;
    const vendorProductId = VendorProductId.create(id);

    return await this._writeVendorProductRepository.delete(vendorProductId, entityManager);
  }

  // Helper methods - these would normally be in a mapper
  private mapDtoToEntity(dto: CreateVendorProductDto): VendorProductEntity {
    return VendorProductEntity.builder()
      .setVendorId(dto.vendor_id)
      .setProductId(dto.product_id)
      .setPrice(dto.price)
      .setCreatedAt(new Date())
      .setUpdatedAt(null)
      .setDeletedAt(null)
      .build();
  }

  private updateEntityFromDto(
    entity: VendorProductEntity,
    dto: UpdateVendorProductDto,
  ): VendorProductEntity {
    const builder = VendorProductEntity.builder()
      .setVendorProductId(entity.getId())
      .setVendorId(entity.vendorId)
      .setProductId(entity.productId)
      .setPrice(entity.price)
      .setCreatedAt(entity.createdAt)
      .setUpdatedAt(new Date())
      .setDeletedAt(entity.deletedAt);

    // Set vendor only if it exists
    if (entity.vendor) {
      builder.setVendor(entity.vendor);
    }

    // Set product only if it exists
    if (entity.product) {
      builder.setProduct(entity.product);
    }

    if (dto.vendor_id !== undefined) {
      builder.setVendorId(dto.vendor_id);
    }

    if (dto.product_id !== undefined) {
      builder.setProductId(dto.product_id);
    }

    if (dto.price !== undefined) {
      builder.setPrice(dto.price);
    }

    return builder.build();
  }
}